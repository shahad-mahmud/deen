// Home page lists: newest books, and all books grouped by author.
type B = { id: number; author: string; author_bn?: string; added?: string };

// Newest first by book.json "added" (YYYY-MM-DD); books without a date never count as new.
export const recent = <T extends B>(books: T[], max = 4): T[] =>
  books.filter((b) => b.added).sort((a, b) => b.added!.localeCompare(a.added!) || b.id - a.id).slice(0, max);

// Grouped by the author line shown on the page (Turath's Arabic one can differ by a space between books
// of the same author), spaces ignored. Authors with more books come first.
export function byAuthor<T extends B>(books: T[]): T[][] {
  const groups = new Map<string, T[]>();
  for (const b of books) {
    const key = (b.author_bn || b.author).replace(/\s+/g, "");
    groups.set(key, [...(groups.get(key) ?? []), b]);
  }
  return [...groups.values()].sort((a, b) => b.length - a.length);
}
