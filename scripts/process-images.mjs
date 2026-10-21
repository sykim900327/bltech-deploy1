// Converts generated images (assets-src/generated) into site-ready files in public/images,
// and prepares the logo files in public/brand from the rendered CI artwork.
//   photo        → WebP, max 1600px
//   portrait     → blue-grey monochrome WebP, 480px
//   line         → ink lines on transparent background (lossless WebP), trimmed
//   dither-beige → 1-bit Atkinson dither, ink on beige paper (PNG)
//   dither-grey  → 1-bit Atkinson dither, ink on light grey paper (PNG)
import { mkdir, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { images } from './images.manifest.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets-src', 'generated');
const OUT = path.join(ROOT, 'public', 'images');
const BRAND_SRC = path.join(ROOT, 'assets-src', 'refs', 'BL_tech_ci_render.png');
const BRAND_OUT = path.join(ROOT, 'public', 'brand');

const INK = [29, 31, 38];
const PAPER = { 'dither-beige': [233, 231, 219], 'dither-grey': [233, 237, 239] };
const DITHER_WIDTH = 560;

const exists = (p) => access(p).then(() => true, () => false);

// Atkinson error diffusion on a grayscale buffer → 2-colour RGB buffer.
function atkinson(gray, width, height, ink, paper) {
  const px = Float32Array.from(gray);
  const out = Buffer.alloc(width * height * 3);
  const spread = [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const on = px[i] >= 128;
      const err = (px[i] - (on ? 255 : 0)) / 8;
      for (const [dx, dy] of spread) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny < height) px[ny * width + nx] += err;
      }
      out.set(on ? paper : ink, i * 3);
    }
  }
  return out;
}

async function dither(src, dest, paper) {
  const { data, info } = await sharp(src)
    .flatten({ background: '#ffffff' })
    .resize({ width: DITHER_WIDTH })
    .grayscale()
    .normalise()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgb = atkinson(data, info.width, info.height, INK, paper);
  await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } })
    .png({ palette: true, colours: 2 })
    .toFile(dest);
}

// Blue-grey duotone: luminance mapped from a dark slate to a light grey-blue.
const DUO_DARK = [34, 44, 52];
const DUO_LIGHT = [184, 198, 205];
async function duotone(src, dest) {
  const { data, info } = await sharp(src).resize(480, 480).grayscale().raw().toBuffer({ resolveWithObject: true });
  const rgb = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < info.width * info.height; i++) {
    const t = data[i] / 255;
    for (let c = 0; c < 3; c++) rgb[i * 3 + c] = Math.round(DUO_DARK[c] + (DUO_LIGHT[c] - DUO_DARK[c]) * t);
  }
  await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 80 }).toFile(dest);
}

// Dark strokes become opaque ink, light background becomes transparent.
async function lineArt(src, dest) {
  const trimmed = await sharp(src).flatten({ background: '#ffffff' }).trim({ threshold: 20 }).toBuffer();
  const { data, info } = await sharp(trimmed)
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const alpha = Math.max(0, Math.min(255, (255 - data[i] - 12) * 1.25));
    rgba.set([...INK, alpha], i * 4);
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ lossless: true })
    .toFile(dest);
}

async function processImages() {
  await mkdir(OUT, { recursive: true });
  for (const item of images) {
    const src = path.join(SRC, `${item.id}.png`);
    if (!(await exists(src))) {
      console.warn(`- ${item.id}: 원본 없음 (건너뜀)`);
      continue;
    }
    switch (item.post) {
      case 'photo':
        await sharp(src).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(OUT, `${item.id}.webp`));
        break;
      case 'portrait':
        await duotone(src, path.join(OUT, `${item.id}.webp`));
        break;
      case 'line':
        await lineArt(src, path.join(OUT, `${item.id}.webp`));
        break;
      case 'dither-beige':
      case 'dither-grey':
        await dither(src, path.join(OUT, `${item.id}.png`), PAPER[item.post]);
        break;
      default:
        throw new Error(`${item.id}: 알 수 없는 post 값 ${item.post}`);
    }
    console.log(`✓ ${item.id} (${item.post})`);
  }
}

