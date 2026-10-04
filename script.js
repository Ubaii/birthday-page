/* ==========================================================
   CONFIG & DATA
   ========================================================== */
const TYPE_SPEED = 60; // ms per huruf (makin besar makin pelan)
const LOADING_TICK = 300; // ms per langkah loading
const CAPTURE_GAP = 3000; // jeda antar foto di gallery

const MESSAGE = `hi,

happy birthday cipcip🤍

cant believe you're 18 already, time really goes so fast. i hope this new age brings you a lot of happiness, new memories, and so many good things into your life. may everything you’ve been wishing for slowly come true.

thank you for being such an important part of my life. you really make my days feel brighter, warmer, and more meaningful just by being you.

no matter what happens, i always believe in you and i’m always proud of you.

stay healthy, stay happy, and never stop being the amazing person you are.

i love you so much`;

const PHOTOS = [
  { text: '', image: './images/1.jpeg' },
  { text: '', image: './images/2.jpeg' },
  { text: '', image: './images/3.jpeg' },
  { text: '', image: './images/4.jpeg' },
  { text: '', image: './images/5.jpeg' },
  { text: '', image: './images/6.jpeg' },
  { text: '', image: './images/7.jpeg' },
  { text: '', image: './images/8.jpeg' },
  { text: '', image: './images/9.jpeg' },
  { text: '', image: './images/10.jpeg' },
  { text: '', image: './images/11.jpeg' },
  { text: '', image: './images/12.jpeg' },
  { text: '', image: './images/13.jpeg' },
  { text: '', image: './images/14.jpeg' },
  { text: '', image: './images/15.jpeg' },


  // Foto tambahan (ganti caption sesuai fotonya)

];

const PLAYLISTS = [
  {
    embedUrl:
      'https://open.spotify.com/embed/playlist/3S8VYl6bImaJ1XojSP6TPu?si=8d4bca28403c49f5',
    name: 'Birthday Special Mix',
    description: 'Special songs for your special day',
  },
  {
    embedUrl:
      'https://open.spotify.com/embed/playlist/1r5mTjfldnpPdDQKgkJmJ9?si=a475a8d63cc64c57',
    name: 'Love Songs Collection',
    description: 'The best love songs for us',
  },
  {
    embedUrl:
      'https://open.spotify.com/embed/playlist/18Oco9XZ3kjUT1BYIubbnR?utm_source=generator',
    name: 'Sweet Memories',
    description: 'Songs that bring back sweet memories',
  },
];

// Ganti dengan alasan-alasanmu sendiri. Makin spesifik, makin terasa personal.
const LOVE_REASONS = [
  'Because of your amazing smile.',
  'The way you laugh at my silly jokes.',
  'How you always know how to cheer me up.',
  'You are incredibly smart and witty.',
  'Your kindness to everyone around you.',
  'That time we got caught in the rain and just laughed.',
  "How your eyes sparkle when you're excited.",
  'You always support my dreams, no matter how big.',
  'For being my best friend in the entire world.',
  'How we can just be silly and weird together.',
  'You make me a better person, every single day.',
  'The way you look at me.',
  'For always being patient with me.',
  'Your passion for your hobbies.',
  "Because you're you. And that's more than enough. ❤️",
];

/* ==========================================================
   STATE & HELPERS
   ========================================================== */
let currentScreen = 'loading';
let typewriterInterval = null;
let isTyping = false;
let countdownInterval = null;
let captureInterval = null;
let lastFocusedHeart = null;

const $ = (selector, root = document) => root.querySelector(selector);

const SCREEN_INIT = {
  message: initializeMessage,
  gallery: initializeGallery,
  music: initializeMusicPlayer,
  reasons: initializeReasons,
};

const NEXT_SCREEN = {
  message: 'gallery',
  gallery: 'music',
  music: 'reasons',
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  showScreen('loading');
  simulateLoading();
  addEventListeners();
}

/* ==========================================================
   LOADING
   ========================================================== */
