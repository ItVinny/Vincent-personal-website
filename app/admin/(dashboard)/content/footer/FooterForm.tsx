"use client";

import { useState, useTransition } from "react";
import { updateFooter } from "@/lib/actions/content";
import { useToast } from "../../_components/Toast";
import { Field, TextInput, SaveButton } from "../../_components/FormFields";

type FooterData = {
  tagline: string;
  email: string;
  linkedin: string;
  whatsapp: string;
  telegram: string;
  behance: string;
  instagram: string;
  copyright: string;
};

export function FooterForm({ initial }: { initial: FooterData }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function set<K extends keyof FooterData>(key: K, value: FooterData[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateFooter(values);
      if (result.success) {
        showToast("Footer saved.");
      } else {
        setError(result.error);
        showToast(result.error, "error");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl rounded-[18px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <Field label="Tagline" htmlFor="tagline">
        <TextInput
          id="tagline"
          value={values.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          required
        />
      </Field>

      <Field label="Contact email" htmlFor="email">
        <TextInput
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
      </Field>

      <h2 className="mb-3 mt-6 text-[13px] font-medium uppercase tracking-wide text-[#86868b]">
        Contact icons shown on your homepage
      </h2>

      <Field label="WhatsApp number" htmlFor="whatsapp">
        <TextInput
          id="whatsapp"
          value={values.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value.replace(/[^\d]/g, ""))}
          placeholder="254712345678 (country code, no + or spaces)"
        />
      </Field>

      <Field label="Telegram username" htmlFor="telegram">
        <TextInput
          id="telegram"
          value={values.telegram}
          onChange={(e) => set("telegram", e.target.value.replace(/^@/, ""))}
          placeholder="yourusername (without the @)"
        />
      </Field>

      <Field label="LinkedIn URL" htmlFor="linkedin">
        <TextInput
          id="linkedin"
          value={values.linkedin}
          onChange={(e) => set("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/..."
        />
      </Field>

      <h2 className="mb-3 mt-6 text-[13px] font-medium uppercase tracking-wide text-[#86868b]">
        Other links (stored, not currently shown on the homepage)
      </h2>

      <Field label="Behance URL" htmlFor="behance">
        <TextInput
          id="behance"
          value={values.behance}
          onChange={(e) => set("behance", e.target.value)}
          placeholder="https://behance.net/..."
        />
      </Field>

      <Field label="Instagram URL" htmlFor="instagram">
        <TextInput
          id="instagram"
          value={values.instagram}
          onChange={(e) => set("instagram", e.target.value)}
          placeholder="https://instagram.com/..."
        />
      </Field>

      <Field label="Copyright line" htmlFor="copyright">
        <TextInput
          id="copyright"
          value={values.copyright}
          onChange={(e) => set("copyright", e.target.value)}
          required
        />
      </Field>

      {error && (
        <p className="mb-4 text-[13px] text-[#d70015]" role="alert">
          {error}
        </p>
      )}

      <SaveButton loading={isPending} />
    </form>
  );
}
