(() => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.error('Nie udało się zarejestrować Service Workera:', error);
    }
  });

  let deferredPrompt = null;

  const installButton = document.createElement('button');
  installButton.type = 'button';
  installButton.textContent = 'Zainstaluj aplikację';
  installButton.setAttribute('aria-label', 'Zainstaluj aplikację');
  installButton.style.cssText = [
    'position:fixed',
    'right:16px',
    'bottom:96px',
    'z-index:10000',
    'display:none',
    'padding:12px 16px',
    'border:none',
    'border-radius:999px',
    'background:#024a94',
    'color:#fff',
    'font-weight:600',
    'font-size:14px',
    'box-shadow:0 4px 12px rgba(0,0,0,0.22)',
    'cursor:pointer'
  ].join(';');

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButton.style.display = 'none';
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(installButton);
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.style.display = 'block';
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installButton.style.display = 'none';
  });
})();
