import { createElement, clearElement, createSectionHeader } from "../scripts/utils/dom.js";

function getLocalizedStage(stage, index, copy) {
  const override = copy.timeline.localizedStages?.[index];
  return override ? { ...stage, ...override } : stage;
}

export function renderSection(host, state) {
  const copy = state.copy;
  const stages = state.bootstrap.timelineStages.map((stage, index) =>
    getLocalizedStage(stage, index, copy)
  );

  clearElement(host);
  host.setAttribute("aria-busy", "false");

  const section = createElement("div", { className: "section-card fade-in" });
  section.appendChild(
    createSectionHeader({
      eyebrow: copy.timeline.eyebrow,
      title: copy.timeline.title,
      intro: copy.timeline.intro,
      headingId: "timeline-heading"
    })
  );

  const stack = createElement("div", { className: "timeline-stack" });
  stages.forEach((stage, index) => {
    const card = createElement("article", { className: "timeline-card" });
    const marker = createElement("div", { className: "timeline-marker" }, [
      createElement("span", { className: "marker-dot", text: String(index + 1) }),
      index < stages.length - 1 ? createElement("span", { className: "marker-line" }) : null
    ]);

    const content = createElement("div", { className: "timeline-content" });
    content.appendChild(createElement("p", { className: "timeline-label", text: stage.date }));
    content.appendChild(createElement("h3", { text: stage.stage }));
    content.appendChild(createElement("p", { text: stage.description }));

    card.appendChild(marker);
    card.appendChild(content);
    stack.appendChild(card);
  });

  section.appendChild(stack);
  host.appendChild(section);
}
