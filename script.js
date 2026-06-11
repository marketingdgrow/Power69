/* ================================================
   POWER 69 — PREMIUM SCRIPT.JS
   ================================================ */

'use strict';

let siteData = {};

async function loadData() {
  try {
    const res = await fetch('data.json');
    siteData = await res.json();
  } catch (e) {
    console.warn('data.json not loaded, using fallback');
  }
  init();
}

function init() {
  initLoader();
}

/* ===== LOADER ===== */
function initLoader() {
  const fill = document.querySelector('.loader-fill');
  const pct = document.querySelector('.loader-pct');
  const loader = document.getElementById('loader');
  let progress = 0;

  const interval = setInterval(() => {
    const increment = Math.random() * 15 + 5;
    progress = Math.min(progress + increment, 100);
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.02)';
        loader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        setTimeout(() => {
          loader.style.display = 'none';
          afterLoad();
        }, 800);
      }, 400);
    }
  }, 80);
}

function afterLoad() {
  initParticles();
  initNavbar();
  buildAllSections();
  initScrollReveal();
  initMobileMenu();
  initTestimonials();
  initFAQ();
  initStats();
  initContactForm();
  initCursorGlow();
  initMouseParallax();
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-left, .hero .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
  }, 100);
}

/* ===== PARTICLE CANVAS ===== */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 8000), 120);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.1,
        gold: Math.random() > 0.5
      });
    }
  }
  createParticles();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201, 168, 76, ${p.alpha})`
        : `rgba(255, 255, 255, ${p.alpha * 0.4})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

/* ===== BUILD ALL SECTIONS ===== */
function buildAllSections() {
  buildFeatures();
  buildProducts();
  buildWhy();
  buildStats();
  buildBenefits();
  buildIngredients();
  buildTestimonials();
  buildFAQ();
  buildProductSections();
}

/* ===== ICON HELPER ===== */
function getIcon(fa_icon, size) {
  if (!fa_icon) return '';
  // fa_icon format: "fa-solid fa-dumbbell" or "fa-solid fa-droplet"
  return `<i class="${fa_icon}" style="font-size:${size || '1em'}"></i>`;
}

/* FEATURES */
function buildFeatures() {
  const grid = document.getElementById('featuresGrid');
  if (!grid || !siteData.features) return;
  grid.innerHTML = siteData.features.map(f => `
    <div class="feature-card reveal-up">
      <div class="fc-icon"><i class="${f.fa_icon}"></i></div>
      <div class="fc-title">${f.title}</div>
      <p class="fc-desc">${f.desc}</p>
    </div>
  `).join('');
}

