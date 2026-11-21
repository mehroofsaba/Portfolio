gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isSmallScreen = window.innerWidth < 700;

const canvas = document.getElementById("petal-canvas");
const ctx = canvas.getContext("2d");
let width,
  height,
  petals = [];

const PETAL_COUNT = isSmallScreen ? 17 : 30;

function getPetalColor() {
  return document.body.classList.contains("theme-dark") ? "#E8A9B4" : "#D9A5AE";
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Petal {
  constructor() {
    this.reset(true);
  }

  reset(randomStartY = false) {
    this.x = Math.random() * width;
    this.y = randomStartY ? Math.random() * height : -20;
    this.size = Math.random() * 6 + 4;
    this.speedY = Math.random() * 0.4 + 0.15;
    this.speedX = Math.random() * 0.2 - 0.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.015;
    this.opacity = Math.random() * 0.35 + 0.15;
    this.swayAmount = Math.random() * 0.6;
    this.swayOffset = Math.random() * Math.PI * 2;
  }

  update(time) {
    this.y += this.speedY;
    this.x +=
      this.speedX +
      Math.sin(time * 0.01 + this.swayOffset) * this.swayAmount * 0.1;
    this.rotation += this.rotationSpeed;
    if (this.y > height + 20) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.bezierCurveTo(
      -this.size * 0.6,
      -this.size * 0.2,
      -this.size * 0.6,
      this.size * 0.4,
      0,
      this.size,
    );
    ctx.bezierCurveTo(
      this.size * 0.6,
      this.size * 0.4,
      this.size * 0.6,
      -this.size * 0.2,
      0,
      -this.size,
    );
    ctx.fillStyle = getPetalColor();
    ctx.fill();
    ctx.restore();
  }
}

function initPetals() {
  petals = Array.from({ length: PETAL_COUNT }, () => new Petal());
}

// Step 11: pause the animation loop when the tab isn't visible
let petalsRunning = false;

function animate(time) {
  if (!petalsRunning) return;
  ctx.clearRect(0, 0, width, height);
  petals.forEach((p) => {
    p.update(time);
    p.draw();
  });
  requestAnimationFrame(animate);
}

function startPetals() {
  if (petalsRunning) return;
  petalsRunning = true;
  requestAnimationFrame(animate);
}

function stopPetals() {
  petalsRunning = false;
}

if (!reduceMotion) {
  resizeCanvas();
  initPetals();
  startPetals();

  window.addEventListener("resize", () => {
    resizeCanvas();
    initPetals();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPetals();
    else startPetals();
  });
} else {
  canvas.style.display = "none";
}

/*
   HERO ENTRANCE ANIMATION  (Step 7)
   */
if (!reduceMotion) {
  gsap
    .timeline({ defaults: { ease: "power3.out", duration: 1 } })
    .to(".greeting", { opacity: 1, y: 0 })
    .to(".hero-name", { opacity: 1, y: 0 }, "-=0.6")
    .to(".hero-role", { opacity: 1, y: 0 }, "-=0.6")
    .to(".hero-desc", { opacity: 1, y: 0 }, "-=0.6")
    .to(".hero-cta", { opacity: 1, y: 0 }, "-=0.6")
    .to(".scroll-cue", { opacity: 1, y: 0 }, "-=0.4");
} else {
  gsap.set(".reveal", { opacity: 1, y: 0 });
}

/* 
   SCROLL ANIMATIONS  (Step 9)
    */
if (!reduceMotion) {
  gsap.utils.toArray(".reveal-scroll").forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: (i % 3) * 0.08, // slight stagger for elements entering together
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });
  });
} else {
  gsap.set(".reveal-scroll", { opacity: 1, y: 0 });
}

/* =========================================================
   THEME TOGGLE + HERO PORTRAIT TRANSITION
========================================================= */

