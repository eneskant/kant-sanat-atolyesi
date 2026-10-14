// Only public static assets are cached. Auth requests and student data never enter this cache.
const CACHE='kant-student-shell-v2';
const BASE=new URL('./',self.location.href);
const STATIC=['','index.html','styles.css','app.js','firebase-config.js','manifest.webmanifest','../kant-sanati-logo.png','assets/icon-192.png','assets/icon-512.png'].map(path=>new URL(path,BASE).pathname);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(STATIC))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('kant-student-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.search||!STATIC.includes(url.pathname))return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||new Response('Bağlantı gerekli',{status:503}))));});
