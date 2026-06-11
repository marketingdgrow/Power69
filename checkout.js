/* ================================================
   POWER 69 — CHECKOUT.JS
   Full logic: steps, qty, coupon, validation,
   card formatting, payment, order confirmation
   ================================================ */

'use strict';

/* ===== STATE ===== */
const state = {
  qty: 1,
  basePrice: 1999,
  originalPrice: 2999,
  couponDiscount: 0,
  couponApplied: false,
  paymentMethod: 'card',
  currentStep: 1,
};

const VALID_COUPONS = {
  'POWER10': 0.10,
  'WELLNESS20': 0.20,
  'FIRST15': 0.15,
  'PW69': 0.15,
};

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initQty();
  initCoupon();
  initBillingToggle();
  initCardFormatting();
  updateSummary();
  initProgressBar();
});

/* ===== PROGRESS BAR ===== */
function initProgressBar() {
  updateStepUI(1);
}

function updateStepUI(step) {
  state.currentStep = step;
  const steps = [1, 2, 3];
  steps.forEach(s => {
    const el = document.getElementById(s === 1 ? 'step1Indicator' : `step${s}`);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (s < step) el.classList.add('done');
    else if (s === step) el.classList.add('active');
  });

  // Step 1 is always in nav
  const step1 = document.querySelector('.co-step');
  if (step1) {
    step1.classList.remove('active', 'done');
    if (step === 1) step1.classList.add('active');
    else step1.classList.add('done');
  }

  const step2El = document.getElementById('step2');
  const step3El = document.getElementById('step3');
  if (step2El) {
    step2El.classList.remove('active', 'done');
    if (step === 2) step2El.classList.add('active');
    else if (step > 2) step2El.classList.add('done');
  }
  if (step3El) {
    step3El.classList.remove('active', 'done');
    if (step === 3) step3El.classList.add('active');
  }
}

/* ===== STEP NAVIGATION ===== */
function goStep(step) {
  // Hide all sections
  ['sectionCart', 'sectionShipping', 'sectionPayment'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Show target section
  const sectionMap = { 1: 'sectionCart', 2: 'sectionShipping', 3: 'sectionPayment' };
  const target = document.getElementById(sectionMap[step]);
  if (target) {
    target.classList.remove('hidden');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  updateStepUI(step);
  updateCODTotal();
}

/* ===== QUANTITY ===== */
function initQty() {
  const minus = document.getElementById('qtyMinus');
  const plus = document.getElementById('qtyPlus');
  if (minus) minus.addEventListener('click', () => changeQty(-1));
  if (plus) plus.addEventListener('click', () => changeQty(1));
}

function changeQty(delta) {
  state.qty = Math.max(1, Math.min(10, state.qty + delta));
  const qtyEl = document.getElementById('qtyVal');
  if (qtyEl) qtyEl.textContent = state.qty;
  updateSummary();
}

/* ===== COUPON ===== */
function initCoupon() {
  const btn = document.getElementById('applyBtn');
  if (btn) btn.addEventListener('click', applyCoupon);

  const input = document.getElementById('couponInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') applyCoupon();
    });
  }
}

function applyCoupon() {
  const input = document.getElementById('couponInput');
  const msgEl = document.getElementById('couponMsg');
  if (!input || !msgEl) return;

  const code = input.value.trim().toUpperCase();

  if (!code) {
    showCouponMsg('Please enter a coupon code.', false);
    return;
  }

  if (state.couponApplied) {
    showCouponMsg('Coupon already applied!', false);
    return;
  }

  if (VALID_COUPONS[code]) {
    const pct = VALID_COUPONS[code];
    state.couponDiscount = Math.round(state.basePrice * pct);
    state.couponApplied = true;
    input.disabled = true;
    document.getElementById('applyBtn').textContent = '✓ APPLIED';
    document.getElementById('applyBtn').style.color = '#4CAF50';
    document.getElementById('applyBtn').style.borderColor = '#4CAF50';
    showCouponMsg(`🎉 Coupon applied! You saved ₹${state.couponDiscount}`, true);
    updateSummary();
  } else {
    showCouponMsg('Invalid coupon code. Try POWER10, PW69 or FIRST15', false);
  }
}

function showCouponMsg(msg, success) {
  const el = document.getElementById('couponMsg');
  if (!el) return;
  el.textContent = msg;
  el.className = 'co-coupon-msg ' + (success ? 'coupon-success' : 'coupon-error');
}