// Full logo (trimmed) in two sizes + the ribbon symbol alone for the favicon.
async function processBrand() {
  if (!(await exists(BRAND_SRC))) return console.warn('- 로고 렌더 파일 없음 (건너뜀)');
  await mkdir(BRAND_OUT, { recursive: true });
  const logo = await sharp(BRAND_SRC).trim({ threshold: 1 }).toBuffer();
  await sharp(logo).resize({ width: 520 }).png().toFile(path.join(BRAND_OUT, 'logo.png'));
  await sharp(logo).resize({ width: 1600 }).png().toFile(path.join(BRAND_OUT, 'logo-xl.png'));

  // The ribbon symbol overlaps the lettering column-wise, so pick it by connected components:
  // keep blobs that contain green (the green half of the ribbon) or the right-most pixel.
  const { data, info } = await sharp(logo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const label = new Int32Array(W * H).fill(-1);
  const comps = [];
  let rightmost = 0;
  for (let start = 0; start < W * H; start++) {
    if (label[start] !== -1 || data[start * 4 + 3] <= 128) continue;
    const comp = { pixels: [], green: false, maxX: 0 };
    const stack = [start];
    label[start] = comps.length;
    while (stack.length) {
      const p = stack.pop();
      comp.pixels.push(p);
      const [r, g, b] = [data[p * 4], data[p * 4 + 1], data[p * 4 + 2]];
      if (g > r + 40 && g > b) comp.green = true;
      const px = p % W;
      const py = (p - px) / W;
      comp.maxX = Math.max(comp.maxX, px);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = px + dx;
        const ny = py + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (label[q] === -1 && data[q * 4 + 3] > 128) {
          label[q] = comps.length;
          stack.push(q);
        }
      }
    }
    rightmost = Math.max(rightmost, comp.maxX);
    comps.push(comp);
  }
  // Selected pixels, dilated a few px so the anti-aliased edges survive.
  const R = 3;
  const mask = new Uint8Array(W * H);
  for (const comp of comps) {
    if (!(comp.green || comp.maxX === rightmost)) continue;
    for (const p of comp.pixels) mask[p] = 1;
  }
  const grow = new Uint8Array(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (mask[y * W + x]) for (let d = -R; d <= R; d++) if (x + d >= 0 && x + d < W) grow[y * W + x + d] = 1;
  const keep = new Uint8Array(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (grow[y * W + x]) for (let d = -R; d <= R; d++) if (y + d >= 0 && y + d < H) keep[(y + d) * W + x] = 1;
  const out = Buffer.from(data);
  for (let p = 0; p < W * H; p++) if (!keep[p]) out[p * 4 + 3] = 0;
  const symbol = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer();
  for (const size of [64, 180]) {
    await sharp(symbol)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(BRAND_OUT, `symbol-${size}.png`));
  }
  console.log(`✓ brand (logo ${W}x${H}, ${comps.length} blobs)`);
}

// Certificate scans (assets-src/certs/<id>.png, from the company site): grid thumbnail + large version for the viewer.
// The viewer derives the large file from the thumbnail name (<id>.webp → <id>-lg.webp).
async function processCerts() {
  const srcDir = path.join(ROOT, 'assets-src', 'certs');
  const outDir = path.join(ROOT, 'public', 'certs');
  if (!(await exists(srcDir))) return console.warn('- 인증서 원본 없음 (건너뜀)');
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(srcDir)).filter((f) => f.endsWith('.png'));
  for (const file of files) {
    const id = file.replace(/\.png$/, '');
    const src = sharp(path.join(srcDir, file)).flatten({ background: '#ffffff' });
    await src.clone().resize({ width: 360 }).webp({ quality: 78 }).toFile(path.join(outDir, `${id}.webp`));
    await src.clone().resize({ width: 1240, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(outDir, `${id}-lg.webp`));
  }
  console.log(`✓ certs (${files.length} × thumbnail + large)`);
}

await processImages();
await processBrand();
await processCerts();
