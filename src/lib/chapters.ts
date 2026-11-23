// Groups Turath pages into chapters (level-1 TOC headings) so a chapter reads continuously.
// Pure functions only; books.ts feeds them file contents.

export type TocHeading = { title: string; level: number; page: number };
export type Segment = { page: number; ar: string; bn: string | null }; // bn null = not translated yet
export type SubHeading = { title_ar: string; title_bn: string | null; page: number };
export type Chapter = {
  no: number; // 1-based
  title_ar: string;
  title_bn: string | null;
  segments: Segment[];
  subs: SubHeading[];
};

// A heading glued to a paragraph (no blank line) is a title highlighted inside a report (e.g. book 13113),
// not a section break, so it never cuts a page, and render.ts shows it as plain text.
const blocks = (t: string) => t.trim().split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
const isHead = (b: string) => /^#{1,6}\s/.test(b);
export const headingTexts = (t: string) =>
  blocks(t).filter(isHead).map((b) => b.replace(/^#+\s+/, "").replace(/^\*\*(.*)\*\*$/, "$1").trim());

/** Blocks from the `from`-th heading (null = page start) up to, not including, the `to`-th heading (null = page end). */
export function slice(t: string, from: number | null, to: number | null): string {
  const bs = blocks(t);
  const hi = bs.flatMap((b, i) => (isHead(b) ? [i] : []));
  return bs.slice(from == null ? 0 : hi[from], to == null ? bs.length : hi[to]).join("\n\n");
}

export function buildChapters(
  total: number,
  toc: TocHeading[],
  ar: (n: number) => string,
  bn: (n: number) => string | null,
): Chapter[] {
  const onPage = new Map<number, number>(); // toc headings per page
  const pos = toc.map((h) => {
    const idx = onPage.get(h.page) ?? 0;
    onPage.set(h.page, idx + 1);
    return { ...h, idx };
  });
  const count = (n: number) => onPage.get(n) ?? 0;
  // A page can be cut at its headings only if both texts mark exactly the TOC's headings.
  const splittable = (n: number) => {
    const b = bn(n);
    return headingTexts(ar(n)).length === count(n) && (b == null || headingTexts(b).length === count(n));
  };
  const bnTitle = (n: number, idx: number) => {
    const b = bn(n);
    const hs = b ? headingTexts(b) : [];
    return hs.length === count(n) ? hs[idx] : null;
  };

  type Point = { page: number; idx: number | null };
  const starts: { at: Point; title_ar: string; title_bn: string | null }[] = [
    { at: { page: 1, idx: null }, title_ar: "مقدمة", title_bn: "ভূমিকা" },
    ...pos.filter((h) => h.level === 1).map((h) => ({ at: { page: h.page, idx: h.idx }, title_ar: h.title, title_bn: bnTitle(h.page, h.idx) })),
  ];

  const chapters: Chapter[] = [];
  starts.forEach((s, k) => {
    const end: Point | null = starts[k + 1]?.at ?? null;
    const segments: Segment[] = [];
    const subs: SubHeading[] = [];
    for (let n = s.at.page; n <= (end ? end.page : total); n++) {
      const from = n === s.at.page ? s.at.idx : null;
      const to = end && n === end.page ? end.idx : null;
      let a: string, b: string | null, lo: number, hi: number; // [lo, hi) = TOC headings on this page covered
      if (splittable(n)) {
        a = slice(ar(n), from, to);
        const raw = bn(n);
        b = raw == null ? null : slice(raw, from, to);
        [lo, hi] = [from ?? 0, to ?? count(n)];
      } else if (to != null) {
        continue; // unsplittable page belongs wholly to the last chapter starting on it
      } else {
        [a, b, lo, hi] = [ar(n), bn(n), 0, count(n)];
      }
      if (!a.trim()) continue;
      segments.push({ page: n, ar: a, bn: b });
      for (const h of pos)
        if (h.page === n && h.level > 1 && h.idx >= lo && h.idx < hi)
          subs.push({ title_ar: h.title, title_bn: bnTitle(n, h.idx), page: n });
    }
    if (segments.length) chapters.push({ no: 0, title_ar: s.title_ar, title_bn: s.title_bn, segments, subs });
  });
  chapters.forEach((c, i) => (c.no = i + 1));
  return chapters;
}
