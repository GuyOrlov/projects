const CACHE='guy-pdf-toolkit-v1';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('guy-pdf-toolkit-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin&&!['cdnjs.cloudflare.com','cdn.jsdelivr.net','accounts.google.com'].includes(url.hostname))return;
 event.respondWith(caches.match(event.request).then(cache=>cache||fetch(event.request).then(response=>{if(response.ok||response.type==='opaque'){const clone=response.clone();caches.open(CACHE).then(c=>c.put(event.request,clone)).catch(()=>{});}return response;}).catch(()=>cache)));
});