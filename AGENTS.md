# Instructions for AI agents

This repo publishes Bangla translations of classical Arabic Islamic books. Before you translate or edit anything under `content/<book_id>/bn/`, read **[docs/TRANSLATING.md](docs/TRANSLATING.md)**. It holds the file format and the translation rules, and it overrides anything here when the two disagree.

## Bulk translation: batches, each translated by one subagent and reviewed by another

When asked to translate more than a few pages (e.g. "translate 6848 pages 51–100"), do not translate them all in one go. Work in batches:

1. **Size the batch.** The default is **5 pages**. Size by the Arabic text, not the page count: a batch should be about 7,000 Arabic characters (`wc -m content/<id>/ar/NNNN.txt`; a typical page is ~1,400). So use 3–4 pages when they are long and 6–8 when they are short. Never split a page across batches.
2. **Translate with a subagent.** Give one subagent only that batch: the page numbers, the path to `docs/TRANSLATING.md`, and the last page of the previous batch to read for continuity (rule 14). It writes `content/<id>/bn/NNNN.md` for each page.
3. **Review with a second, separate subagent.** It did not write the batch, and it compares every `bn` page against its `ar` page. It checks:
   - **Correctness:** nothing skipped, shortened, softened or added; page-break fragments marked with `…`; one `## ` per Arabic `## `.
   - **Misinterpretation:** sentences whose meaning has changed, such as a negation lost, the wrong subject or speaker, a ruling made stronger or weaker than the Arabic, or a scholar's view presented as the author's.
   - **Quran:** every `﴿ … ﴾` in the Arabic is rendered as an ayah quote block. The meaning matches the ayah. Each `*(সূরা <নাম>: <আয়াত>)*` reference names the right surah and ayah number; if the reviewer is not certain, it flags the reference for removal.
   - **Hadith:** the wording is close and the narrator names are correct. The source, collection or grading is shown **only** if the Arabic names it on that page, and none is dropped (e.g. `الصحيحين` / `متفق عليه` = সহিহ বুখারি ও সহিহ মুসলিম, `في السنن` = সুনান গ্রন্থসমূহ).
   - **Other books and people:** names of scholars, Companions, books and places are rendered correctly and consistently with earlier pages.

   The reviewer returns a list of issues, each with the page, the Arabic, the current Bangla and the fix. It changes nothing itself.
4. **Fix, then verify.** Apply the fixes (or send them back to the translating subagent). Then run `npm test && npm run build`.
5. **Next batch.** Start it only after the previous batch is fixed, because each batch continues from the previous batch's last page.

Commit only the `content/<id>/bn/*.md` files, on a branch, and open a PR (see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)). Never edit `content/<id>/ar/`; it is the source text.
