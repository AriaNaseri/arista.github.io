# Arista — Aria Naseri

A static portfolio of nine paintings and drawings, built with HTML, CSS, and JavaScript. No dependencies, external assets, or build step are required.

## Files

- `index.html`: homepage, artwork cards, and accessible full-size viewer.
- `styles.css`: responsive gallery and visual styling.
- `script.js`: painting/drawing filters and viewer controls. Without JavaScript, all artworks remain visible and image links open the full-size photos.
- `assets/artworks/`: all nine permanently named JPEGs.
- `data/artworks.json`: descriptive titles, image paths, descriptions, display dimensions, and original filename mapping. This is a reference catalogue; the site uses the static HTML, so update both when changing artwork details.

Titles are descriptive working titles based on the supplied photographs. Dates, exact materials, and physical dimensions have not been assumed.

## Photo organization

The temporary `works/` directory has been replaced by `assets/artworks/`. Four sideways photographs (Woman in Gold, Dance in Blue, Wolf and Rose, and Black Horse Study) have EXIF orientation tags so browsers display them upright. Their JPEG image data has not been recompressed or retouched. All paintings are shown in full, without cropping.

The original uploads were backed up locally outside this repository in `/home/saeid/git/arista-artwork-originals/`. That backup is not needed to serve the website.

## Preview locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publish to GitHub Pages

Repository: https://github.com/AriaNaseri/arista.github.io

In Settings → Pages, choose **Deploy from a branch**, **main**, and **/ (root)**. Save. The site will be available at https://arianaseri.github.io/arista.github.io/ after a successful deployment.

Commit and push the website files to publish changes. All asset URLs are relative, supporting the repository's URL path. The `.nojekyll` marker keeps the site buildless.
