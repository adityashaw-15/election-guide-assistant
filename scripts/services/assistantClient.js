import { answerElectionQuestion } from "../../../src/services/faqService.js";
import { sanitizePlainText } from "../../../src/utils/sanitize.js";
import { validateQuestionInput } from "../../../src/utils/validation.js";

export function prepareQuestion(rawQuestion) {
  const sanitizedQuestion = sanitizePlainText(rawQuestion);
  const validation = validateQuestionInput(sanitizedQuestion);
  return { sanitizedQuestion, validation };
}

export async function requestAssistantAnswer(rawQuestion, { endpoint, preferNetwork = true } = {}) {
  const prepared = prepareQuestion(rawQuestion);

  if (!prepared.validation.valid) {
    return {
      ok: false,
      error: prepared.validation.message,
      question: prepared.sanitizedQuestion,
      source: "client-validation"
    };
  }

  if (preferNetwork && endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prepared.sanitizedQuestion })
      });
      const payload = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: payload.error || "Unable to answer this question right now.",
          question: prepared.sanitizedQuestion,
          source: "api-error"
        };
      }

      return {
        ok: true,
        answer: payload,
        question: prepared.sanitizedQuestion,
        source: "api"
      };
    } catch {
      return {
        ok: true,
        answer: answerElectionQuestion(prepared.sanitizedQuestion),
        question: prepared.sanitizedQuestion,
        source: "local-fallback"
      };
    }
  }

  return {
    ok: true,
    answer: answerElectionQuestion(prepared.sanitizedQuestion),
    question: prepared.sanitizedQuestion,
    source: "local"
  };
}
