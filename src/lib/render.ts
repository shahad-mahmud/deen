// Tiny markdown subset used by both ar/*.txt and bn/*.md: blank-line paragraphs,
// "#".."######" headings (all rendered as h2), "> " quotes, **bold**, *italic*. Everything is HTML-escaped first.
const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);
// Some Turath text carries literal entities (&quot; in 13180 and others); decode them so they are not escaped twice.
const DECODE: Record<string, string> = { quot: '"', lt: "<", gt: ">", amp: "&" };
const decode = (s: string) => s.replace(/&(quot|lt|gt|amp);/g, (_, e) => DECODE[e]);

export function renderBlocks(text: string): string {
  return text
    .replace(/([^\n])\n#{1,6}[ \t]+/g, "$1\n") // a title glued to a paragraph is highlighted hadith text (e.g. 8207, 13113), not a heading
    .replace(/^#{1,6}\s.*$/gm, "\n\n$&\n\n")
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block) => {
      let tag = "p";
      let body = block;
      const heading = block.match(/^#{1,6}\s+([\s\S]*)$/);
      if (heading) [tag, body] = ["h2", heading[1].replace(/^\*\*(.*)\*\*$/, "$1")];
      else if (block.startsWith(">")) [tag, body] = ["blockquote", block.replace(/^>[ \t]?/gm, "")];
      body = escape(decode(body))
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");
      return `<${tag}>${body}</${tag}>`;
    })
    .join("\n");
}

const BN = "০১২৩৪৫৬৭৮৯";
export const bnNum = (n: number | string) => String(n).replace(/\d/g, (d) => BN[+d]);
