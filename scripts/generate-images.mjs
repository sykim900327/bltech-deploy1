// Generates the images in images.manifest.mjs with the OpenAI Images API (gpt-image-2.5-sunburst).
// Entries with `refs` go to /v1/images/edits with the reference files; the rest to /v1/images/generations.
//
//   npm run images:generate                 # generate everything that doesn't exist yet
//   npm run images:generate -- team-1 team-2 --force   # (re)generate specific ids
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { images } from './images.manifest.mjs';

const MODEL = 'gpt-image-2.5-sunburst';
const ROOT = path.resolve(import.meta.dirname, '..');
const REFS = path.join(ROOT, 'assets-src', 'refs');
const OUT = path.join(ROOT, 'assets-src', 'generated');
const USAGE_FILE = path.join(OUT, '_usage.json');
const CONCURRENCY = 3; // default tier allows 5 images/minute
const PRICE_PER_M = { text: 5, image: 8, output: 30 }; // USD, from the model page

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error('OPENAI_API_KEY 가 .env 에 없습니다.');
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

const exists = (p) => access(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function costOf(usage) {
  if (!usage) return 0;
  const d = usage.input_tokens_details ?? {};
  const text = d.text_tokens ?? usage.input_tokens ?? 0;
  const image = d.image_tokens ?? 0;
  return (text * PRICE_PER_M.text + image * PRICE_PER_M.image + (usage.output_tokens ?? 0) * PRICE_PER_M.output) / 1e6;
}

async function request(item) {
  const params = {
    model: MODEL,
    prompt: item.prompt,
    size: item.size,
    quality: item.quality ?? 'high',
    output_format: 'png',
    ...(item.background && { background: item.background }),
  };
  if (!item.refs?.length) {
    return fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, n: 1 }),
    });
  }
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, String(v));
  for (const ref of item.refs) {
    const buf = await readFile(path.join(REFS, ref));
    form.append('image[]', new Blob([buf], { type: 'image/png' }), ref);
  }
  return fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
}

async function generate(item) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const started = Date.now();
    const res = await request(item);
    if (res.ok) {
      const json = await res.json();
      await writeFile(path.join(OUT, `${item.id}.png`), Buffer.from(json.data[0].b64_json, 'base64'));
      return { usage: json.usage, seconds: Math.round((Date.now() - started) / 1000) };
    }
    const body = await res.text();
    const retryable = (res.status === 429 && !body.includes('insufficient_quota')) || res.status >= 500;
    if (!retryable) throw new Error(`HTTP ${res.status} ${body.slice(0, 600)}`);
    const wait = (Number(res.headers.get('retry-after')) || 15 * attempt) * 1000;
    console.warn(`  ${item.id}: HTTP ${res.status}, ${wait / 1000}s 후 재시도 (${attempt}/5)`);
    await sleep(wait);
  }
  throw new Error('재시도 한도 초과');
}

await mkdir(OUT, { recursive: true });
const usageLog = (await exists(USAGE_FILE)) ? JSON.parse(await readFile(USAGE_FILE, 'utf8')) : {};

const queue = [];
for (const item of images) {
  if (only.length && !only.includes(item.id)) continue;
  if (!force && (await exists(path.join(OUT, `${item.id}.png`)))) continue;
  queue.push(item);
}
console.log(`${MODEL}: ${queue.length}장 생성 시작 (동시 ${CONCURRENCY})`);

let runCost = 0;
const failures = [];
async function worker() {
  while (queue.length) {
    const item = queue.shift();
    try {
      const { usage, seconds } = await generate(item);
      const cost = costOf(usage);
      runCost += cost;
      usageLog[item.id] = { usage, cost, at: new Date().toISOString() };
      await writeFile(USAGE_FILE, JSON.stringify(usageLog, null, 2));
      console.log(`✓ ${item.id} (${seconds}s, $${cost.toFixed(3)})`);
    } catch (err) {
      failures.push(item.id);
      console.error(`✗ ${item.id}: ${err.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const total = Object.values(usageLog).reduce((s, e) => s + (e.cost ?? 0), 0);
console.log(`이번 실행 $${runCost.toFixed(2)} / 누적 $${total.toFixed(2)}${failures.length ? ` / 실패: ${failures.join(', ')}` : ''}`);
if (failures.length) process.exit(1);
