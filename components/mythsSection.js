import { createElement, createList, clearElement, createSectionHeader } from "../scripts/utils/dom.js";

export function renderSection(host, state) {
  const copy = state.copy;
  const tips = copy.myths.tips || state.bootstrap.fakeNewsTips;

  clearElement(host);
  host.setAttribute("aria-busy", "false");

  const section = createElement("div", { className: "section-card fade-in" });
  section.appendChild(
    createSectionHeader({
      eyebrow: copy.myths.eyebrow,
      title: copy.myths.title,
      intro: copy.myths.intro,
      headingId: "myths-heading"
    })
  );

  const grid = createElement("div", { className: "myth-grid" });
  tips.forEach((tip, index) => {
    const card = createElement("article", { className: "fact-card" });
    card.appendChild(createElement("p", { className: "overview-label", text: `Check ${index + 1}` }));
    card.appendChild(createElement("h3", { text: tip }));
    card.appendChild(
      createElement("p", {
        text:
          index === 0
            ? "Start with the most authoritative source before trusting shared claims."
            : "Pause before forwarding and compare the claim against multiple trustworthy references."
      })
    );
    grid.appendChild(card);
  });

  const sourceCard = createElement("article", { className: "fact-card" });
  sourceCard.appendChild(
    createElement("h3", {
      text: state.language === "hi" ? "स्रोत जाँच की आदतें" : "Source-check habits"
    })
  );
  sourceCard.appendChild(
    createList([
      state.language === "hi"
        ? "शेयर करने से पहले तारीख, आधिकारिक नोटिस और स्रोत लिंक देखें।"
        : "Look for dates, official notices, and source links before sharing.",
      state.language === "hi"
        ? "क्रॉप किए गए स्क्रीनशॉट और क्लिप को सत्यापन से पहले अधूरा प्रमाण मानें।"
        : "Treat cropped screenshots and clips as incomplete evidence until verified.",
      state.language === "hi"
        ? "अपने क्षेत्र की पुष्टि आधिकारिक पोर्टल या हेल्प डेस्क से सुरक्षित रखें।"
        : "Save constituency-specific confirmations from official portals or help desks."
    ])
  );
  grid.appendChild(sourceCard);
  section.appendChild(grid);
  host.appendChild(section);
}
