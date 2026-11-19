/**
 * QUADE static site builder
 * -------------------------
 * Combines the shared partials (header, footer, contact section) with each
 * page in build/pages/ and writes finished HTML into the site root, keeping
 * the same URLs as the old WordPress site (e.g. /about-us/ -> about-us/index.html).
 *
 * Usage:  node build/build.js
 *
 * Each page file starts with a settings block:
 *   <!--
 *   path: about-us/
 *   title: About Us - QUADE
 *   description: ...
 *   nav: about            (home | about | wwd | join | portfolio | quote | none)
 *   footer: yes           (yes = include the Contact Us + footer section)
 *   og_type: article
 *   sitemap: no          (leave the page out of sitemap.xml, e.g. the 404 page)
 *   -->
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://quadengg.com';
const P = (f) => fs.readFileSync(path.join(__dirname, 'partials', f), 'utf8');

const partials = {
  head: P('head.html'),
  header: P('header.html'),
  contact: P('contact-footer.html'),
  scripts: P('scripts.html'),
};

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function parse(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^<!--([\s\S]*?)-->\s*/);
  const meta = {};
  if (m) {
    m[1].split('\n').forEach((line) => {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
  }
  return { meta, body: m ? src.slice(m[0].length) : src };
}

function navLinks(active, hasFooter) {
  const items = [
    ['home', '/', 'Home'],
    ['about', '/about-us/', 'About'],
    ['wwd', '/what-we-do/', 'What We Do'],
    ['join', '/join-the-team/', 'Join the Team'],
    ['contact', hasFooter ? '#contact_us' : '/#contact_us', 'Contact Us'],
    ['portfolio', 'http://portfolio.quadengg.com/', 'Our Portfolio', 'btn'],
    ['quote', '/request-for-quote/', 'Request for Quote', 'btn'],
  ];
  return items
    .filter(([key]) => !(key === 'contact' && active === 'quote')) // old site hid it on the quote page
    .map(([key, href, label, extra]) => {
      const cls = [extra, key === active ? 'current' : ''].filter(Boolean).join(' ');
      const target = href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
      return `<li${cls ? ` class="${cls}"` : ''}><a href="${href}"${target}${key === active ? ' aria-current="page"' : ''}>${label}</a></li>`;
    })
    .join('\n          ');
}

const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'));

files.forEach((f) => {
  const { meta, body } = parse(path.join(pagesDir, f));
  const urlPath = meta.path === '/' || !meta.path ? '' : meta.path.replace(/^\/|\/$/g, '') + '/';
  const canonical = `${SITE}/${urlPath}`;
  const hasFooter = meta.footer !== 'no';
  const description = meta.description || '';

  let head = partials.head
    .replace(/{{title}}/g, esc(meta.title))
    .replace(/{{og_title}}/g, esc(meta.og_title || meta.title.replace(/ - QUADE$/, '')))
    .replace(/{{canonical}}/g, canonical)
    .replace(/{{og_type}}/g, meta.og_type || 'article')
    .replace(/{{description_tags}}/g, description
      ? `<meta name="description" content="${esc(description)}">\n  <meta property="og:description" content="${esc(description)}">`
      : '')
    .replace(/{{og_image}}/g, meta.og_image ? `<meta property="og:image" content="${SITE}${meta.og_image}">` : '')
    .replace(/{{extra_head}}/g, meta.extra_head || '');

  const header = partials.header.replace('{{nav}}', navLinks(meta.nav, hasFooter));
  const contact = hasFooter ? partials.contact.replace(/{{page}}/g, urlPath ? '/' + urlPath : '/') : '';

  const html = `<!DOCTYPE html>
<html lang="en-US">
<head>
${head}
</head>
<body class="${meta.body_class || ''}">
<div id="page-container">
${header}
<main id="main-content">
${body.trim()}
</main>
${contact}
</div>
${partials.scripts}
</body>
</html>
`;

  const outDir = path.join(ROOT, urlPath);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log('built', path.join(urlPath, 'index.html'));
});

// sitemap.xml
const urls = files.map((f) => {
  const { meta } = parse(path.join(pagesDir, f));
  if (meta.sitemap === 'no') return null;
  const p = meta.path === '/' || !meta.path ? '' : meta.path.replace(/^\/|\/$/g, '') + '/';
  return `  <url><loc>${SITE}/${p}</loc></url>`;
});
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.filter(Boolean).join('\n')}\n</urlset>\n`);
console.log('built sitemap.xml');
