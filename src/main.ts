import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import '@fontsource/noto-serif-kr/300.css';
import '@fontsource/noto-serif-kr/400.css';
import 'lenis/dist/lenis.css';
import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { applyLanguage, lang, switchLanguage, takeSwitchState, t, type Lang } from './i18n';
import { labels, products, tabs, type Product } from './products';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

const DESKTOP = '(min-width: 992px)';
const MOTION = '(prefers-reduced-motion: no-preference)';
const reduceMotion = !matchMedia(MOTION).matches;
const isDesktop = () => matchMedia(DESKTOP).matches;
const root = document.documentElement;

// ---------------------------------------------------------------------------
// Smooth scroll
// ---------------------------------------------------------------------------
const lenis = reduceMotion ? null : new Lenis({ lerp: 0.1 });
if (lenis) {
  lenis.on('scroll', () => ScrollTrigger.update());
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function headerOffset() {
  return isDesktop() ? 0 : -(parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 0);
}

function scrollToTarget(target: HTMLElement | 0) {
  if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : headerOffset(), duration: 1.4 });
  else if (target === 0) window.scrollTo({ top: 0 });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + headerOffset() });
}

// ---------------------------------------------------------------------------
// UI: anchors, mobile menu, contact modal, accordions, forms, cursor
// ---------------------------------------------------------------------------
const menuButton = $('[data-menu-toggle]');

function setMenu(open: boolean) {
  if (root.classList.contains('menu-open') === open) return;
  root.classList.toggle('menu-open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  if (open) lenis?.stop();
  else lenis?.start();
}

const modal = $('#contact-modal');
let modalOpener: HTMLElement | null = null;

function setModal(open: boolean) {
  if (!modal || modal.classList.contains('is-open') === open) return;
  modal.classList.toggle('is-open', open);
  modal.setAttribute('aria-hidden', String(!open));
  if (open) {
    modalOpener = document.activeElement as HTMLElement | null;
    setMenu(false);
    lenis?.stop();
    window.setTimeout(() => $('input', modal)?.focus({ preventScroll: true }), 450);
  } else {
    lenis?.start();
    modalOpener?.focus({ preventScroll: true });
  }
}

// Mobile only: the org chart block turns into a full-screen "About Us" sheet (desktop shows it inline).
const aboutSheet = $('#about-us');
let aboutOpener: HTMLElement | null = null;

function setAbout(open: boolean) {
  if (!aboutSheet || aboutSheet.classList.contains('is-open') === open) return;
  if (open && isDesktop()) return scrollToTarget(aboutSheet);
  aboutSheet.classList.toggle('is-open', open);
  $$('[data-about-open]').forEach((el) => el.setAttribute('aria-expanded', String(open)));
  if (open) {
    aboutOpener = document.activeElement as HTMLElement | null;
    aboutSheet.setAttribute('role', 'dialog');
    aboutSheet.setAttribute('aria-modal', 'true');
    aboutSheet.setAttribute('data-lenis-prevent', '');
    aboutSheet.scrollTop = 0;
    setMenu(false);
    lenis?.stop();
    window.setTimeout(() => $('[data-about-close]', aboutSheet)?.focus({ preventScroll: true }), 450);
  } else {
    aboutSheet.removeAttribute('role');
    aboutSheet.removeAttribute('aria-modal');
    aboutSheet.removeAttribute('data-lenis-prevent');
    lenis?.start();
    aboutOpener?.focus({ preventScroll: true });
  }
}

function toggleHeight(panel: HTMLElement, open: boolean) {
  gsap.to(panel, {
    height: open ? 'auto' : 0,
    duration: reduceMotion ? 0 : 0.7,
    ease: 'expo.out',
    onComplete: () => ScrollTrigger.refresh(),
  });
}

function setupUi() {
  document.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.hasAttribute('data-about-open')) return;
    event.preventDefault();
    setMenu(false);
    const href = link.getAttribute('href')!;
    if (href === '#') return;
    if (href === '#top') return scrollToTarget(0);
    const el = $(href);
    // Some anchors (e.g. the mobile "Business" heading) are hidden on desktop: use the next section.
    const target = el && el.getClientRects().length ? el : (el?.nextElementSibling as HTMLElement | null);
    if (target) scrollToTarget(target);
  });

  menuButton?.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $$('[data-contact-open]').forEach((button) => button.addEventListener('click', () => setModal(true)));
  $$('[data-contact-close]').forEach((button) => button.addEventListener('click', () => setModal(false)));
  $$('[data-about-open]').forEach((el) =>
    el.addEventListener('click', (event) => {
      event.preventDefault();
      setAbout(true);
    }),
  );
  $$('[data-about-close]').forEach((button) => button.addEventListener('click', () => setAbout(false)));
  matchMedia(DESKTOP).addEventListener('change', (event) => event.matches && setAbout(false));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeLightbox();
    setModal(false);
    setAbout(false);
    setMenu(false);
  });

  // KO / EN: reloads in the other language and comes back to the section being read
  $$('[data-lang]').forEach((button) =>
    button.addEventListener('click', () => switchLanguage(button.dataset.lang as Lang, currentSectionId())),
  );

  $$('[data-next]').forEach((button) =>
    button.addEventListener('click', () => {
      const target = $(button.dataset.next!);
      if (target) scrollToTarget(target);
    }),
  );

  // Mobile accordions (the toggles are hidden on desktop)
  $$('.case__more').forEach((button) =>
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Close' : 'More';
      toggleHeight($('.case__body', button.closest('.case')!)!, open);
    }),
  );
  $$('.member__toggle').forEach((button) =>
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      toggleHeight($('.member__detail', button.closest('.member')!)!, open);
    }),
  );

  // Forms: client-side validation only — no mail backend is connected yet, so a valid submit points to the phone line.
  $$<HTMLFormElement>('[data-form]').forEach((form) => {
    const status = $('.form__status', form)!;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let valid = true;
      $$<HTMLInputElement>('input[required]', form).forEach((input) => {
        const ok = input.value.trim() !== '' && input.checkValidity();
        input.closest('.field')?.classList.toggle('is-invalid', !ok);
        valid &&= ok;
      });
      if (!valid) {
        status.textContent = t('form.invalid');
        return;
      }
      status.textContent = t('form.pending');
    });
    form.addEventListener('input', (event) => (event.target as Element).closest('.field')?.classList.remove('is-invalid'));
  });

  // Custom cursor (fine pointers only)
  const cursor = $('.cursor');
  if (cursor && !reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    window.addEventListener(
      'pointermove',
      (event) => {
        target.x = event.clientX;
        target.y = event.clientY;
        cursor.classList.add('is-visible');
      },
      { passive: true },
    );
    root.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('pointerover', (event) => {
      cursor.classList.toggle('is-hover', !!(event.target as Element).closest('a, button, input, textarea, label'));
    });
    gsap.ticker.add(() => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    });
  }
}

