const filesToCache = [
    '/',
    '/index.html',
    '/post.html',
    '/css/styles.css',
    'manifest.json'

];

const staticCacheName = 'static-cache-v1';
const dynamicCacheName = 'dynamic-cache-v1';


self.addEventListener('install', function(event) {
    console.log('SW: installing and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
    const cacheWhitelist = [staticCacheName]
    event.waitUntil(
        caches.keys()
            .then( (cachesNames) => {
                return Promise.all(
                    cachesNames.map((cacheName) => {
                        if(cacheWhitelist.indexOf(cacheName) === -1){
                            return caches.delete(cacheName);
                        }
                    })
                )
            })
    );
});

self.addEventListener('fetch', async function(event) {
    event.respondWith(
        caches.open(staticCacheName)
            .then((staticCache) => {
                return staticCache.match(event.request)
                    .then((response) => {
                        // if it is in static return it from cache
                        if (response) {
                            console.log(`SW: Returning from static cache ${event.request.url}`);
                            return response;
                        }
                        // otherwise try fetching it from network and saveing it to dynamicCache cache
                        return fetch(event.request)
                            .then((response) => {
                                console.log(`SW: Fetching from network ${event.request.url}`);
                                return caches.open(dynamicCacheName)
                                    .then((dynamicCache) => {
                                        dynamicCache.put(event.request, response.clone())
                                        return response;
                                    })
                                    .catch((e) => console.log('SW: ' + e))
                            })
                            // if there is no network get it from dynamicCache cache or return 404.html
                            .catch((e) => {
                                return caches.open(dynamicCacheName)
                                    .then((dynamicCache) => {
                                        console.log(`SW: Fetching from dynamic cache ${event.request.url}`);
                                        return dynamicCache.match(event.request)
                                            .then((response) => {
                                                if (response) {
                                                    return response;
                                                }
                                                return dynamicCache.match('/error.html')
                                                    .then((response) => response)
                                            })
                                    })
                            })
                    })
            })
    );
});