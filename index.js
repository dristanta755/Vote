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

  document.body.classList.add("meme-mode");

  const heroTitle = document.querySelector("#home h1");
  const heroText  = document.querySelector("#home p");

  if (heroTitle) heroTitle.innerText = "🔥 VOTE DRISTANTA: MEME LORD SUPREME 🔥";
  if (heroText) heroText.innerText = "Freshman year is officially meme-fied! Chaos incoming!";

  // Posters styling update
  document.querySelectorAll(".poster-img").forEach(img => {
    img.style.border = "5px solid hotpink";
    img.style.borderRadius = "20px";
    img.style.boxShadow = "0 0 20px limegreen, 0 0 40px hotpink";
    img.style.background = "linear-gradient(135deg, hotpink, limegreen)";
    img.style.padding = "5px";
  });

  // Start memes bouncing (separate layer)
  startMemeBouncing();
}

function startMemeBouncing() {
  if (window.__memesOn) return;
  window.__memesOn = true;

  const memeContainer = document.createElement("div");
  memeContainer.id = "meme-container";
  Object.assign(memeContainer.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 99999 // always on top
  });
  document.body.appendChild(memeContainer);

  const memeSources = [
    "memes/meme1.png",
    "memes/meme2.gif",
    "memes/meme3.png",
    "memes/meme4.png",
    "memes/meme5.png"
  ];

  const memes = [];

  function spawnMeme() {
    const meme = document.createElement("img");
    meme.src = memeSources[Math.floor(Math.random() * memeSources.length)];
    meme.style.position = "absolute";
    meme.style.opacity = "1";
    meme.style.transition = "opacity 2s linear";
    meme.style.borderRadius = "20px";
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

      // Bounce off edges
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

  // Spawn faster + more memes
  window.__memesInterval = setInterval(spawnMeme, 800);
  animate();
}

const allPosters = document.querySelectorAll(".poster-img");

allPosters.forEach(img => {
  // Make sure posters are positioned absolutely
  img.style.position = "absolute";
  img.style.zIndex = 9999;

  // Random starting position
  let x = Math.random() * (window.innerWidth - img.width);
  let y = Math.random() * (window.innerHeight - img.height);

  // Random velocity
  let dx = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2);
  let dy = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2);

  function animatePoster() {
    // Update position
    x += dx;
    y += dy;

    // Bounce off edges
    if (x <= 0) {
      x = 0;
      dx *= -1;
    }
    if (x + img.width >= window.innerWidth) {
      x = window.innerWidth - img.width;
      dx *= -1;
    }
    if (y <= 0) {
      y = 0;
      dy *= -1;
    }
    if (y + img.height >= window.innerHeight) {
      y = window.innerHeight - img.height;
      dy *= -1;
    }

    // Apply position
    img.style.left = x + "px";
    img.style.top = y + "px";

    requestAnimationFrame(animatePoster);
  }

  animatePoster();
});
