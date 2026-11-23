import { test } from "node:test";
import assert from "node:assert/strict";
import { renderBlocks, bnNum } from "./render.ts";

test("renderBlocks escapes HTML and supports the subset", () => {
  assert.equal(
    renderBlocks("## a<b\n\nx **y**\nz\n\n> q"),
    "<h2>a&lt;b</h2>\n<p>x <strong>y</strong><br>z</p>\n<blockquote>q</blockquote>",
  );
  assert.equal(renderBlocks('<script>alert("x")</script>'), "<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>");
  // Gemini-style: bold heading, ayah quote with italic reference
  assert.equal(
    renderBlocks('### **কবিরা গুনাহ**\n\n> **"আয়াত"** *(সূরা আন-নিসা: ৩১)*'),
    '<h2>কবিরা গুনাহ</h2>\n<blockquote><strong>&quot;আয়াত&quot;</strong> <em>(সূরা আন-নিসা: ৩১)</em></blockquote>',
  );
});

test("renderBlocks: a heading line glued to a paragraph is still a heading", () => {
  assert.equal(renderBlocks("isnad:\n## matn\nrest"), "<p>isnad:</p>\n<h2>matn</h2>\n<p>rest</p>");
});

test("bnNum", () => assert.equal(bnNum(234), "২৩৪"));
