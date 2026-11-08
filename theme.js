// Appearance is an independent device preference, never game-world time or weather.
export const THEME_KEY='greenwood.theme.v1';
export const themeChoices=[{value:'light',label:'Daylight',icon:'☀'},{value:'dark',label:'Moonlight',icon:'☾'},{value:'system',label:'Follow device',icon:'◐'}];
export function normalizeTheme(value){return ['light','dark','system'].includes(value)?value:'system'}
export function resolveTheme(preference,darkDevice=false){const value=normalizeTheme(preference);return value==='system'?(darkDevice?'dark':'light'):value}
export function readTheme(storage){try{return normalizeTheme(storage.getItem(THEME_KEY))}catch{return 'system'}}
export function initTheme({storage,doc=globalThis.document,win=globalThis.window,onChange=()=>{}}){
 const media=win?.matchMedia?.('(prefers-color-scheme: dark)');let preference=readTheme(storage);
 const apply=()=>{const resolved=resolveTheme(preference,!!media?.matches);doc.documentElement.dataset.theme=resolved;doc.documentElement.dataset.themePreference=preference;doc.documentElement.style.colorScheme=resolved;doc.querySelector('meta[name="theme-color"]')?.setAttribute('content',resolved==='dark'?'#111a21':'#f4f6f1');return resolved};
 const changed=()=>{if(preference==='system'){apply();onChange(preference)}};
 media?.addEventListener?.('change',changed);apply();
 return {get preference(){return preference},get resolved(){return resolveTheme(preference,!!media?.matches)},set(value){preference=normalizeTheme(value);let saved=true;try{storage.setItem(THEME_KEY,preference)}catch{saved=false}apply();onChange(preference);return saved},destroy(){media?.removeEventListener?.('change',changed)}};
}
