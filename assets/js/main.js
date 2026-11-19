/* QUADE — site scripts (vanilla JS, no jQuery needed) */
(function () {
  'use strict';

  /* ---------- Header: shrink + shadow on scroll ---------- */
  var header = document.getElementById('main-header');
  var toTop = document.querySelector('.scroll-top');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-fixed', y > 0);
    if (toTop) toTop.classList.toggle('show', y > 800);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.mobile-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('#top-menu a').forEach(function (a) {
      a.addEventListener('click', function () { header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ---------- Sliders (autoplay, loop, swipe, pause on hover) ---------- */
  document.querySelectorAll('.slider').forEach(function (el) {
    var track = el.querySelector('.track');
    var slides = track.children;
    var n = slides.length;
    if (n < 2) return;
    var i = 0, timer = null, delay = (parseFloat(el.dataset.delay) || 3) * 1000;

    var dots = document.createElement('div');
    dots.className = 'dots';
    for (var d = 0; d < n; d++) {
      (function (k) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide ' + (k + 1));
        b.addEventListener('click', function () { go(k); restart(); });
        dots.appendChild(b);
      })(d);
    }
    el.appendChild(dots);

    if (el.hasAttribute('data-arrows')) {
      ['prev', 'next'].forEach(function (dir) {
        var a = document.createElement('button');
        a.type = 'button';
        a.className = 'arrow ' + dir;
        a.setAttribute('aria-label', dir === 'prev' ? 'Previous slide' : 'Next slide');
        a.addEventListener('click', function () { go(i + (dir === 'prev' ? -1 : 1)); restart(); });
        el.appendChild(a);
      });
    }

    function go(k) {
      i = (k + n) % n;
      track.style.transform = 'translateX(' + (-100 * i) + '%)';
      Array.prototype.forEach.call(dots.children, function (b, j) { b.classList.toggle('active', j === i); });
    }
    function start() { stop(); timer = setInterval(function () { go(i + 1); }, delay); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function restart() { if (!el.matches(':hover')) start(); }

    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', start);

    var x0 = null;
    el.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    el.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); restart(); }
    });

    go(0);
    start();
  });

  /* ---------- Reveal on scroll (replaces Divi entrance animations) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  /* ---------- Contact / quote forms ---------- */
  document.querySelectorAll('form.js-contact').forEach(function (form) {
    var msg = form.querySelector('.form-msg');
    function show(text, isError) {
      msg.textContent = text;
      msg.className = 'form-msg show' + (isError ? ' error' : '');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var missing = ['name', 'email', 'phone', 'services', 'message'].filter(function (k) { return !f[k].value.trim(); });
      if (missing.length) { show('Please fill in the following fields: ' + missing.join(', ') + '.', true); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { show('Please enter a valid email address.', true); return; }
      if (!/^[0-9\s\-]{10,12}$/.test(f.phone.value.trim())) { show('Phone: only numbers allowed, 10–12 characters.', true); return; }

      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      fetch(form.getAttribute('action'), { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (res) {
          if (res && res.ok) { form.reset(); show('Thanks for contacting us'); }
          else { show((res && res.error) || 'Sorry, your message could not be sent. Please email admin@quadengg.com.', true); }
        })
        .catch(function () { show('Sorry, your message could not be sent. Please email admin@quadengg.com.', true); })
        .then(function () { btn.disabled = false; });
    });
  });
})();
