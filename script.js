// Game state management
let currentScreen = 'loading';
// === VARIABEL TETRIS DIHAPUS ===
let typewriterInterval = null;
let isTyping = false;
let currentPhotoIndex = 0;
let currentMusicIndex = 0;
let isPlaying = false;
let playbackInterval = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  showScreen('loading');
  simulateLoading();
  addEventListeners();
  // === initializeTetris() DIHAPUS ===
}

function simulateLoading() {
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.querySelector('.progress-text');
  const loadingText = document.querySelector('.loading-text');
  const loadingScreen = document.getElementById('loading-screen');

  let progress = 0;
  // --- TRANSLATED: Loading messages ---
  const loadingMessages = [
    'Preparing...',
    'Loading Memories...',
    'Preparing Surprise...',
    'Almost Ready...',
    'Welcome!',
  ];

  let messageIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5; // Random increment between 5-20

    if (progress > 100) progress = 100;

    // Update progress bar with smooth animation
    progressFill.style.width = progress + '%';
    progressText.textContent = Math.floor(progress) + '%';

    // Update loading message based on progress
    const newMessageIndex = Math.floor(
      (progress / 100) * (loadingMessages.length - 1)
    );
    if (
      newMessageIndex !== messageIndex &&
      newMessageIndex < loadingMessages.length
    ) {
      messageIndex = newMessageIndex;

      // Fade out current message
      loadingText.style.opacity = '0';

      setTimeout(() => {
        loadingText.innerHTML = loadingMessages[messageIndex];
        loadingText.style.opacity = '1';
      }, 200);
    }

    if (progress >= 100) {
      clearInterval(interval);

      // Add completion animation
      loadingScreen.classList.add('loading-complete');

      // Wait for completion animation, then transition
      setTimeout(() => {
        transitionToMainScreen();
      }, 1000);
    }
  }, 200);
}

function transitionToMainScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const mainScreen = document.getElementById('main-screen');

  // Start fade out animation for loading screen
  loadingScreen.classList.add('fade-out');

  // After fade out completes, show main screen
  setTimeout(() => {
    loadingScreen.classList.remove('active', 'fade-out', 'loading-complete');

    // Show main screen with entrance animation
    mainScreen.classList.add('active', 'screen-entering');
    currentScreen = 'main';

    // Add staggered animations for elements
    setTimeout(() => {
      initializeMainScreen();
    }, 100);

    // Remove entrance class after animation
    setTimeout(() => {
      mainScreen.classList.remove('screen-entering');
    }, 1200);
  }, 600);
}

function initializeMainScreen() {
  // Add interactive elements and event listeners
  const menuButtons = document.querySelectorAll('.menu-btn');
  const startBtn = document.querySelector('.start-btn');

  // Add button click animations
  menuButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  // Start button functionality
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
        // Could trigger some action here
      }, 150);
    });
  }

  // Add hover effects for menu buttons
  menuButtons.forEach((btn) => {
    btn.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
}

function showScreen(screenName) {
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach((screen) => {
    screen.classList.remove('active');
  });

  // Show target screen
  const targetScreen = document.getElementById(screenName + '-screen');
  if (targetScreen) {
    targetScreen.classList.add('active');
    currentScreen = screenName;

    // Initialize screen-specific content
    switch (screenName) {
      case 'message':
        setTimeout(() => {
          initializeMessage();
        }, 100);
        break;
      case 'gallery':
        setTimeout(() => {
          initializeGallery();
        }, 100);
        break;
      case 'music':
        setTimeout(() => {
          initializeMusicPlayer();
        }, 100);
        break;
      // === PERUBAHAN DI SINI ===
      case 'reasons': // Diubah dari 'tetris'
        setTimeout(() => {
          initializeReasons(); // Memanggil fungsi baru
        }, 100);
        break;
    }
  }
}

// Message Page Functions
function initializeMessage() {
  // Clear any existing typewriter interval
  if (typewriterInterval) {
    clearInterval(typewriterInterval);
    typewriterInterval = null;
  }

  const messageScreen = document.getElementById('message-screen');
  if (!messageScreen) return;

  // Create or update the message screen content
  const pageScreen = messageScreen.querySelector('.page-screen');
  if (pageScreen) {
    // --- TRANSLATED: Header and button ---
    pageScreen.innerHTML = `
          <div class="page-header">A Letter For You</div>
          <div class="message-content">
              </div>
          <button class="skip-btn">SKIP</button>
      `;

    // Add skip button event listener
    const skipBtn = pageScreen.querySelector('.skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', skipTypewriter);
    }
  }

  // Start typewriter effect
  setTimeout(() => {
    startTypewriter();
  }, 300);
}

