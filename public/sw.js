import { entries, del } from 'idb-keyval';

const filesToCache = [
    '/',
    '/index.html',
    '/post.html',
    '/css/styles.css',
    'manifest.json',
    '/icons/notification.png',
    '/icons/notification-full.png'

];

const staticCacheName = 'static-cache-v1';
const dynamicCacheName = 'dynamic-cache-v1';

async function syncPhotos(){
    entries().then((entries)=>{
        entries.forEach((entry) => {
            let { id, blob } = entry[1];
            console.log(id);
            fetch('/api/posts', {
                method: 'POST',
                body: blob
            }).then((response) => {
                if(!response.ok){
                    console.log('syncPhotos: failed response is not ok');
                }
                del(id);
            })
        })
    })

}

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
                                        if(event.request.method === 'GET'){
                                            dynamicCache.put(event.request, response.clone())
                                        }
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

self.addEventListener("sync", function(event) {
    console.log('SW: sync')

    if (event.tag === "sync-photos"){
        event.waitUntil(syncPhotos());
    }

})

self.addEventListener("push", function (event) {
    console.log("push")
    let data = {
        title: "title",
        body: "body",
        redirectUrl: "/"
    }

    if(event.data){
        data = JSON.parse(event.data.text());
    }

    let options = {
        body: data.body,
        icon: "/icons/android/android-launchericon-96-96.png",
        badge: "/icons/android/android-launchericon-96-96.png",
        vibrate: [200,100,200,100,200,100,200],
        data: {
            redirectUrl: data.redirectUrl
        }
    }

    event.waitUntil(
        self.registration.showNotification(
            data.title, options
        )
    );

})

self.addEventListener("notificationclick", function(event){
    console.log("notificationclick");
    let notification = event.notification;
    event.waitUntil(
        self.clients.matchAll().then(function (clients){
            clients.forEach(client => {
                client.navigate(notification.data.redirectUrl);
                client.focus();
            })
            notification.close();
        })
    )
})

self.addEventListener("notificationclose", function(event){
    console.log("notification close");
})

