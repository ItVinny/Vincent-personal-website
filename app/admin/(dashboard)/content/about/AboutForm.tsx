"use client";

import { useState, useTransition } from "react";
import { updateAbout } from "@/lib/actions/content";
import { useToast } from "../../_components/Toast";
import { Field, TextInput, TextArea, SaveButton } from "../../_components/FormFields";

type AboutData = {
  headline: string;
  body: string;
  linkText: string;
  linkHref: string;
};

export function AboutForm({ initial }: { initial: AboutData }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function set<K extends keyof AboutData>(key: K, value: AboutData[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateAbout(values);
      if (result.success) {
        showToast("About section saved.");
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
      <Field label="Headline" htmlFor="headline">
        <TextArea
          id="headline"
          rows={2}
          value={values.headline}
          onChange={(e) => set("headline", e.target.value)}
          required
        />
      </Field>

      <Field label="Body text" htmlFor="body">
        <TextArea
          id="body"
          rows={5}
          value={values.body}
          onChange={(e) => set("body", e.target.value)}
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Link text" htmlFor="linkText">
          <TextInput
            id="linkText"
            value={values.linkText}
            onChange={(e) => set("linkText", e.target.value)}
            required
          />
        </Field>
        <Field label="Link URL" htmlFor="linkHref">
          <TextInput
            id="linkHref"
            value={values.linkHref}
            onChange={(e) => set("linkHref", e.target.value)}
            required
          />
        </Field>
      </div>

      {error && (
        <p className="mb-4 text-[13px] text-[#d70015]" role="alert">
          {error}
        </p>
      )}

      <SaveButton loading={isPending} />
    </form>
  );
}
