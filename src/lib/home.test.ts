import { test } from "node:test";
import assert from "node:assert/strict";
import { byAuthor, recent } from "./home.ts";

const books = [
  { id: 1, author: "x", added: "2026-11-20" },
  { id: 2, author: "y", added: "2026-11-24" },
  { id: 3, author: "x" },
  { id: 4, author: "x", added: "2026-11-24" },
];

test("recent: newest first, same day by higher id, undated left out, capped", () => {
  assert.deepEqual(recent(books).map((b) => b.id), [4, 2, 1]);
  assert.deepEqual(recent(books, 2).map((b) => b.id), [4, 2]);
});

test("byAuthor: one group per author, larger groups first, book order kept", () => {
  assert.deepEqual(byAuthor(books).map((g) => g.map((b) => b.id)), [[1, 3, 4], [2]]);
});

test("byAuthor: same Bangla author line groups together even if Turath's Arabic differs by a space", () => {
  const two = [{ id: 1, author: "(ت ٢٨١هـ)", author_bn: "ইমাম ক" }, { id: 2, author: "(ت ٢٨١ هـ)", author_bn: "ইমাম  ক" }];
  assert.equal(byAuthor(two).length, 1);
});
