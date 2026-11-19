(()=>{
const st=document.createElement('style');st.textContent='.et_animated,.et-waypoint,[class*=et_pb_]{opacity:1!important;animation:none!important}';document.head.appendChild(st);
const S=e=>{const c=getComputedStyle(e);const o={};
 const bg=c.backgroundImage!=='none'?c.backgroundImage.replace(/https:\/\/quadengg\.com\/wp-content\/uploads\/\d+\/\d+\//g,''):'';
 if(bg)o.bgi=bg.slice(0,200); if(c.backgroundColor!=='rgba(0, 0, 0, 0)')o.bgc=c.backgroundColor;
 if(bg){o.bgs=c.backgroundSize;o.bgp=c.backgroundPosition;o.bgr=c.backgroundRepeat; if(c.backgroundAttachment!=='scroll')o.bga=c.backgroundAttachment;}
 const p=c.padding; if(p!=='0px')o.pad=p; const m=c.margin; if(m!=='0px')o.mar=m;
 o.w=Math.round(e.getBoundingClientRect().width); o.h=Math.round(e.getBoundingClientRect().height);
 if(c.maxWidth!=='none')o.maxw=c.maxWidth;
 if(c.borderRadius!=='0px')o.br=c.borderRadius; if(c.boxShadow!=='none')o.sh=c.boxShadow;
 if(c.borderWidth!=='0px'&&c.borderStyle!=='none')o.bd=c.border;
 return o;};
const T=e=>{const c=getComputedStyle(e);return `${c.fontFamily.split(',')[0]} ${c.fontSize}/${c.lineHeight} w${c.fontWeight} ${c.color} ${c.textAlign}${c.textTransform!=='none'?' '+c.textTransform:''}${c.letterSpacing!=='normal'?' ls'+c.letterSpacing:''}`};
const clean=h=>h.replace(/\s+/g,' ').replace(/https:\/\/quadengg\.com\/wp-content\/uploads\/\d+\/\d+\//g,'IMG/').replace(/ (class|style|decoding|loading|srcset|sizes|width|height|data-[a-z-]+)="[^"]*"/g,'').slice(0,2500);
const out=[];
document.querySelectorAll('#main-content .et_pb_section, #et-boc .et_pb_section').forEach(sec=>{
 if(out.find(x=>x.el===sec))return;
 const s={sec:sec.className.match(/et_pb_section_\d+/)?.[0]+' '+(sec.className.match(/\b(?!et_)[a-z_0-9-]+$/)?.[0]||''),...S(sec),rows:[]};
 sec.querySelectorAll(':scope > .et_pb_row, :scope > .et_pb_fullwidth_module, :scope > div:not(.et_pb_row)').forEach(r=>{
  const row={row:r.className.match(/et_pb_(row|fullwidth_\w+?)_\d+/)?.[0]||r.className.slice(0,60),...S(r),cols:[]};
  const cols=r.querySelectorAll(':scope > .et_pb_column'); (cols.length?cols:[r]).forEach(col=>{
   const cc={col:(col.className.match(/et_pb_column_(\d_\d|\d+_\d+)/)||[''])[0],...S(col),mods:[]};
   col.querySelectorAll(':scope > .et_pb_module, :scope > .et_pb_row_inner').forEach(m=>{
     const t=m.className.match(/et_pb_(text|image|button|code|blurb|video|divider|contact_form|cta|toggle|tabs|gallery|slider|fullwidth_\w+|row_inner|blog|social_media_follow|number_counter|testimonial|accordion|post_slider|portfolio|filterable_portfolio)/)?.[0]||m.className.slice(0,40);
     const mm={t,...S(m)};
     const txt=m.querySelector('h1,h2,h3,h4,p,a,li')||m; mm.font=T(txt);
     const hs=[...m.querySelectorAll('h1,h2,h3,h4,h5')].slice(0,3).map(h=>h.tagName+':'+T(h)); if(hs.length)mm.hfont=hs;
     mm.html=clean(m.innerHTML);
     cc.mods.push(mm);});
   row.cols.push(cc);});
  s.rows.push(row);});
 out.push(s);});
return JSON.stringify(out.map(({el,...x})=>x));
})()