function startTypewriter() {
  const messageContent = document.querySelector('.message-content');
  if (!messageContent) return;

  // --- TRANSLATED: The personal message ---
  const fullMessage = `hi,

happy 19th birthday 🤍

cant believe you're 19 already, time really goes so fast. i hope this new age brings you a lot of happiness, new memories, and so many good things into your life. may everything you’ve been wishing for slowly come true.

thank you for being such an important part of my life. you really make my days feel brighter, warmer, and more meaningful just by being you.

no matter what happens, i always believe in you and i’m always proud of you.

stay healthy, stay happy, and never stop being the amazing person you are.

i love you so much 💕`;


  // Clear content and start fresh
  messageContent.innerHTML = '';
  let charIndex = 0;
  isTyping = true;

  // Clear any existing interval
  if (typewriterInterval) {
    clearInterval(typewriterInterval);
  }

  typewriterInterval = setInterval(() => {
    if (charIndex < fullMessage.length) {
      const char = fullMessage[charIndex];
      if (char === '\n') {
        messageContent.innerHTML += '<br>';
      } else {
        messageContent.innerHTML += char;
      }
      charIndex++;
      // Auto scroll to bottom
      messageContent.scrollTop = messageContent.scrollHeight;
    } else {
      clearInterval(typewriterInterval);
      isTyping = false;
    }
  }, 50);
}

function skipTypewriter() {
  if (isTyping && typewriterInterval) {
    clearInterval(typewriterInterval);
    const messageContent = document.querySelector('.message-content');
    if (messageContent) {

      // === FINAL MESSAGE (SAMA DENGAN TYPEWRITER) ===
      const fullMessage = `hi,<br><br>
      happy 19th birthday 🤍<br><br>
      cant believe you're 19 already, time really goes so fast. i hope this new age brings you a lot of happiness, new memories, and so many good things into your life. may everything you’ve been wishing for slowly come true.<br><br>
      thank you for being such an important part of my life. you really make my days feel brighter, warmer, and more meaningful just by being you.<br><br>
      no matter what happens, i always believe in you and i’m always proud of you.<br><br>
      stay healthy, stay happy, and never stop being the amazing person you are.<br><br>
      i love you so much 💕`;

      messageContent.innerHTML = fullMessage;
      isTyping = false;
      messageContent.scrollTop = messageContent.scrollHeight;
    }
  }
}


// Gallery Functions
function initializeGallery() {
  const galleryContent = document.querySelector('.gallery-content');
  if (!galleryContent) return;

  // Clear existing content
  galleryContent.innerHTML = '';

  // --- TRANSLATED: Gallery UI text ---
  const galleryHTML = `
      <div class="photobox-header">
          <div class="photobox-dot red"></div>
          <span class="photobox-title">MEMORY ALBUM</span>
          <div class="photobox-dot green"></div>
      </div>
      <div class="photobox-progress">READY TO SEE PHOTOS</div>
      <div class="photo-display">
          <div class="photo-placeholder">Press 'Start' to see the memories</div>
      </div>
      <div class="photobox-controls">
          <button class="photo-btn">START</button>
      </div>
  `;

  galleryContent.innerHTML = galleryHTML;

  // Add event listener for photo button after DOM is updated
  setTimeout(() => {
    const photoBtn = document.querySelector('.photo-btn');
    if (photoBtn) {
      photoBtn.addEventListener('click', startPhotoShow);
      console.log('Photo button found and listener added'); // Debug log
    } else {
      console.log('Photo button not found'); // Debug log
    }
  }, 100);
}

