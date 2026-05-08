const STORAGE = {
  THEME: "website.theme",
  AUDIO: "website.audio",
  USERS: "website.users",
  AUTH: "website.auth",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function getJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_err) {
    return fallback;
  }
}

function setJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setFeedback(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = `feedback ${type}`;
}

function currentUser() {
  return getJson(STORAGE.AUTH, null);
}

function applyTheme() {
  const savedTheme = localStorage.getItem(STORAGE.THEME) || "dark";
  document.body.classList.toggle("dark", savedTheme === "dark");
  const icon = $("#themeBtn i");
  if (icon) {
    icon.className = savedTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

function toggleTheme() {
  const next = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem(STORAGE.THEME, next);
  applyTheme();
}

function toggleMenu() {
  $(".nav-links")?.classList.toggle("open");
}

function navAuthState() {
  const auth = currentUser();
  const loginLink = $("#navLogin");
  const registerLink = $("#navRegister");
  const dashboardLink = $("#navDashboard");
  const logoutBtn = $("#navLogout");
  if (!loginLink || !registerLink || !dashboardLink || !logoutBtn) return;

  const loggedIn = Boolean(auth?.email);
  loginLink.style.display = loggedIn ? "none" : "";
  registerLink.style.display = loggedIn ? "none" : "";
  dashboardLink.style.display = loggedIn ? "" : "none";
  logoutBtn.style.display = loggedIn ? "" : "none";

  // ===== User Profile Chip (inject once, update always) =====
  let chip = document.getElementById("userChip");
  if (!chip) {
    const actions = document.querySelector(".actions");
    if (actions) {
      chip = document.createElement("div");
      chip.id = "userChip";
      chip.className = "user-chip";
      chip.title = "ข้อมูลถูกเก็บชั่วคราวในเบราว์เซอร์ จนกว่าจะ Logout";
      chip.innerHTML = `
        <div class="user-chip-avatar" id="userChipAvatar"></div>
        <div class="user-chip-info">
          <span class="user-chip-name" id="userChipName"></span>
          <span class="user-chip-note">⏳ ชั่วคราว (Session)</span>
        </div>
      `;
      actions.insertBefore(chip, actions.firstChild);
    }
  }
  if (chip) {
    chip.style.display = loggedIn ? "flex" : "none";
    if (loggedIn && auth?.name) {
      const chipAvatar = document.getElementById("userChipAvatar");
      const chipName   = document.getElementById("userChipName");
      if (chipAvatar) chipAvatar.textContent = auth.name.charAt(0).toUpperCase();
      if (chipName)   chipName.textContent = auth.name;
    }
  }
}

function logout() {
  localStorage.removeItem(STORAGE.AUTH);
  navAuthState();
  window.location.href = "index.html";
}

function clickAudio() {
  const audioEnabled = localStorage.getItem(STORAGE.AUDIO) !== "off";
  if (!audioEnabled) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 660;
  gain.gain.value = 0.06;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, 70);
}

function toggleAudio() {
  const current = localStorage.getItem(STORAGE.AUDIO) || "on";
  const next = current === "on" ? "off" : "on";
  localStorage.setItem(STORAGE.AUDIO, next);
  const icon = $("#audioBtn i");
  if (icon) icon.className = next === "on" ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
}

function syncAudioIcon() {
  const state = localStorage.getItem(STORAGE.AUDIO) || "on";
  const icon = $("#audioBtn i");
  if (icon) icon.className = state === "on" ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
}

function setupContactForm() {
  const form = $("#contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      name: $("#name")?.value.trim(),
      email: $("#email")?.value.trim(),
      subject: $("#subject")?.value.trim(),
      message: $("#message")?.value.trim(),
    };
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setFeedback($("#contactFeedback"), "กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      return;
    }
    setFeedback($("#contactFeedback"), "ส่งคำถามสำเร็จ ทีมที่ปรึกษาจะติดต่อกลับเร็วที่สุด", "ok");
    form.reset();
  });
}

function setupRegister() {
  const form = $("#registerForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#regName")?.value.trim();
    const email = $("#regEmail")?.value.trim().toLowerCase();
    const password = $("#regPassword")?.value;
    const confirm = $("#regConfirmPassword")?.value;
    if (!name || !email || !password || !confirm) {
      setFeedback($("#registerFeedback"), "กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }
    if (password.length < 6) {
      setFeedback($("#registerFeedback"), "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", "error");
      return;
    }
    if (password !== confirm) {
      setFeedback($("#registerFeedback"), "ยืนยันรหัสผ่านไม่ตรงกัน", "error");
      return;
    }
    const users = getJson(STORAGE.USERS, []);
    if (users.some((u) => u.email === email)) {
      setFeedback($("#registerFeedback"), "อีเมลนี้ถูกใช้แล้ว", "error");
      return;
    }
    users.push({ name, email, password, createdAt: new Date().toISOString() });
    setJson(STORAGE.USERS, users);
    setFeedback($("#registerFeedback"), "สมัครสมาชิกเรียบร้อย กำลังพาไปหน้าเข้าสู่ระบบ...", "ok");
    setTimeout(() => (window.location.href = "login.html"), 900);
  });
}

function setupLogin() {
  const form = $("#loginForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#loginEmail")?.value.trim().toLowerCase();
    const password = $("#loginPassword")?.value;
    const users = getJson(STORAGE.USERS, []);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      setFeedback($("#loginFeedback"), "อีเมลหรือรหัสผ่านไม่ถูกต้อง", "error");
      return;
    }
    setJson(STORAGE.AUTH, { name: user.name, email: user.email });
    setFeedback($("#loginFeedback"), "เข้าสู่ระบบสำเร็จ กำลังไปแดชบอร์ด...", "ok");
    setTimeout(() => (window.location.href = "dashboard.html"), 650);
  });
}

function setupDashboard() {
  const guard = document.body.dataset.guard === "auth";
  if (!guard) return;
  const auth = currentUser();
  if (!auth) {
    window.location.href = "login.html";
    return;
  }
  const userName = $("#userName");
  const userEmail = $("#userEmail");
  if (userName) userName.textContent = auth.name;
  if (userEmail) userEmail.textContent = auth.email;
}



document.addEventListener("click", (e) => {
  const target = e.target.closest("a,button,.card");
  if (target) clickAudio();
});

document.addEventListener("DOMContentLoaded", () => {

  applyTheme();
  syncAudioIcon();
  navAuthState();
  setupContactForm();
  setupRegister();
  setupLogin();
  setupDashboard();

  $("#themeBtn")?.addEventListener("click", toggleTheme);
  $("#audioBtn")?.addEventListener("click", toggleAudio);
  $("#menuBtn")?.addEventListener("click", toggleMenu);
  $("#navLogout")?.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });

  $$(".nav-links a").forEach((item) =>
    item.addEventListener("click", () => $(".nav-links")?.classList.remove("open")),
  );
});
