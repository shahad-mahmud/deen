# Instructions for AI agents

This repo publishes Bangla translations of classical Arabic Islamic books. Before you translate or edit anything under `content/<book_id>/bn/`, read **[docs/TRANSLATING.md](docs/TRANSLATING.md)**. It holds the file format and the translation rules, and it overrides anything here when the two disagree.

## Bulk translation: batches, each translated by one subagent and checked by two reviewers

When asked to translate more than a few pages (e.g. "translate 6848 pages 51–100"), do not translate them all in one go. Work in batches:

1. **Size the batch.** The default is **5 pages**. Size by the Arabic text, not the page count: a batch should be about 7,000 Arabic characters (`wc -m content/<id>/ar/NNNN.txt`; a typical page is ~1,400). So use 3–4 pages when they are long and 6–8 when they are short. Never split a page across batches.
2. **Translate with a subagent.** Give one subagent only that batch: the page numbers, the path to `docs/TRANSLATING.md`, and the last page of the previous batch to read for continuity (rule 14). It writes `content/<id>/bn/NNNN.md` for each page.
3. **Review with two more subagents, run in parallel.** Neither wrote the batch, and neither changes any file. Each returns a list of issues, each with the page, the Arabic, the current Bangla and the fix, and names the pages it found clean.

   **a. Full audit (structure and rules).** For every page in the batch, it checks things that can be counted or matched against the Arabic and `docs/TRANSLATING.md`:
   - **Pages:** every page in the batch has a `bn` file.
   - **Headings:** one `## ` per Arabic `## ` that is a real heading (not a hadith or verse Turath marked as a title; see `docs/TRANSLATING.md`), in order, plus one for each table-of-contents heading the Arabic leaves unmarked (rule 16, `meta.json` `headings`). No other `#` headings.
   - **Hadith numbers:** they match the Arabic, in Bangla digits (rule 15).
   - **Sources:** every hadith source or collection in the Bangla is named in the Arabic on that page, and every one named in the Arabic is in the Bangla (rule 4).
   - **Quran:** every `﴿ … ﴾` is an ayah quote block. A `*(সূরা …)*` reference appears only where the reviewer is certain of it.
   - **Leftovers:** no untranslated Arabic and no `⦗n⦘` page numbers. No "here is the translation" text, introductions or closing lines.
   - **Format and terms:** only the allowed markdown, honorifics as in rule 5, conventional Islamic terms (rules 7 and 11; no ঈশ্বর or স্বর্গ), and `…` at page-break fragments.
   - **Length:** pages whose Bangla is much shorter or longer than usual for the Arabic. These often hide a skipped passage, or text that belongs to the previous or next page.

   **b. Meaning audit.** It reads every `bn` page alongside its `ar` page, sentence by sentence:
   - **Correctness:** nothing skipped, shortened, softened or added. Every narrator in each chain is present.
   - **Misinterpretation:** sentences whose meaning has changed, such as a lost negation, the wrong subject or speaker, a ruling or grading made stronger or weaker than the Arabic (e.g. `واهية` = very weak, not just weak), or a scholar's view presented as the author's. It also checks who narrated from whom in a chain.
   - **Quran:** the meaning matches the ayah, and each reference names the right surah and ayah number. If it is not certain, it flags the reference for removal.
   - **Hadith:** the wording is close. The author's notes on where a hadith is recorded are read correctly (which book, which chapter, from which narrator). Sources follow rule 4, e.g. `الصحيحين` / `متفق عليه` = সহিহ বুখারি ও সহিহ মুসলিম and `في السنن` = সুনান গ্রন্থসমূহ.
   - **Other books and people:** names of scholars, Companions, books and places are rendered correctly and consistently with earlier pages.
4. **Fix, then verify.** Check each finding against the Arabic, then apply the fixes (or send them back to the translating subagent). Then run `npm test && npm run build`.
5. **Next batch.** Start it only after the previous batch is fixed, because each batch continues from the previous batch's last page.

Commit only the `content/<id>/bn/*.md` files, on a branch, and open a PR (see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)).

## The Arabic source is read-only

`content/<id>/ar/` is Turath's text, downloaded by `scripts/fetch.py`. "Where the Arabic comes from" in [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) lists exactly what the script changes.

- Never edit, reformat or "fix" `ar/` files, and don't change how `fetch.py` treats the text. That includes adding missing `## ` headings, removing `⦗n⦘` page numbers and joining or splitting lines. To add a book, run `fetch.py` as it is.
- If the Arabic looks wrong or a heading isn't marked, handle it in the translation (see `docs/TRANSLATING.md`) or report it to the user. Don't change the source.
