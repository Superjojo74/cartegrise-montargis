// Burger menu
const burger = document.getElementById('burger');
const navlinks = document.getElementById('navlinks');
if (burger && navlinks) {
  burger.addEventListener('click', () => navlinks.classList.toggle('open'));
  navlinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => navlinks.classList.remove('open'))
  );
}

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  '.card, .step, .review, .stat, .sec-head, .col-copy, .coll-copy, .contact-info'
);
revealTargets.forEach((el) => el.classList.add('reveal-el'));
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => io.observe(el));

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        cur += step;
        if (cur >= target) {
          el.textContent = target + suffix;
        } else {
          el.textContent = cur + suffix;
          requestAnimationFrame(tick);
        }
      };
      tick();
      cio.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((el) => cio.observe(el));

// Contact form submit
const form = document.getElementById('leadForm');
const okMsg = document.getElementById('formMsg');
const errMsg = document.getElementById('formErr');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    okMsg.classList.remove('show');
    errMsg.classList.remove('show');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('.form-submit');
    const action = form.getAttribute('action') || '';
    const configured = action && !action.includes('REMPLACER_ID');

    // Endpoint Formspree pas encore configuré : succès de démonstration
    if (!configured) {
      okMsg.classList.add('show');
      form.reset();
      return;
    }

    btn.disabled = true;
    btn.style.opacity = '.7';
    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        okMsg.classList.add('show');
        form.reset();
      } else {
        errMsg.classList.add('show');
      }
    } catch (_) {
      errMsg.classList.add('show');
    } finally {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  });
}
