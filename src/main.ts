import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import '@fontsource/noto-serif-kr/300.css';
import '@fontsource/noto-serif-kr/400.css';
import 'lenis/dist/lenis.css';
import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

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
    setModal(false);
    setAbout(false);
    setMenu(false);
  });

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
        status.textContent = '이름과 이메일을 확인해 주세요.';
        return;
      }
      status.textContent = '온라인 문의 접수는 준비 중입니다. 전화(033-264-2686)로 연락 주시면 빠르게 안내해 드리겠습니다.';
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
  const team = $('#company')!;
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
    const counters = $$('.rows:not(.rows--static) dd').flatMap((dd) => {
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
      ['company', team, team],
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

    // Team
    gsap.from('.team__tags > *', {
      autoAlpha: 0,
      y: 12,
      stagger: 0.08,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: team, start: 'top 85%', once: true },
    });
    $$('.member, .company__block').forEach((member) =>
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
async function runPreloader(onLift: () => void) {
  const el = $('.preloader');
  if (!el || reduceMotion) {
    el?.remove();
    onLift();
    return;
  }
  lenis?.stop();
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
  el.remove();
  lenis?.start();
}

function introHero() {
  if (reduceMotion) return;
  revealLines($('.hero__title')!, false);
  gsap.from(['.hero__label', '.hero .tags', '.sidebar__logo', '.index', '.pills', '.cta', '.m-header'], {
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
setupMarquee();
setupUi();
setupScroll();
runPreloader(introHero).then(() => ScrollTrigger.refresh());
document.fonts.ready.then(() => ScrollTrigger.refresh());
