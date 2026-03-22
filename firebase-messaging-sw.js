// Firebase Cloud Messaging Service Worker
// yoav-fitness — Push Notifications

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBtYMSjABXLCshcd30v8tijc3AZV3i1Q4U",
  authDomain: "yoav-fitness--web-app.firebaseapp.com",
  projectId: "yoav-fitness--web-app",
  storageBucket: "yoav-fitness--web-app.firebasestorage.app",
  messagingSenderId: "137058543324",
  appId: "1:137058543324:web:d09995a0cba119fa98b619",
  measurementId: "G-S1L6G3EWCS"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message:', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '💪 יואב Fit', {
    body: body || '',
    icon: icon || '/Yoav-fitness/icon-192.png',
    badge: '/Yoav-fitness/icon-192.png',
    dir: 'rtl',
    lang: 'he',
    vibrate: [200, 100, 200],
    tag: payload.data?.tag || 'yoav-fit',
    data: payload.data || {}
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('Yoav-fitness') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/Yoav-fitness/');
      }
    })
  );
});

// ====== SCHEDULED NOTIFICATIONS ENGINE ======
// Runs every minute to check if a notification should fire
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(checkScheduledNotifications());
  }
});

// Also handle via message from main app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_CHECK') {
    checkScheduledNotifications();
  }
});

async function checkScheduledNotifications() {
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  const dayOfWeek = now.getDay(); // 0=Sun ... 6=Sat

  // Get schedule from IndexedDB / cache
  const schedule = await getScheduleFromCache();
  if (!schedule) return;

  for (const notif of schedule) {
    if (!notif.enabled) continue;
    if (notif.time !== timeStr) continue;
    if (notif.days && !notif.days.includes(dayOfWeek)) continue;

    // Check if already fired today
    const firedKey = `fired_${notif.id}_${now.toDateString()}`;
    const cache = await caches.open('yoav-fit-fired');
    const already = await cache.match(firedKey);
    if (already) continue;

    // Fire notification
    await self.registration.showNotification(notif.title, {
      body: notif.body,
      icon: '/Yoav-fitness/icon-192.png',
      badge: '/Yoav-fitness/icon-192.png',
      dir: 'rtl',
      lang: 'he',
      vibrate: [200, 100, 200],
      tag: notif.id,
      requireInteraction: notif.requireInteraction || false
    });

    // Mark as fired
    await cache.put(firedKey, new Response('fired'));
  }
}

async function getScheduleFromCache() {
  try {
    const cache = await caches.open('yoav-fit-schedule');
    const resp = await cache.match('schedule');
    if (!resp) return null;
    return await resp.json();
  } catch (e) {
    return null;
  }
}
