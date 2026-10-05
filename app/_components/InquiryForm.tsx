"use client";

import { useState, useTransition } from "react";
import { sendInquiry } from "@/lib/actions/inquiry";

const fieldClass =
  "w-full rounded-[10px] border border-[#d2d2d7] bg-white px-3.5 py-2.5 text-[15px] text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

export function InquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await sendInquiry({ name, email, message, website });
      if (result.success) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  if (status === "sent") {
    return (
      <div className="rounded-[14px] bg-[#f5f5f7] p-6 text-center">
        <p className="text-[15px] text-[#1d1d1f]">
          Thanks — your message is on its way. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-left">
      {/* Honeypot field -- hidden from real visitors via CSS, not
          display:none (which some bots skip), and never announced to
          screen readers. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inquiry-name" className="mb-1.5 block text-[13px] text-[#6e6e73]">
            Name
          </label>
          <input
            id="inquiry-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="inquiry-email" className="mb-1.5 block text-[13px] text-[#6e6e73]">
            Email
          </label>
          <input
            id="inquiry-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="inquiry-message" className="mb-1.5 block text-[13px] text-[#6e6e73]">
          Message
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={fieldClass}
        />
      </div>

      {status === "error" && error && (
        <p className="mb-4 text-[13px] text-[#d70015]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#0066cc] px-[22px] py-[11px] text-[15px] text-white transition hover:bg-[#0071e3] disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Sending\u2026" : "Send Inquiry"}
      </button>
    </form>
  );
}
