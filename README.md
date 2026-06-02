# KapiTomo

KapiTomo e um site estatico oficial para publicar e ler obras autorais de leitura livre. Ele tem pagina inicial, biblioteca pesquisavel, filtros por genero, leitor de capitulos e links de download.

## Plugin oficial

O plugin oficial do KapiTomo para o Nyxovira fica em `downloads/plugins/kapitomo.zip`.

Catalogo remoto:

`https://kapitomo.github.io/KapiTomo/plugins/catalog.json`

Canal oficial:

`https://www.youtube.com/@KapiTomo`

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

## Site online

GitHub Pages hospeda este site estatico sem dominio pago.

Expected public URL after publishing:

`https://kapitomo.github.io/KapiTomo/`

Configuracao usada:

1. Create a public GitHub repository named `KapiTomo`.
2. Push these files to the `main` branch.
3. Open repository `Settings`.
4. Go to `Pages`.
5. Choose `Deploy from a branch`.
6. Select branch `main` and folder `/root`.
7. Save and wait for GitHub to show the public URL.

You can later connect a custom domain, but it is optional.
