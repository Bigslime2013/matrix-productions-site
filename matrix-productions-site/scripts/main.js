// =========================
// MATRIX RAIN BACKGROUND
// =========================
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const letters = 'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Start the rain
const rainInterval = setInterval(drawMatrix, 33);

// Stop after 20 seconds and fade out
setTimeout(() => {
  clearInterval(rainInterval);

  // Fade out effect
  let opacity = 1;
  const fadeInterval = setInterval(() => {
    opacity -= 0.05;
    canvas.style.opacity = opacity;
    if (opacity <= 0) {
      clearInterval(fadeInterval);
      canvas.remove(); // remove from DOM
    }
  }, 50);
}, 20000);

// =========================
// GLITCH-ON-SCROLL HEADERS
// =========================
const glitchHeaders = document.querySelectorAll('h2.glitch-section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('glitch-active');
    }
  });
}, { threshold: 0.5 });
glitchHeaders.forEach(h => observer.observe(h));

// =========================
// AUDIO WAVEFORM ANIMATIONS
// =========================
document.querySelectorAll('.waveform').forEach(canvas => {
  const audioSrc = canvas.dataset.audio;
  const ctx = canvas.getContext('2d');

  const audio = new Audio(audioSrc);
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  function drawWaveform() {
    requestAnimationFrame(drawWaveform);
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = '#0f0';
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
  drawWaveform();

  // Link waveform to actual <audio> element
  const player = canvas.nextElementSibling;
  player.addEventListener('play', () => {
    audioCtx.resume();
    audio.src = player.querySelector('source').src;
    audio.play();
  });
  player.addEventListener('pause', () => audio.pause());
});