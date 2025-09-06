// ===== DOM Ready =====
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  // Scroll animations (skip hero section)
  if (window.gsap) {
    gsap.utils.toArray("section:not(.hero-parallax) .fade-up").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: el,
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power2.out"
      });
    });
  }
});

// ===== Hero Parallax =====
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-parallax");
  if (hero) {
    hero.style.transform = `translateY(${window.scrollY * -0.1}px)`;
  }
});

// ===== Konami Code =====
const konamiCode = [
  "v", "o", "t", "e", " ", "d", "r", "i", "s", "t", "a", "n", "t", "a"
];
let konamiIndex = 0;

document.addEventListener("keydown", (event) => {
  const key = event.key;
  const expected = konamiCode[konamiIndex];

  if (key === expected) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateMemeMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateMemeMode() {
  if (window.__memeModeActivated) return;
  window.__memeModeActivated = true;

  const heroTitle = document.querySelector("#home h1");
  const heroText  = document.querySelector("#home p"); // <--- fixed
  if (heroTitle) heroTitle.innerText = "🔥 VOTE DRISTANTA: MEME LORD SUPREME 🔥";
  if (heroText) heroText.innerText = "Freshman year is officially meme-fied! Chaos incoming!";

  // Animate sections gradient
  document.querySelectorAll('section').forEach(sec => {
    let angle = 0;
    setInterval(() => {
      angle += 2;
      sec.style.background = `linear-gradient(${angle}deg, hotpink, limegreen)`;
    }, 50);
  });

  // GSAP animations
  if (window.gsap) {
    // Hero animations
    if (heroTitle) gsap.to(heroTitle, { duration: 2, rotation: 720, scale: 2, repeat:-1, yoyo:true });
    if (heroText) gsap.to(heroText, { duration: 1.5, rotation: 360, scale:1.5, repeat:-1, yoyo:true });

    // Spin all posters
    const allPosters = document.querySelectorAll(".poster-img, #lightbox-img");
    allPosters.forEach(img => {
      gsap.to(img, { rotation:360*(Math.random()<0.5?-1:1), scale:1+Math.random()*0.3, duration:2+Math.random()*2, repeat:-1, yoyo:true });
      img.style.border = "3px solid hotpink";
      img.style.filter = "drop-shadow(0 0 10px limegreen)";
    });

    // Spin navbar links
    document.querySelectorAll("nav a").forEach(el => {
      gsap.to(el, { rotation:15, x:10, y:-5, duration:0.2, repeat:-1, yoyo:true });
    });

    // Spin all other text
    const allText = document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,span");
    allText.forEach(el => {
      if (!el.closest("#home")) {
        gsap.to(el, { rotation:360, duration:2+Math.random()*2, repeat:-1, yoyo:true });
        el.style.background = "linear-gradient(45deg, hotpink, limegreen)";
        el.style.webkitBackgroundClip = "text";
        el.style.webkitTextFillColor = "transparent";
        el.style.display = "inline-block";
      }
    });
  }

  // Start memes bouncing
  startMemeBouncing();
}


// ===== Meme Bouncing =====
function startMemeBouncing() {
  if (window.__memesOn) return;
  window.__memesOn = true;

  const memeContainer = document.createElement("div");
  Object.assign(memeContainer.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 9999
  });
  document.body.appendChild(memeContainer);

  const memeSources = [
    "memes/meme1.png",
    "memes/meme2.gif",
    "memes/meme3.png",
    "memes/meme4.png"

  ];

  const memes = [];

  function spawnMeme() {
    const meme = document.createElement("img");
    meme.src = memeSources[Math.floor(Math.random() * memeSources.length)];
    meme.style.position = "absolute";
    meme.style.opacity = "1";
    meme.style.transition = "opacity 2s linear";
    const size = 60 + Math.random() * 100;
    meme.style.width = `${size}px`;
    meme.style.height = `${size}px`;
    memeContainer.appendChild(meme);

    let x = Math.random() * (window.innerWidth - size);
    let y = Math.random() * (window.innerHeight - size);
    let dx = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2);
    let dy = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2);

    const memeObj = { el: meme, x, y, dx, dy, size, opacity: 1 };
    memes.push(memeObj);

    // Fade after 10s
    setTimeout(() => { memeObj.opacity = 0; meme.style.opacity = "0"; }, 10000);
    setTimeout(() => {
      memes.splice(memes.indexOf(memeObj), 1);
      meme.remove();
    }, 12000);
  }

  function animate() {
    memes.forEach((m, i) => {
      m.x += m.dx;
      m.y += m.dy;

      // Bounce off screen edges
      if (m.x <= 0 || m.x + m.size >= window.innerWidth) m.dx *= -1;
      if (m.y <= 0 || m.y + m.size >= window.innerHeight) m.dy *= -1;

      // Bounce off other memes
      for (let j = i + 1; j < memes.length; j++) {
        const n = memes[j];
        const dx = n.x - m.x;
        const dy = n.y - m.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const minDist = (m.size/2 + n.size/2);
        if (dist < minDist) [m.dx, n.dx] = [n.dx, m.dx], [m.dy, n.dy] = [n.dy, m.dy];
      }

      m.el.style.left = m.x + "px";
      m.el.style.top = m.y + "px";
    });

    requestAnimationFrame(animate);
  }

  window.__memesInterval = setInterval(spawnMeme, 2000);
  animate();
}