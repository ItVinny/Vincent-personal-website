import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-[10px] border border-[#d2d2d7] px-3.5 py-2.5 text-[15px] text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[13px] font-medium text-[#1d1d1f]"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-[13px] text-[#d70015]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldBase} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={fieldBase} rows={props.rows ?? 4} />;
}

export function SaveButton({
  loading,
  children = "Save changes",
}: {
  loading: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-full bg-[#0066cc] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0071e3] disabled:opacity-60"
    >
      {loading ? "Saving\u2026" : children}
    </button>
  );
}
