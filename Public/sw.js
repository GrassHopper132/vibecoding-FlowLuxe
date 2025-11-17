const CACHE = "flowluxe-v1";
// We only cache the "app shell", not the videos. This is correct.
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./logo.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k))))
  );
});

self.addEventListener("fetch", (e)=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(found => found || fetch(req))
  );
});