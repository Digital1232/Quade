const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.xml':'application/xml','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(req.method==='POST'&&p==='/contact.php'){res.writeHead(200,{'Content-Type':'application/json'});return res.end('{"ok":true}');}
  let f=path.join(root,p); if(!f.startsWith(root)){res.writeHead(403);return res.end();}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404);return res.end('404');}
  const st=fs.statSync(f), type=types[path.extname(f)]||'application/octet-stream';
  const range=req.headers.range;
  if(range&&type==='video/mp4'){const [s,e]=range.replace('bytes=','').split('-');const start=+s,end=e?+e:Math.min(start+2e6,st.size-1);res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${st.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1,'Content-Type':type});return fs.createReadStream(f,{start,end}).pipe(res);}
  res.writeHead(200,{'Content-Type':type,'Content-Length':st.size,'Cache-Control':'no-store'});fs.createReadStream(f).pipe(res);
}).listen(5577,()=>console.log('http://localhost:5577'));
