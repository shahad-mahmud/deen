// Home page: "continue reading" from this browser's saved positions, and full-text search (Pagefind index built into dist/pagefind/).
const bnNum = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

// Search
const input = document.getElementById("q");
const status = document.getElementById("search-status");
const list = document.getElementById("search-results");
let pagefind, timer, seq = 0;
const PAGEFIND = "/pagefind/pagefind.js"; // a variable, so Vite (astro dev) doesn't try to resolve it
// A failed load is forgotten, so the next search tries again (e.g. after a dropped connection).
const load = () => (pagefind ??= import(/* @vite-ignore */ PAGEFIND).catch((e) => { pagefind = undefined; throw e; }));

async function run(q) {
  const mine = ++seq; // a slower earlier query must not overwrite a newer one
  list.replaceChildren();
  if (!q.trim()) { status.textContent = ""; return; }
  status.textContent = "খোঁজা হচ্ছে…";
  try {
    const search = await (await load()).search(q);
    const top = await Promise.all(search.results.slice(0, 20).map((r) => r.data()));
    if (mine !== seq) return;
    status.textContent = search.results.length ? `${bnNum(search.results.length)}টি পৃষ্ঠা পাওয়া গেছে${search.results.length > 20 ? ", প্রথম ২০টি দেখানো হলো" : ""}` : "কিছু পাওয়া যায়নি।";
    for (const r of top) {
      const li = document.createElement("li");
      li.append(Object.assign(document.createElement("a"), { href: r.url, textContent: r.meta.title }));
      const p = document.createElement("p");
      p.innerHTML = r.excerpt; // excerpt of our own built pages, with Pagefind's <mark> around matches
      li.append(p);
      list.append(li);
    }
  } catch (e) {
    console.error("search failed", e);
    if (mine === seq) status.textContent = location.hostname === "localhost" ? "সার্চ ইনডেক্স শুধু বিল্ড করা সাইটে থাকে (npm run build && npm run preview)।" : "খোঁজা যাচ্ছে না। সংযোগ দেখে আবার চেষ্টা করুন।";
  }
}
input.addEventListener("focus", () => load().catch(() => {}), { once: true }); // warm up; run() reports a failure
input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => run(input.value), 250); });
document.getElementById("search").addEventListener("submit", (e) => { e.preventDefault(); clearTimeout(timer); run(input.value); input.blur(); }); // Enter / mobile "Go"
const focusSearch = () => location.hash === "#search" && input.focus();
focusSearch();
addEventListener("hashchange", focusSearch); // header search button while already on the home page

// Continue reading: reader.js saves last:<book id> = {url, title, mark, at}. Show the 3 most recently read books.
const cont = document.getElementById("continue");
const read = (id) => { try { return JSON.parse(localStorage.getItem(`last:${id}`) || "null"); } catch { return null; } };
const seen = [...document.querySelectorAll("a[data-book]")]
  .map((a) => ({ a, last: read(a.dataset.book) }))
  .filter((x) => typeof x.last?.url === "string" && typeof x.last.title === "string")
  .sort((x, y) => (y.last.at || 0) - (x.last.at || 0))
  .slice(0, 3);
for (const { a, last } of seen) {
  const li = document.createElement("li");
  const link = Object.assign(document.createElement("a"), { href: last.url, textContent: a.textContent });
  const where = [...last.title.split(" — "), last.mark].filter((s) => s && s !== a.textContent).join(" · ");
  li.append(link);
  if (where) li.append(Object.assign(document.createElement("small"), { className: "note", textContent: ` — ${where}` }));
  cont.querySelector("ul").append(li);
}
cont.hidden = seen.length === 0;