const SECTION_IDS = ['biz-01', 'biz-02', 'biz-03', 'biz-04', 'products', 'company', 'certifications', 'contact'];

// ---------------------------------------------------------------------------
// Products: category tabs + expandable product sheets (data in src/products.ts)
// ---------------------------------------------------------------------------
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function productHtml(p: Product, open: boolean) {
  const copy = p[lang];
  const L = labels[lang];
  const rows = (items: [string, string][]) => items.map(([dt, dd]) => `<div><dt>${esc(dt)}</dt><dd>${esc(dd)}</dd></div>`).join('');
  const blocks = [
    copy.uses &&
      `<div class="prod__block"><p class="prod__label">${L.uses}</p><dl class="prod__uses">${rows(copy.uses)}</dl>${
        copy.uses.some(([, v]) => v.includes('*')) ? `<p class="prod__note">${L.note}</p>` : ''
      }</div>`,
    copy.features.length && `<div class="prod__block"><p class="prod__label">${L.features}</p><dl class="prod__features">${rows(copy.features)}</dl></div>`,
    copy.types &&
      `<div class="prod__block"><p class="prod__label">${L.types}</p><div class="prod__types">${copy.types
        .map(([name, items]) => `<div class="ptype"><p class="ptype__name">${esc(name)}</p><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`)
        .join('')}</div></div>`,
  ].filter(Boolean);
  return `<li class="prod${open ? ' is-open' : ''}">
    <button class="prod__head" type="button" aria-expanded="${open}" aria-controls="prod-${p.id}">
      <span class="prod__img"><img src="${p.img}" alt="${esc(p.name)}" width="640" height="650" loading="lazy" /></span>
      <span class="prod__text"><span class="prod__sub">${esc(p.sub)}</span><strong class="prod__name">${esc(p.name)}</strong><span class="prod__tagline">${esc(copy.tagline)}</span></span>
      <svg class="icon prod__icon"><use href="#i-plus" /></svg>
    </button>
    <div class="prod__body" id="prod-${p.id}"${open ? '' : ' style="height: 0"'}><div class="prod__inner">${blocks.join('')}</div></div>
  </li>`;
}

