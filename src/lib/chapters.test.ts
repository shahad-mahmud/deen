import { test } from "node:test";
import assert from "node:assert/strict";
import { buildChapters, slice } from "./chapters.ts";

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
