# bsharakhoury.com

Static portfolio site (plain HTML/CSS/JS, no build step) for Bechara El Khoury.

## Files
- `index.html` – main site (Filmmaking, Photography, Head of Media, About, Contact)
- `headofmedia.html` – Head of Media showreel page
- `photos/<category>/` – gallery images (abstract, film, landscape, panorama, people, wildlife); `cover.jpg` is the category cover
- `BecharafilmmakingphotoDSCF0670.jpg` – About portrait and social share image
- `robots.txt`, `sitemap.xml`, `404.html` – SEO / error page

## Common updates
- **Add a photo:** drop a JPG (under ~500 KB, ~2000px wide) into the right `photos/` folder, then add an `<img>` in the matching gallery block in `index.html`.
- **Add a film:** copy an existing `film-thumb` block in `index.html` and change the Vimeo/YouTube ID and title.
- **Change contact/social links:** search `index.html` for `mailto:`, `linkedin.com`, `instagram.com`.

## Deploy
Push to `main`; GitHub Pages republishes in about a minute. Prefer a branch + pull request for bigger changes.
