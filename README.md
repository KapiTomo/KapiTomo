# KapiTomo

KapiTomo is a static official webtoon site for your own free works. It has a hero page, searchable library, genre filters, chapter reader, download links, and a small creator setup section.

## Edit your works

Update `data/works.js`:

- `title`: work title.
- `genre`: category used by the filter buttons.
- `cover`: image path inside `assets`.
- `download`: public file path inside `downloads`.
- `description`: library summary.
- `chapters`: reader content.

Put cover images in `assets` and downloadable files in `downloads`.

## Open locally

Open `index.html` in a browser.

## Publish for free

GitHub Pages can host this static site without a paid domain:

Expected public URL after publishing:

`https://nanquimori.github.io/KapiTomo/`

Steps:

1. Create a public GitHub repository named `KapiTomo`.
2. Push these files to the `main` branch.
3. Open repository `Settings`.
4. Go to `Pages`.
5. Choose `Deploy from a branch`.
6. Select branch `main` and folder `/root`.
7. Save and wait for GitHub to show the public URL.

You can later connect a custom domain, but it is optional.
