/* Still, Us. — opening heartbeat loader */
(() => {
  const loader = document.getElementById('openingLoader');
  const message = document.getElementById('openingLoaderMessage');
  if (!loader || !message) return;

  const messages = [
    'Tucking the tiny moments somewhere safe…',
    'Saving a little extra sparkle for you…',
    'Made with love, a little chaos, and lots of you…',
    'Almost there, birthday girl…',
    'One tiny heartbeat, then you’re home. ♡'
  ];

  let current = 0;
  const messageTimer = window.setInterval(() => {
    if (current >= messages.length) return;
    message.classList.add('is-changing');
    window.setTimeout(() => {
      if (current < messages.length) message.textContent = messages[current];
      current += 1;
      message.classList.remove('is-changing');
    }, 230);
  }, 1500);

  // The full opening lasts about 10 seconds, including its soft fade-out.
  window.setTimeout(() => {
    window.clearInterval(messageTimer);
    loader.classList.add('is-leaving');
    document.body.classList.remove('is-opening');
    window.setTimeout(() => loader.remove(), 760);
  }, 9240);
})();
