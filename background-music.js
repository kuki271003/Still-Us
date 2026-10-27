/* Still, Us. — gentle ambient soundtrack controller.
   Playback starts from the first meaningful user interaction, because browsers
   generally block automatic audio before a gesture. The track loops continuously
   between screens, and the top-bar button fades it in/out. */
(() => {
  'use strict';

  const audio = document.getElementById('siteMusic');
  const button = document.getElementById('musicToggle');
  const status = document.getElementById('musicStatus');
  const enterButton = document.getElementById('enterButton');
  const prologueContinue = document.getElementById('prologueContinue');
  const wordmark = document.getElementById('wordmark');

  if (!audio || !button) return;

  const TARGET_VOLUME = 0.26;
  let state = 'off';
  let userMadeChoice = false;
  let fadeFrame = 0;
  let operationId = 0;

  audio.loop = true;
  audio.volume = 0;

  function announce(message) {
    if (status) status.textContent = message;
  }

  function updateButton(nextState) {
    const playing = nextState === 'playing' || nextState === 'starting';
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-pressed', String(playing));

    if (nextState === 'playing' || nextState === 'starting') {
      button.setAttribute('aria-label', 'Pause background music');
      button.title = 'Pause background music';
    } else if (nextState === 'error') {
      button.setAttribute('aria-label', 'Try background music again');
      button.title = 'Music could not be loaded — try again';
    } else {
      button.setAttribute('aria-label', 'Play background music');
      button.title = 'Play background music';
    }
  }

  function fadeTo(target, duration, onComplete) {
    if (fadeFrame) cancelAnimationFrame(fadeFrame);
    const startVolume = audio.volume;
    const startTime = performance.now();

    const frame = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      // A smooth ease-out rather than an abrupt volume jump.
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(0, Math.min(1, startVolume + (target - startVolume) * eased));

      if (progress < 1) {
        fadeFrame = requestAnimationFrame(frame);
      } else {
        fadeFrame = 0;
        if (typeof onComplete === 'function') onComplete();
      }
    };

    fadeFrame = requestAnimationFrame(frame);
  }

  async function startMusic() {
    if (state === 'playing' && !audio.paused) return true;
    if (state === 'starting') return true;

    const operation = ++operationId;
    if (fadeFrame) {
      cancelAnimationFrame(fadeFrame);
      fadeFrame = 0;
    }

    state = 'starting';
    updateButton(state);
    announce('Starting Still, Us. background music.');

    try {
      // Call play directly from the user's click pathway to satisfy autoplay policies.
      const playResult = audio.play();
      if (playResult && typeof playResult.then === 'function') await playResult;
      if (operation !== operationId) {
        audio.pause();
        return false;
      }
      state = 'playing';
      updateButton(state);
      announce('Still, Us. background music is playing and will loop until paused.');
      fadeTo(TARGET_VOLUME, 1700);
      return true;
    } catch (error) {
      state = 'error';
      audio.pause();
      audio.volume = 0;
      updateButton(state);
      announce('The background music could not start. Check that the audio asset is present.');
      return false;
    }
  }

  function stopMusic() {
    // Invalidate a pending play() promise so a fast pause click wins the race.
    ++operationId;
    if (fadeFrame) {
      cancelAnimationFrame(fadeFrame);
      fadeFrame = 0;
    }

    if (audio.paused || state === 'off' || state === 'error') {
      audio.pause();
      audio.volume = 0;
      state = 'off';
      updateButton(state);
      announce('Background music is paused.');
      return;
    }

    state = 'stopping';
    updateButton('off');
    announce('Fading out and pausing background music.');
    fadeTo(0, 650, () => {
      audio.pause();
      state = 'off';
      updateButton(state);
      announce('Background music is paused.');
    });
  }

  button.addEventListener('click', () => {
    userMadeChoice = true;
    if (state === 'playing' || state === 'starting') {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // Begin the soundtrack naturally as she enters the experience. If she has
  // explicitly chosen music off, respect that decision across her navigation.
  const startOnJourney = () => {
    if (!userMadeChoice) startMusic();
  };
  if (enterButton) enterButton.addEventListener('click', startOnJourney);
  if (prologueContinue) prologueContinue.addEventListener('click', startOnJourney);
  if (wordmark) wordmark.addEventListener('click', startOnJourney);

  audio.addEventListener('ended', () => {
    // The loop attribute should handle this; this is a resilience fallback.
    if (state === 'playing') {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  });

  audio.addEventListener('error', () => {
    if (state !== 'off') {
      state = 'error';
      updateButton(state);
      announce('The background music file could not be loaded.');
    }
  });

  updateButton('off');
})();
