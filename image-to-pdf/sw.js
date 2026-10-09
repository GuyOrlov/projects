const CACHE='guy-pdf-toolkit-v2';
const APP=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('guy-pdf-toolkit-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(!/^https?:$/.test(url.protocol))return;
 const own=url.origin===self.location.origin;
 const library=['cdnjs.cloudflare.com','cdn.jsdelivr.net'].includes(url.hostname);
 if(!own&&!library)return;
 if(own){
  event.respondWith(fetch(event.request).then(response=>{
   if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,clone)).catch(()=>{});}
   return response;
  }).catch(async()=>await caches.match(event.request)||await caches.match('./index.html')));
 }else{
  event.respondWith(caches.match(event.request).then(cache=>cache||fetch(event.request).then(response=>{
   if(response.ok||response.type==='opaque')caches.open(CACHE).then(c=>c.put(event.request,response.clone())).catch(()=>{});
   return response;
  })));
 }
});