function startPhotoShow() {
  const photoBtn = document.querySelector('.photo-btn');
  const photoDisplay = document.querySelector('.photo-display');
  const progressDiv = document.querySelector('.photobox-progress');

  if (!photoBtn || !photoDisplay || !progressDiv) return;

  // Photo captions are already in English, so this is fine
  const photos = [
    {
      text: 'Showing Nails',
      image: './images/photo1.jpg',
    },
    {
      text: 'Eating Bread',
      image: './images/photo2.jpg',
    },
    {
      text: 'Smile Silly Face',
      image: './images/photo3.jpg',
    },
    {
      text: 'Fresh Smells',
      image: './images/photo4.jpg',
    },
    {
      text: 'Pouting Lips',
      image: './images/photo5.jpg',
    },
    {
      text: 'Making Heart Pose',
      image: './images/photo6.jpg',
    },
    {
      text: 'Scary Face',
      image: './images/photo7.jpg',
    },
    {
      text: 'Sleepy Baby',
      image: './images/photo8.jpg',
    },
  ];

  console.log('Total photos:', photos.length);

  // --- TRANSLATED: Progress text ---
  photoBtn.textContent = 'PROCESSING...';
  photoBtn.disabled = true;
  progressDiv.textContent = 'PREPARING ALBUM...';

  // Create photo frames HTML
  let framesHTML = '';
  for (let i = 0; i < photos.length; i++) {
    framesHTML += `
          <div class="photo-frame" id="frame-${i + 1}">
              <div class="photo-content">READY</div>
          </div>
      `;
  }

  // --- TRANSLATED: Photostrip header ---
  const photoStripHTML = `
      <div class="photo-strip">
          <div class="photo-strip-header">PHOTO SESSION</div>
          <div class="photo-frames-container">
              ${framesHTML}
          </div>
          <div class="photo-strip-footer">💕 BIRTHDAY MEMORIES 💕</div>
      </div>
      <div class="scroll-indicator">⬇ Scroll Down ⬇</div>
  `;

  photoDisplay.innerHTML = photoStripHTML;
  currentPhotoIndex = 0;

  // Countdown before starting
  let countdown = 3;
  // --- TRANSLATED: Countdown text ---
  progressDiv.textContent = `GET READY... ${countdown}`;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      progressDiv.textContent = `GET READY... ${countdown}`;
    } else {
      clearInterval(countdownInterval);
      progressDiv.textContent = 'START! 📸';
      startPhotoCapture(photos);
    }
  }, 1000);
}

