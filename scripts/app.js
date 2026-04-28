import { guideSteps, timelineStages, fakeNewsTips } from "../data/electionData.js";
import { getFaqPreview } from "../services/faqService.js";
import { getCopy } from "../config/translations.js";
import { isFirebaseConfigured } from "../config/firebase.js";
import { createRenderTracker } from "../utils/renderTracker.js";

const state = {
  language: localStorage.getItem("election-assistant-language") || "en",
  theme: localStorage.getItem("election-assistant-theme") || "light",
  bootstrap: null,
  copy: getCopy(localStorage.getItem("election-assistant-language") || "en"),
  isFileMode: window.location.protocol === "file:",
  endpoints: {
  bootstrap: null,
  ask: null
  },
  ui: {
    guideIndex: 0,
    chatMessages: [],
    chatStatus: { text: "", error: false },
    readinessAnswers: {
      hasVoterId: false,
      isRegistered: false,
      knowsBoothLocation: false,
      hasCheckedDocuments: false
    }
  }
};

const sectionDefinitions = {
  guide: {
    root: document.querySelector('[data-section-root="guide"]'),
    loader: () => import("../components/guideSection.js")
  },
  assistant: {
    root: document.querySelector('[data-section-root="assistant"]'),
    loader: () => import("../components/chatSection.js")
  },
  timeline: {
    root: document.querySelector('[data-section-root="timeline"]'),
    loader: () => import("../components/timelineSection.js")
  },
  readiness: {
    root: document.querySelector('[data-section-root="readiness"]'),
    loader: () => import("../components/readinessSection.js")
  },
  myths: {
    root: document.querySelector('[data-section-root="myths"]'),
    loader: () => import("../components/mythsSection.js")
  }
};

const loadedSections = new Map();
const renderTracker = createRenderTracker();

function getFallbackBootstrap() {
  return {
    guideSteps,
    timelineStages,
    faqs: getFaqPreview(),
    fakeNewsTips
  };
}

async function loadBootstrap() {
  if (state.isFileMode) {
    return getFallbackBootstrap();
  }

  try {
    const response = await fetch(state.endpoints.bootstrap);
    if (!response.ok) {
      throw new Error("Unable to load bootstrap content.");
    }
    const payload = await response.json();
    return {
      ...payload,
      fakeNewsTips: payload.fakeNewsTips || fakeNewsTips
    };
  } catch {
    return getFallbackBootstrap();
  }
}

function applyTheme() {
  document.body.dataset.theme = state.theme;
  const toggle = document.querySelector("#theme-toggle");
  if (!toggle) {
    return;
  }
  toggle.setAttribute("aria-pressed", String(state.theme === "dark"));
  toggle.textContent = state.theme === "dark" ? state.copy.themeLight : state.copy.themeDark;
}

function setLanguage(language) {
  state.language = language;
  state.copy = getCopy(language);
  document.documentElement.lang = language === "hi" ? "hi" : "en";
  localStorage.setItem("election-assistant-language", language);
  document.querySelector("#lang-en")?.classList.toggle("is-active", language === "en");
  document.querySelector("#lang-hi")?.classList.toggle("is-active", language === "hi");
  document.querySelector("#lang-en")?.setAttribute("aria-pressed", String(language === "en"));
  document.querySelector("#lang-hi")?.setAttribute("aria-pressed", String(language === "hi"));
  applyStaticCopy();
  applyTheme();
  rerenderLoadedSections();
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem("election-assistant-theme", theme);
  applyTheme();
}

function updateText(selector, value) {
  const node = document.querySelector(`[data-copy="${selector}"]`);
  if (node) {
    node.textContent = value;
  }
}

function applyStaticCopy() {
  const copy = state.copy;
  updateText("brand", copy.brand);
  updateText("navGuide", copy.navGuide);
  updateText("navAssistant", copy.navAssistant);
  updateText("navTimeline", copy.navTimeline);
  updateText("navReadiness", copy.navReadiness);
  updateText("heroEyebrow", copy.heroEyebrow);
  updateText("heroTitle", copy.heroTitle);
  updateText("heroDescription", copy.heroDescription);
  updateText("heroPrimary", copy.heroPrimary);
  updateText("heroSecondary", copy.heroSecondary);
  updateText("statOneLabel", copy.statOneLabel);
  updateText("statOneValue", copy.statOneValue);
  updateText("statTwoLabel", copy.statTwoLabel);
  updateText("statTwoValue", copy.statTwoValue);
  updateText("statThreeLabel", copy.statThreeLabel);
  updateText("statThreeValue", copy.statThreeValue);
  updateText("visualCaption", copy.visualCaption);
  updateText("floatingLabel", copy.floatingLabel);
  updateText("floatingTitle", copy.floatingTitle);
  updateText("floatingBody", copy.floatingBody);
  updateText("overviewOneLabel", copy.overviewOneLabel);
  updateText("overviewOneTitle", copy.overviewOneTitle);
  updateText("overviewOneBody", copy.overviewOneBody);
  updateText("overviewTwoLabel", copy.overviewTwoLabel);
  updateText("overviewTwoTitle", copy.overviewTwoTitle);
  updateText("overviewTwoBody", copy.overviewTwoBody);
  updateText("overviewThreeLabel", copy.overviewThreeLabel);
  updateText("overviewThreeTitle", copy.overviewThreeTitle);
  updateText("footerLead", copy.footerLead);
  updateText("footerTail", copy.footerTail);
}

