// ===== script.js =====
/*
  script.js
  Purpose: provides all interactivity for the page:
   - Theme toggle (light/dark)
   - Counter (keyboard support)
   - Collapsible FAQ
   - Tabbed interface
   - Dropdown with outside-click close
   - Custom form validation with inline error messages

  Each block is commented to explain its purpose (required by the assignment).
*/

// Wait for DOM before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
  /* ===== Theme toggle (light/dark) ===== */
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Restore preference if available
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeBtn.textContent = '☀️ Light Mode';
    themeBtn.setAttribute('aria-pressed', 'true');
  }

  // Toggle theme on click
  themeBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    themeBtn.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Also allow keyboard 't' to toggle theme (accessibility + extra event type)
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') themeBtn.click();
  });

  /* ===== Counter feature ===== */
  let count = 0;
  const display = document.getElementById('counter-display');
  const inc = document.getElementById('increment');
  const dec = document.getElementById('decrement');
  const res = document.getElementById('reset');

  function updateCounter() {
    display.textContent = count;
  }

  inc.addEventListener('click', () => { count++; updateCounter(); });
  dec.addEventListener('click', () => { count--; updateCounter(); });
  res.addEventListener('click', () => { count = 0; updateCounter(); });

  // Keyboard support for counter: +, -, R (reset)
  document.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') { count++; updateCounter(); }
    if (e.key === '-') { count--; updateCounter(); }
    if (e.key.toLowerCase() === 'r') { count = 0; updateCounter(); }
  });

  /* ===== Collapsible FAQ ===== */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const expanded = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', String(!expanded));
      q.classList.toggle('open');
      const answer = q.nextElementSibling;
      answer.classList.toggle('open');
    });

    // keyboard support (Enter/Space)
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') q.click();
    });
  });

  /* ===== Tabbed interface ===== */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      document.getElementById(target).classList.add('active');
    });
  });

  /* ===== Dropdown (click outside to close) ===== */
  const dropBtn = document.getElementById('drop-btn');
  const dropList = document.getElementById('drop-list');
  const dropdown = document.getElementById('my-dropdown');

  dropBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // don't let document click close it immediately
    dropList.hidden = !dropList.hidden;
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) dropList.hidden = true;
  });

  // Basic item handler to show how interactivity can be used
  document.querySelectorAll('.drop-item').forEach(item => {
    item.addEventListener('click', (e) => {
      alert('You selected: ' + e.target.textContent);
      dropList.hidden = true;
    });
  });

  /* ===== Form validation ===== */
  const form = document.getElementById('signup-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm-password');
  const ageInput = document.getElementById('age');
  const websiteInput = document.getElementById('website');
  const termsCheckbox = document.getElementById('terms');
  const successBox = document.getElementById('form-success');

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  function showError(el, message) {
    const small = document.getElementById(el.id + '-error');
    small.textContent = message;
    el.classList.add('invalid');
  }
  function clearError(el) {
    const small = document.getElementById(el.id + '-error');
    small.textContent = '';
    el.classList.remove('invalid');
  }

  function validateName() {
    const v = nameInput.value.trim();
    if (v.length < 2) { showError(nameInput, 'Please enter your full name (at least 2 characters).'); return false; }
    clearError(nameInput); return true;
  }

  function validateEmail() {
    const v = emailInput.value.trim();
    if (!emailRegex.test(v)) { showError(emailInput, 'Please enter a valid email address.'); return false; }
    clearError(emailInput); return true;
  }

  function validatePassword() {
    const v = passwordInput.value;
    if (!passwordRegex.test(v)) { showError(passwordInput, 'Password must be 8+ characters and include letters and numbers.'); return false; }
    clearError(passwordInput); return true;
  }

  function validateConfirm() {
    if (confirmInput.value !== passwordInput.value) { showError(confirmInput, 'Passwords do not match.'); return false; }
    clearError(confirmInput); return true;
  }

  function validateAge() {
    const v = Number(ageInput.value);
    if (!v || v < 13 || v > 120) { showError(ageInput, 'Enter a valid age (13 - 120).'); return false; }
    clearError(ageInput); return true;
  }

  function validateWebsite() {
    const v = websiteInput.value.trim();
    if (v === '') { clearError(websiteInput); return true; }
    if (!urlRegex.test(v)) { showError(websiteInput, 'Please enter a valid URL (or leave blank).'); return false; }
    clearError(websiteInput); return true;
  }

  function validateTerms() {
    if (!termsCheckbox.checked) { document.getElementById('terms-error').textContent = 'You must accept the terms.'; return false; }
    document.getElementById('terms-error').textContent = '';
    return true;
  }

  // Live validation on input
  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);
  confirmInput.addEventListener('input', validateConfirm);
  ageInput.addEventListener('input', validateAge);
  websiteInput.addEventListener('input', validateWebsite);
  termsCheckbox.addEventListener('change', validateTerms);

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent actual submit for demo
    successBox.textContent = '';

    const valid = [
      validateName(),
      validateEmail(),
      validatePassword(),
      validateConfirm(),
      validateAge(),
      validateWebsite(),
      validateTerms()
    ].every(v => v === true);

    if (valid) {
      successBox.textContent = 'Form is valid! ✅ — Thanks for signing up.';
      form.reset();
      document.querySelectorAll('.invalid').forEach(i => i.classList.remove('invalid'));
    } else {
      const firstInvalid = document.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
    }

   // Automatically updates the copyright year in the footer
   const footerYear = document.getElementById('year');
   if (footerYear) {
   footerYear.textContent = new Date().getFullYear();
}
  });
});
