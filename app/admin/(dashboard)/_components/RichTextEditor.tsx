"use client";

import { useEffect, useRef } from "react";

// A small, dependency-free rich text editor built on the browser's
// native contentEditable + execCommand. Stores and returns its content
// as an HTML string, which is rendered with dangerouslySetInnerHTML
// on the public journal post page.
//
// execCommand is a deprecated API, but it's still supported in every
// evergreen browser for exactly this kind of basic formatting, and
// avoids adding a full editor library (Tiptap/ProseMirror/etc.) as a
// dependency for what's a single-admin internal tool. If this project
// grows real multi-editor needs later, swapping this for Tiptap is a
// contained change -- it only touches this file and how `body` is
// rendered on the article page.

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set the initial content once on mount only. Re-syncing on every
  // keystroke would fight the browser's own cursor position.
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    handleInput();
  }

  function handleInput() {
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  }

  return (
    <div className="rounded-[10px] border border-[#d2d2d7] transition focus-within:border-[#0071e3] focus-within:ring-2 focus-within:ring-[#0071e3]/20">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#e5e5ea] p-1.5">
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              exec("formatBlock", e.target.value);
              e.target.value = "";
            }
          }}
          aria-label="Text style"
          className="h-8 rounded-md border-none bg-transparent px-1.5 text-[13px] text-[#1d1d1f] outline-none hover:bg-[#f5f5f7]"
        >
          <option value="">Style</option>
          <option value="<p>">Paragraph</option>
          <option value="<h2>">Heading</option>
          <option value="<h3>">Subheading</option>
        </select>

        <Divider />

        <ToolButton label="Bold" onClick={() => exec("bold")}>
          <span className="font-bold">B</span>
        </ToolButton>
        <ToolButton label="Italic" onClick={() => exec("italic")}>
          <span className="italic">I</span>
        </ToolButton>
        <ToolButton label="Underline" onClick={() => exec("underline")}>
          <span className="underline">U</span>
        </ToolButton>
        <ToolButton label="Highlight" onClick={() => exec("hiliteColor", "#fff59d")}>
          <span className="rounded-sm bg-[#fff59d] px-1">H</span>
        </ToolButton>

        <Divider />

        <ToolButton label="Numbered list" onClick={() => exec("insertOrderedList")}>
          1.
        </ToolButton>
        <ToolButton label="Bulleted list" onClick={() => exec("insertUnorderedList")}>
          &bull;
        </ToolButton>

        <Divider />

        <ToolButton label="Clear formatting" onClick={() => exec("removeFormat")}>
          Tx
        </ToolButton>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[220px] px-3.5 py-3 text-[15px] leading-[1.6] text-[#1d1d1f] outline-none [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-[1.3rem] [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-[1.1rem] [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_mark]:rounded-sm [&_mark]:bg-[#fff59d] [&_mark]:px-0.5"
      />
    </div>
  );
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px] text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-[#e5e5ea]" aria-hidden="true" />;
}
