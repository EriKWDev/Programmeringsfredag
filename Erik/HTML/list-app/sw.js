var CACHE_NAME = "FList-cache-v1";

var urlsToCache = [
    "/",
    "/main.css",
    "/main.js",
    "/index.html",
    "/manifest.json",
];

self.addEventListener("install", (event) => {
    console.log("Install!");
    event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
          })
      );
});

self.addEventListener("activate", (event) => {
    console.log("Activate!");
});

self.addEventListener("fetch", (event) => {
    console.log("Fetch!", event.request);
});