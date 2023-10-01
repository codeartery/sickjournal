
const cacheName = 'pwa-assets'

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                '/', 
                '/manifest.json',
                '/index.html',
                '/database.js',
                '/serviceworker.js',                
                '/pages/edit.html',
                '/pages/history.html',
                '/pages/settings.html',
                '/styles/global.css', 
                '/styles/index.css',
                '/styles/edit.css',
                '/styles/history.css',
                
            ])
        })
    )
    console.log('service worker installed')
})


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheResponse => {
            const networkResponse = fetch(event.request).then(response => {
                caches.open(cacheName).then(cache => {
                    cache.put(event.request, response.clone())
                })
                return response
            })
            return networkResponse || cacheResponse
        })
    )
})