function renderProducts() {
  const tabBar = $('[data-product-tabs]');
  const panels = $('[data-product-panels]');
  if (!tabBar || !panels) return;
  const count = (id: string) => String(products.filter((p) => p.tab === id).length).padStart(2, '0');
  tabBar.innerHTML = tabs
    .map((tab, i) => `<button type="button" role="tab" id="ptab-${tab.id}" aria-controls="ppanel-${tab.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(tab[lang])}<span>${count(tab.id)}</span></button>`)
    .join('');
  panels.innerHTML = tabs
    .map(
      (tab, i) =>
        `<div class="ppanel" role="tabpanel" id="ppanel-${tab.id}" aria-labelledby="ptab-${tab.id}"${i ? ' hidden' : ''}><ul class="plist">${products
          .filter((p) => p.tab === tab.id)
          .map((p, j) => productHtml(p, j === 0))
          .join('')}</ul></div>`,
    )
    .join('');

  // Tabs (click + arrow keys)
  const tabButtons = $$<HTMLButtonElement>('[role="tab"]', tabBar);
  const select = (index: number) => {
    tabButtons.forEach((button, i) => {
      const on = i === index;
      button.setAttribute('aria-selected', String(on));
      button.tabIndex = on ? 0 : -1;
      $(`#${button.getAttribute('aria-controls')}`)!.hidden = !on;
    });
    tabButtons[index].focus({ preventScroll: true });
    ScrollTrigger.refresh();
  };
  tabButtons.forEach((button, i) => {
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') select((i + 1) % tabButtons.length);
      if (event.key === 'ArrowLeft') select((i - 1 + tabButtons.length) % tabButtons.length);
    });
  });

  // Product sheets
  $$('.prod__head', panels).forEach((head) =>
    head.addEventListener('click', () => {
      const open = head.getAttribute('aria-expanded') !== 'true';
      head.setAttribute('aria-expanded', String(open));
      head.parentElement!.classList.toggle('is-open', open);
      toggleHeight(head.nextElementSibling as HTMLElement, open);
    }),
  );
}

/** id of the section currently being read ('' while still in the hero). */
function currentSectionId() {
  let id = '';
  for (const sectionId of SECTION_IDS) {
    const el = document.getElementById(sectionId);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) id = sectionId;
  }
  return id;
}

// Certificate viewer: each card opens its large scan; buttons, arrow keys and swipes step through all of them.
let closeLightbox = () => {};

