// Reader conveniences. Every preference lives only in this browser's localStorage.
const root = document.documentElement;
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode: preference just isn't remembered */ } },
};

// Light/dark
document.getElementById("theme")?.addEventListener("click", () => {
  const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.theme = cur === "dark" ? "light" : "dark";
  store.set("theme", root.dataset.theme);
});

// Text size (A− / A+)
for (const btn of document.querySelectorAll("[data-fs]")) {
  btn.addEventListener("click", () => {
    const now = parseFloat(getComputedStyle(document.body).fontSize);
    const next = Math.min(28, Math.max(14, now + Number(btn.dataset.fs)));
    root.style.setProperty("--fs", `${next}px`);
    store.set("fs", String(next));
  });
}

// Arabic column on/off
const ar = document.getElementById("ar-toggle");
if (ar) {
  const sync = () => ar.setAttribute("aria-pressed", String(root.dataset.ar === "on"));
  sync();
  ar.addEventListener("click", () => {
    if (root.dataset.ar === "on") delete root.dataset.ar;
    else root.dataset.ar = "on";
    store.set("ar", root.dataset.ar || "off");
    sync();
  });
}

// Previous/next with arrow keys and horizontal swipe; targets are the pager's rel links.
const go = (rel) => {
  const a = document.querySelector(`a[rel="${rel}"]`);
  if (a) location.href = a.href;
};
addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (e.key === "ArrowLeft") go("prev");
  if (e.key === "ArrowRight") go("next");
});
let touch = null;
addEventListener("touchstart", (e) => { touch = e.touches.length === 1 ? e.touches[0] : null; }, { passive: true });
addEventListener("touchend", (e) => {
  if (!touch || String(getSelection())) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touch.clientX, dy = t.clientY - touch.clientY;
  if (Math.abs(dx) > 90 && Math.abs(dx) > 2.5 * Math.abs(dy)) go(dx < 0 ? "next" : "prev");
  touch = null;
}, { passive: true });

// Remember reading position per book ("continue where you left off" on the book page).
const book = document.body.dataset.resume;
if (book) {
  const marks = [...document.querySelectorAll(".pmark")];
  const save = () => {
    const passed = marks.filter((m) => m.getBoundingClientRect().top < 140).at(-1);
    const where = passed ? `#${passed.id}` : "";
    store.set(`last:${book}`, JSON.stringify({ url: location.pathname + where, title: document.title, mark: passed?.textContent.trim() || "" }));
  };
  save();
  let queued = false;
  addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; save(); }, 500);
  }, { passive: true });
}
const resume = document.getElementById("resume");
if (resume) {
  try {
    const last = JSON.parse(store.get(`last:${resume.dataset.book}`) || "null");
    if (last?.url) {
      resume.href = last.url;
      resume.querySelector("small").textContent = [last.title.split(" — ")[0], last.mark].filter(Boolean).join(" · ");
      resume.hidden = false;
    }
  } catch { /* corrupt entry: just don't offer resume */ }
}
