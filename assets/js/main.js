/* thinkGo — interactions */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Grand titre : découpage en mots, montée ligne par ligne ---------- */
  function splitTitle(el) {
    var walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var frag = doc.createDocumentFragment();
      n.textContent.split(/([ \t\n\r]+)/).forEach(function (part) {
        if (!part) return;
        if (/^[ \t\n\r]+$/.test(part)) { frag.appendChild(doc.createTextNode(' ')); return; }
        var mask = doc.createElement('span');
        mask.className = 'wm';
        var inner = doc.createElement('span');
        inner.className = 'wm__i';
        inner.textContent = part;
        mask.appendChild(inner);
        frag.appendChild(mask);
      });
      n.parentNode.replaceChild(frag, n);
    });
    // Same delay for every word of a line, staggered line after line
    var tops = [];
    el.querySelectorAll('.wm').forEach(function (w) {
      var t = Math.round(w.offsetTop);
      var line = tops.indexOf(t);
      if (line === -1) { tops.push(t); line = tops.length - 1; }
      w.firstChild.style.setProperty('--d', (0.12 + line * 0.13).toFixed(2) + 's');
    });
    el.classList.add('split');
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  }
  if (!reduceMotion) {
    doc.querySelectorAll('main h1').forEach(function (h1) {
      h1.classList.remove('reveal');
      splitTitle(h1);
    });
  }

  /* ---------- Méthode : ligne du temps au défilement ---------- */
  var timelines = Array.prototype.slice.call(doc.querySelectorAll('[data-timeline]'));
  function updateTimelines() {
    var trigger = window.innerHeight * 0.62;
    timelines.forEach(function (tl) {
      var rail = tl.querySelector('.timeline__rail');
      var r = rail.getBoundingClientRect();
      var p = reduceMotion ? 1 : Math.max(0, Math.min(1, (trigger - r.top) / r.height));
      tl.style.setProperty('--p', p.toFixed(4));
      tl.querySelectorAll('.tl-step').forEach(function (step) {
        var num = step.querySelector('.tl-step__num').getBoundingClientRect();
        step.classList.toggle('is-on', reduceMotion || num.top + num.height / 2 < trigger);
      });
    });
  }
  window.addEventListener('resize', updateTimelines);

  /* ---------- Header: scrolled state, hide on scroll down, progress ---------- */
  var header = doc.getElementById('header');
  var progress = header.querySelector('.progress');
  var sticky = doc.getElementById('sticky-cta');
  var hero = doc.querySelector('.hero') || doc.getElementById('contact');
  var contact = doc.getElementById('funnel');
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 24);
    if (!body.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', y > 600 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove('is-hidden');
    }
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';

    // Sticky CTA: visible after the hero, hidden around the contact form
    var heroBottom = hero ? hero.offsetTop + hero.offsetHeight - 200 : 400;
    var nearContact = false;
    if (contact) {
      var c = contact.getBoundingClientRect();
      nearContact = c.top < window.innerHeight && c.bottom > 0;
    }
    sticky.classList.toggle('is-visible', y > heroBottom && !nearContact);

    updateTimelines();
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = doc.querySelector('.burger');
  var menu = doc.getElementById('mobile-menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) header.classList.remove('is-hidden');
  }
  burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1080) setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = doc.querySelectorAll('.reveal, [data-ring], .region, .discretion__statement');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = doc.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var end = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        var dur = 1400;
        function frame(t) {
          if (!start) start = t;
          var p = Math.min((t - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased) + suffix;
          if (p < 1) window.requestAnimationFrame(frame);
        }
        window.requestAnimationFrame(frame);
        cObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  /* ---------- Tabs (méthode) ---------- */
  var tabs = Array.prototype.slice.call(doc.querySelectorAll('[role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      var panel = doc.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !selected;
      if (selected) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
        panel.querySelectorAll('.reveal').forEach(function (r) { r.classList.add('is-visible'); });
      }
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  /* ---------- Conversion funnel ---------- */
  var funnel = doc.getElementById('funnel');
  if (funnel) initFunnel(funnel);

  function initFunnel(funnel) {
  var form = funnel.querySelector('form');
  var steps = Array.prototype.slice.call(form.querySelectorAll('.funnel__step'));
  var bar = funnel.querySelector('.funnel__bar span');
  var curEl = funnel.querySelector('[data-step-current]');
  var totEl = funnel.querySelector('[data-step-total]');
  var btnPrev = form.querySelector('[data-prev]');
  var btnNext = form.querySelector('[data-next]');
  var btnSubmit = form.querySelector('[data-submit]');
  var errorEl = form.querySelector('.funnel__error');
  var summaryEl = form.querySelector('[data-summary]');
  var current = 0;

  totEl.textContent = steps.length;

  function render(direction) {
    steps.forEach(function (s, i) {
      s.classList.toggle('is-active', i === current);
      s.classList.toggle('is-back', i === current && direction === 'back');
    });
    curEl.textContent = current + 1;
    bar.style.width = ((current + 1) / steps.length * 100) + '%';
    btnPrev.hidden = current === 0;
    var last = current === steps.length - 1;
    btnNext.hidden = last;
    btnSubmit.hidden = !last;
    errorEl.textContent = '';
    if (last) buildSummary();
  }

  function buildSummary() {
    var data = new FormData(form);
    var items = [];
    ['projet', 'profil', 'taille', 'horizon'].forEach(function (k) { if (data.get(k)) items.push(data.get(k)); });
    data.getAll('zone').forEach(function (z) { items.push(z); });
    summaryEl.innerHTML = '';
    items.forEach(function (t) {
      var s = doc.createElement('span');
      s.textContent = t;
      summaryEl.appendChild(s);
    });
  }

  function validateStep(i) {
    var step = steps[i];
    var groups = {};
    var ok = true;
    var msg = '';

    step.querySelectorAll('input[type="radio"][required]').forEach(function (r) { groups[r.name] = true; });
    Object.keys(groups).forEach(function (name) {
      if (!form.querySelector('input[name="' + name + '"]:checked')) {
        ok = false;
        msg = msg || 'Merci de sélectionner une option pour continuer.';
      }
    });

    step.querySelectorAll('.field').forEach(function (f) { f.classList.remove('has-error'); });
    step.querySelectorAll('.field input[required]').forEach(function (input) {
      var valid = input.value.trim() !== '' && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
      if (!valid) {
        ok = false;
        input.closest('.field').classList.add('has-error');
        msg = msg || (input.type === 'email' && input.value.trim() ? 'Merci d’indiquer une adresse e-mail valide.' : 'Merci de compléter les champs obligatoires.');
      }
    });

    var consent = step.querySelector('.consent input');
    if (consent) {
      consent.closest('.consent').classList.toggle('has-error', !consent.checked);
      if (!consent.checked) { ok = false; msg = msg || 'Merci d’accepter d’être recontacté.'; }
    }

    errorEl.textContent = ok ? '' : msg;
    if (!ok) {
      var firstBad = step.querySelector('.has-error input') || step.querySelector('input');
      if (firstBad && firstBad.type !== 'radio') firstBad.focus();
    }
    return ok;
  }

  function goTo(i, direction) {
    current = Math.max(0, Math.min(i, steps.length - 1));
    render(direction);
    var top = funnel.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.4) {
      window.scrollTo({ top: window.scrollY + top - 100, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    var focusTarget = steps[current].querySelector('legend');
    if (focusTarget) { focusTarget.setAttribute('tabindex', '-1'); focusTarget.focus({ preventScroll: true }); }
  }

  btnNext.addEventListener('click', function () { if (validateStep(current)) goTo(current + 1, 'next'); });
  btnPrev.addEventListener('click', function () { goTo(current - 1, 'back'); });

  // Auto-advance on single-choice steps (steps 1 & 2)
  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.type !== 'radio') return;
    errorEl.textContent = '';
    var step = t.closest('.funnel__step');
    var idx = steps.indexOf(step);
    if (idx === current && step.querySelectorAll('.choice').length && idx < steps.length - 1) {
      window.setTimeout(function () { goTo(idx + 1, 'next'); }, 280);
    }
  });

  // Clear error state as soon as the user corrects a field
  form.addEventListener('input', function (e) {
    var f = e.target.closest('.field');
    if (f) f.classList.remove('has-error');
    if (e.target.closest('.consent')) e.target.closest('.consent').classList.remove('has-error');
    if (!form.querySelector('.has-error')) errorEl.textContent = '';
  });

  // Enter key moves forward instead of submitting early
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && current < steps.length - 1) {
      e.preventDefault();
      btnNext.click();
    }
  });

  // Pre-select intent from the URL (?projet=acquerir|ceder) or any CTA with data-intent
  function preselect(intent) {
    var radio = form.querySelector('[data-intent-value="' + intent + '"]');
    if (radio && !funnel.classList.contains('is-done')) {
      radio.checked = true;
      current = 1;
      render('next');
    }
  }
  var qs = new URLSearchParams(window.location.search).get('projet');
  if (qs) preselect(qs);

  doc.querySelectorAll('[data-intent]').forEach(function (cta) {
    cta.addEventListener('click', function () {
      var intent = cta.getAttribute('data-intent');
      var radio = form.querySelector('[data-intent-value="' + intent + '"]');
      if (radio && !funnel.classList.contains('is-done')) {
        radio.checked = true;
        current = 1;
        render('next');
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(current)) return;

    btnSubmit.classList.add('is-loading');
    btnSubmit.querySelector('use').setAttribute('href', '#i-loader');

    var data = new FormData(form);
    var params = new URLSearchParams();
    data.forEach(function (value, key) { params.append(key, value); });

    fetch(form.getAttribute('action') || '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      funnel.classList.add('is-done');
      var done = funnel.querySelector('.funnel__done h3');
      if (done) { done.setAttribute('tabindex', '-1'); done.focus(); }
    }).catch(function () {
      errorEl.innerHTML = 'L’envoi n’a pas abouti. Merci de réessayer ou de nous appeler au <a href="tel:+41792000703" style="text-decoration:underline">+41 79 200 07 03</a>.';
    }).then(function () {
      btnSubmit.classList.remove('is-loading');
      btnSubmit.querySelector('use').setAttribute('href', '#i-arrow');
    });
  });

  if (!qs) render();
  }

  /* ---------- Revue M&A : carrousel ---------- */
  doc.querySelectorAll('[data-pubs]').forEach(function (vp) {
    var section = vp.closest('.pubs');
    var prev = section.querySelector('[data-pubs-prev]');
    var next = section.querySelector('[data-pubs-next]');
    function step() {
      var card = vp.querySelector('.pub');
      var gap = parseFloat(getComputedStyle(vp.querySelector('.pubs__track')).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
    }
    function update() {
      var max = vp.scrollWidth - vp.clientWidth - 2;
      prev.disabled = vp.scrollLeft <= 2;
      next.disabled = vp.scrollLeft >= max;
    }
    prev.addEventListener('click', function () { vp.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { vp.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });
    vp.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Hero vidéo : pause, mouvement réduit ---------- */
  var heroVideo = doc.querySelector('.hero__video');
  if (heroVideo) {
    var toggle = doc.querySelector('.hero__toggle');
    function setPaused(paused) {
      if (paused) heroVideo.pause(); else { var pr = heroVideo.play(); if (pr && pr.catch) pr.catch(function () {}); }
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', paused ? 'Lire la vidéo' : 'Mettre la vidéo en pause');
      }
    }
    if (toggle) toggle.addEventListener('click', function () { setPaused(!heroVideo.paused); });
    if (reduceMotion) { heroVideo.removeAttribute('autoplay'); setPaused(true); }
  }

  /* ---------- Year ---------- */
  var y = doc.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
