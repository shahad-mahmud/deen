# Translation instructions (for Antigravity / Gemini)

Translate classical Arabic Islamic texts into modern, fluent Bangla that reads naturally, not like a word-for-word translation. These are Islamic books: wherever Bangla-speaking Muslims already use an established Islamic term, use that term instead of translating the Arabic literally (see rule 7).

## Files

- Input (do not edit): `content/<book_id>/ar/NNNN.txt`, one file per Turath page (`0004.txt` = https://app.turath.io/book/<book_id>?page=4).
- Output: `content/<book_id>/bn/NNNN.md`, with **the same 4-digit number**. One output file per input file.
- Translate only the pages you were asked for (e.g. "translate 6848 pages 1–20"). Skip pages whose `bn` file already exists unless asked to redo them.

## Output format

- **Short, readable paragraphs** separated by a blank line. The Arabic is one long run-on block; split it into paragraphs wherever the topic or speaker changes (opening praise, a new point, each ayah, each hadith, the author's explanation after it).
- An Arabic line starting with `## ` is a chapter heading. Translate it as a `## ` line too. **Use `## ` only for these lines: exactly one `## ` per Arabic `## `, in the same order, and no other `#`/`###` headings anywhere.** The site uses them to split chapters and to build the Bangla table of contents; an extra or missing heading makes that page fall back to the Arabic title. When the author introduces distinct numbered types or sub-sections inline (e.g. শিরকের প্রথম প্রকার / দ্বিতীয় প্রকার), you may add a short `**bold**` subheading line on its own paragraph to make it scannable.
- **Quran ayat** go in their own quote block: the Bangla meaning in quotes (not bold), then the reference in italics. Put the sentence that introduces the ayah ("আল্লাহ তাআলা বলেন:") as its own paragraph just before it:

  ```markdown
  মহান আল্লাহ ... ক্ষমা করে দেবেন। আল্লাহ তাআলা বলেন:

  > "তোমাদেরকে যেসব বড় গুনাহ থেকে নিষেধ করা হয়েছে, তোমরা যদি সেগুলো থেকে বেঁচে থাকো, তবে আমি তোমাদের (ছোট) পাপগুলো মোচন করে দেব এবং তোমাদেরকে সম্মানজনক স্থানে (জান্নাতে) প্রবেশ করাব।" *(সূরা আন-নিসা: ৩১)*

  এই আয়াতের মাধ্যমে ...
  ```

- **Hadith** use the same quote block: the words of the hadith in quotes (not bold), with the sentence that introduces it ("রাসূলুল্লাহ (সা.) ইরশাদ করেছেন:") as its own paragraph just before it. If the hadith lists items, put each item on its own line inside the quote block, numbered with Bangla digits. Narration inside the hadith ("অতঃপর তিনি সেগুলো উল্লেখ করলেন:") is plain text, not italic. Add a source in italics *only if the Arabic names it* (see rule 4):

  ```markdown
  তাঁরা নবী করিম (সা.)-এর এই হাদিসটিকে দলিল হিসেবে পেশ করেন, যেখানে তিনি বলেছেন:

  > "তোমরা সাতটি ধ্বংসাত্মক কাজ (কবিরা গুনাহ) থেকে বেঁচে থাকো।"
  > অতঃপর তিনি সেগুলো উল্লেখ করলেন:
  > ১. আল্লাহর সাথে শিরক করা,
  > ২. জাদু করা,
  > ...
  ```

- Allowed markdown: `## ` headings, `> ` quote blocks, `**bold**`, `*italic*`. Nothing else: no lists, tables or links, no front-matter, no file-level title.
- Do **not** add your own introduction, summary, commentary, "Here is the translation" text, or a closing source/page line (the site already shows the book and page).

See `content/6848/bn/0001.md` for a complete example page.

## Rules

1. **Translate everything on the page, faithfully.** Do not skip, shorten, summarise or soften anything.
2. **Pages break mid-sentence.** If the page starts or ends mid-sentence, translate the fragment as it is and mark the break with `…`.
3. **Quran verses** appear in `﴿ … ﴾` in the Arabic. Give the Bangla *meaning* in the quote-block format above. Add the reference `*(সূরা <নাম>: <আয়াত নং>)*` only if you are certain of it. Follow established Bangla translations of the meaning (e.g. Islamic Foundation, Bayan Foundation style).
4. **Hadith:** translate the wording closely. Keep narrator names. **Never add a source, collection name or grading that is not in the Arabic** (no "(সহিহ মুসলিম)" or "(সহিহ বুখারি)" unless the author wrote it on this page), and never remove one that is there. Readers must be able to trust that every reference shown comes from the author.
5. **Honorifics** (the usual Bangla short forms): ﷺ / صلى الله عليه وسلم → `(সা.)`, رضي الله عنه/عنها/عنهم → `(রা.)`, رحمه الله → `(রহ.)`, عليه السلام → `(আ.)`, تعالى after Allah → `তাআলা`, عز وجل → `আযযা ওয়া জাল্লা`.
6. **Names:** use standard Bangla Islamic spelling (আবু হুরায়রা, ইবনে আব্বাস, উমর ইবনুল খাত্তাব).
7. **Islamic terms: use the conventional Bangla form, don't translate them.** Use the words Bangla-speaking Muslims and Bangla Islamic books already use: নামাজ/সালাত, রোজা, যাকাত, হজ, ওযু, জান্নাত, জাহান্নাম, কিয়ামত, ঈমান, তাকওয়া, শিরক, কুফর, গুনাহ, সওয়াব, তাওবা, হালাল, হারাম, সুন্নাত, বিদআত, ইবাদত, দোয়া, আখিরাত, দুনিয়া. For example, write "জান্নাত", not "বাগান" or "স্বর্গ", and "সওয়াব", not "পুরস্কার". Prefer modern Bangla spellings (`কবিরা`, `সগিরা`, `হাদিস`, `শরিয়ত`, `এতিম`, `সহিহ`, `লানত`) over older `ী`-heavy forms. If a term may be unfamiliar to a general reader, add a short meaning in brackets the first time it appears on a page, e.g. রিয়া (লোক দেখানো আমল), হদ (শরিয়ত নির্ধারিত শাস্তি), কবিরা গুনাহ (বড় গুনাহ).
8. Empty `()` in the Arabic are leftover footnote markers. Ignore them.
9. If a word or phrase is genuinely unclear, translate your best reading and put `[?]` right after it. Never invent content.
10. **Style:** modern, fluent written Bangla (চলিত ভাষা). Restructure sentences so they read naturally in Bangla with complete verb phrases (e.g. "কাফফারা হয়ে যায়" rather than literal noun-heavy calques) while keeping the full meaning. Use natural Bangla Islamic phrasing where appropriate (e.g. "ইরশাদ করেছেন", "উলামায়ে কেরাম", "নবী করিম (সা.)"). Avoid heavy Sanskritised words where a common Islamic or everyday word exists (prefer "আল্লাহ", not "ঈশ্বর"; "নবী/রাসূল", not "অবতার"), and avoid colloquial or regional speech.
11. **More conventional terms for this kind of book:** الكبائر → কবিরা গুনাহ, الصغائر → সগিরা গুনাহ, الرياء → রিয়া, الشرك الأكبر / الأصغر → শিরকে আকবার / শিরকে আসগার, السلف الصالح → সালাফে সালেহিন, الحد → হদ, اللعن → লানত, المرتد / من بدل دينه → মুরতাদ, الصوم → সাওম/রোজা.
12. **Tone:** keep the solemn, reverent, scholarly tone of the original while staying fluent; never casual.
13. **Short sayings** (a line from a Companion, a scholar or a short phrase quoted mid-argument) stay inside the paragraph in quotation marks. Only ayat and hadith get their own quote block.
14. **Continuity:** before translating page N, read the end of `bn/<N-1>.md` (if it exists) so a sentence broken across pages continues seamlessly and terms and names stay consistent with earlier pages.

## After translating

```bash
npm test && npm run build   # must pass; a broken file fails the build
```

Commit only the new/changed `content/<book_id>/bn/*.md` files on a branch and open a PR.
