/* Tiny DOM helpers shared by every renderer.

   The redesign dropped Web Components and Shadow DOM: with no <slot>, no
   ::slotted and no ::part anywhere in the old build, the shadow boundary
   bought nothing and cost a duplicated stylesheet per component. What is
   left is plain functions that return elements, which one stylesheet can
   style and which a WordPress theme cannot break by wrapping them.

   Everything here builds nodes and sets textContent. Nothing interpolates
   content into an HTML string, so content coming from js/data (and later
   from WordPress) can never be parsed as markup. */

/**
 * Create an element.
 * @param {string} tag
 * @param {Object} [props] - `class`, `text`, `html` (trusted markup only),
 *   `dataset`, or any attribute name. `null`/`undefined` values are skipped,
 *   so callers can pass optional data straight through.
 * @param {Array<Node|string|null|undefined>} [children]
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === "text") {
      node.textContent = value;
    } else if (key === "html") {
      // Only ever called with markup this repo authors (icon SVGs from
      // js/data/icons.js), never with content from data or from WordPress.
      node.innerHTML = value;
    } else if (key === "dataset") {
      Object.assign(node.dataset, value);
    } else if (key === "class") {
      node.className = value;
    } else if (key === "style") {
      node.setAttribute("style", value);
    } else if (key in node && typeof node[key] !== "object") {
      node[key] = value;
    } else {
      node.setAttribute(key, value);
    }
  }

  append(node, children);
  return node;
}

/** Append children, skipping empty ones so callers can use `cond && node`. */
export function append(parent, children) {
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child);
  }
  return parent;
}

/** Replace a node's children in one go. */
export function fill(parent, children) {
  parent.replaceChildren();
  return append(parent, children);
}

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/**
 * Mount a renderer into every matching slot, if the slot exists.
 * Pages share a header and footer but not every section, so a page's script
 * asks for what it needs and silently skips what this page does not have.
 */
export function mount(selector, render) {
  const target = $(selector);
  if (!target) return null;
  fill(target, render());
  return target;
}
