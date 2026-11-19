const fs=require('fs');const f=process.argv[2];const h=fs.readFileSync('raw/'+f,'utf8');
const i=h.indexOf('<div id="main-content">');const j=h.indexOf('<footer id="main-footer"');
let s=h.slice(i,j).replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/\s+/g,' ').replace(/ (decoding|loading|srcset|sizes|data-[a-z-]+)="[^"]*"/g,'').replace(/https:\/\/quadengg\.com\/wp-content\/uploads\/\d+\/\d+\//g,'IMG/');
console.log(s.slice(0,+process.argv[3]||20000));