function updateIntegrationStatus() {
  const gaMeasurementId =
    document.querySelector('meta[name="ga-measurement-id"]')?.getAttribute("content") || "";
  const analyticsNode = document.querySelector("#analytics-status");
  const firebaseNode = document.querySelector("#firebase-status");
  const summary = document.querySelector("#integration-summary");

  if (analyticsNode) {
    const enabled = gaMeasurementId.length > 0;
    analyticsNode.textContent = enabled ? "Analytics configured" : "Analytics placeholder";
    analyticsNode.className = `status-pill ${enabled ? "is-ready" : "is-placeholder"}`;
  }

  if (firebaseNode) {
    const enabled = isFirebaseConfigured();
    firebaseNode.textContent = enabled ? "Firebase configured" : "Firebase placeholder";
    firebaseNode.className = `status-pill ${enabled ? "is-ready" : "is-placeholder"}`;
  }

  if (summary) {
    summary.textContent = isFirebaseConfigured()
      ? "Google Analytics and Firebase keys are present. Connect your SDK setup when you are ready."
      : "Google Analytics can be enabled with a measurement ID, and Firebase config is ready for project keys.";
  }
}

function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

function setupAnalytics() {
  const measurementId =
    document.querySelector('meta[name="ga-measurement-id"]')?.getAttribute("content") || "";

  if (!measurementId) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

// Section rendering is centralized here so the initial load path and the lazy observer
// cannot initialize the same section twice.
async function renderSection(name, options = {}) {
  const definition = sectionDefinitions[name];
  if (!definition || !definition.root || !state.bootstrap) {
    return;
  }

  if (!renderTracker.shouldRender(name, options)) {
    return;
  }

  let module = loadedSections.get(name);
  if (!module) {
    module = await definition.loader();
    loadedSections.set(name, module);
  }

  renderTracker.start(name);

  try {
    definition.root.classList.add("fade-in");
    module.renderSection(definition.root, state);
    renderTracker.finish(name);
    trackEvent("section_rendered", { section: name });
  } catch (error) {
    renderTracker.cancel(name);
    throw error;
  }
}

async function rerenderLoadedSections() {
  for (const name of loadedSections.keys()) {
    await renderSection(name, { force: true });
  }
}

function setupControls() {
  document.querySelector("#lang-en")?.addEventListener("click", () => setLanguage("en"));
  document.querySelector("#lang-hi")?.addEventListener("click", () => setLanguage("hi"));
  document
    .querySelector("#theme-toggle")
    ?.addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
}

function setupActiveNav() {
  const links = [...document.querySelectorAll("[data-section-link]")];
  const sections = [
    document.querySelector("#guide-section"),
    document.querySelector("#assistant-section"),
    document.querySelector("#timeline-section"),
    document.querySelector("#readiness-section")
  ].filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) {
        return;
      }

      const sectionName = visible.target.id.replace("-section", "");
      links.forEach((link) => {
        const active = link.dataset.sectionLink === sectionName;
        link.classList.toggle("is-active", active);
        if (active) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupLazySections() {
  const observer = new IntersectionObserver(
    async (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const sectionName = entry.target.dataset.sectionRoot;
        if (sectionName) {
          await renderSection(sectionName);
          if (renderTracker.hasRendered(sectionName)) {
            observer.unobserve(entry.target);
          }
        }
      }
    },
    { rootMargin: "240px 0px", threshold: 0.05 }
  );

  Object.values(sectionDefinitions).forEach((definition) => {
    if (definition.root) {
      observer.observe(definition.root);
    }
  });
}

async function startApp() {
  state.bootstrap = await loadBootstrap();
  applyStaticCopy();
  updateIntegrationStatus();
  applyTheme();
  setupControls();
  setupAnalytics();
  setupActiveNav();
  setupLazySections();
  await renderSection("guide");
  await renderSection("assistant");
  trackEvent("app_loaded", { fileMode: state.isFileMode });
}

setLanguage(state.language);
startApp();
