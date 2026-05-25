const yesButtons = [
  document.getElementById("yesBtn"),
  document.getElementById("yesBtn2"),
].filter(Boolean);
const noButton = document.getElementById("noBtn2");
const yesButton = document.getElementById("yesBtn2");
const arena = document.getElementById("arena");
const fireworksCanvas = document.getElementById("fireworks");
const gameCard = document.getElementById("gameCard");
const ctx = fireworksCanvas.getContext("2d");

let fireworksActive = false;
let particles = [];

const resizeCanvas = () => {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
};

const randomBetween = (min, max) => min + Math.random() * (max - min);

const spawnBurst = (x, y) => {
  const colors = ["#ff5f9e", "#ffd36b", "#6fe7ff", "#ffffff"];
  const count = 48;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = randomBetween(1.5, 4.5);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: randomBetween(40, 80),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: randomBetween(1.5, 3.5),
    });
  }
};

const updateParticles = () => {
  ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  particles = particles.filter((p) => p.life > 0);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02;
    p.life -= 1;

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(p.life / 80, 0.1);
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
};

const animate = () => {
  if (fireworksActive) {
    if (Math.random() < 0.07) {
      spawnBurst(
        randomBetween(120, fireworksCanvas.width - 120),
        randomBetween(80, fireworksCanvas.height * 0.6)
      );
    }
    updateParticles();
    requestAnimationFrame(animate);
  }
};

const activateFireworks = () => {
  fireworksActive = true;
  fireworksCanvas.classList.add("active");
  gameCard.innerHTML =
    "<h2>Yes received!</h2><p>Celebrating our little cosmic hello.</p>";
  resizeCanvas();
  animate();
};

const overlaps = (rectA, rectB) =>
  !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );

const moveNoButton = (button, avoid) => {
  const arenaRect = arena.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const maxX = arenaRect.width - buttonRect.width - 16;
  const maxY = arenaRect.height - buttonRect.height - 16;
  const padding = 8;
  const maxAttempts = 12;

  button.style.position = "absolute";

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const nextX = randomBetween(padding, Math.max(padding, maxX));
    const nextY = randomBetween(padding, Math.max(padding, maxY));
    const candidate = {
      left: arenaRect.left + nextX,
      right: arenaRect.left + nextX + buttonRect.width,
      top: arenaRect.top + nextY,
      bottom: arenaRect.top + nextY + buttonRect.height,
    };

    const avoidRect = avoid?.getBoundingClientRect();
    if (!avoidRect || !overlaps(candidate, avoidRect)) {
      button.style.left = `${nextX}px`;
      button.style.top = `${nextY}px`;
      return;
    }
  }
};

if (noButton) {
  noButton.addEventListener("mouseenter", () =>
    moveNoButton(noButton, yesButton)
  );
  noButton.addEventListener("click", () => moveNoButton(noButton, yesButton));
}

yesButtons.forEach((button) => {
  button.addEventListener("click", activateFireworks);
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
