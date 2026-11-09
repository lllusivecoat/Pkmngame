/* Only this app's static files and cache namespace are managed here. */
importScripts('./precache-manifest.js');
const CONFIG=self.GREENWOOD_PRECACHE;
const SCOPE=new URL(self.registration.scope);
const PREFIX='greenwood-pkmngame:'+SCOPE.pathname+':';
const CACHE=PREFIX+CONFIG.version;
const fileURLs=new Set(CONFIG.files.map(file=>new URL(file,SCOPE).href));
const indexURL=new URL('index.html',SCOPE).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);try{for(let i=0;i<CONFIG.files.length;i+=12)await Promise.all(CONFIG.files.slice(i,i+12).map(async file=>{const url=new URL(file,SCOPE),response=await fetch(new Request(url,{cache:'reload'}));if(!response.ok)throw Error('Offline file unavailable');await cache.put(url,response)}))}catch(error){await caches.delete(CACHE);throw error}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='GREENWOOD_SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;const canonical=new URL(url.pathname,SCOPE.origin).href;if(request.mode!=='navigate'&&!fileURLs.has(canonical))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(request.mode==='navigate'){try{const response=await fetch(request);if(response.ok)return response}catch{}const saved=await cache.match(indexURL);return saved||new Response('Open Greenwood online once to prepare offline play.',{status:503,headers:{'Content-Type':'text/plain'}})}const exact=await cache.match(request);if(exact)return exact;if(!url.search||url.searchParams.get('v')===CONFIG.releaseTag){const saved=await cache.match(canonical);if(saved)return saved}return fetch(request)})())});
