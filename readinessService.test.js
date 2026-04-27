import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateReadinessChecklist } from "../src/services/readinessService.js";

describe("Readiness checker", () => {
  it("reports fully prepared state", () => {
    const result = evaluateReadinessChecklist({
      hasVoterId: true,
      isRegistered: true,
      knowsBoothLocation: true,
      hasCheckedDocuments: true
    });

    assert.equal(result.level, "Ready");
    assert.equal(result.score, 4);
  });

  it("returns suggestions when items are missing", () => {
    const result = evaluateReadinessChecklist({
      hasVoterId: false,
      isRegistered: false,
      knowsBoothLocation: true,
      hasCheckedDocuments: false
    });

    assert.equal(result.level, "Needs attention");
    assert.equal(result.suggestions.length, 3);
  });

  it("localizes readiness output in Hindi", () => {
    const result = evaluateReadinessChecklist(
      {
        hasVoterId: true,
        isRegistered: false,
        knowsBoothLocation: true,
        hasCheckedDocuments: false
      },
      "hi"
    );

    assert.equal(result.level, "लगभग तैयार");
  });
});
