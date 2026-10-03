# bsharakhoury.com

Static portfolio site for Bechara El Khoury. Plain HTML, CSS and JavaScript, no build step.
Hosted on Cloudflare Pages, which deploys automatically from this repo.

## Files
| File | Purpose |
|---|---|
| `index.html` | Main page content (Work, Photography, Head of Media, About, Contact) |
| `style.css` | All styling and design tokens (`:root` variables) |
| `script.js` | Site behaviour (menus, video modal, album viewer) |
| `photos.js` | **Photo album lists** - the file to edit when adding photos |
| `headofmedia.html` | Standalone Head of Media page |
| `photos/<category>/` | Gallery images (`cover.jpg` is the category card image) |
| `og-image.jpg`, `favicon.ico`, `icon-*.png`, `apple-touch-icon.png`, `site.webmanifest` | Google / social preview and icons |
| `robots.txt`, `sitemap.xml`, `404.html` | SEO and error page |
| `tools/validate.py` | Checks for missing files and missing alt text |

## Common updates
- **Add a photo:** save a JPG (about 1800px wide, under 500 KB) in `photos/<category>/`, then add one line to that category in `photos.js`.
- **Add a film:** copy an existing `film-thumb` block in `index.html` and change the Vimeo/YouTube ID, thumbnail and title.
- **Change contact or social links:** search `index.html` for `mailto:`, `linkedin.com`, `instagram.com`.
- **Change colours or fonts:** edit the `:root` variables at the top of `style.css`.

## Workflow
1. Create a branch and make changes.
2. Run `python3 tools/validate.py` (GitHub runs it automatically on every pull request).
3. Open a pull request. Cloudflare Pages builds a preview link for each branch, so changes can be reviewed before going live.
4. Merge to `main` to publish (about 30 seconds).

To preview locally: `python3 -m http.server 8000` and open http://localhost:8000.

## Notes
- Hosting: Cloudflare Pages (domain and email at GoDaddy, DNS at Cloudflare). GitHub Pages is not used for the live site.
- Do not add a catch-all `_redirects` rule (`/* /index.html 200`): it would hide the 404 page and hurt SEO.
- House style: no em dashes in site copy.
