// Shared between lib/auth.ts (which enforces the lockout) and
// lib/actions/auth-status.ts (which reports attempts-remaining to the
// login page). Keeping these in one place means the number shown to
// the admin can never drift out of sync with the number actually
// enforced.
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;
