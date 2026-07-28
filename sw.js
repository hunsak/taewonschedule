const CACHE_NAME = 'taewon-schedule-v2';
const CORE_ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 항상 브라우저 HTTP 캐시를 건너뛰고 진짜 네트워크로 다시 물어봐서,
  // 다른 기기에서 방금 바꾼 최신 내용을 곧바로 받아오도록 함
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
      return res;
    }).catch(() => caches.match(event.request))
  );
});