function simulateLoading() {
  const fill = $('#progress-fill');
  const label = $('.progress-text');
  const bar = $('.progress-bar');
  const status = $('.loading-text');
  const screen = $('#loading-screen');

  const messages = [
    'Preparing...',
    'Loading Memories...',
    'Preparing Surprise...',
    'Almost Ready...',
    'Welcome!',
  ];

  let progress = 0;
  let messageIndex = 0;

  const timer = setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 7 + 3);
    const value = Math.floor(progress);

    fill.style.width = progress + '%';
    label.textContent = value + '%';
    bar.setAttribute('aria-valuenow', value);

    const next = Math.floor((progress / 100) * (messages.length - 1));
    if (next !== messageIndex) {
      messageIndex = next;
      status.textContent = messages[next];
    }

    if (progress >= 100) {
      clearInterval(timer);
      screen.classList.add('loading-complete');
      setTimeout(transitionToMainScreen, 1200);
    }
  }, LOADING_TICK);
}

function transitionToMainScreen() {
  const loadingScreen = $('#loading-screen');
  const mainScreen = $('#main-screen');

  loadingScreen.classList.add('fade-out');

  // Durasi disamakan dengan transisi di CSS (fade-out 0.7s, masuk 1.3s)
  setTimeout(() => {
    loadingScreen.classList.remove('active', 'fade-out', 'loading-complete');
    mainScreen.classList.add('active', 'screen-entering');
    currentScreen = 'main';

    setTimeout(() => mainScreen.classList.remove('screen-entering'), 1400);
  }, 800);
}

/* ==========================================================
   NAVIGASI
   ========================================================== */
function stopTypewriter() {
  clearInterval(typewriterInterval);
  typewriterInterval = null;
  isTyping = false;
}

function stopPhotoTimers() {
  clearInterval(countdownInterval);
  clearInterval(captureInterval);
  countdownInterval = null;
  captureInterval = null;
}

function showScreen(name) {
  const target = document.getElementById(`${name}-screen`);
  if (!target) return;

  // Hentikan proses yang masih jalan dari halaman sebelumnya
  stopTypewriter();
  stopPhotoTimers();

  // Keluar dari halaman musik = musik berhenti
  if (currentScreen === 'music' && name !== 'music') {
    const music = $('.music-content');
    if (music) music.innerHTML = '';
  }

  document
    .querySelectorAll('.screen')
    .forEach((screen) => screen.classList.remove('active'));

  target.classList.add('active');
  currentScreen = name;

  const init = SCREEN_INIT[name];
  if (init) setTimeout(init, 100);
}

function handleContinueNavigation() {
  showScreen(NEXT_SCREEN[currentScreen] || 'main');
}

/* ==========================================================
   MESSAGE
   ========================================================== */
function initializeMessage() {
  const pageScreen = $('#message-screen .page-screen');
  if (!pageScreen) return;

  pageScreen.innerHTML = `
    <div class="page-header">A Letter For You Cip</div>
    <div class="message-content"></div>
    <button type="button" class="skip-btn">SKIP</button>
  `;

  $('.skip-btn', pageScreen).addEventListener('click', skipTypewriter);

  setTimeout(startTypewriter, 300);
}

function startTypewriter() {
  const box = $('.message-content');
  if (!box) return;

  stopTypewriter();

  // Array.from supaya emoji (🤍) nggak terpotong jadi karakter rusak
  const chars = Array.from(MESSAGE);
  const text = document.createTextNode('');
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.textContent = '|';

  box.replaceChildren(text, cursor);

  let index = 0;
  isTyping = true;

  typewriterInterval = setInterval(() => {
    if (index < chars.length) {
      text.data += chars[index++];
      box.scrollTop = box.scrollHeight;
    } else {
      stopTypewriter();
      cursor.remove();
    }
  }, TYPE_SPEED);
}

function skipTypewriter() {
  if (!isTyping) return;
  stopTypewriter();

  const box = $('.message-content');
  if (box) {
    box.textContent = MESSAGE;
    box.scrollTop = box.scrollHeight;
  }
}

/* ==========================================================
   GALLERY
   ========================================================== */
