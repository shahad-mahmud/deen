"""Download a Turath book's Arabic text into content/<id>/ar/NNNN.txt (one file per Turath page).

Usage: python3 scripts/fetch.py 6848
Uses the same single JSON file the Turath app downloads for offline reading (one request per book).
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TITLE_SPAN = re.compile(r'<span data-type="title"[^>]*>(.*?)</span>', re.S)


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "deen-reader (personal study site)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


# Honorific ligature code points most Arabic web fonts lack (render as a box); ﷺ is kept, Amiri has it.
HONORIFICS = {
    "﵀": "رحمه الله", "﵁": "رضي الله عنه", "﵂": "رضي الله عنها", "﵃": "رضي الله عنهم",
    "﵄": "رضي الله عنهما", "﵇": "عليه السلام", "﵈": "عليهم السلام", "﵊": "عليه الصلاة والسلام",
    "﵍": "عليها السلام", "﵎": "تبارك وتعالى", "﵏": "رحمهم الله", "﷾": "سبحانه وتعالى",
    "﷿": "عز وجل",
}


def clean(text):
    text = TITLE_SPAN.sub(lambda m: "\n## " + m.group(1).strip() + "\n", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"[ \t]*⦗[٠-٩]+⦘[ \t]*", " ", text)  # inline printed-page markers; the site doesn't use them
    for ch, words in HONORIFICS.items():
        text = text.replace(ch, f" {words} ")
    text = re.sub(r" {2,}", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"


DIACRITICS = re.compile("[\u064b-\u0652\u0670]")


def mark_headings(text, titles):
    """Some books put a TOC heading on a plain line instead of a title span; mark that line `## `."""
    lines = text.split("\n")
    for title in titles:
        words = DIACRITICS.sub("", title).split()[:4]
        if any(l.startswith("## ") and DIACRITICS.sub("", l)[3:].split()[:4] == words for l in lines):
            continue
        for i, l in enumerate(lines):
            if not l.startswith("## ") and DIACRITICS.sub("", l).split()[:4] == words:
                lines[i] = "## " + l
                break
    return "\n".join(lines)


def main(book_id):
    book = get(f"https://files.turath.io/books-v3/{book_id}.json")
    meta = get(f"https://api.turath.io/book?id={book_id}&include=indexes&ver=3")
    pages = book["pages"]
    out = ROOT / "content" / str(book_id)
    (out / "ar").mkdir(parents=True, exist_ok=True)
    (out / "bn").mkdir(exist_ok=True)
    titles = {}
    for h in meta["indexes"]["headings"]:
        titles.setdefault(h["page"], []).append(h["title"])
    for i, p in enumerate(pages, 1):
        (out / "ar" / f"{i:04d}.txt").write_text(mark_headings(clean(p["text"]), titles.get(i, [])), encoding="utf-8")
    info = meta["meta"].get("info") or ""
    author = re.search(r"المؤلف:\s*(.+)", info)
    (out / "meta.json").write_text(json.dumps({
        "id": int(book_id),
        "name": meta["meta"]["name"],
        "author": author.group(1).strip() if author else "",
        "info": info,
        "printed_pages": [p.get("page") for p in pages],
        "headings": meta["indexes"]["headings"],  # "page" is the 1-based Turath page index
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    book_json = out / "book.json"
    if not book_json.exists():  # hand-edited Bangla title/notes; never overwrite
        book_json.write_text(json.dumps({"title_bn": "", "note_bn": ""}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{meta['meta']['name']}: {len(pages)} pages -> {out}")


if __name__ == "__main__":
    main(sys.argv[1])