/* ===== SUMMARY UPDATER ===== */
function updateSummary() {
  const subtotal = state.basePrice * state.qty;
  const origTotal = state.originalPrice * state.qty;
  const baseDiscount = origTotal - subtotal;
  const totalDiscount = baseDiscount + state.couponDiscount;
  const finalTotal = subtotal - state.couponDiscount;

  // Qty
  setEl('summQty', state.qty);

  // Prices
  setEl('summPrice', formatNum(subtotal));
  setEl('summOrig', formatNum(origTotal));
  setEl('summDiscount', formatNum(baseDiscount));
  setEl('summTotal', formatNum(finalTotal));
  setEl('summSave', formatNum(totalDiscount));
  setEl('finalTotal', formatNum(finalTotal));

  // Coupon row visibility
  const couponRow = document.getElementById('couponRow');
  if (couponRow) {
    couponRow.style.display = state.couponDiscount > 0 ? 'flex' : 'none';
    setEl('summCoupon', formatNum(state.couponDiscount));
  }

  updateCODTotal();
}

function updateCODTotal() {
  const subtotal = state.basePrice * state.qty;
  const final = subtotal - state.couponDiscount;
  setEl('codTotal', formatNum(final));
  setEl('finalTotal', formatNum(final));
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function formatNum(n) {
  return n.toLocaleString('en-IN');
}

/* ===== BILLING TOGGLE ===== */
function initBillingToggle() {
  const checkbox = document.getElementById('sameAsBilling');
  if (!checkbox) return;
  checkbox.addEventListener('change', () => {
    const billing = document.getElementById('billingSection');
    if (billing) billing.classList.toggle('hidden', checkbox.checked);
  });
}

/* ===== SHIPPING VALIDATION ===== */
function validateShipping() {
  const fields = ['fname', 'lname', 'phone', 'email', 'addr1', 'city', 'state', 'pin'];
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('error');
    if (!el.value.trim()) {
      el.classList.add('error');
      el.style.borderColor = '#f44336';
      valid = false;
    } else {
      el.style.borderColor = '';
    }
  });

  // Phone validation
  const phone = document.getElementById('phone');
  if (phone && phone.value && !/^[6-9]\d{9}$/.test(phone.value.replace(/\D/g, ''))) {
    phone.classList.add('error');
    phone.style.borderColor = '#f44336';
    valid = false;
    showToast('Please enter a valid 10-digit phone number.');
    return;
  }

  // PIN validation
  const pin = document.getElementById('pin');
  if (pin && pin.value && !/^\d{6}$/.test(pin.value)) {
    pin.classList.add('error');
    pin.style.borderColor = '#f44336';
    valid = false;
    showToast('Please enter a valid 6-digit PIN code.');
    return;
  }

  if (!valid) {
    showToast('Please fill all required fields.');
    return;
  }

  goStep(3);
}

/* ===== PAYMENT SELECTION ===== */
function selectPayment(method) {
  state.paymentMethod = method;

  // Update option styles
  ['payCard', 'payUPI', 'payCOD'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  const map = { card: 'payCard', upi: 'payUPI', cod: 'payCOD' };
  const active = document.getElementById(map[method]);
  if (active) active.classList.add('active');

  // Show/hide forms
  ['cardForm', 'upiForm', 'codForm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const formMap = { card: 'cardForm', upi: 'upiForm', cod: 'codForm' };
  const activeForm = document.getElementById(formMap[method]);
  if (activeForm) activeForm.classList.remove('hidden');

  updateCODTotal();
}

/* ===== UPI SELECTION ===== */
function selectUPI(el) {
  document.querySelectorAll('.upi-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

/* ===== CARD FORMATTING ===== */
function initCardFormatting() {
  const numInput = document.getElementById('cardNum');
  const expiryInput = document.getElementById('cardExpiry');

  if (numInput) {
    numInput.addEventListener('input', () => formatCard(numInput));
  }
  if (expiryInput) {
    expiryInput.addEventListener('input', () => formatExpiry(expiryInput));
  }
}

function formatCard(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  val = val.replace(/(.{4})/g, '$1 ').trim();
  input.value = val;

  const cvNum = document.getElementById('cvNumber');
  if (cvNum) {
    const raw = val.replace(/\s/g, '');
    let display = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) display += ' ';
      display += raw[i] ? (i < 12 ? '•' : raw[i]) : '•';
    }
    cvNum.textContent = display;
  }
}

function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 2) val = val.substring(0, 2) + ' / ' + val.substring(2);
  input.value = val;

  const cvExpiry = document.getElementById('cvExpiry');
  if (cvExpiry) cvExpiry.textContent = val || 'MM / YY';
}

/* ===== PLACE ORDER ===== */
function placeOrder() {
  if (state.paymentMethod === 'card') {
    if (!validateCard()) return;
  } else if (state.paymentMethod === 'upi') {
    if (!validateUPI()) return;
  }

  // Show loading state
  const btn = document.getElementById('placeOrderBtn');
  const btnText = document.getElementById('placeOrderText');
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.7';
  }
  if (btnText) btnText.textContent = 'Processing...';

  // Simulate processing
  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
    if (btnText) {
      const finalTotal = state.basePrice * state.qty - state.couponDiscount;
      btnText.innerHTML = `Place Order — ₹<span id="finalTotal">${formatNum(finalTotal)}</span>`;
    }
    showConfirmation();
  }, 1800);
}

