// sw.js — kill switch (dormant unless a previous host registered a worker here).
// If Karine's old site (Wix / Squarespace / GoDaddy and similar) registered a
// service worker at /sw.js, it may keep serving the cached old site on visitors'
// devices after the DNS cutover. The browser re-fetches this script on its
// periodic update check; because the bytes differ it installs this worker, which
// clears every cache and unregisters itself, so the device falls back to the live
// site. Nothing on this site registers it, so once old workers are evicted it
// just sits dormant.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
    } catch (e) { /* ignore */ }
    try {
      await self.registration.unregister();
    } catch (e) { /* ignore */ }
    try {
      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach((client) => client.navigate(client.url));
    } catch (e) { /* ignore */ }
  })());
});
