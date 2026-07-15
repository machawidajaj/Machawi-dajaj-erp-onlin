
(() => {
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    console.log('Machawi ERP is installable');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    console.log('Machawi ERP installed');
  });

  window.installMachawiApp = async function () {
    if (!deferredPrompt) {
      alert('افتح قائمة Google Chrome ثم اختر: تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.');
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  };

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();

        // Remove service workers from the earlier broken PWA versions.
        for (const registration of registrations) {
          await registration.unregister();
        }

        await navigator.serviceWorker.register('./service-worker.js', {
          updateViaCache: 'none'
        });

        console.log('Machawi ERP service worker registered');
      } catch (error) {
        console.error('PWA registration failed:', error);
      }
    });
  }
})();
