"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { requestLoginCode } from "@/lib/actions/two-factor";
import { getOtpStatus } from "@/lib/actions/auth-status";

type Step = "password" | "code";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [step, setStep] = useState<Step>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await requestLoginCode(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setCode("");
    setInfo(`We sent a 6-digit code to ${maskEmail(email)}. It expires in 10 minutes.`);
    setStep("code");
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      code,
      redirect: false,
    });

    if (result?.error) {
      const status = await getOtpStatus(email);
      setLoading(false);

      if (status.status === "expired") {
        setError("That code has expired. Request a new one below.");
      } else if (status.status === "no_pending_code") {
        setError("No code is pending. Request a new one below.");
      } else if (status.status === "attempts_remaining" && status.remaining > 0) {
        setError(`Incorrect code. ${status.remaining} attempt${status.remaining === 1 ? "" : "s"} remaining.`);
      } else {
        setError("Incorrect code. Request a new one below.");
      }
      return;
    }

    setLoading(false);
    router.push(from);
    router.refresh();
  }

  async function handleResend() {
    setError(null);
    setInfo(null);
    setLoading(true);
    const result = await requestLoginCode(email, password);
    setLoading(false);

    if (!result.success) {
      // The password itself can't have changed since step 1, but the
      // account could have been locked out between then and now by
      // excessive attempts elsewhere -- surface that if so.
      setError(result.error);
      setStep("password");
      return;
    }
    setCode("");
    setInfo(`A new code was sent to ${maskEmail(email)}.`);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1d1d1f] text-[13px] font-semibold text-white">
          VO
        </div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
          Sign in to admin
        </h1>
        <p className="mt-1 text-[14px] text-[#6e6e73]">
          Vincent Omolo &mdash; site management
        </p>
      </div>

      <div className="rounded-[18px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {step === "password" ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-[#1d1d1f]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border border-[#d2d2d7] px-3.5 py-2.5 text-[15px] text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-[#1d1d1f]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[10px] border border-[#d2d2d7] px-3.5 py-2.5 pr-11 text-[15px] text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                  className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-[#86868b] hover:text-[#1d1d1f]"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <p className="mb-4 text-[13px] text-[#d70015]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0066cc] py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0071e3] disabled:opacity-60"
            >
              {loading ? "Checking\u2026" : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            {info && (
              <p className="mb-4 text-[13px] text-[#1d1d1f]">{info}</p>
            )}

            <div className="mb-6">
              <label htmlFor="code" className="mb-1.5 block text-[13px] font-medium text-[#1d1d1f]">
                6-digit code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-[10px] border border-[#d2d2d7] px-3.5 py-2.5 text-center text-[20px] tracking-[6px] text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"
              />
            </div>

            {error && (
              <p className="mb-4 text-[13px] text-[#d70015]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="mb-3 w-full rounded-full bg-[#0066cc] py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0071e3] disabled:opacity-60"
            >
              {loading ? "Verifying\u2026" : "Verify and sign in"}
            </button>

            <div className="flex items-center justify-between text-[13px]">
              <button
                type="button"
                onClick={() => {
                  setStep("password");
                  setError(null);
                  setInfo(null);
                }}
                className="text-[#86868b] hover:text-[#1d1d1f]"
              >
                &larr; Start over
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-[#0066cc] hover:underline disabled:opacity-60"
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-[12px] text-[#86868b]">
        This is a private admin area for the site owner only.
      </p>
    </div>
  );
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M17.94 17.94A10.5 10.5 0 0112 19.5C5 19.5 1.5 12 1.5 12a19.3 19.3 0 014.22-5.94M9.9 4.24A10.9 10.9 0 0112 4.5c7 0 10.5 7.5 10.5 7.5a19.4 19.4 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