function setupLightbox() {
  const box = $('#lightbox');
  const cards = $$<HTMLButtonElement>('.cert__btn');
  if (!box || !cards.length) return;
  const img = $<HTMLImageElement>('.lightbox__img', box)!;
  const name = $('[data-lb-name]', box)!;
  const meta = $('[data-lb-meta]', box)!;
  const counter = $('[data-lb-index]', box)!;
  $('[data-lb-total]', box)!.textContent = String(cards.length);
  let current = 0;
  let opener: HTMLElement | null = null;

  const show = (index: number) => {
    current = (index + cards.length) % cards.length;
    const card = cards[current];
    const thumb = $<HTMLImageElement>('img', card)!;
    const thumbSrc = thumb.currentSrc || thumb.src;
    // show the (cached) thumbnail at once, then swap in the large scan: name.webp → name-lg.webp
    img.src = thumbSrc;
    const large = new Image();
    large.onload = () => {
      if (cards[current] === card) img.src = large.src;
    };
    large.src = thumbSrc.replace(/\.webp$/, '-lg.webp');
    img.alt = name.textContent = $('.cert__name', card)!.textContent ?? '';
    meta.textContent = $('.cert__meta', card)!.textContent;
    counter.textContent = String(current + 1);
  };

  const open = (index: number) => {
    opener = document.activeElement as HTMLElement | null;
    show(index);
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    setMenu(false);
    lenis?.stop();
    window.setTimeout(() => $('button[data-lightbox-close]', box)?.focus({ preventScroll: true }), 300);
  };

  closeLightbox = () => {
    if (!box.classList.contains('is-open')) return;
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    lenis?.start();
    opener?.focus({ preventScroll: true });
  };

  cards.forEach((card, i) => card.addEventListener('click', () => open(i)));
  $$('[data-lightbox-close]', box).forEach((el) => el.addEventListener('click', () => closeLightbox()));
  $('[data-lb-prev]', box)!.addEventListener('click', () => show(current - 1));
  $('[data-lb-next]', box)!.addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', (event) => {
    if (!box.classList.contains('is-open')) return;
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
  let touchX: number | null = null;
  box.addEventListener('touchstart', (event) => (touchX = event.touches[0].clientX), { passive: true });
  box.addEventListener('touchend', (event) => {
    if (touchX === null) return;
    const dx = event.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}

// Mobile marquee: duplicate each collage so the strip can loop seamlessly (clones are hidden on desktop).
function setupMarquee() {
  $$('.case__track').forEach((track) => {
    const items = $$('.media:not(.media--btn)', track);
    for (const item of items) {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelector('img')?.setAttribute('alt', '');
      track.append(clone);
    }
    track.style.setProperty('--marquee', `${items.length * 8}s`);
  });
}

// ---------------------------------------------------------------------------
// Scroll animations
// ---------------------------------------------------------------------------
function revealLines(el: HTMLElement, scroll: boolean) {
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'line',
    autoSplit: true,
    onSplit(self) {
      if (el.dataset.revealed) return; // re-split after a resize: keep lines in place
      return gsap.from(self.lines, {
        yPercent: 105,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.08,
        onStart: () => {
          el.dataset.revealed = '1';
        },
        ...(scroll && { scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
      });
    },
  });
}

function formatNumber(value: number, template: string) {
  const decimals = template.split('.')[1]?.length ?? 0;
  let text = value.toFixed(decimals);
  if (template.includes(',')) text = Number(text).toLocaleString('en-US', { minimumFractionDigits: decimals });
  return template.startsWith('0') ? text.padStart(template.length, '0') : text;
}

function setupScroll() {
  const mm = gsap.matchMedia();
  const cases = $$('.case');
  const productsSection = $('#products')!;
  const team = $('#company')!;
  const certs = $('#certifications')!;
  const contact = $('#contact')!;

  // Shared (desktop + mobile)
  mm.add(MOTION, () => {
    $$('.team__title, .contact__title').forEach((el) => revealLines(el, true));

    $$('.rows').forEach((rows) =>
      gsap.from(rows.children, {
        autoAlpha: 0,
        y: 10,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: rows, start: 'top 92%', once: true },
      }),
    );

    // Count-up for numeric values ("38%", "12,000+", "05"…)
    const counters = $$('.rows:not(.rows--static) dd, .cert-stats dd').flatMap((dd) => {
      const match = dd.textContent!.trim().match(/^(\d[\d,]*(?:\.\d+)?)(.*)$/);
      if (!match) return [];
      const [original, digits, suffix] = match;
      const end = parseFloat(digits.replace(/,/g, ''));
      const state = { value: 0 };
      dd.textContent = formatNumber(0, digits) + suffix;
      gsap.to(state, {
        value: end,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: dd, start: 'top 92%', once: true },
        onUpdate: () => {
          dd.textContent = formatNumber(state.value, digits) + suffix;
        },
      });
      return [{ dd, original }];
    });

    // Team section tints the whole page background
    gsap
      .timeline({ scrollTrigger: { trigger: team, start: 'top 70%', end: 'bottom 30%', scrub: true } })
      .to('.bg-layer', { opacity: 1, duration: 0.12, ease: 'none' })
      .to('.bg-layer', { opacity: 1, duration: 0.7 })
      .to('.bg-layer', { opacity: 0, duration: 0.18, ease: 'none' });

    return () => counters.forEach(({ dd, original }) => (dd.textContent = original));
  });

  // Desktop only
  mm.add(`${DESKTOP} and ${MOTION}`, () => {
    // Sidebar symbol collapses while the hero scrolls away, pulling the index up under the logo.
    const inner = $('.sidebar__inner')!;
    const symbol = $('.sidebar__symbol')!;
    const logo = $('.sidebar__logo')!;
    const index = $('.index')!;
    const fullHeight = () => {
      const cs = getComputedStyle(inner);
      return (
        inner.clientHeight -
        parseFloat(cs.paddingTop) -
        parseFloat(cs.paddingBottom) -
        logo.offsetHeight -
        index.offsetHeight -
        parseFloat(getComputedStyle(index).marginTop)
      );
    };
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.6}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(symbol, { flex: 'none', height: fullHeight }, { height: 0, ease: 'none', duration: 1 })
      .to(symbol, { autoAlpha: 0, ease: 'none', duration: 0.35 }, 0.65);

    // Index: active item + progress bar per business section
    const items = $$('.index__item');
    cases.forEach((section, i) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => items[i]?.classList.toggle('is-active', self.isActive),
        onUpdate: (self) => items[i]?.style.setProperty('--p', self.progress.toFixed(4)),
      }),
    );
    ScrollTrigger.create({
      trigger: cases[0],
      endTrigger: cases[cases.length - 1],
      start: 'top center',
      end: 'bottom center',
      toggleClass: { targets: '.index', className: 'is-tracking' },
    });

    // Nav pills follow the section in view
    const navRanges: [string, Element, Element][] = [
      ['business', cases[0], cases[cases.length - 1]],
      ['products', productsSection, productsSection],
      ['company', team, certs],
      ['contact', contact, contact],
    ];
    for (const [key, start, end] of navRanges) {
      ScrollTrigger.create({
        trigger: start,
        endTrigger: end,
        start: 'top center',
        end: 'bottom center',
        toggleClass: { targets: `.pills [data-nav="${key}"]`, className: 'is-active' },
      });
    }

    // Contact: sidebar illustration in, floating CTA out
    ScrollTrigger.create({ trigger: contact, start: 'top 55%', toggleClass: { targets: '.sidebar', className: 'show-art' } });
    ScrollTrigger.create({ trigger: contact, start: 'top 80%', toggleClass: { targets: '.cta', className: 'is-hidden' } });

    // Case heads
    for (const section of cases) {
      revealLines($('.case__title', section)!, true);
      gsap.from($('.case__meta', section), {
        autoAlpha: 0,
        y: 12,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      });
      const body = $('.case__body', section)!;
      gsap.from($$(':scope > :not(.rows)', body), {
        autoAlpha: 0,
        y: 16,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: body, start: 'top 88%', once: true },
      });
    }

    // Collage images: mask reveal from the bottom with a slow zoom-out
    $$('.case .media:not(.is-clone):not(.media--btn)').forEach((figure) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: figure, start: 'top 92%', once: true } });
      tl.fromTo(figure, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out' });
      const img = $('img', figure);
      if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
    });
    $$('.media--btn').forEach((button) =>
      gsap.from(button, {
        scale: 0.4,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: button, start: 'top 92%', once: true },
      }),
    );

    // Company + certifications
    $$('.team__tags').forEach((tags) =>
      gsap.from(tags.children, {
        autoAlpha: 0,
        y: 12,
        stagger: 0.08,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: tags, start: 'top 85%', once: true },
      }),
    );
    $$('.member, .company__block, .cert-stats, .cert-group').forEach((member) =>
      gsap.from(member, {
        autoAlpha: 0,
        y: 32,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: member, start: 'top 88%', once: true },
      }),
    );
  });
}

