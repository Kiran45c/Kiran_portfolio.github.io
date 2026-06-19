// ===== SCROLL ANIMATIONS =====
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        const counter = entry.target.querySelector('.stat-n');
        if (counter) animateCount(counter);
      }, i * 60);
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-up, .animate-left').forEach(el => animObserver.observe(el));

// ===== COUNT ANIMATION =====
function animateCount(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1200;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ===== ACTIVE NAV (sidebar + topnav) =====
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.snav').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// ===== BACK TO TOP =====
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  btt.classList.toggle('show', window.scrollY > 400);
}, { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mmlink').forEach(l => {
  l.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== SKILL TAG → GOOGLE SEARCH =====
document.querySelectorAll('.skill-pills span').forEach(tag => {
  tag.setAttribute('title', `Search: ${tag.textContent}`);
  tag.addEventListener('click', () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(tag.textContent)}`, '_blank', 'noopener');
  });
});

// ===== CERTIFICATE MODAL =====
const certModal   = document.getElementById('cert-modal');
const certIframe  = document.getElementById('cert-modal-iframe');
const certTitle   = document.getElementById('cert-modal-title');
const certClose   = document.getElementById('cert-modal-close');
const certBackdrop = document.getElementById('cert-modal-backdrop');

const certNames = {
  'Python.pdf': 'Python Programming',
  'eda.pdf': 'Exploratory Data Analysis',
  'DA.pdf': 'Data Analysis',
  'PowerBi_certificate.pdf': 'Power BI (DAX, KPI)',
  'gen_ai.pdf': 'Generative AI',
  'sql.pdf': 'SQL',
};

function openCert(file) {
  certIframe.src = file;
  certTitle.textContent = certNames[file] || file;
  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCert() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { certIframe.src = ''; }, 300);
}

document.querySelectorAll('.cert-pill[data-cert]').forEach(p => {
  p.addEventListener('click', () => openCert(p.dataset.cert));
});
certClose.addEventListener('click', closeCert);
certBackdrop.addEventListener('click', closeCert);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCert(); });

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  btn.disabled = true;
  btnText.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success) {
      document.getElementById('form-success').style.display = 'flex';
      form.reset();
      setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 5000);
      btnText.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    } else {
      btnText.innerHTML = 'Failed. Try again <i class="fa-solid fa-rotate-right"></i>';
    }
  } catch {
    btnText.innerHTML = 'Failed. Try again <i class="fa-solid fa-rotate-right"></i>';
  } finally {
    btn.disabled = false;
  }
});
