"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createJournalPost, updateJournalPost } from "@/lib/actions/content";
import { useToast } from "../../_components/Toast";
import { Field, TextInput, TextArea, SaveButton } from "../../_components/FormFields";

type JournalData = {
  title: string;
  slug: string;
  date: string; // yyyy-mm-dd, for the date input
  excerpt: string;
  body: string;
  order: number;
  published: boolean;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function JournalForm({
  id,
  initial,
}: {
  id?: string;
  initial: JournalData;
}) {
  const [values, setValues] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(id)); // don't auto-slug when editing an existing post
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  function set<K extends keyof JournalData>(key: K, value: JournalData[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!slugTouched) {
      set("slug", slugify(title));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = id
        ? await updateJournalPost(id, values)
        : await createJournalPost(values);

      if (result.success) {
        showToast(id ? "Post saved." : "Post created.");
        router.push("/admin/content/journal");
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
      <Field label="Title" htmlFor="title">
        <TextInput
          id="title"
          value={values.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
      </Field>

      <Field
        label="Slug (used in the article URL)"
        htmlFor="slug"
        error={undefined}
      >
        <TextInput
          id="slug"
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            set("slug", e.target.value);
          }}
          required
        />
      </Field>

      <Field label="Date" htmlFor="date">
        <TextInput
          id="date"
          type="date"
          value={values.date}
          onChange={(e) => set("date", e.target.value)}
          required
        />
      </Field>

      <Field label="Excerpt" htmlFor="excerpt">
        <TextArea
          id="excerpt"
          rows={2}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          required
        />
      </Field>

      <Field label="Body (optional, full article text)" htmlFor="body">
        <TextArea
          id="body"
          rows={8}
          value={values.body}
          onChange={(e) => set("body", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Order" htmlFor="order">
          <TextInput
            id="order"
            type="number"
            value={values.order}
            onChange={(e) => set("order", Number(e.target.value))}
          />
        </Field>

        <Field label="Status" htmlFor="published">
          <select
            id="published"
            value={values.published ? "true" : "false"}
            onChange={(e) => set("published", e.target.value === "true")}
            className="w-full rounded-[10px] border border-[#d2d2d7] px-3.5 py-2.5 text-[15px] text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"
          >
            <option value="true">Published</option>
            <option value="false">Hidden</option>
          </select>
        </Field>
      </div>

      {error && (
        <p className="mb-4 text-[13px] text-[#d70015]" role="alert">
          {error}
        </p>
      )}

      <SaveButton loading={isPending}>
        {id ? "Save changes" : "Create post"}
      </SaveButton>
    </form>
  );
}
