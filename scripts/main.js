// =========================
// MATRIX RAIN BACKGROUND
// =========================
const canvas = document.getElementById('matrixRain');
if (canvas) {
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
  setInterval(drawMatrix, 33);
}

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

// =========================
// PHANTOM MODAL & CHATBOT LOGIC
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // Modal controls
  const openBtn = document.getElementById('openPhantomBtn');
  const closeBtn = document.getElementById('closePhantomBtn');
  const modal = document.getElementById('phantomModal');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Matrix rain effect
  const matrixCanvas = document.getElementById('matrixCanvas');
  if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };
    setInterval(draw, 30);
  }

  const backgroundMusic = new Audio('assets/portal-hum.mp3');
  backgroundMusic.loop = true;
  let musicStarted = false;

  // Boot sequence
  const bootSequence = document.getElementById('boot');
  const hudContainer = document.getElementById('chatUI');
  if (bootSequence && hudContainer) {
    setTimeout(() => {
        bootSequence.style.display = 'none';
        hudContainer.style.display = 'block';
    }, 2000);
  }

  // Chat logic
  fetch("lore.json")
      .then(res => res.json())
    .then(lore => {
      const chatLog = document.getElementById("chatLog");
      const input = document.getElementById("userInput");

      if (chatLog && input) {
        function matchLore(userText) {
          const lower = userText.toLowerCase();
          for (const key in lore) {
            if (lower.includes(key.toLowerCase())) {
              return lore[key];
            }
          }
          return "System processing... glitch detected. Try again.";
        }

        input.addEventListener("keypress", function(e) {
          if (e.key === "Enter") {
            e.preventDefault();
            const userText = input.value.trim();
            if (!userText) return;

            const response = matchLore(userText);
            chatLog.innerHTML += `<div class='user'>🟢 ${userText}</div>`;
            chatLog.innerHTML += `<div class='phantom'>⚡ ${response}</div>`;
            chatLog.scrollTop = chatLog.scrollHeight;
            input.value = "";

            speak(response);

            const triggers = ["unlock phantom", "open the gate", "show me phantom"];
            if (triggers.some(t => userText.toLowerCase().includes(t))) {
              triggerBackdoor();
            }

            if (userText.toLowerCase().includes("access terminal")) {
              window.location.href = "assets/terminal.html";
            }
          }
        });
      }
    });
});

function triggerBackdoor() {
  document.getElementById("phantomModal").style.display = "none";

  const portal = document.createElement("div");
  portal.className = "phantom-door";
  portal.innerHTML = `
    <div class="spirit-avatar">
      <video autoplay muted class="spirit-video">
        <source src="assets/phantom-spirit.MOV" type="video/quicktime">
      </video>
    </div>
  `;
  document.body.appendChild(portal);

  const audio = new Audio('assets/ghost-woosh.mp3');
  audio.play();

  const video = portal.querySelector('video');
  if (video) {
    video.play().catch(error => {
      console.error("Video play failed:", error);
    });

    video.addEventListener('ended', () => {
      portal.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = "https://phantom.matrixproductions.org";
      }, 1000); // Wait for fade-out to complete
    });
  }
}

const customVoiceMap = {
  "Phantom Mode activated. Booth-forged. Glitch-reactive.": "phantom_mode",
  "Spirit avatar deployed. Portal breach confirmed.": "ghost_protocol",
  "Track 03: Sonic rebellion. No sleep. Just distortion.": "track_03",
  "Terminal override complete. Welcome to the Phantom Archive.": "terminal_exit",
  "Truth is encrypted. You must glitch deeper to decode it.": "truth_encrypted"
};

function speak(text) {
  const customAudio = customVoiceMap[text];
  if (customAudio) {
    const audio = new Audio(`assets/voice/${customAudio}.mp3`);
    audio.play();
    audio.onended = () => {
      if (!musicStarted) {
        backgroundMusic.play();
        musicStarted = true;
      }
    };
    return;
  }

  const synth = window.speechSynthesis;
  
  function doSpeak() {
    const voices = synth.getVoices();
    if (voices.length === 0) {
      return;
    }
    
    const utter = new SpeechSynthesisUtterance(text);
    let voice = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('male'));
    if (!voice) {
      voice = voices.find(v => v.lang === 'en-US');
    }
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('en')); // Fallback to any English voice
    }
    if (!voice) {
      voice = voices[0]; // Fallback to the first available voice
    }
    
    utter.voice = voice;
    utter.rate = 0.9;
    utter.pitch = 0.5;

    utter.onend = () => {
      if (!musicStarted) {
        backgroundMusic.play();
        musicStarted = true;
      }
    };

    synth.speak(utter);
  }

  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = doSpeak;
  } else {
    doSpeak();
  }
}
