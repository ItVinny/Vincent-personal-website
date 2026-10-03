"use client";

import { useState, useTransition } from "react";
import { updateHero } from "@/lib/actions/content";
import { useToast } from "../../_components/Toast";
import { Field, TextInput, TextArea, SaveButton } from "../../_components/FormFields";

type HeroData = {
  name: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
};

export function HeroForm({ initial }: { initial: HeroData }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function set<K extends keyof HeroData>(key: K, value: HeroData[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateHero(values);
      if (result.success) {
        showToast("Hero section saved.");
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
      <Field label="Name" htmlFor="name">
        <TextInput
          id="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </Field>

      <Field label="Title / role" htmlFor="title">
        <TextInput
          id="title"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </Field>

      <Field label="Description" htmlFor="description">
        <TextArea
          id="description"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Primary button text" htmlFor="primaryCtaText">
          <TextInput
            id="primaryCtaText"
            value={values.primaryCtaText}
            onChange={(e) => set("primaryCtaText", e.target.value)}
            required
          />
        </Field>
        <Field label="Primary button link" htmlFor="primaryCtaLink">
          <TextInput
            id="primaryCtaLink"
            value={values.primaryCtaLink}
            onChange={(e) => set("primaryCtaLink", e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Secondary button text" htmlFor="secondaryCtaText">
          <TextInput
            id="secondaryCtaText"
            value={values.secondaryCtaText}
            onChange={(e) => set("secondaryCtaText", e.target.value)}
            required
          />
        </Field>
        <Field label="Secondary button link" htmlFor="secondaryCtaLink">
          <TextInput
            id="secondaryCtaLink"
            value={values.secondaryCtaLink}
            onChange={(e) => set("secondaryCtaLink", e.target.value)}
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
