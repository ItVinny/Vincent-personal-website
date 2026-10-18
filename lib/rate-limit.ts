// A simple in-memory rate limiter for public server actions (the
// inquiry form, analytics tracking). It's deliberately lightweight --
// no new service or database table.
//
// Honest limitation: this resets whenever a serverless function cold-
// starts, and isn't shared across multiple concurrent instances, so
// it's a speed bump against casual scripted abuse, not a hard
// guarantee against a determined attacker. If this site ever sees
// real abuse, the proper upgrade is a shared store like Upstash Redis
// (@upstash/ratelimit) so every instance sees the same counters.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

// Best-effort visitor IP from standard proxy headers. Vercel sets
// x-forwarded-for; this is identification for rate-limiting purposes
// only, not a security-critical trust boundary.
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
