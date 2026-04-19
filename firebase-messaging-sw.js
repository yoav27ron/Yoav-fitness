// Self-unregistering service worker.
// Replaces the old Firebase messaging SW from the previous YOAV FITNESS build
// so returning visitors who had it installed get a clean slate on the v2 redesign.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => { try { c.navigate(c.url); } catch (_) {} });
    } catch (_) { /* no-op */ }
  })());
});
