export function clearElement(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function appendChildren(node, children) {
  const items = Array.isArray(children) ? children : [children];
  for (const child of items) {
    if (child === null || child === undefined || child === false) {
      continue;
    }

    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function createElement(tagName, options = {}, children = []) {
  const node = document.createElement(tagName);

  if (options.className) {
    node.className = options.className;
  }

  if (options.text !== undefined) {
    node.textContent = options.text;
  }

  if (options.id) {
    node.id = options.id;
  }

  if (options.attributes) {
    for (const [key, value] of Object.entries(options.attributes)) {
      if (value !== undefined && value !== null) {
        node.setAttribute(key, String(value));
      }
    }
  }

  if (options.dataset) {
    for (const [key, value] of Object.entries(options.dataset)) {
      if (value !== undefined) {
        node.dataset[key] = String(value);
      }
    }
  }

  if (options.listeners) {
    for (const [eventName, handler] of Object.entries(options.listeners)) {
      node.addEventListener(eventName, handler);
    }
  }

  appendChildren(node, children);
  return node;
}

export function createList(items, { ordered = false, className = "" } = {}) {
  const list = createElement(ordered ? "ol" : "ul", { className });
  for (const item of items) {
    list.appendChild(createElement("li", { text: item }));
  }
  return list;
}

export function createSectionHeader({ eyebrow, title, intro, headingId }) {
  const container = createElement("div", { className: "section-heading-row" });
  const textWrap = createElement("div");
  textWrap.appendChild(createElement("span", { className: "section-tag", text: eyebrow }));
  textWrap.appendChild(createElement("h2", { text: title, id: headingId }));
  textWrap.appendChild(createElement("p", { className: "section-intro", text: intro }));
  container.appendChild(textWrap);
  return container;
}
