
const cacheName = 'sicktrackcache'

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                '/', 
                '/manifest.json',
                '/index.html',
                '/style.css',
                '/script-ui.js',
                '/script-db.js',
                '/script-sw.js'                
            ])
        })
    )
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
            //TODO: cache then network? but then I'd need a refresh cycle
        })
    )
})
