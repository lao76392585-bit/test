// ===== HEADER SCROLL EFFECT =====
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Show/Hide Scroll to Top Button
  const scrollToTop = document.getElementById("scrollToTop");
  if (window.scrollY > 500) {
    scrollToTop.classList.add("show");
  } else {
    scrollToTop.classList.remove("show");
  }
});

// ===== MENU TOGGLE =====
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
}

// Close menu when link is clicked
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("active");
  });
});

// ===== SCROLL TO TOP =====
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ===== FORM SUBMISSION =====
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Validate form
  if (!name || !email || !subject || !message) {
    showFormMessage("Please fill all fields", "error");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage("Please enter a valid email", "error");
    return;
  }

  // Simulate form submission
  const submitBtn = document.querySelector(".form-submit");
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  setTimeout(() => {
    showFormMessage(
      "✓ Message sent successfully! We'll get back to you soon.",
      "success",
    );
    document.getElementById("contactForm").reset();
    submitBtn.textContent = "Send Message";
    submitBtn.disabled = false;
  }, 1500);
});

function showFormMessage(message, type) {
  const formMessage = document.getElementById("formMessage");
  formMessage.textContent = message;
  formMessage.className = "form-message " + type;

  setTimeout(() => {
    formMessage.style.display = "none";
  }, 5000);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation =
        entry.target.style.animation || "fadeInUp 0.8s ease-out forwards";
    }
  });
}, observerOptions);

// ===== COUNTER ANIMATION =====
const statsSection = document.getElementById("stats");
let hasCountedUp = false;

window.addEventListener("scroll", () => {
  if (!hasCountedUp) {
    const statsRect = statsSection.getBoundingClientRect();
    if (statsRect.top < window.innerHeight) {
      hasCountedUp = true;
      countUpStats();
    }
  }
});

function countUpStats() {
  const stats = document.querySelectorAll(".stat-item h4");
  stats.forEach((stat) => {
    const target = parseInt(stat.textContent);
    const isMoney = stat.textContent.includes("%");
    const isPlus = stat.textContent.includes("+");

    let current = 0;
    const increment = target / 50;

    const updateCount = () => {
      current += increment;
      if (current < target) {
        stat.textContent =
          Math.floor(current) + (isPlus ? "+" : "") + (isMoney ? "%" : "");
        requestAnimationFrame(updateCount);
      } else {
        stat.textContent = target + (isPlus ? "+" : "") + (isMoney ? "%" : "");
      }
    };

    updateCount();
  });
}

// ===== PARALLAX EFFECT =====
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.backgroundPosition = `0 ${window.scrollY * 0.5}px`;
  }
});

// ===== INITIAL ANIMATIONS =====
window.addEventListener("load", () => {
  // Fade out loader
  setTimeout(() => {
    document.querySelector(".loader").style.display = "none";
  }, 2500);
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ===== RANDOM EMOJI ROTATION =====
setInterval(() => {
  const emojis = ["🚀", "✨", "🎯", "💡", "⚡"];
  document.querySelector(".hero-image-text").textContent =
    emojis[Math.floor(Math.random() * emojis.length)];
}, 3000);
