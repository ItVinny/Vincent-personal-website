"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { deleteMedia } from "@/lib/actions/media";
import { useToast } from "../_components/Toast";

type MediaItem = { id: string; url: string; alt: string; createdAt: string };

export function UploadSection() {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <div className="mb-8 rounded-[14px] border-2 border-dashed border-[#d2d2d7] bg-white p-8 text-center">
      <UploadButton
        endpoint="mediaUploader"
        onClientUploadComplete={() => {
          showToast("Image uploaded.");
          router.refresh();
        }}
        onUploadError={(error) => {
          showToast(error.message, "error");
        }}
        appearance={{
          button:
            "bg-[#0066cc] hover:bg-[#0071e3] text-[14px] font-medium px-5 py-2.5 rounded-full after:bg-[#0071e3]",
          allowedContent: "text-[12px] text-[#86868b] mt-2",
        }}
      />
    </div>
  );
}

export function MediaGrid({ items }: { items: MediaItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-[15px] text-[#86868b]">
        No images uploaded yet. Use the box above to add your first one.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMedia(item.id);
      if (result.success) {
        showToast("Image deleted.");
      } else {
        showToast(result.error, "error");
      }
      setConfirming(false);
    });
  }

  return (
    <div className="overflow-hidden rounded-[12px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="aspect-square bg-[#f5f5f7]">
        <Image
          src={item.url}
          alt={item.alt}
          width={200}
          height={200}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-2.5">
        <p className="mb-1.5 truncate text-[12px] text-[#6e6e73]" title={item.alt}>
          {item.alt || "Untitled"}
        </p>
        {confirming ? (
          <div className="flex items-center gap-2 text-[12px]">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="font-medium text-[#d70015] hover:underline"
            >
              {isPending ? "Deleting\u2026" : "Confirm"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-[#86868b] hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-[12px] text-[#86868b] hover:text-[#d70015]"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
