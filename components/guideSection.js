import { createElement, createList, clearElement, createSectionHeader } from "../scripts/utils/dom.js";

function getLocalizedStep(step, index, copy) {
  const override = copy.guide.localizedSteps?.[index];
  return override ? { ...step, ...override } : step;
}

export function renderSection(host, state) {
  const copy = state.copy;
  const localizedSteps = state.bootstrap.guideSteps.map((step, index) =>
    getLocalizedStep(step, index, copy)
  );
  const selectedStep = localizedSteps[state.ui.guideIndex] || localizedSteps[0];

  clearElement(host);
  host.setAttribute("aria-busy", "false");

  const section = createElement("div", { className: "section-card fade-in" });
  section.appendChild(
    createSectionHeader({
      eyebrow: copy.guide.eyebrow,
      title: copy.guide.title,
      intro: copy.guide.intro,
      headingId: "guide-heading"
    })
  );

  const progressWrap = createElement("div", {
    className: "guide-progress",
    attributes: { "aria-label": copy.guide.progressLabel, role: "tablist" }
  });

  localizedSteps.forEach((step, index) => {
    const isActive = index === state.ui.guideIndex;
    const button = createElement(
      "button",
      {
        className: `progress-button${isActive ? " is-active" : ""}`,
        attributes: {
          type: "button",
          "aria-pressed": String(isActive)
        },
        listeners: {
          click: () => {
            state.ui.guideIndex = index;
            renderSection(host, state);
          }
        }
      },
      [
        createElement("span", { className: "progress-index", text: String(index + 1) }),
        createElement("span", { text: step.title })
      ]
    );
    progressWrap.appendChild(button);
  });
  section.appendChild(progressWrap);

  const focusWrap = createElement("div", { className: "guide-focus" });
  const focusCard = createElement("article", { className: "focus-card" });
  focusCard.appendChild(
    createElement("div", { className: "focus-meta" }, [
      createElement("span", { className: "focus-badge", text: copy.guide.focusLabel }),
      createElement("span", { text: `${state.ui.guideIndex + 1} / ${localizedSteps.length}` })
    ])
  );
  focusCard.appendChild(createElement("h3", { text: selectedStep.title }));
  focusCard.appendChild(createElement("p", { className: "step-summary", text: selectedStep.summary }));
  focusCard.appendChild(createList(selectedStep.details));
  focusWrap.appendChild(focusCard);

  const tipCard = createElement("aside", { className: "tip-card" });
  tipCard.appendChild(createElement("h3", { text: copy.guide.tipTitle }));
  tipCard.appendChild(createList(copy.guide.tipPoints));
  focusWrap.appendChild(tipCard);
  section.appendChild(focusWrap);

  const grid = createElement("div", { className: "guide-grid" });
  localizedSteps.forEach((step, index) => {
    const isActive = index === state.ui.guideIndex;
    const card = createElement(
      "button",
      {
        className: `guide-mini-card${isActive ? " is-active" : ""}`,
        attributes: { type: "button", "aria-pressed": String(isActive) },
        listeners: {
          click: () => {
            state.ui.guideIndex = index;
            renderSection(host, state);
          }
        }
      },
      [
        createElement("span", {
          className: "overview-label",
          text: `${state.language === "hi" ? "चरण" : "Stage"} ${index + 1}`
        }),
        createElement("h3", { text: step.title }),
        createElement("p", { text: step.summary })
      ]
    );
    grid.appendChild(card);
  });
  section.appendChild(grid);
  host.appendChild(section);
}
