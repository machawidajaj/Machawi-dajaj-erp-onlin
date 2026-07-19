(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(function (registration) {
        registration.update().catch(function () {});
      })
      .catch(function (error) {
        console.warn('PWA registration failed:', error);
      });
  });
})();
