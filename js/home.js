(() => {
  const button = document.querySelector('.menu-button');
  const menu = document.querySelector('.nav');
  button?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    button.textContent = open ? '×' : '☰';
  });
  menu?.addEventListener('click', e => {
    if (e.target.closest('a')) {
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open menu');
      button.textContent = '☰';
    }
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.scroll-progress span');
  const hero = document.querySelector('.hero');
  const cta = document.querySelector('.cta');
  const aboutImage = document.querySelector('.about-image');
  const process = document.querySelector('.process');
  let ticking = false;
  function updateScroll() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0})`;
    if (!reduced.matches) {
      [hero, cta, aboutImage].forEach(element => {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
          const distance = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) * 0.10;
          element.style.setProperty('--parallax-y', `${Math.max(-35, Math.min(35, distance)).toFixed(1)}px`);
        }
      });
    }
    if (!reduced.matches && process) {
      const r = process.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) process.style.setProperty('--wave-x', `${Math.max(-35, Math.min(35, (window.innerHeight / 2 - (r.top + r.height / 2)) * .05)).toFixed(1)}px`);
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  reduced.addEventListener?.('change', () => { [hero, cta, aboutImage, process].forEach(el => el.style.removeProperty('--parallax-y')); updateScroll(); });
  updateScroll();

  if (!reduced.matches && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll('.about-copy, .about-image, .stat, .services-intro, .service-card, .process, .testimonial, .cta, .footer');
    const headings = document.querySelectorAll('.about-copy h2, .services-intro h2, .process h2, .testimonial h2, .cta h2');
    items.forEach((el, i) => {
      el.classList.add('reveal-item');
      if (el.matches('.stat, .service-card')) el.style.setProperty('--reveal-delay', `${(i % 3) * 90}ms`);
    });
    headings.forEach(el => {
      const lines = el.innerHTML.split(/<br\s*\/?\s*>/i);
      const label = lines.map(line => { const node = document.createElement('span'); node.innerHTML = line; return node.textContent.trim(); }).join(' ');
      el.setAttribute('aria-label', label);
      el.innerHTML = '';
      el.classList.add('reveal-heading', 'text-reveal');
      lines.forEach((line, i) => {
        const mask = document.createElement('span');
        mask.className = 'text-reveal-line';
        mask.setAttribute('aria-hidden', 'true');
        mask.style.setProperty('--line-delay', `${i * 120}ms`);
        const inner = document.createElement('span');
        inner.innerHTML = line;
        mask.appendChild(inner);
        el.appendChild(mask);
      });
    });
    document.querySelectorAll('.steps>div, .checks li').forEach((el, i) => el.style.setProperty('--child-delay', `${(i % 4) * 100 + 100}ms`));
    // First paint is never dependent on a library or network connection.
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: 0 });
    [...items, ...headings].forEach(el => observer.observe(el));
    const heroObserver = new IntersectionObserver(([entry]) => { hero.classList.toggle('hero-active', entry.isIntersecting); }, { threshold: 0 });
    heroObserver.observe(hero);
  }
})();
