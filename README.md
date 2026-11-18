# deen.shahadmahmud.com

Machine-translated (Gemini) Bangla reading pages for classical Arabic books from [Turath](https://app.turath.io/). Built with [Astro](https://astro.build), deployed on Cloudflare Pages on every merge to `main`.

```
content/<book_id>/
  meta.json   # fetched from Turath (title, author, headings, printed page numbers)
  book.json   # hand-written: Bangla title, author line, notes
  ar/0001.txt # Arabic source, one file per Turath page (do not edit)
  bn/0001.md  # Bangla translation, written by Antigravity/Gemini (see TRANSLATING.md)
src/          # Astro site. Reading is by chapter (/<id>/ch/<n>/, built from Turath's TOC by lib/chapters.ts);
              # single pages stay at /<id>/<page>/. Fonts are self-hosted via Astro's fonts config.
scripts/fetch.py
```

## Workflow

1. Add a book: `python3 scripts/fetch.py <turath_book_id>`, then fill `content/<id>/book.json`.
2. Translate on a branch: in Antigravity, *"Follow TRANSLATING.md. Translate book 6848 pages 1–10."*
3. Check locally: `npm test && npm run build` (or `npm run dev` to read it at http://localhost:4321).
4. Open a PR. Cloudflare posts a preview link on the PR; merge to publish.

## Cloudflare Pages setup (once)

Dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.

- Production branch: `main`
- Framework preset: Astro · Build command: `npm run build` · Output directory: `dist`
- Node version comes from `.node-version`.

Then project → Custom domains → add `deen.shahadmahmud.com`.