function startPhotoCapture(photos) {
  const progressDiv = document.querySelector('.photobox-progress');
  const photoBtn = document.querySelector('.photo-btn');
  const photoDisplay = document.querySelector('.photo-display');
  const framesContainer = document.querySelector('.photo-frames-container');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  console.log(
    'Starting photo capture. Initial currentPhotoIndex:',
    currentPhotoIndex
  );
  console.log('Total photos to capture:', photos.length);

  const captureInterval = setInterval(() => {
    console.log('=== CAPTURE LOOP ===');
    console.log('Current photo index:', currentPhotoIndex);
    console.log('Photos remaining:', photos.length - currentPhotoIndex);

    if (currentPhotoIndex < photos.length) {
      const frameId = `frame-${currentPhotoIndex + 1}`;
      const frame = document.getElementById(frameId);

      console.log('Processing frame:', frameId);
      console.log('Photo content:', photos[currentPhotoIndex]);

      if (frame) {
        // --- TRANSLATED: Flash text ---
        progressDiv.textContent = '✨ SMILE! ✨';

        // Auto scroll to current photo
        setTimeout(() => {
          if (framesContainer) {
            try {
              const frameTop = frame.offsetTop - framesContainer.offsetTop;
              const containerHeight = framesContainer.clientHeight;
              const frameHeight = frame.clientHeight;

              const scrollPosition =
                frameTop - containerHeight / 2 + frameHeight / 2;

              framesContainer.scrollTo({
                top: scrollPosition,
                behavior: 'smooth',
              });
            } catch (error) {
              console.log('Scroll error:', error);
              const frameTop = frame.offsetTop - framesContainer.offsetTop;
              framesContainer.scrollTop =
                frameTop - framesContainer.clientHeight / 2;
            }
          }
        }, 200);

        // Update frame content with image
        setTimeout(() => {
          frame.classList.add('filled');

          const photo = photos[currentPhotoIndex];
          frame.innerHTML = `
                      <img src="${photo.image}" alt="${photo.text}" class="photo-image" 
                           onerror="this.style.display='none'; this.nextElementSibling.style.background='linear-gradient(45deg, #ff6b9d, #c44569)';" />
                      <div class="photo-overlay">
                          <div class="photo-content">${photo.text}</div>
                      </div>
                  `;

          const displayCount = currentPhotoIndex + 1;
          // --- TRANSLATED: Progress text ---
          progressDiv.textContent = `CAPTURED ${displayCount}/${photos.length}`;

          console.log(
            'Photo captured. Showing:',
            displayCount,
            'of',
            photos.length
          );

          if (currentPhotoIndex < photos.length - 1 && scrollIndicator) {
            scrollIndicator.style.display = 'block';
          }

          currentPhotoIndex++;
          console.log('Index incremented to:', currentPhotoIndex);
        }, 500);
      } else {
        console.error(`Frame with ID ${frameId} not found`);
        currentPhotoIndex++;
      }
    } else {
      console.log('=== ALL PHOTOS COMPLETED ===');
      clearInterval(captureInterval);

      if (scrollIndicator) {
        scrollIndicator.style.display = 'none';
      }

      setTimeout(() => {
        if (framesContainer) {
          try {
            framesContainer.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (error) {
            framesContainer.scrollTop = 0;
          }
        }
      }, 1000);

      setTimeout(() => {
        // --- TRANSLATED: Finish text and button ---
        progressDiv.textContent = '🎉 ALBUM COMPLETE! 🎉';
        photoBtn.textContent = 'RESTART';
        photoBtn.disabled = false;

        photoBtn.removeEventListener('click', startPhotoShow);
        photoBtn.addEventListener('click', startNewSession);
      }, 2000);
    }
  }, 2500);
}

function startNewSession() {
  const photoBtn = document.querySelector('.photo-btn');
  const progressDiv = document.querySelector('.photobox-progress');

  console.log('=== STARTING NEW SESSION ===');

  // --- TRANSLATED: Reset text ---
  progressDiv.textContent = 'READY TO SEE PHOTOS';
  photoBtn.textContent = 'START';

  // Remove old listener and add original
  photoBtn.removeEventListener('click', startNewSession);
  photoBtn.addEventListener('click', startPhotoShow);

  // Clear display
  const photoDisplay = document.querySelector('.photo-display');
  if (photoDisplay) {
    // --- TRANSLATED: Placeholder text ---
    photoDisplay.innerHTML =
      '<div class="photo-placeholder">Press \'Start\' for a new session</div>';
  }

  // CRITICAL: Reset photo index to exactly 0
  currentPhotoIndex = 0;

  console.log('Session reset. Photo index:', currentPhotoIndex);
}

// Music Player Functions
function initializeMusicPlayer() {
  const musicContent = document.querySelector('.music-content');
  if (!musicContent) return;

  // --- TRANSLATED: Header text ---
  musicContent.innerHTML = `
      <div class="spotify-container">
          <div class="spotify-header">
              <div class="spotify-logo">♪ Our Playlists</div>
          </div>
          <div class="spotify-embed-container">
              <iframe id="spotify-iframe" 
                      style="border-radius:12px" 
                      src="" 
                      width="100%" 
                      height="200" 
                      frameBorder="0" 
                      allowfullscreen="" 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy">
              </iframe>
          </div>
          <div class="playlist-controls">
              <button class="playlist-btn active" data-playlist="1">Playlist 1</button>
              <button class="playlist-btn" data-playlist="2">Playlist 2</button>
              <button class="playlist-btn" data-playlist="3">Playlist 3</button>
          </div>
          <div class="music-info">
              <div class="current-playlist">Now Playing: Birthday Special Mix</div>
              <div class="playlist-description">Special songs for your special day ✨</div>
          </div>
      </div>
  `;

  // Add music player event listeners
  addSpotifyPlayerListeners();

  // Load default playlist
  loadSpotifyPlaylist(1);
}

function addSpotifyPlayerListeners() {
  const playlistBtns = document.querySelectorAll('.playlist-btn');

  playlistBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Remove active class from all buttons
      playlistBtns.forEach((b) => b.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Get playlist number
      const playlistNum = parseInt(this.getAttribute('data-playlist'));

      // Load corresponding playlist
      loadSpotifyPlaylist(playlistNum);
    });
  });
}

function loadSpotifyPlaylist(playlistNumber) {
  const iframe = document.getElementById('spotify-iframe');
  const currentPlaylist = document.querySelector('.current-playlist');
  const playlistDescription = document.querySelector('.playlist-description');

  if (!iframe) return;

  // --- TRANSLATED: Playlist names and descriptions ---
  const playlists = {
    1: {
      // Ganti dengan playlist pertama kamu
      embedUrl: 'https://open.spotify.com/embed/playlist/6VWj6Tc1pzspYnWv8Q9v75?utm_source=generator',
      name: 'Birthday Special Mix',
      description: 'Special songs for your special day ✨',
    },
    2: {
      // Ganti dengan playlist kedua kamu
      embedUrl: 'https://open.spotify.com/embed/playlist/66KqBIXEFg3kdVKjyNPkCk?utm_source=generator',
      name: 'Love Songs Collection',
      description: 'The best love songs for us ❤️',
    },
    3: {
      // Ganti dengan playlist ketiga kamu
      embedUrl: 'https://open.spotify.com/embed/playlist/18Oco9XZ3kjUT1BYIubbnR?utm_source=generator',
      name: 'Sweet Memories',
      description: 'Songs that bring back sweet memories 🌟',
    },
  };

  const selectedPlaylist = playlists[playlistNumber];

  if (selectedPlaylist) {
    // Update iframe source
    iframe.src = selectedPlaylist.embedUrl;

    // Update info
    if (currentPlaylist) {
      currentPlaylist.textContent = `Now Playing: ${selectedPlaylist.name}`;
    }

    if (playlistDescription) {
      playlistDescription.textContent = selectedPlaylist.description;
    }

    // Add loading effect
    iframe.style.opacity = '0.5';

    iframe.onload = function () {
      this.style.opacity = '1';
    };
  }
}

