// Registers the service worker. Included on every page.
// Service workers only run on https:// or localhost, which Live Server and GitHub Pages both provide.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => {
      console.warn('Service worker failed to register:', err);
    });
  });
}
