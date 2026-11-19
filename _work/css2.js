const fs=require('fs');
for(const f of fs.readdirSync('raw')){const h=fs.readFileSync('raw/'+f,'utf8');
const re=/<style( id="([^"]+)")?[^>]*>([\s\S]*?)<\/style>/g;let m;let out='';
while((m=re.exec(h))){const id=m[2]||'anon';
 if(id==='et-divi-customizer-global-cached-inline-styles'){fs.writeFileSync('css/_global.css',m[3].replace(/\}/g,'}\n'));continue;}
 if(/et-builder-module-design/.test(id)) out+=m[3];}
// also inline <style> in body (e.g. code modules)
fs.writeFileSync('css/'+f.replace('.html','.css'),out.replace(/\}/g,'}\n'));}
