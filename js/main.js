// ALMA — Clínica Dentária | Prototype interactions

(function () {
  'use strict';

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(pointer: fine)');
  const prefersReduced = () => reduceMotionQuery.matches;

  /* ---------- Header scroll state, progress bar, back to top ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const progressBar = document.querySelector('.progress-bar');

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    backToTop.classList.toggle('show', y > 500);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    updateActiveNavLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  function setNavOpen(open) {
    mainNav.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  navToggle.addEventListener('click', () => setNavOpen(!mainNav.classList.contains('open')));
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setNavOpen(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      setNavOpen(false);
      navToggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!mainNav.classList.contains('open')) return;
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) setNavOpen(false);
  });

  /* ---------- Scrollspy: marca a secção activa na navegação ---------- */
  const navLinks = [...mainNav.querySelectorAll('a[href^="#"]')];
  const navSections = navLinks
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  function updateActiveNavLink() {
    if (!navSections.length) return;
    const probe = window.scrollY + (header.offsetHeight || 84) + 48;
    let active = navSections[0];
    navSections.forEach(section => { if (section.offsetTop <= probe) active = section; });

    // No fundo da página a última secção é sempre a activa.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      active = navSections[navSections.length - 1];
    }

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + active.id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (prefersReduced()) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    revealEls.forEach((el, i) => el.style.setProperty('--d', i % 6));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll('.stat-number');

  function formatCount(value, decimals) {
    return value.toLocaleString('pt-PT', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  counters.forEach(el => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    if (Number.isNaN(target)) return;

    if (prefersReduced()) {
      el.textContent = formatCount(target, decimals);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);

        const duration = 1800;
        const start = performance.now();
        (function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = formatCount(target * eased, decimals);
          if (progress < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  /* ---------- Marquee: botão de pausa (WCAG 2.2.2) ---------- */
  const trustStrip = document.querySelector('.trust-strip');
  const marqueePause = document.getElementById('marqueePause');
  if (trustStrip && marqueePause) {
    marqueePause.addEventListener('click', () => {
      const paused = trustStrip.classList.toggle('is-paused');
      marqueePause.setAttribute('aria-pressed', String(paused));
      marqueePause.setAttribute('aria-label', paused ? 'Retomar animação' : 'Pausar animação');
    });
  }

  /* ---------- Comparador Antes / Depois ---------- */
  const baSlider = document.getElementById('baSlider');
  const baBefore = document.getElementById('baBefore');
  const baRange = document.getElementById('baRange');
  const baHandle = document.getElementById('baHandle');

  if (baSlider && baBefore && baRange && baHandle) {
    function setBaPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      // pct = quanto do "Antes" fica visivel a partir da esquerda
      baBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      baHandle.style.left = pct + '%';
      baRange.value = pct;
    }

    baRange.addEventListener('input', () => setBaPosition(parseFloat(baRange.value)));

    function positionFromEvent(e) {
      const rect = baSlider.getBoundingClientRect();
      setBaPosition(((e.clientX - rect.left) / rect.width) * 100);
    }

    baSlider.addEventListener('pointerdown', (e) => {
      baSlider.setPointerCapture(e.pointerId);   // o arrasto continua fora do elemento
      positionFromEvent(e);
    });
    baSlider.addEventListener('pointermove', (e) => {
      if (baSlider.hasPointerCapture(e.pointerId)) positionFromEvent(e);
    });
    baSlider.addEventListener('pointerup', (e) => baSlider.releasePointerCapture(e.pointerId));

    setBaPosition(50);
  }

  /* ---------- Carrossel de testemunhos ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const carousel = document.getElementById('testimonialCarousel');

  if (track && dotsWrap && carousel) {
    const cards = [...track.children];
    const total = cards.length;
    let current = 0;
    let autoplayTimer = null;
    let userPaused = false;

    const dots = cards.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ver testemunho ${i + 1} de ${total}`);
      dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
      cards.forEach((card, i) => card.setAttribute('aria-hidden', String(i !== current)));
    }

    function startAutoplay() {
      if (prefersReduced() || userPaused || autoplayTimer) return;
      autoplayTimer = setInterval(() => goTo(current + 1), 5500);
    }
    function stopAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    document.getElementById('testimonialPrev')
      .addEventListener('click', () => { goTo(current - 1); restartAutoplay(); });
    document.getElementById('testimonialNext')
      .addEventListener('click', () => { goTo(current + 1); restartAutoplay(); });

    const pauseBtn = document.getElementById('testimonialPause');
    pauseBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.setAttribute('aria-label', userPaused ? 'Retomar rotação automática' : 'Pausar rotação automática');
      if (userPaused) stopAutoplay(); else startAutoplay();
    });

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); restartAutoplay(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); restartAutoplay(); }
    });

    // Pausa também com o teclado (focus), não só com o rato.
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', (e) => {
      if (!carousel.contains(e.relatedTarget)) startAutoplay();
    });

    if (prefersReduced()) {
      pauseBtn.hidden = true;
    }

    goTo(0);
    startAutoplay();
  }

  /* ---------- Serviços: pré-selecciona o serviço no formulário ---------- */
  const serviceSelect = document.getElementById('service');
  document.querySelectorAll('.service-card [data-service]').forEach(link => {
    link.addEventListener('click', () => {
      if (!serviceSelect) return;
      const wanted = link.dataset.service;
      if ([...serviceSelect.options].some(opt => opt.value === wanted)) {
        serviceSelect.value = wanted;
      }
      const nameField = document.getElementById('name');
      if (nameField) setTimeout(() => nameField.focus({ preventScroll: true }), 700);
    });
  });

  /* ---------- Formulário de contacto (protótipo — sem backend) ---------- */
  const form = document.getElementById('contactForm');

  if (form) {
    const formNote = document.getElementById('formNote');
    const honeypot = document.getElementById('website');

    const rules = {
      name: value => value.trim().length >= 2 || 'Indique o seu nome.',
      phone: value => /^[+()\d\s-]{9,20}$/.test(value.trim()) || 'Indique um telefone válido (mínimo 9 dígitos).',
      email: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) || 'Indique um email válido.'
    };

    function validateField(field) {
      let result = true;

      if (field.type === 'checkbox') {
        result = field.checked || 'É necessário o seu consentimento para podermos responder.';
      } else if (rules[field.id]) {
        result = rules[field.id](field.value);
      }

      const errorEl = document.getElementById(field.id + '-error');
      const valid = result === true;
      field.setAttribute('aria-invalid', String(!valid));
      if (errorEl) errorEl.textContent = valid ? '' : result;
      return valid;
    }

    const validatedFields = [...form.querySelectorAll('[required]')];

    validatedFields.forEach(field => {
      const revalidate = () => { if (field.dataset.touched) validateField(field); };
      field.addEventListener('blur', () => { field.dataset.touched = '1'; validateField(field); });
      field.addEventListener('input', revalidate);
      field.addEventListener('change', revalidate);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot: se estiver preenchido, o pedido é de um bot — descartado em silêncio.
      if (honeypot && honeypot.value) return;

      let firstInvalid = null;
      validatedFields.forEach(field => {
        field.dataset.touched = '1';
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        formNote.classList.add('is-error');
        formNote.textContent = 'Reveja os campos assinalados antes de enviar.';
        firstInvalid.focus();
        return;
      }

      formNote.classList.remove('is-error');
      formNote.textContent = 'Obrigado! (Protótipo) — o pedido seria enviado à clínica aqui.';
      form.reset();
      validatedFields.forEach(field => {
        delete field.dataset.touched;
        field.removeAttribute('aria-invalid');
        const errorEl = document.getElementById(field.id + '-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  /* ---------- Tilt dos cartões e spotlight (ponteiro fino, sem redução de movimento) ---------- */
  if (finePointerQuery.matches && !prefersReduced()) {
    document.querySelectorAll('.service-card, .diff-card').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--rx', `${(-py * 7).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`);
        card.classList.add('tilt');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('tilt');
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      });
    });

    const diffSection = document.querySelector('.differentiators');
    if (diffSection) {
      diffSection.addEventListener('pointermove', (e) => {
        const rect = diffSection.getBoundingClientRect();
        diffSection.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        diffSection.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    }
  }

  /* ---------- Cursor personalizado (desktop, sem redução de movimento) ---------- */
  const cursor = document.querySelector('.cursor-dot');
  if (cursor && finePointerQuery.matches && !prefersReduced()) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.classList.add('active');
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    document.querySelectorAll('a, button, .service-card, .ba-slider').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }

  onScroll();
})();