// ---------------------------------------------------------------------------
// Preloader → hero intro
// ---------------------------------------------------------------------------
async function runPreloader(onLift: () => void, quick: boolean) {
  const el = $('.preloader');
  if (!el || reduceMotion) {
    el?.remove();
    onLift();
    return;
  }
  lenis?.stop();
  if (quick) {
    // after a language switch: no counter, just fade out once the fonts are in
    await document.fonts.ready;
    onLift();
    await gsap.to(el, { autoAlpha: 0, duration: 0.35, ease: 'power1.out' });
  } else {
    const count = $('[data-count]', el)!;
    const state = { value: 0 };
    await Promise.all([
      gsap.to(state, {
        value: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          count.textContent = String(Math.round(state.value)).padStart(3, '0');
        },
      }),
      document.fonts.ready,
    ]);
    window.setTimeout(onLift, 350);
    await gsap.to(el, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' });
  }
  el.remove();
  lenis?.start();
}

function introHero() {
  if (reduceMotion) return;
  revealLines($('.hero__title')!, false);
  gsap.from(['.hero__label', '.hero .tags', '.sidebar__logo', '.index', '.topnav', '.cta', '.m-header'], {
    autoAlpha: 0,
    y: 10,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.05,
    clearProps: 'all',
  });
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
applyLanguage(); // before anything measures, splits or clones the text
renderProducts();
const returnTo = takeSwitchState();
setupMarquee();
setupUi();
setupLightbox();
setupScroll();
runPreloader(introHero, returnTo !== null).then(() => {
  ScrollTrigger.refresh();
  const target = returnTo ? document.getElementById(returnTo) : null;
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: headerOffset(), immediate: true });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + headerOffset() });
});
document.fonts.ready.then(() => ScrollTrigger.refresh());
