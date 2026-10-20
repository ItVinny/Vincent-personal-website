// Shared between lib/auth.ts, lib/actions/two-factor.ts, and
// lib/actions/auth-status.ts, so the numbers enforced and the numbers
// shown to the admin can never drift out of sync.
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const MAX_OTP_ATTEMPTS = 5;
