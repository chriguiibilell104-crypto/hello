const yesButtons = [
  document.getElementById("yesBtn"),
  document.getElementById("yesBtn2"),
];
const noButtons = [
  document.getElementById("noBtn"),
  document.getElementById("noBtn2"),
];
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

const moveNoButton = (button) => {
  const arenaRect = arena.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const maxX = arenaRect.width - buttonRect.width - 16;
  const maxY = arenaRect.height - buttonRect.height - 16;
  const nextX = randomBetween(8, Math.max(8, maxX));
  const nextY = randomBetween(8, Math.max(8, maxY));

  button.style.position = "absolute";
  button.style.left = `${nextX}px`;
  button.style.top = `${nextY}px`;
};

noButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => moveNoButton(button));
  button.addEventListener("click", () => moveNoButton(button));
});

yesButtons.forEach((button) => {
  button.addEventListener("click", activateFireworks);
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
