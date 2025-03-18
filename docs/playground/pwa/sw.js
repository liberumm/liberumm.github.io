// sw.js

// インストール時にキャッシュを作成
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '.',
        'index.html',
        'manifest.json',
        'icon-192.png',
        'icon-512.png'
      ]);
    }).catch(error => {
      console.error('Error caching assets:', error);
    })
  );
});

// ネットワークから取得できない場合はキャッシュを返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// メッセージを受け取り、通知を表示する
self.addEventListener('message', function(event) {
  console.log('Received message in Service Worker:', event.data);
  self.registration.showNotification(event.data);
});
