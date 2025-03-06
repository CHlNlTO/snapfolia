// public/sw.js
const CACHE_NAME = "snapfolia-v1";
const MODEL_CACHE_NAME = "snapfolia-model-v1";

// App shell files to cache
const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  // Add more app shell files as needed
];

// Model files to cache
const MODEL_FILES = [
  "https://uiffmgyykbhewphigjsf.supabase.co/storage/v1/object/public/snapfolia/yolov8n-cls_web_model/model.json",
  "https://uiffmgyykbhewphigjsf.supabase.co/storage/v1/object/public/snapfolia/yolov8n-cls_web_model/group1-shard1of3.bin",
  "https://uiffmgyykbhewphigjsf.supabase.co/storage/v1/object/public/snapfolia/yolov8n-cls_web_model/group1-shard2of3.bin",
  "https://uiffmgyykbhewphigjsf.supabase.co/storage/v1/object/public/snapfolia/yolov8n-cls_web_model/group1-shard3of3.bin",
];

// Install event
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");

  // Cache app shell files
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell");
      return cache.addAll(APP_SHELL_FILES);
    })
  );

  // Cache model files separately
  event.waitUntil(
    caches.open(MODEL_CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching model files");
      return cache.addAll(MODEL_FILES);
    })
  );

  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate");

  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== MODEL_CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle model file requests
  if (MODEL_FILES.includes(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }

        // If not in cache, fetch from network and cache
        return fetch(event.request).then((networkResponse) => {
          // Clone the response since it can only be used once
          const responseToCache = networkResponse.clone();

          caches.open(MODEL_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
    );
    return;
  }

  // For other requests, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for app shell files
        if (response.ok && APP_SHELL_FILES.includes(url.pathname)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try from cache
        return caches.match(event.request);
      })
  );
});
