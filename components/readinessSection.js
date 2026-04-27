import { evaluateReadinessChecklist } from "../../src/services/readinessService.js";
import { createElement, createList, clearElement, createSectionHeader } from "../scripts/utils/dom.js";

export function renderSection(host, state) {
  const copy = state.copy;

  clearElement(host);
  host.setAttribute("aria-busy", "false");

  const section = createElement("div", { className: "section-card fade-in" });
  section.appendChild(
    createSectionHeader({
      eyebrow: copy.readiness.eyebrow,
      title: copy.readiness.title,
      intro: copy.readiness.intro,
      headingId: "readiness-heading"
    })
  );

  const checklistGrid = createElement("div", {
    className: "readiness-grid",
    attributes: { role: "group", "aria-label": copy.readiness.title }
  });

  const answerKeys = Object.keys(state.ui.readinessAnswers);
  answerKeys.forEach((key, index) => {
    const active = state.ui.readinessAnswers[key];
    checklistGrid.appendChild(
      createElement(
        "button",
        {
          className: "toggle-card",
          attributes: {
            type: "button",
            "aria-pressed": String(active)
          },
          listeners: {
            click: () => {
              state.ui.readinessAnswers[key] = !state.ui.readinessAnswers[key];
              renderSection(host, state);
            }
          }
        },
        [
          createElement("p", { className: "quiz-label", text: `Check ${index + 1}` }),
          createElement("h3", { text: copy.readiness.items[index] })
        ]
      )
    );
  });

  section.appendChild(checklistGrid);

  const result = evaluateReadinessChecklist(state.ui.readinessAnswers, state.language);
  const resultCard = createElement("article", {
    className: "result-card",
    attributes: { "aria-live": "polite" }
  });
  resultCard.appendChild(
    createElement("div", { className: "readiness-score" }, [
      createElement("span", { className: "score-ring", text: String(result.score) }),
      createElement("div", {}, [
        createElement("h3", { text: result.level }),
        createElement("p", { text: result.summary })
      ])
    ])
  );
  resultCard.appendChild(createList(result.suggestions));
  section.appendChild(resultCard);

  const actionRow = createElement("div", { className: "readiness-actions" });
  actionRow.appendChild(
    createElement("button", {
      className: "reset-button",
      text: copy.readiness.reset,
      attributes: { type: "button" },
      listeners: {
        click: () => {
          for (const key of answerKeys) {
            state.ui.readinessAnswers[key] = false;
          }
          renderSection(host, state);
        }
      }
    })
  );
  section.appendChild(actionRow);
  host.appendChild(section);
}
