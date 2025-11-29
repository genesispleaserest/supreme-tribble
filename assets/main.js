// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.textContent = open ? '☰' : '✕';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }
  });
}

// Current year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      if (menu) {
        menu.style.display = 'none';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe cards and sections for animation
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.card, .timeline > div, .faq details');
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
});

// Contact form submission
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

function endpointForPreference(pref, formEl) {
  const action = formEl?.getAttribute('action');
  if (action) return action;

  const zap = formEl?.dataset?.webhookZapier;
  const n8n = formEl?.dataset?.webhookN8n;
  if (pref === 'zapier' && zap) return zap;
  if (pref === 'n8n' && n8n) return n8n;
  return zap || n8n || '';
}

async function submitForm(event) {
  event.preventDefault();
  if (!form || !statusEl) return;
  statusEl.textContent = '';

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Honeypot
  const hp = form.querySelector('input[name="website"]');
  if (hp && hp.value) {
    statusEl.textContent = 'Thanks!';
    return;
  }

  // Basic validation
  const required = ['company', 'name', 'email', 'message'];
  for (const name of required) {
    const el = form.querySelector(`[name="${name}"]`);
    if (!el || !el.value.trim()) {
      statusEl.textContent = 'Please fill out all required fields.';
      return;
    }
  }

  const endpoint = endpointForPreference(data.platform, form);
  if (!endpoint) {
    statusEl.textContent = 'No webhook configured. Please try email.';
    return;
  }

  statusEl.textContent = 'Sending...';

  try {
    const res = await fetch(endpoint, {
      method: form.getAttribute('method') || 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });
    if (!res.ok) {
      let msg = 'Submission failed. Please email us directly.';
      try {
        const body = await res.json();
        if (body?.errors && Array.isArray(body.errors)) {
          msg = body.errors.map(e => e.message).join(' ');
        }
      } catch (e) {
        // ignore parse errors
      }
      throw new Error(msg);
    }
    statusEl.textContent = 'Thanks - we will reach out shortly!';
    form.reset();
  } catch (err) {
    console.error(err);
    statusEl.textContent = err.message || 'Submission failed. Please email us directly.';
  }
}
if (form) form.addEventListener('submit', submitForm);

// Reviews scroller controls
const scroller = document.querySelector('.reviews-scroller');
const prevBtn = document.querySelector('.scroll-nav .prev');
const nextBtn = document.querySelector('.scroll-nav .next');

function scrollByCard(dir = 1) {
  if (!scroller) return;
  const card = scroller.querySelector('.review-card');
  const amount = (card?.clientWidth || 300) + 12; // include gap
  scroller.scrollBy({ left: dir * amount, behavior: 'smooth' });
}

prevBtn?.addEventListener('click', () => scrollByCard(-1));
nextBtn?.addEventListener('click', () => scrollByCard(1));







