// VASA Trade Platform Service Worker
const CACHE_NAME = 'vasa-trade-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Resources to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add critical CSS and JS files
  '/client/global.css'
];

// API endpoints to cache
const API_CACHE_URLS = [
  '/api/health',
  '/api/demo',
  '/api/search/popular',
  '/api/compliance/countries'
];

// Dynamic content that should be cached
const DYNAMIC_CACHE = [
  '/search',
  '/products',
  '/orders',
  '/messages'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    handleFetch(request)
  );
});

// Main fetch handler with different strategies
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First (for static assets)
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First (for API calls)
    if (url.pathname.startsWith('/api/')) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate (for pages)
    if (isDynamicPage(url.pathname)) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network First
    return await networkFirst(request);
    
  } catch (error) {
    console.error('Fetch failed:', error);
    return await getOfflineFallback(request);
  }
}

// Cache First Strategy - good for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First Strategy - good for API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate - good for pages
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Offline fallback
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For navigation requests, show offline page
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match(OFFLINE_URL);
    return offlineResponse || new Response('Offline', { status: 503 });
  }
  
  // For API requests, return cached data or error
  if (url.pathname.startsWith('/api/')) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Offline - cached data not available',
        offline: true
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // For other resources, try to return cached version
  const cachedResponse = await caches.match(request);
  return cachedResponse || new Response('Resource not available offline', { status: 503 });
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.includes('.') || 
         pathname.startsWith('/icons/') ||
         pathname.startsWith('/images/') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.svg');
}

function isDynamicPage(pathname) {
  return DYNAMIC_CACHE.some(pattern => pathname.startsWith(pattern));
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    badge: '/icons/badge-72x72.png',
    icon: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view-24x24.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/close-24x24.png'
      }
    ]
  };

  let title = 'VASA Trade';
  let body = 'You have a new notification';
  let data = {};

  if (event.data) {
    try {
      const payload = event.data.json();
      title = payload.title || title;
      body = payload.body || body;
      data = payload.data || {};
      
      // Merge custom options
      Object.assign(options, payload.options || {});
    } catch (error) {
      console.error('Error parsing push payload:', error);
      body = event.data.text() || body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data,
      ...options
    })
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'dismiss') {
    return;
  }

  // Determine URL to open
  let urlToOpen = '/';
  
  if (data && data.url) {
    urlToOpen = data.url;
  } else if (action === 'view' && data && data.type) {
    switch (data.type) {
      case 'order':
        urlToOpen = `/orders/${data.orderId || ''}`;
        break;
      case 'message':
        urlToOpen = `/messages/${data.conversationId || ''}`;
        break;
      case 'compliance':
        urlToOpen = '/compliance';
        break;
      default:
        urlToOpen = '/';
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if window is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync offline actions when network is restored
    const cache = await caches.open('offline-actions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        console.error('Background sync failed for request:', request.url);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Message handling from client
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urls))
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        })
    );
  }
});

// Share target handling
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share' && event.request.method === 'POST') {
    event.respondWith(handleShare(event.request));
  }
});

async function handleShare(request) {
  const formData = await request.formData();
  const title = formData.get('title') || '';
  const text = formData.get('text') || '';
  const url = formData.get('url') || '';
  const files = formData.getAll('files');
  
  // Store shared data for the app to retrieve
  const sharedData = {
    title,
    text,
    url,
    files: files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size
    }))
  };
  
  // Redirect to main app with shared data
  return Response.redirect(`/?shared=${encodeURIComponent(JSON.stringify(sharedData))}`, 302);
}

console.log('VASA Trade Service Worker loaded');