// === SEMUA FUNGSI TETRIS DARI SINI ... ===
// ... SAMPAI SINI DIHAPUS ...
// === DAN DIGANTI DENGAN FUNGSI BARU DI BAWAH INI ===

// === FUNGSI BARU UNTUK "REASONS" ===

// Ganti dengan alasan-alasan kamu sendiri!
const loveReasons = [
  "Because of your amazing smile.",
  "The way you laugh at my silly jokes.",
  "How you always know how to cheer me up.",
  "You are incredibly smart and witty.",
  "Your kindness to everyone around you.",
  "That time we got caught in the rain and just laughed.",
  "How your eyes sparkle when you're excited.",
  "You always support my dreams, no matter how big.",
  "For being my best friend in the entire world.",
  "How we can just be silly and weird together.",
  "You make me a better person, every single day.",
  "The way you look at me.",
  "For always being patient with me.",
  "Your passion for your hobbies.",
  "Because you're you. And that's more than enough. ❤️"
  // Tambahkan lebih banyak alasan di sini!
];

function initializeReasons() {
    const reasonsContent = document.querySelector('#reasons-screen .reasons-content');
    if (!reasonsContent) return;

    reasonsContent.innerHTML = ''; // Hapus placeholder

    // Buat ikon hati untuk setiap alasan
    loveReasons.forEach((reason, index) => {
        const heart = document.createElement('div');
        heart.classList.add('reason-heart');
        heart.innerHTML = '💖'; // Kamu bisa ganti ini ke '❤️', '✨', '🎁'
        
        // Tambahkan listener klik
        heart.addEventListener('click', () => {
            showReasonModal(reason, index + 1);
        });
        
        reasonsContent.appendChild(heart);
    });
}

function showReasonModal(reasonText, reasonNumber) {
    const modal = document.getElementById('reason-modal');
    const title = document.getElementById('reason-title');
    const text = document.getElementById('reason-text');

    if (modal && title && text) {
        // Atur konten modal
        title.textContent = `Reason #${reasonNumber}`;
        text.innerHTML = `<p>${reasonText}</p>`;
        
        // Tampilkan modal
        modal.classList.add('active');
    }
}
// === AKHIR DARI FUNGSI BARU ===


// Event Listeners
function addEventListeners() {
  // Menu buttons
  const menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const page = this.getAttribute('data-page');
      if (page) {
        showScreen(page);
      }
    });
  });

  // Back buttons
  const backButtons = document.querySelectorAll('.back-btn');
  backButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const page = this.getAttribute('data-page');
      if (page) {
        showScreen(page);
      }
    });
  });

  // Start button
  const startBtn = document.querySelector('.start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      if (currentScreen === 'main') {
        showScreen('message');
      }
    });
  }

  // Continue buttons
  const continueButtons = document.querySelectorAll('.continue-btn');
  continueButtons.forEach((button) => {
    button.addEventListener('click', function () {
      handleContinueNavigation();
    });
  });

  // Skip button (event listener already added in initializeMessage)

  // === PERUBAHAN LOGIKA MODAL ===
  // Hapus listener 'confirm-btn' dan 'ok-btn' lama
  const closeReasonBtn = document.getElementById('close-reason-btn');
  
  if (closeReasonBtn) {
    closeReasonBtn.addEventListener('click', function() {
        document.getElementById('reason-modal').classList.remove('active');
    });
  }

  // === KEYBOARD CONTROLS (UNTUK TETRIS) DIHAPUS ===
}

// === FUNGSI addTetrisListeners() DIHAPUS SEMUA ===

function handleContinueNavigation() {
  switch (currentScreen) {
    case 'message':
      showScreen('gallery');
      break;
    case 'gallery':
      showScreen('music');
      break;
    // === PERUBAHAN DI SINI ===
    case 'music':
      showScreen('reasons'); // Diubah dari 'tetris'
      break;
    default:
      showScreen('main');
  }
}