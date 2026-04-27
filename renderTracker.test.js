import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRenderTracker } from "../public/scripts/utils/renderTracker.js";

describe("Render tracker", () => {
  it("blocks duplicate initialization while a section is pending", () => {
    const tracker = createRenderTracker();

    assert.equal(tracker.shouldRender("assistant"), true);
    tracker.start("assistant");

    assert.equal(tracker.shouldRender("assistant"), false);
    assert.equal(tracker.shouldRender("assistant", { force: true }), false);
  });

  it("prevents repeat initialization after the first render", () => {
    const tracker = createRenderTracker();

    tracker.start("assistant");
    tracker.finish("assistant");

    assert.equal(tracker.shouldRender("assistant"), false);
    assert.equal(tracker.hasRendered("assistant"), true);
  });

  it("allows explicit rerenders for an already-rendered section", () => {
    const tracker = createRenderTracker();

    tracker.start("assistant");
    tracker.finish("assistant");

    assert.equal(tracker.shouldRender("assistant", { force: true }), true);
  });
});
