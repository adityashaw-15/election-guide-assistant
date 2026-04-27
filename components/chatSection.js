import { createElement, createList, clearElement, createSectionHeader } from "../scripts/utils/dom.js";
import { requestAssistantAnswer } from "../scripts/services/assistantClient.js";

function createAssistantBubble(answer) {
  const bubble = createElement("article", {
    className: "chat-bubble assistant",
    attributes: { "aria-label": "Assistant response" }
  });
  bubble.appendChild(createElement("h3", { className: "assistant-bubble-title", text: answer.title }));
  bubble.appendChild(createElement("p", { text: answer.summary }));
  bubble.appendChild(createList(answer.bullets));
  bubble.appendChild(createElement("p", { text: answer.followUp }));
  return bubble;
}

function createUserBubble(text) {
  return createElement("article", { className: "chat-bubble user" }, [
    createElement("p", { text })
  ]);
}

function createThread(messages) {
  const thread = createElement("div", {
    className: "chat-thread",
    attributes: { role: "log", "aria-live": "polite", "aria-label": "Chat messages" }
  });

  messages.forEach((message) => {
    thread.appendChild(
      message.role === "user" ? createUserBubble(message.text) : createAssistantBubble(message.answer)
    );
  });

  return thread;
}

function createWelcomeMessage(copy) {
  return {
    role: "assistant",
    kind: "welcome",
    answer: copy.chat.welcome
  };
}

export function renderSection(host, state) {
  const copy = state.copy;

  if (state.ui.chatMessages.length === 0) {
    state.ui.chatMessages = [createWelcomeMessage(copy)];
  } else if (
    state.ui.chatMessages.length === 1 &&
    state.ui.chatMessages[0].kind === "welcome"
  ) {
    state.ui.chatMessages[0] = createWelcomeMessage(copy);
  }

  clearElement(host);
  host.setAttribute("aria-busy", "false");

  const section = createElement("div", { className: "section-card fade-in" });
  section.appendChild(
    createSectionHeader({
      eyebrow: copy.chat.eyebrow,
      title: copy.chat.title,
      intro: copy.chat.intro,
      headingId: "assistant-heading"
    })
  );

  const layout = createElement("div", { className: "chat-layout" });
  const board = createElement("div", { className: "chat-board" });
  const aside = createElement("aside", { className: "chat-aside" });
  const statusLine = createElement("p", {
    className: "status-line",
    attributes: { role: "status", "aria-live": "polite" }
  });

  const thread = createThread(state.ui.chatMessages);
  board.appendChild(createElement("p", { className: "chat-label", text: copy.chat.threadLabel }));
  board.appendChild(thread);

  const form = createElement("form", {
    className: "chat-form",
    attributes: { novalidate: "true" }
  });
  const label = createElement("label", {
    text: copy.chat.fieldLabel,
    attributes: { for: "chat-question" }
  });
  const inputWrap = createElement("div", { className: "chat-input-wrap" });
  const textarea = createElement("textarea", {
    className: "chat-input",
    id: "chat-question",
    attributes: {
      name: "question",
      maxlength: "240",
      placeholder: copy.chat.placeholder,
      "aria-describedby": "chat-helper chat-status"
    }
  });
  const sendButton = createElement("button", {
    className: "send-button",
    text: copy.chat.submit,
    attributes: { type: "submit" }
  });
  inputWrap.appendChild(textarea);
  inputWrap.appendChild(sendButton);

  const helperRow = createElement("div");
  helperRow.appendChild(createElement("p", { id: "chat-helper", className: "status-line", text: copy.chat.helper }));
  const charCount = createElement("p", { className: "character-count", text: "0 / 240" });
  helperRow.appendChild(charCount);

  form.appendChild(label);
  form.appendChild(inputWrap);
  form.appendChild(helperRow);
  statusLine.id = "chat-status";
  statusLine.textContent = state.ui.chatStatus.text;
  statusLine.classList.toggle("is-error", state.ui.chatStatus.error);
  form.appendChild(statusLine);

  textarea.addEventListener("input", () => {
    charCount.textContent = `${textarea.value.length} / 240`;
  });

  async function submitPrompt(promptText) {
    const result = await requestAssistantAnswer(promptText, {
      endpoint: state.endpoints.ask,
      preferNetwork: !state.isFileMode
    });

    if (!result.ok) {
      state.ui.chatStatus = { text: result.error, error: true };
      statusLine.textContent = result.error;
      statusLine.classList.add("is-error");
      return;
    }

    state.ui.chatStatus = {
      text: result.source === "api" ? copy.chat.ready : copy.chat.fallback,
      error: false
    };
    statusLine.classList.remove("is-error");
    statusLine.textContent = state.ui.chatStatus.text;
    state.ui.chatMessages.push({ role: "user", text: result.question });
    state.ui.chatMessages.push({ role: "assistant", answer: result.answer });
    renderSection(host, state);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusLine.classList.remove("is-error");
    await submitPrompt(textarea.value);
  });
  board.appendChild(form);

  // Keep the right rail focused on prompts and suggestions only.
  // The welcome content lives in the chat thread so it appears once.
  aside.appendChild(createElement("p", { className: "chat-label", text: copy.chat.quickLabel }));
  const quickWrap = createElement("div", { className: "chat-quick-actions" });
  copy.chat.quickPrompts.forEach((item) => {
    quickWrap.appendChild(
      createElement("button", {
        className: "quick-action",
        text: item.label,
        attributes: { type: "button" },
        listeners: {
          click: async () => {
            statusLine.classList.remove("is-error");
            await submitPrompt(item.prompt);
          }
        }
      })
    );
  });
  aside.appendChild(quickWrap);
  aside.appendChild(
    createElement("div", { className: "result-card" }, [
      createElement("h3", { text: copy.chat.sidebarTitle }),
      createElement("p", { text: copy.chat.sidebarSummary }),
      createList(copy.chat.sidebarTopics)
    ])
  );

  layout.appendChild(board);
  layout.appendChild(aside);
  section.appendChild(layout);
  host.appendChild(section);

  const updatedThread = host.querySelector(".chat-thread");
  if (updatedThread) {
    updatedThread.scrollTop = updatedThread.scrollHeight;
  }
}