function validateCard() {
  const num = document.getElementById('cardNum');
  const name = document.getElementById('cardName');
  const expiry = document.getElementById('cardExpiry');
  const cvv = document.getElementById('cardCvv');

  if (!num || !num.value || num.value.replace(/\s/g, '').length < 16) {
    showToast('Please enter a valid 16-digit card number.');
    num && (num.style.borderColor = '#f44336');
    return false;
  }
  if (!name || !name.value.trim()) {
    showToast('Please enter the card holder name.');
    name && (name.style.borderColor = '#f44336');
    return false;
  }
  if (!expiry || expiry.value.replace(/\D/g, '').length < 4) {
    showToast('Please enter a valid expiry date.');
    expiry && (expiry.style.borderColor = '#f44336');
    return false;
  }
  if (!cvv || cvv.value.length < 3) {
    showToast('Please enter a valid CVV.');
    cvv && (cvv.style.borderColor = '#f44336');
    return false;
  }
  return true;
}

function validateUPI() {
  const upiInput = document.querySelector('#upiForm input[type="text"]');
  const selected = document.querySelector('.upi-btn.selected');
  if (!selected && (!upiInput || !upiInput.value.trim())) {
    showToast('Please select a UPI app or enter your UPI ID.');
    return false;
  }
  return true;
}

/* ===== ORDER CONFIRMATION ===== */
function showConfirmation() {
  const modal = document.getElementById('confirmModal');
  if (!modal) return;

  // Generate order ID
  const orderId = Math.floor(100000 + Math.random() * 900000);
  setEl('orderId', orderId);

  // Set confirmation details
  setEl('confQty', state.qty);
  const finalTotal = state.basePrice * state.qty - state.couponDiscount;
  setEl('confTotal', `₹${formatNum(finalTotal)}`);

  // Set payment method text
  const payMap = { card: 'Credit/Debit Card', upi: 'UPI Payment', cod: 'Cash on Delivery' };
  const confPayEl = document.getElementById('confPayment');
  if (confPayEl) confPayEl.textContent = payMap[state.paymentMethod];

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Confetti effect
  triggerConfetti();
}

function closeConfirm() {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== CONFETTI ===== */
function triggerConfetti() {
  const colors = ['#C9A84C', '#e8c96d', '#f5e09a', '#ffffff', '#8B6914'];
  const confettiCount = 80;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const conf = document.createElement('div');
      conf.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${Math.random() * 100}vw;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        z-index: 99999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 2 + 2}s ease-in forwards;
        opacity: ${Math.random() * 0.8 + 0.2};
      `;
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 4000);
    }, i * 30);
  }

  if (!document.getElementById('confettiStyle')) {
    const style = document.createElement('style');
    style.id = 'confettiStyle';
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(${Math.random() * 720}deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ===== TOAST ===== */
function showToast(msg, type = 'error') {
  let toast = document.getElementById('coToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'coToast';
    toast.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 9998;
      background: #1a0a0a; border: 1px solid #f44336;
      padding: 14px 22px; border-radius: 4px;
      font-family: 'Rajdhani', sans-serif; font-size: 0.85rem;
      color: #f44336; letter-spacing: 1px;
      transform: translateY(100px); opacity: 0;
      transition: all 0.35s ease;
      box-shadow: 0 4px 20px rgba(244,67,54,0.3);
      max-width: 340px;
    `;
    document.body.appendChild(toast);
  }

  if (type === 'success') {
    toast.style.background = '#0a1a0a';
    toast.style.borderColor = '#4CAF50';
    toast.style.color = '#4CAF50';
    toast.style.boxShadow = '0 4px 20px rgba(76,175,80,0.3)';
  } else {
    toast.style.background = '#1a0a0a';
    toast.style.borderColor = '#f44336';
    toast.style.color = '#f44336';
    toast.style.boxShadow = '0 4px 20px rgba(244,67,54,0.3)';
  }

  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3500);
}

/* ===== INPUT FOCUS EFFECTS ===== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.co-form-group input, .co-form-group select').forEach(input => {
    input.addEventListener('focus', function () {
      this.style.borderColor = '#C9A84C';
      this.style.background = 'rgba(201,168,76,0.05)';
      this.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)';
    });
    input.addEventListener('blur', function () {
      if (!this.value) {
        this.style.borderColor = '';
        this.style.background = '';
        this.style.boxShadow = '';
      } else {
        this.style.borderColor = 'rgba(201,168,76,0.5)';
        this.style.boxShadow = 'none';
      }
    });
  });
});