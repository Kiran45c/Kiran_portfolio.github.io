// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
  toggleBackToTop();
});

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  });
});

// ===== ACTIVE NAV LINK =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ===== TYPED TEXT =====
const roles = ['Data Scientist', 'ML Engineer', 'GenAI Developer', 'Python Developer'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, --charIndex);
  } else {
    typedEl.textContent = current.slice(0, ++charIndex);
  }
  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(typeEffect, delay);
}
typeEffect();

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('stat-card')) {
          animateCount(entry.target.querySelector('.stat-num'));
        }
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate], .stat-card, .skill-category, .project-card, .timeline-item').forEach(el => {
  observer.observe(el);
});

// ===== COUNT ANIMATION =====
function animateCount(el) {
  if (!el) return;
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

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.btn-primary');
  const btnText = document.getElementById('btn-text');
  btn.disabled = true;
  btnText.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

  // Simulate send (replace with real EmailJS or Formspree integration)
  setTimeout(() => {
    btn.disabled = false;
    btnText.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    document.getElementById('form-success').style.display = 'flex';
    form.reset();
    setTimeout(() => {
      document.getElementById('form-success').style.display = 'none';
    }, 5000);
  }, 1500);
});

// ===== CERTIFICATE MODAL =====
const certModal = document.getElementById('cert-modal');
const certIframe = document.getElementById('cert-modal-iframe');
const certTitle = document.getElementById('cert-modal-title');
const certClose = document.getElementById('cert-modal-close');
const certBackdrop = document.getElementById('cert-modal-backdrop');

const certNames = {
  'Python.pdf': 'Python Programming',
  'eda.pdf': 'Exploratory Data Analysis',
  'DA.pdf': 'Data Analysis',
  'PowerBi_certificate.pdf': 'Power BI (DAX, KPI)',
  'gen_ai.pdf': 'Generative AI',
  'sql.pdf': 'SQL',
};

function openCertModal(file) {
  certIframe.src = file;
  certTitle.textContent = certNames[file] || file;
  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { certIframe.src = ''; }, 300);
}

document.querySelectorAll('.cert-card[data-cert]').forEach(card => {
  card.addEventListener('click', () => openCertModal(card.dataset.cert));
});
certClose.addEventListener('click', closeCertModal);
certBackdrop.addEventListener('click', closeCertModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });

// ===== SMOOTH SCROLL for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
