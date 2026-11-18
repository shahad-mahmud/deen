// Reads content/<id>/ at build time. Layout is documented in README.md.
import fs from "node:fs";
import path from "node:path";
import { buildChapters, type Chapter } from "./chapters";

const CONTENT = path.resolve("content");

export type Heading = { title: string; level: number; page: number }; // page = 1-based Turath page index
export type Book = {
  id: number;
  name: string;
  author: string;
  printed_pages: (number | null)[];
  headings: Heading[];
  title_bn: string;
  author_bn?: string;
  note_bn?: string;
  total: number;
  translated: Set<number>;
  dir: string;
  chapters: Chapter[];
  chapterOfPage: Map<number, number>; // page -> chapter no. containing its first segment
};

const pad = (n: number) => String(n).padStart(4, "0");
const read = (f: string) => fs.readFileSync(f, "utf-8");

export function loadBooks(): Book[] {
  return fs
    .readdirSync(CONTENT)
    .map((d) => path.join(CONTENT, d))
    .filter((dir) => fs.existsSync(path.join(dir, "meta.json")))
    .sort()
    .map((dir) => {
      const meta = JSON.parse(read(path.join(dir, "meta.json")));
      const extra = JSON.parse(read(path.join(dir, "book.json")));
      const total = meta.printed_pages.length;
      const translated = new Set<number>();
      for (let n = 1; n <= total; n++) if (readBn({ dir } as Book, n)) translated.add(n);
      const book = { ...meta, ...extra, title_bn: extra.title_bn || meta.name, total, translated, dir } as Book;
      book.chapters = buildChapters(total, meta.headings, (n) => readAr(book, n), (n) => readBn(book, n));
      book.chapterOfPage = new Map();
      for (const c of book.chapters) for (const s of c.segments) if (!book.chapterOfPage.has(s.page)) book.chapterOfPage.set(s.page, c.no);
      return book;
    });
}

export const readAr = (b: Book, n: number) => read(path.join(b.dir, "ar", `${pad(n)}.txt`));

export function readBn(b: Pick<Book, "dir">, n: number): string | null {
  const f = path.join(b.dir, "bn", `${pad(n)}.md`);
  const text = fs.existsSync(f) ? read(f).trim() : "";
  return text || null;
}
