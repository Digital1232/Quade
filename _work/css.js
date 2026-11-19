const fs=require('fs');const h=fs.readFileSync(process.argv[2],'utf8');const max=+process.argv[3]||6000;
const re=/<style( id="([^"]+)")?[^>]*>([\s\S]*?)<\/style>/g;let m;
while((m=re.exec(h))){const id=m[2]||'anon';if(/^(wp-|global-styles|divi-dynamic-critical|cky-style|divi-style-inline)/.test(id))continue;
console.log('=====',id,m[3].length);console.log(m[3].slice(0,max));}