function initializeGallery() {
  const content = $('.gallery-content');
  if (!content) return;

  content.innerHTML = `
    <div class="photobox-header">
      <div class="photobox-dot"></div>
      <span class="photobox-title">MEMORY ALBUM</span>
      <div class="photobox-dot"></div>
    </div>
    <div class="photobox-progress">READY TO SEE PHOTOS</div>
    <div class="photo-display">
      <div class="photo-placeholder">Press 'Start' to see the memories</div>
    </div>
    <div class="photobox-controls">
      <button type="button" class="photo-btn">START</button>
    </div>
  `;

  $('.photo-btn', content).addEventListener('click', startPhotoShow);
}

function startPhotoShow() {
  const button = $('.photo-btn');
  const display = $('.photo-display');
  const progress = $('.photobox-progress');
  if (!button || !display || !progress) return;

  stopPhotoTimers();

  button.textContent = 'PROCESSING...';
  button.disabled = true;
  progress.textContent = 'PREPARING ALBUM...';

  const frames = PHOTOS.map(
    (_, i) => `
      <div class="photo-frame" id="frame-${i + 1}">
        <div class="photo-content">READY</div>
      </div>`
  ).join('');

  display.innerHTML = `
    <div class="photo-strip">
      <div class="photo-strip-header">PHOTO SESSION</div>
      <div class="photo-frames-container">${frames}</div>
      <div class="photo-strip-footer">BIRTHDAY MEMORIES</div>
    </div>
    <div class="scroll-indicator">Scroll Down</div>
  `;

  const refs = {
    button,
    progress,
    container: $('.photo-frames-container', display),
    indicator: $('.scroll-indicator', display),
  };

  let countdown = 3;
  progress.textContent = `GET READY... ${countdown}`;

  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      progress.textContent = `GET READY... ${countdown}`;
    } else {
      clearInterval(countdownInterval);
      countdownInterval = null;
      progress.textContent = 'START!';
      startPhotoCapture(refs);
    }
  }, 1000);
}

function startPhotoCapture(refs) {
  let index = 0;

  captureInterval = setInterval(() => {
    if (index < PHOTOS.length) {
      capturePhoto(index, refs);
      index++;
      return;
    }

    clearInterval(captureInterval);
    captureInterval = null;
    finishPhotoShow(refs);
  }, CAPTURE_GAP);
}

function capturePhoto(index, refs) {
  const frame = document.getElementById(`frame-${index + 1}`);
  if (!frame) return;

  refs.progress.textContent = 'SMILE!';

  // Scroll ke frame yang sedang diisi
  setTimeout(() => {
    const top =
      frame.offsetTop -
      refs.container.offsetTop -
      (refs.container.clientHeight - frame.clientHeight) / 2;
    refs.container.scrollTo({ top, behavior: 'smooth' });
  }, 200);

  // Isi frame dengan foto
  setTimeout(() => {
    fillFrame(frame, PHOTOS[index]);
    refs.progress.textContent = `CAPTURED ${index + 1}/${PHOTOS.length}`;
  }, 500);
}

function fillFrame(frame, photo) {
  frame.classList.add('filled');
  frame.textContent = '';

  const img = document.createElement('img');
  img.className = 'photo-image';
  img.src = photo.image;
  img.alt = photo.text;
  // Kalau foto nggak ketemu, tampilkan frame pink polos + caption
  img.addEventListener('error', () => {
    img.remove();
    frame.classList.add('missing');
  });

  const overlay = document.createElement('div');
  overlay.className = 'photo-overlay';

  const caption = document.createElement('div');
  caption.className = 'photo-content';
  caption.textContent = photo.text;

  overlay.appendChild(caption);
  frame.append(img, overlay);
}

