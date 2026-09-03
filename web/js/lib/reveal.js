/* Scroll reveal for blocks.

   Deliberately small and deliberately dumb: blocks fade and lift once, then
   stop being watched. No parallax, no scroll-linked transforms, nothing that
   fights the browser's scrolling. The motion exists so a long page feels
   composed rather than dumped, not to be noticed.

   Elements are visible by default in CSS when this never runs, and the
   reduced-motion branch below skips the whole mechanism rather than running
   a zero-length transition on every block. */

const REVEALED = "is-in";

export function initReveal(root = document) {
  const targets = [...root.querySelectorAll("[data-reveal]")];
  if (targets.length === 0) return;

  // Opt the page into the hidden start state only now that something is
  // definitely here to undo it — see the note on `.js [data-reveal]`.
  document.documentElement.classList.add("js");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((node) => node.classList.add(REVEALED));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(REVEALED);
        // One-shot: re-animating on the way back up is the thing that makes
        // scroll animation feel cheap.
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((node) => observer.observe(node));
}
