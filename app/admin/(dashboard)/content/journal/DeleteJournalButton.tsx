"use client";

import { useState, useTransition } from "react";
import { deleteJournalPost } from "@/lib/actions/content";
import { useToast } from "../../_components/Toast";

export function DeleteJournalButton({ id, title }: { id: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteJournalPost(id);
      if (result.success) {
        showToast(`"${title}" deleted.`);
      } else {
        showToast(result.error, "error");
      }
      setConfirming(false);
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-[#86868b]">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="font-medium text-[#d70015] hover:underline"
        >
          {isPending ? "Deleting\u2026" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[#86868b] hover:underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-[13px] text-[#86868b] hover:text-[#d70015]"
    >
      Delete
    </button>
  );
}
