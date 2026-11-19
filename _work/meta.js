const fs=require('fs');
for(const f of fs.readdirSync('raw')){const h=fs.readFileSync('raw/'+f,'utf8');
const t=(h.match(/<title>([^<]*)/)||[])[1];const d=(h.match(/<meta name="description" content="([^"]*)/)||[])[1];
const og=[...h.matchAll(/<meta (property|name)="(og:[a-z_:]+|twitter:[a-z_]+)" content="([^"]*)"/g)].map(m=>m[2]+'='+m[3]).join(' | ');
const ld=(h.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)||[])[1]||'';
const can=(h.match(/<link rel="canonical" href="([^"]*)/)||[])[1];
const gtag=(h.match(/gtag\("config",\s*"([^"]+)"/g)||[]).join(',');
console.log('##',f,'\n T:',t,'\n D:',d,'\n C:',can,'\n OG:',og.slice(0,600),'\n GTAG:',gtag,'\n LD:',ld.length);}
