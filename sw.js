const staticCacheName = 'site-static-v9';
const dynamicCacheName = 'dynamic-cache-v18';
//

const assets = [
    '/',
    './index.html',
    './js/app.js',
    './js/ui.js',
    './js/materialize.min.js',
    './css/styles.css',
    './css/materialize.min.css',
    './img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v126/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    './pages/fallback.html'
]

const limitCacheSize = (name, size) => {
    //open the cache you want to open
    caches.open(name).then(cache => {
       //get the keys(items)inside the specified cache
       cache.keys().then(keys => {
           //if keys length is > size limit of cache
           if(keys.length > size){
               //then delete the latest cache until the size number is satisfied
               // nd have a recurring function to repeat process until keys.length is < size
               cache.delete(keys[0]).then(limitCacheSize(name, size))
           }
       })
    })
}



// installing the service worker
self.addEventListener('install', (evt) => {
    // console.log("service worker is installed")

    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log("caching shell assets")
            return cache.addAll(assets);
        })
    );
    

});


//activate the service worker
self.addEventListener('activate', (evt) => {
    // console.log("service worker activated!")
  evt.waitUntil(
      caches.keys().then(keys => {
          return Promise.all(keys
              .filter(key => key !== staticCacheName && key !== dynamicCacheName)
              .map(key => caches.delete(key))
          )
      })
  )
})

//fetch Event with service worker => 
// service worker listen to what the page
// wants from the server and then grab those info
// that the page wants

self.addEventListener('fetch', evt =>{
    // console.log("Fetch Event", evt)

    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    evt.respondWith(
        caches.match(evt.request).then((cacheRes) => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone())
                    limitCacheSize(dynamicCacheName, 15);
                    return fetchRes;
                })
            })
        }).catch(() => {
            if(evt.request.url.indexOf('.html') > -1){
                return caches.match('/pages/fallback.html')
            }
        })
    )
}
})

