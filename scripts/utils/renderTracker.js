export function createRenderTracker() {
  const rendered = new Set();
  const pending = new Set();

  return {
    shouldRender(name, { force = false } = {}) {
      if (force) {
        return !pending.has(name);
      }

      return !rendered.has(name) && !pending.has(name);
    },
    start(name) {
      pending.add(name);
    },
    cancel(name) {
      pending.delete(name);
    },
    finish(name) {
      pending.delete(name);
      rendered.add(name);
    },
    hasRendered(name) {
      return rendered.has(name);
    }
  };
}
