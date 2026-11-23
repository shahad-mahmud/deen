import { test } from "node:test";
import assert from "node:assert/strict";
import { buildChapters, flatToc, slice } from "./chapters.ts";

const AR: Record<number, string> = {
  1: "intro a",
  2: "intro b\n\n## H1\n\none a",
  3: "one b\n\n## S1\n\nsub text\n\n## H2\n\ntwo a",
  4: "two b",
};
const BN: Record<number, string | null> = { 1: "ভূমিকা ক", 2: "ভূমিকা খ\n\n## অধ্যায় ১\n\nএক ক", 3: "only one heading\n\n## x", 4: null };
const toc = [
  { title: "H1", level: 1, page: 2 },
  { title: "S1", level: 2, page: 3 },
  { title: "H2", level: 1, page: 3 },
];

test("slice cuts between headings", () => {
  assert.equal(slice(AR[3], null, 0), "one b");
  assert.equal(slice(AR[3], 0, 1), "## S1\n\nsub text");
  assert.equal(slice(AR[3], 1, null), "## H2\n\ntwo a");
});

test("buildChapters splits pages at chapter headings, never loses or duplicates a page", () => {
  const ch = buildChapters(4, toc, (n) => AR[n], (n) => BN[n] ?? null);
  assert.deepEqual(ch.map((c) => c.title_bn ?? c.title_ar), ["ভূমিকা", "অধ্যায় ১", "H2"]);
  assert.deepEqual(ch[0].segments, [
    { page: 1, ar: "intro a", bn: "ভূমিকা ক" },
    { page: 2, ar: "intro b", bn: "ভূমিকা খ" },
  ]);
  assert.deepEqual(ch[1].segments.map((s) => s.page), [2]); // page 3's bn headings don't match -> page goes to H2
  assert.deepEqual(ch[2].segments.map((s) => [s.page, s.ar]), [[3, AR[3]], [4, "two b"]]);
  assert.equal(ch[2].segments[1].bn, null);
  assert.deepEqual(ch[2].subs.map((s) => s.title_ar), ["S1"]);
});

test("a heading glued to a paragraph does not cut the page", () => {
  const ar = (n: number) => ["", "١ - isnad:\n## matn one\nrest", "٢ - isnad:\n## matn two\nrest"][n];
  const ch = buildChapters(2, [{ title: "matn one", level: 1, page: 1 }, { title: "matn two", level: 1, page: 2 }], ar, () => null);
  assert.deepEqual(ch.map((c) => c.segments.map((s) => [s.page, s.ar])), [[[1, ar(1)]], [[2, ar(2)]]]);
});

test("flatToc groups a flat book into sections titled by narration numbers", () => {
  const ar = (n: number) => `${"٠١٢٣٤٥٦٧٨٩"[n]} - isnad:\n## matn\nrest`;
  const toc = flatToc(5, ar, 2);
  assert.deepEqual(toc.map((h) => [h.page, h.title_bn]), [[1, "হাদিস ১–২"], [3, "হাদিস ৩–৪"], [5, "হাদিস ৫–৫"]]);
  const ch = buildChapters(5, toc, ar, () => null);
  assert.deepEqual(ch.map((c) => [c.title_bn, c.segments.map((s) => s.page)]), [["হাদিস ১–২", [1, 2]], ["হাদিস ৩–৪", [3, 4]], ["হাদিস ৫–৫", [5]]]);
});
