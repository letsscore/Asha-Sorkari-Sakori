const CACHE='asha-sorkari-shell-v3';
const SHELL=['./','./index.html','./css/style.css','./js/app.js','./js/ui.js','./js/firebase.js','./js/firebase-config.js','./js/data.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const r=event.request;
  if(r.method!=='GET' || new URL(r.url).origin!==location.origin) return;
  if(r.mode==='navigate'){
    event.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res})));
});
