# deen

**Read classical Arabic Islamic books in Bangla: [deen.shahadmahmud.com](https://deen.shahadmahmud.com)**

The site shows classical Arabic books from [Turath](https://app.turath.io/) with a Bangla translation next to each page. You can show the Arabic beside the Bangla, read by chapter, change the text size, switch to a dark theme, and pick up where you left off.

> ⚠️ **The Bangla is machine-translated (Gemini) and has not been checked by a scholar.** It can contain mistakes. For anything you act on, check the original Arabic (linked on every page) or ask a qualified scholar.

See the [home page](https://deen.shahadmahmud.com) for the list of books and how much of each is translated.

## Contributing

Found a wrong meaning or reference? Want to improve the Bangla or translate more pages? See **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)**. Even a one-line issue helps.

- [docs/TRANSLATING.md](docs/TRANSLATING.md): translation format and rules (for people and AI agents).
- [AGENTS.md](AGENTS.md): how AI agents run bulk translation (batches checked by two reviewers: full audit and meaning audit).

## How it works

```
content/<book_id>/
  meta.json   # fetched from Turath (title, author, headings, printed page numbers)
  book.json   # hand-written: Bangla title, author line, notes; "flat": true for a book of numbered narrations with no chapters
  ar/0001.txt # Arabic source, one file per Turath page (do not edit)
  bn/0001.md  # Bangla translation of that page
src/          # Astro site. Reading is by chapter (/<id>/ch/<n>/, built from Turath's TOC by lib/chapters.ts);
              # single pages stay at /<id>/<page>/. Fonts are self-hosted.
scripts/fetch.py  # downloads a Turath book into content/<id>/
```

It is a static [Astro](https://astro.build) site, deployed to Cloudflare Workers on every merge to `main`. PRs get a preview link.

## Credits

The Arabic text comes from [Turath](https://app.turath.io/) (the Nuqayah project, from al-Maktaba ash-Shamela).