/* PRODUCTS - New Horizontal Layout */
function buildProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid || !siteData.products) return;
  grid.innerHTML = siteData.products.map((p, idx) => `
    <div class="product-card reveal-up">
      <div class="pc-number">0${idx + 1}</div>
      <div class="pc-icon-wrap">
        <div class="pc-icon-circle">
          <i class="${p.fa_icon}"></i>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-vol-badge">${p.volume}</div>
        <div class="pc-name">${p.name}</div>
        <div class="pc-sub">${p.subtitle}</div>
        <p class="pc-desc">${p.description}</p>
        <ul class="pc-benefits">
          ${p.benefits.map(b => `<li><i class="fa-solid fa-check"></i>${b}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

/* WHY - New 4-col grid with icon + stat */
function buildWhy() {
  const grid = document.getElementById('whyGrid');
  if (!grid || !siteData.why_power69) return;
  grid.innerHTML = siteData.why_power69.map(w => `
    <div class="why-card reveal-up">
      <div class="wc-icon-wrap">
        <div class="wc-icon-bg"></div>
        <div class="wc-icon"><i class="${w.fa_icon}"></i></div>
      </div>
      <div class="wc-title">${w.title}</div>
      <p class="wc-desc">${w.desc}</p>
    </div>
  `).join('');
}

/* STATS */
function buildStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid || !siteData.statistics) return;
  grid.innerHTML = siteData.statistics.map(s => `
    <div class="stat-item reveal-up">
      <div class="stat-icon"><i class="${s.fa_icon}"></i></div>
      <div class="stat-number" data-target="${s.number}" data-suffix="${s.suffix}">0${s.suffix}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

/* BENEFITS */
function buildBenefits() {
  const tl = document.getElementById('benefitsTimeline');
  if (!tl || !siteData.benefits_timeline) return;
  tl.innerHTML = siteData.benefits_timeline.map(b => `
    <div class="bt-item reveal-up">
      <div class="bt-icon-wrap">
        <div class="bt-icon"><i class="${b.fa_icon}"></i></div>
        <div class="bt-dot"></div>
      </div>
      <div class="bt-week">${b.week}</div>
      <div class="bt-title">${b.title}</div>
      <p class="bt-desc">${b.desc}</p>
    </div>
  `).join('');
}

/* INGREDIENTS */
function buildIngredients() {
  const grid = document.getElementById('ingredientsGrid');
  if (!grid || !siteData.ingredients) return;
  grid.innerHTML = siteData.ingredients.map(ing => `
    <div class="ingredient-card reveal-up" onclick="openIngredientLightbox('${ing.name}', '${ing.latin}', '${ing.benefit}', '${ing.fa_icon}')">
      <div class="ic-icon"><i class="${ing.fa_icon}"></i></div>
      <div class="ic-name">${ing.name}</div>
      <div class="ic-latin">${ing.latin}</div>
      <p class="ic-benefit">${ing.benefit}</p>
      <div class="ic-learn">Learn More <i class="fa-solid fa-arrow-right"></i></div>
    </div>
  `).join('');
}

/* ===== 3 INDIVIDUAL PRODUCT SECTIONS ===== */
function buildProductSections() {
  const container = document.getElementById('productSectionsContainer');
  if (!container || !siteData.products) return;

  const layouts = [
    { imgSide: 'left',  bg: 'var(--navy)' },
    { imgSide: 'right', bg: 'var(--black)' },
    { imgSide: 'left',  bg: 'var(--navy)' },
  ];

  const imgMap = ['./img/oil.png', './img/capsules.png', './img/laddu.png'];

  container.innerHTML = siteData.products.map((p, i) => {
    const layout = layouts[i];
    const isRight = layout.imgSide === 'right';
    return `
      <section class="individual-product-section section-pad" style="background:${layout.bg};" id="product-detail-${p.id}">
        <div class="container">
          <div class="ip-grid ${isRight ? 'ip-grid--reverse' : ''}">
            <div class="ip-image-col reveal-${isRight ? 'right' : 'left'}">
              <div class="ip-img-wrap">
                <div class="ip-img-glow"></div>
                <div class="ip-img-ring"></div>
                <img src="${imgMap[i]}" alt="${p.name}" class="ip-product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="ip-fallback-visual" style="display:none;">
                  <div class="ip-fallback-inner">
                    <i class="${p.fa_icon}"></i>
                    <div class="ip-fallback-name">${p.name}</div>
                    <div class="ip-fallback-vol">${p.volume}</div>
                  </div>
                </div>
                <div class="ip-badge">${p.volume}</div>
              </div>
            </div>
            <div class="ip-content-col reveal-${isRight ? 'left' : 'right'}">
             
              <h2 class="ip-title">${p.name}<br/><span class="gold-text">${p.subtitle}</span></h2>
              <p class="ip-desc">${p.description}</p>
              <ul class="ip-benefits-list">
                ${p.benefits.map(b => `
                  <li>
                    <span class="ip-benefit-dot"><i class="fa-solid fa-check"></i></span>
                    <span>${b}</span>
                  </li>
                `).join('')}
              </ul>
              <div class="ip-how-to">
                <div class="ip-how-label"><i class="fa-solid fa-circle-info"></i> HOW TO USE</div>
                <p class="ip-how-text">${p.how_to_use}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }).join('');
}

/* ===== TESTIMONIALS - NEW GRID LAYOUT ===== */
function buildTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  if (!track || !siteData.testimonials) return;

  track.innerHTML = siteData.testimonials.map(t => `
    <div class="tcard">
      <div class="tcard-inner">
        <div class="tc-top">
          <div class="tc-avatar">${t.avatar}</div>
          <div class="tc-meta">
            <div class="tc-name">${t.name}</div>
            <div class="tc-loc"><i class="fa-solid fa-location-dot"></i> ${t.location}</div>
          </div>
          <div class="tc-rating">${'★'.repeat(t.rating)}</div>
        </div>
        <p class="tc-text">"${t.review}"</p>
        ${t.verified ? '<div class="tc-verified"><i class="fa-solid fa-circle-check"></i> VERIFIED PURCHASE</div>' : ''}
      </div>
    </div>
  `).join('');
}

