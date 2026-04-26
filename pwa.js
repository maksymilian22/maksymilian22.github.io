(() => {
  let deferredPrompt = null;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Zainstaluj aplikację';
  button.setAttribute('aria-label', 'Zainstaluj aplikację');
  button.style.cssText = [
    'position:fixed',
    'right:16px',
    'bottom:96px',
    'z-index:10000',
    'display:block',
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

  const showManualInstallInfo = () => {
    alert('Jeśli nie pojawia się okno instalacji, otwórz menu przeglądarki (⋮) i wybierz "Dodaj do ekranu głównego" lub "Zainstaluj aplikację".');
  };

  button.addEventListener('click', async () => {
    if (!deferredPrompt) {
      showManualInstallInfo();
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });

  const attachButton = () => {
    if (!document.body.contains(button)) {
      document.body.appendChild(button);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachButton);
  } else {
    attachButton();
  }

  if ('serviceWorker' in navigator) {
    const swUrl = new URL('sw.js', window.location.href);

    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register(swUrl.pathname, { scope: './' });
      } catch (error) {
        console.error('Nie udało się zarejestrować Service Workera:', error);
      }
    });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    button.style.display = 'none';
  });
})();
