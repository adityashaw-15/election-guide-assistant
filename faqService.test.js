import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { answerElectionQuestion } from "../src/services/faqService.js";
import { validateQuestionInput } from "../src/utils/validation.js";

describe("FAQ and validation logic", () => {
  it("rejects empty questions", () => {
    assert.deepEqual(validateQuestionInput(""), {
      valid: false,
      message: "Please enter a question before submitting."
    });
  });

  it("returns fallback guidance for invalid topics", () => {
    const answer = answerElectionQuestion("Can you predict the weather?");
    assert.equal(answer.title, "I need a more specific election question");
  });

  it("matches EVM questions", () => {
    const answer = answerElectionQuestion("What is EVM and how does it work?");
    assert.equal(answer.title, "Electronic Voting Machine");
  });

  it("answers required document questions", () => {
    const answer = answerElectionQuestion("What documents do I need to vote?");
    assert.equal(answer.title, "Documents to keep ready");
  });
});