const themeToggle = document.querySelector(".theme-toggle");
// Show the theme toggle only while the hero is in view
if (themeToggle) {
  gsap.set(themeToggle, {
    autoAlpha: 1,
    pointerEvents: "auto",
  });

  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    onEnter: () => {
      gsap.to(themeToggle, {
        autoAlpha: 1,
        duration: 0.35,
        ease: "power2.out",
        onStart: () => {
          themeToggle.style.pointerEvents = "auto";
        },
      });
    },
    onLeave: () => {
      gsap.to(themeToggle, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          themeToggle.style.pointerEvents = "none";
        },
      });
    },
    onEnterBack: () => {
      gsap.to(themeToggle, {
        autoAlpha: 1,
        duration: 0.35,
        ease: "power2.out",
        onStart: () => {
          themeToggle.style.pointerEvents = "auto";
        },
      });
    },
    onLeaveBack: () => {
      gsap.to(themeToggle, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          themeToggle.style.pointerEvents = "none";
        },
      });
    },
  });
}
const heroIntro = document.getElementById("heroIntro");
const heroBio = document.querySelector(".hero-bio");

const bioElements = gsap.utils.toArray(
  ".hero-bio .bio-name, .hero-bio .bio-line",
);

let themeLocked = false;
let heroTimeline = null;

// Initial state
if (heroBio) {
  gsap.set(heroBio, {
    autoAlpha: 0,
    y: 18,
    filter: "blur(5px)",
  });

  gsap.set(bioElements, {
    autoAlpha: 0,
    y: 12,
    filter: "blur(4px)",
  });

  heroBio.inert = true;
  heroBio.setAttribute("aria-hidden", "true");
}

function updateHeroPresentation(isDark) {
  if (!heroIntro || !heroBio) return;

  // Stop the previous transition immediately.
  if (heroTimeline) {
    heroTimeline.kill();
  }

  gsap.killTweensOf([heroIntro, heroBio, ...bioElements]);

  heroBio.inert = !isDark;
  heroBio.setAttribute("aria-hidden", String(!isDark));
  heroIntro.setAttribute("aria-hidden", String(isDark));

  const duration = reduceMotion ? 0 : 0.55;

  heroTimeline = gsap.timeline({
    defaults: {
      duration,
      ease: "power2.out",
      overwrite: "auto",
    },
  });

  if (isDark) {
    // Sakura intro fades out as the portrait appears.
    heroTimeline
      .to(
        heroIntro,
        {
          autoAlpha: 0,
          y: -8,
          filter: "blur(4px)",
        },
        0,
      )
      .to(
        heroBio,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
        },
        0,
      )
      .to(
        bioElements,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: reduceMotion ? 0 : 0.5,
          stagger: reduceMotion ? 0 : 0.06,
          ease: "power2.inOut",
        },
        0.04,
      );
  } else {
    // Portrait disappears and the original intro returns.
    heroTimeline
      .to(
        bioElements,
        {
          autoAlpha: 0,
          y: 8,
          filter: "blur(4px)",
          duration: reduceMotion ? 0 : 0.38,
          stagger: 0,
        },
        0,
      )
      .to(
        heroBio,
        {
          autoAlpha: 0,
          y: 12,
          filter: "blur(5px)",
        },
        0,
      )
      .to(
        heroIntro,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
        },
        0,
      );
  }
}

function applyTheme(isDark) {
  document.body.classList.toggle("theme-dark", isDark);
  updateHeroPresentation(isDark);
}

function previewDark() {
  if (!document.body.classList.contains("theme-dark")) {
    applyTheme(true);
  }
}

function revertToLight() {
  if (!themeLocked && document.body.classList.contains("theme-dark")) {
    applyTheme(false);
  }
}

themeToggle.addEventListener("mouseenter", previewDark);
themeToggle.addEventListener("mouseleave", revertToLight);

themeToggle.addEventListener("focus", previewDark);
themeToggle.addEventListener("blur", revertToLight);

themeToggle.addEventListener("click", () => {
  themeLocked = !themeLocked;

  const stillPreviewing =
    themeToggle.matches(":hover") || document.activeElement === themeToggle;

  applyTheme(themeLocked || stillPreviewing);

  themeToggle.setAttribute("aria-pressed", String(themeLocked));

  themeToggle.querySelector(".toggle-txt").textContent = themeLocked
    ? "unlock dark"
    : "hover me";
});

themeToggle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    themeToggle.click();
  }
});

/*
   MOBILE NAV  (Step 10)
   */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
});

// close mobile nav when a link is tapped
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});
