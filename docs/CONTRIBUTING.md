# Contributing

Thank you for helping. You don't need to know how to code to report a mistake.

## Report a translation mistake

The Bangla text is machine-translated and nobody has checked it yet. If you find a wrong meaning, a missing sentence, a wrong Quran or hadith reference, or awkward Bangla, [open an issue](https://github.com/shahad-mahmud/deen/issues/new) with:

- the page link (e.g. `https://deen.shahadmahmud.com/6848/12/`);
- the sentence as it is now;
- what it should say, and why (quote the Arabic if you can).

## Fix a translation yourself

Every page is a plain Markdown file: `content/<book_id>/bn/NNNN.md` is the Bangla for Turath page `NNNN`, and `content/<book_id>/ar/NNNN.txt` is its Arabic.

1. Read [TRANSLATING.md](TRANSLATING.md). It explains the format (headings, ayah and hadith quote blocks) and the rules (Islamic terms, honorifics, never adding a hadith source the author didn't give).
2. Edit the file. For a small fix, use GitHub's ✏️ button on the file and open a pull request from there.
3. Explain the change in the PR description. If Cloudflare posts a preview link on the PR, use it to check the page.

Please edit only `bn/` files. The Arabic in `ar/` is the source and stays as it was downloaded.

## Translate new pages

Translations are made with an AI agent (Antigravity / Gemini, Claude Code, …) following [TRANSLATING.md](TRANSLATING.md). Agents doing bulk translation also follow [AGENTS.md](../AGENTS.md), which has them translate in batches of about 5 pages and have two separate reviewers (a full audit and a meaning audit) check each batch. Check the book's page on [the site](https://deen.shahadmahmud.com) for which pages are done, and open an issue first if you plan to translate a large range, so that two people don't translate the same pages.

## Add a book

```bash
python3 scripts/fetch.py <turath_book_id>   # downloads the Arabic into content/<id>/
```

Then write `content/<id>/book.json` (Bangla title, author line, optional note, and `"added"`, today's date as `YYYY-MM-DD`; see `content/6848/book.json`) and open a PR. The home page lists the newest books by `added` and groups all books by the Bangla author line, so write the author exactly as the author's other books have it. If the book is a flat collection of numbered narrations and Turath's table of contents just lists each one, add `"flat": true`: the site then groups it into sections of 10 pages instead of one chapter per narration. Only books available on [Turath](https://app.turath.io/) are supported.

### Where the Arabic comes from

`fetch.py` downloads the same single JSON file the Turath app uses for offline reading (one request per book), plus the book's table of contents and details. It writes:

```
content/<id>/
  meta.json   # name, author, Turath's info text, the printed page number of each Turath page,
              # and the table of contents (the site builds chapters from it)
  book.json   # created empty; you fill in the Bangla title, author line and note
  ar/NNNN.txt # one file per Turath page: 0004.txt = https://app.turath.io/book/<id>?page=4
  bn/         # empty; translations go here as NNNN.md
```

Each Turath page is kept as it is, with only these changes:

- Turath's title markup becomes a `## ` line. A heading that Turath doesn't mark stays a plain line.
- Other HTML tags are removed, and repeated spaces and blank lines are collapsed.
- Single-character honorific symbols (`﵁`, `﷿`, …) are written out as words (`رضي الله عنه`, `عز وجل`), because most Arabic fonts can't show them. `ﷺ` is kept.

Words, diacritics and the printed page numbers inside the text (`⦗٢٣⦘`) are never changed. **Never edit `ar/` files by hand.** Readers trust that the Arabic is exactly Turath's text. If a page looks wrong, report it rather than fixing it here.

## Run the site locally

Requires Node 22 (see `.node-version`).

```bash
npm install
npm run dev                  # http://localhost:4321
npm test && npm run build    # run before opening a PR; a malformed page fails the build
```

The site is [Astro](https://astro.build). Pages live in `src/pages/`. `src/lib/` reads `content/` and splits it into chapters using Turath's table of contents (`lib/chapters.ts`).
