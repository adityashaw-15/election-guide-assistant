import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { prepareQuestion, requestAssistantAnswer } from "../public/scripts/services/assistantClient.js";

describe("Assistant client helpers", () => {
  it("rejects empty chat input before sending", () => {
    const result = prepareQuestion("   ");
    assert.equal(result.validation.valid, false);
    assert.equal(result.validation.message, "Please enter a question before submitting.");
  });

  it("handles invalid queries with fallback guidance", async () => {
    const result = await requestAssistantAnswer("Can you predict the cricket score?", {
      preferNetwork: false
    });

    assert.equal(result.ok, true);
    assert.equal(result.answer.title, "I need a more specific election question");
  });
});
