export function createRateLimiter({ windowMs, maxRequests }) {
  const buckets = new Map();

  return {
    check(key) {
      const now = Date.now();
      const current = buckets.get(key);

      if (!current || now > current.resetAt) {
        const nextState = { count: 1, resetAt: now + windowMs };
        buckets.set(key, nextState);
        return {
          allowed: true,
          limit: maxRequests,
          remaining: maxRequests - 1
        };
      }

      current.count += 1;
      const remaining = Math.max(maxRequests - current.count, 0);

      return {
        allowed: current.count <= maxRequests,
        limit: maxRequests,
        remaining
      };
    }
  };
}
