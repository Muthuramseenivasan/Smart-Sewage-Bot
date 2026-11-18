(function () {
  'use strict';

  // Mobile menu
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function () { nav.classList.remove('open'); });

  // Clickable "how it works" steps
  var info = [
    ['Deploy', 'The robot is lowered into the manhole or tank by a tether/winch with precise positioning. The operator stays outside the whole time.'],
    ['Sense', 'Gas sensors (CH₄, H₂S, CO, O₂) and a depth sensor read the environment continuously. Unsafe levels trigger the safety interlock.'],
    ['Inspect', 'The ESP32 camera streams live video with depth sensing, so the operator can see inside and decide where to clean.'],
    ['Agitate', 'Motorized blades rotate to loosen and suspend settled sludge so that it can be pumped out.'],
    ['Extract', 'A suction pump removes the loosened sludge and transfers it through a hose to a tanker in a closed loop.'],
    ['Report', 'Sensor readings, video and job details are logged and sent to the dashboard as auditable reports and alerts.']
  ];
  var steps = document.querySelectorAll('#steps li');
  var box = document.getElementById('stepinfo');
  function showStep(i) {
    steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
    box.innerHTML = '<b>Step ' + (i + 1) + ' · ' + info[i][0] + '</b><br>' + info[i][1];
  }
  steps.forEach(function (s) {
    s.addEventListener('click', function () { showStep(+s.dataset.i); });
  });
  showStep(0);

  // Safety interlock simulator (same threshold as the prototype Arduino code)
  var gas = document.getElementById('gas');
  var gasVal = document.getElementById('gasVal');
  var lamp = document.getElementById('lamp');
  var simText = document.getElementById('simText');
  function sim() {
    var v = +gas.value;
    gasVal.textContent = v;
    var danger = v > 400;
    lamp.classList.toggle('alarm', danger);
    simText.textContent = danger
      ? 'Above threshold: relay switches, the motor/pump responds as programmed and an alert is sent.'
      : 'Below threshold: system stays in its normal state.';
  }
  gas.addEventListener('input', sim);
  sim();

  // Image lightbox
  var lb = document.getElementById('lb');
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('.zoomable').forEach(function (img) {
    img.addEventListener('click', function () {
      lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('show');
    });
  });
  lb.addEventListener('click', function () { lb.classList.remove('show'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('show'); });

  // Count-up numbers and scroll reveal
  function count(el) {
    var end = +el.dataset.n, pre = el.dataset.pre || '', suf = el.dataset.suf || '', t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1200, 1);
      el.textContent = pre + Math.round(end * p) + suf;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  document.querySelectorAll('.card,.stats div,.road li,.vs,table').forEach(function (e) { e.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        var n = en.target.querySelector && en.target.querySelector('[data-n]');
        if (n) count(n);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (e) { io.observe(e); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });
    document.querySelectorAll('[data-n]').forEach(function (n) { n.textContent = (n.dataset.pre || '') + n.dataset.n + (n.dataset.suf || ''); });
  }

  // Highlight current section in the menu
  var links = document.querySelectorAll('nav a');
  var secs = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  window.addEventListener('scroll', function () {
    var y = window.scrollY + 120, cur = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('act', i === cur); });
  }, { passive: true });
})();
