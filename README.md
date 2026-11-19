# QUADE website — custom code (no WordPress)

Plain HTML + CSS + JavaScript rebuild of https://quadengg.com (previously WordPress + Divi).
Same pages, same URLs, same images and text.

## What to upload to the hosting (public_html)

```
index.html
about-us/            what-we-do/          join-the-team/
our-portfolio/       request-for-quote/   cad-engineer/
project-engineer/    2026/                (blog post)
assets/              (css, js, images, video)
contact.php          (contact / quote form mailer)
sitemap.xml
robots.txt
```

Do **not** upload: `build/`, `_work/`, `.claude/`, `README.md`.

## Editing pages

The page files in the folders above are generated. Edit the source instead and rebuild:

- `build/pages/*.html` — page content (one file per page; settings block at the top: URL, title, description)
- `build/partials/header.html` — logo + menu (menu items are set in `build/build.js` → `navLinks`)
- `build/partials/contact-footer.html` — "Contact Us" form + footer on every main page
- `build/partials/head.html` — `<head>` tags, Google Analytics
- `assets/css/style.css` — all styling
- `assets/js/main.js` — sticky header, mobile menu, sliders, scroll animations, forms

Rebuild after editing (needs Node.js):

```
node build/build.js
```

## Contact form

Both forms (footer + Request for Quote) post to `contact.php`, which emails **admin@quadengg.com**.
Change `$TO_EMAIL` / `$FROM_EMAIL` at the top of `contact.php` if needed. Requires PHP `mail()` on the host
(standard on cPanel). If mails land in spam, set up SPF/DKIM for quadengg.com or switch to SMTP.

## Local preview

```
node _work/serve.js
```
then open http://localhost:5577 (the preview server fakes a successful form submit).

## Notes from the migration

- The heading font "Sage" was referenced by the old site but `/fonts/sage.otf` returned 404, so the live site
  showed the browser's default serif. The clone does the same; add the real font file in `assets/fonts/`
  and un-comment the `@font-face` at the top of `style.css` to use it.
- The old site loaded scripts from `myjaffna.lk` (domain no longer exists) — removed.
- The "Insights, updates…" Tagembed social feed is kept as-is (widget ID 2204139). It shows nothing on the live site either; check the widget in your Tagembed account.
- The large empty white area under the footer on the old site (a fixed 1196px min-height) was not copied.
- Job pages and the blog post had no footer on the old site; that is kept.
