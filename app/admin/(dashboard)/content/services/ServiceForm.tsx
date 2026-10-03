"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createService, updateService } from "@/lib/actions/content";
import { useToast } from "../../_components/Toast";
import { Field, TextInput, TextArea, SaveButton } from "../../_components/FormFields";
import { ServiceIcon } from "@/app/_components/ServiceIcon";

type ServiceData = {
  title: string;
  description: string;
  iconName: "target" | "grid" | "monitor" | "compass";
  order: number;
  published: boolean;
};

const ICON_OPTIONS: ServiceData["iconName"][] = [
  "target",
  "grid",
  "monitor",
  "compass",
];

export function ServiceForm({
  id,
  initial,
}: {
  id?: string;
  initial: ServiceData;
}) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  function set<K extends keyof ServiceData>(key: K, value: ServiceData[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = id
        ? await updateService(id, values)
        : await createService(values);

      if (result.success) {
        showToast(id ? "Service saved." : "Service created.");
        router.push("/admin/content/services");
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

      <Field label="Icon" htmlFor="iconName">
        <div className="flex gap-2">
          {ICON_OPTIONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => set("iconName", icon)}
              className={`flex h-12 w-12 items-center justify-center rounded-[10px] border transition ${
                values.iconName === icon
                  ? "border-[#0071e3] bg-[#0071e3]/10"
                  : "border-[#d2d2d7] hover:bg-[#f5f5f7]"
              }`}
              aria-label={icon}
              aria-pressed={values.iconName === icon}
            >
              <ServiceIcon name={icon} />
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        {id ? "Save changes" : "Create service"}
      </SaveButton>
    </form>
  );
}
