const fs=require('fs');
const h=fs.readFileSync('raw/blog-post.html','utf8');
const i=h.indexOf('<div class="entry-content">'), j=h.indexOf('<div class="et_post_meta_wrapper"> </div>', i);
let s=h.slice(i,j);
const inner=[...s.matchAll(/<div class="et_pb_text_inner">([\s\S]*?)<\/div>\s*<\/div>/g)].map(m=>m[1]);
const clean=x=>x.replace(/<span[^>]*>/g,'').replace(/<\/span>/g,'').replace(/<span>/g,'')
  .replace(/ style="list-style-type: none;"/g,' class="nested"').replace(/<p>\s*<\/p>/g,'').replace(/<strong><\/strong>/g,'')
  .replace(/<br \/>/g,'<br>').replace(/\n\s*\n/g,'\n').trim();
let out=`<!--
path: 2026/02/20/ai-in-quality-process-how-quade-automates-qc-for-millwork-drawings-and-work-orders-in-outsourced-millwork-engineering/
title: AI in Quality Process: How Quade Automates QC for Millwork Drawings and Work Orders in Outsourced Millwork Engineering - QUADE
description: How Quade uses an AI-assisted, evidence-first QC workflow with human review to check millwork shop drawings, work orders and materials in outsourced millwork engineering.
og_image: /assets/images/Millwork_Outsourcing_AI.png
nav: none
footer: no
-->
<div class="post-main">
  <div class="post-wrap">
    <article class="post-content">
      <h1 class="entry-title">AI in Quality Process: How Quade Automates QC for Millwork Drawings and Work Orders in Outsourced Millwork Engineering</h1>
      <p class="post-meta">by QUADE | Uncategorized</p>
      <div class="post-body">
        <div class="block feat"><img src="/assets/images/Millwork_Outsourcing_AI.png" width="1536" height="1024" alt="AI in millwork outsourcing quality control"></div>
`;
inner.forEach((x,k)=>{const c=clean(x); if(!c)return; out+=`        <div class="block${k===1?' half':''}">\n${c}\n        </div>\n`;});
out+=`      </div>
    </article>
    <aside class="post-sidebar">
      <div class="widget">
        <form class="search-form" role="search" action="https://www.google.com/search" method="get" target="_blank">
          <label for="s">Search</label>
          <input type="hidden" name="as_sitesearch" value="quadengg.com">
          <input type="search" id="s" name="as_q" required>
          <button type="submit">Search</button>
        </form>
      </div>
      <div class="widget">
        <h2>Recent Posts</h2>
        <ul><li><a href="/2026/02/20/ai-in-quality-process-how-quade-automates-qc-for-millwork-drawings-and-work-orders-in-outsourced-millwork-engineering/">AI in Quality Process: How Quade Automates QC for Millwork Drawings and Work Orders in Outsourced Millwork Engineering</a></li></ul>
      </div>
      <div class="widget">
        <h2>Recent Comments</h2>
        <p>No comments to show.</p>
      </div>
    </aside>
  </div>
</div>
`;
fs.writeFileSync('../build/pages/blog-ai-in-quality-process.html',out);
console.log(inner.length, out.length);