function finishPhotoShow(refs) {
  if (refs.indicator) refs.indicator.style.display = 'none';

  setTimeout(() => {
    refs.container.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1000);

  setTimeout(() => {
    refs.progress.textContent = 'ALBUM COMPLETE';
    refs.button.textContent = 'RESTART';
    refs.button.disabled = false;
  }, 2000);
}

/* ==========================================================
   MUSIC
   ========================================================== */
function initializeMusicPlayer() {
  const content = $('.music-content');
  if (!content) return;

  const buttons = PLAYLISTS.map(
    (_, i) =>
      `<button type="button" class="playlist-btn${
        i === 0 ? ' active' : ''
      }" data-playlist="${i}">Playlist ${i + 1}</button>`
  ).join('');

  content.innerHTML = `
    <div class="spotify-container">
      <div class="spotify-header">
        <div class="spotify-logo">♪ Our Playlists</div>
      </div>
      <div class="spotify-embed-container">
        <iframe id="spotify-iframe"
                title="Spotify playlist"
                src=""
                width="100%"
                height="200"
                style="border:0"
                allowfullscreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"></iframe>
      </div>
      <div class="playlist-controls">${buttons}</div>
      <div class="music-info">
        <div class="current-playlist"></div>
        <div class="playlist-description"></div>
      </div>
    </div>
  `;

  const playlistButtons = content.querySelectorAll('.playlist-btn');
  playlistButtons.forEach((button) => {
    button.addEventListener('click', () => {
      playlistButtons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      loadPlaylist(Number(button.dataset.playlist));
    });
  });

  loadPlaylist(0);
}

function loadPlaylist(index) {
  const playlist = PLAYLISTS[index];
  const iframe = $('#spotify-iframe');
  if (!playlist || !iframe) return;

  const title = $('.current-playlist');
  const description = $('.playlist-description');

  iframe.style.opacity = '0.5';
  iframe.onload = () => {
    iframe.style.opacity = '1';
  };
  iframe.src = playlist.embedUrl;

  if (title) title.textContent = `Now Playing: ${playlist.name}`;
  if (description) description.textContent = playlist.description;
}

/* ==========================================================
   REASONS
   ========================================================== */
function initializeReasons() {
  const content = $('#reasons-screen .reasons-content');
  if (!content) return;

  content.innerHTML = '';

  LOVE_REASONS.forEach((reason, index) => {
    const heart = document.createElement('div');
    heart.className = 'reason-heart';
    heart.textContent = '💖';
    heart.setAttribute('role', 'button');
    heart.setAttribute('tabindex', '0');
    heart.setAttribute('aria-label', `Reason ${index + 1}`);

    const open = () => {
      lastFocusedHeart = heart;
      showReasonModal(reason, index + 1);
    };

    heart.addEventListener('click', open);
    heart.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });

    content.appendChild(heart);
  });
}

function showReasonModal(reason, number) {
  const modal = $('#reason-modal');
  const title = $('#reason-title');
  const text = $('#reason-text');
  if (!modal || !title || !text) return;

  title.textContent = `Reason #${number}`;

  const paragraph = document.createElement('p');
  paragraph.textContent = reason;
  text.replaceChildren(paragraph);

  modal.classList.add('active');
  const closeButton = $('#close-reason-btn');
  if (closeButton) closeButton.focus();
}

function closeReasonModal() {
  const modal = $('#reason-modal');
  if (!modal) return;

  modal.classList.remove('active');
  if (lastFocusedHeart) lastFocusedHeart.focus();
}

/* ==========================================================
   EVENT LISTENERS
   ========================================================== */
function addEventListeners() {
  // Menu + tombol BACK (sama-sama pakai data-page)
  document.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => {
      showScreen(button.getAttribute('data-page'));
    });
  });

  // Tombol NEXT
  document.querySelectorAll('.continue-btn').forEach((button) => {
    button.addEventListener('click', handleContinueNavigation);
  });

  // Tombol START di console
  const startButton = $('.start-btn');
  if (startButton) {
    startButton.addEventListener('click', () => {
      if (currentScreen === 'main') showScreen('message');
    });
  }

  // Popup alasan: tombol OK, klik di luar kotak, atau tekan Esc
  const closeButton = $('#close-reason-btn');
  if (closeButton) closeButton.addEventListener('click', closeReasonModal);

  const modal = $('#reason-modal');
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeReasonModal();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeReasonModal();
    }
  });
}