function initTestimonials() {}

/* FAQ */
function buildFAQ() {
  const grid = document.getElementById('faqGrid');
  if (!grid || !siteData.faqs) return;
  grid.innerHTML = siteData.faqs.map((f, i) => `
    <div class="faq-item reveal-up" id="faq-${i}">
      <div class="faq-question" onclick="toggleFAQ(${i})">
        <span class="faq-icon-left"><i class="${f.fa_icon}"></i></span>
        <span class="faq-q-text">${f.question}</span>
        <span class="faq-icon">+</span>
      </div>
      <div class="faq-answer">
        <div class="faq-a-text">${f.answer}</div>
      </div>
    </div>
  `).join('');
}

function initFAQ() {}

function toggleFAQ(index) {
  const item = document.getElementById(`faq-${index}`);
  const allItems = document.querySelectorAll('.faq-item');
  allItems.forEach((el, i) => {
    if (i !== index) el.classList.remove('open');
  });
  item.classList.toggle('open');
}

/* ===== STATS COUNTER ===== */
function initStats() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  setTimeout(() => {
    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
  }, 500);
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = target % 1 !== 0;
  const duration = 2000;
  const steps = 60;
  const step = target / steps;
  let current = 0;
  let count = 0;

  const interval = setInterval(() => {
    count++;
    current = Math.min(current + step, target);
    const display = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
    el.textContent = display + suffix;
    if (count >= steps) clearInterval(interval);
  }, duration / steps);
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  const observe = () => {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade').forEach(el => {
      if (!el.classList.contains('revealed')) observer.observe(el);
    });
  };
  observe();
  setTimeout(observe, 500);
  setTimeout(observe, 1000);
  setTimeout(observe, 2000);
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✓ Message sent! We will contact you shortly.');
    form.reset();
  });
}

/* ===== LIGHTBOX ===== */
function openIngredientLightbox(name, latin, benefit, fa_icon) {
  const lb = document.getElementById('lightbox');
  const body = document.getElementById('lightboxBody');
  body.innerHTML = `
    <div style="text-align:center; padding: 20px 0;">
      <div style="font-size:3rem; margin-bottom:16px; color:var(--gold)"><i class="${fa_icon}"></i></div>
      <h2 style="font-family:var(--font-head); font-size:1.8rem; color:var(--gold); letter-spacing:2px; margin-bottom:6px;">${name}</h2>
      <p style="font-size:0.8rem; color:var(--white3); font-style:italic; margin-bottom:24px;">${latin}</p>
      <p style="font-size:1rem; line-height:1.7; color:var(--white2); max-width:400px; margin:0 auto;">${benefit}</p>
      <div style="margin-top:28px; height:2px; background:linear-gradient(90deg, transparent, var(--gold), transparent);"></div>
      <p style="margin-top:20px; font-size:0.75rem; color:var(--gold); letter-spacing:2px; font-family:var(--font-head);">PREMIUM AYURVEDIC INGREDIENT</p>
    </div>
  `;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openLightbox(name, latin, benefit, icon) {
  openIngredientLightbox(name, latin, benefit, icon);
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ===== CURSOR GLOW ===== */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function updateGlow() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
}

/* ===== MOUSE PARALLAX HERO ===== */
function initMouseParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.height / 2) / rect.height;

    const product = document.getElementById('heroProduct');
    if (product) {
      product.style.transform = `translateY(${-20 * Math.sin(Date.now() / 2000)}px) rotateX(${y * 5}deg) rotateY(${x * 5}deg)`;
    }

    const glowL = document.querySelector('.hero-glow-left');
    if (glowL) {
      glowL.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
    }
  });
}

/* ===== BUTTON RIPPLE ===== */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-gold');
  if (!btn) return;

  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;

  ripple.style.cssText = `
    position: absolute; border-radius: 50%;
    width: ${size}px; height: ${size}px;
    left: ${e.clientX - rect.left - size / 2}px;
    top: ${e.clientY - rect.top - size / 2}px;
    background: rgba(255,255,255,0.2);
    transform: scale(0); animation: rippleAnim 0.6s ease-out forwards;
    pointer-events: none;
  `;

  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = '@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }';
    document.head.appendChild(style);
  }

  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

/* ===== KEYBOARD ESCAPE FOR LIGHTBOX ===== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', loadData);