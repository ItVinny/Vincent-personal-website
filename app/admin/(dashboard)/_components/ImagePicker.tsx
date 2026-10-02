"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { attachImage } from "@/lib/actions/media";
import { useToast } from "./Toast";

type MediaItem = { id: string; url: string; alt: string };

type ImageTarget =
  | { type: "hero" }
  | { type: "about" }
  | { type: "project"; id: string }
  | { type: "journal"; id: string };

export function ImagePicker({
  target,
  current,
  library,
}: {
  target: ImageTarget;
  current: MediaItem | null;
  library: MediaItem[];
}) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function attach(mediaId: string | null) {
    startTransition(async () => {
      const result = await attachImage(target, mediaId);
      if (result.success) {
        showToast(mediaId ? "Image attached." : "Image removed.");
        setShowLibrary(false);
      } else {
        showToast(result.error, "error");
      }
    });
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[10px] bg-[#f5f5f7]">
          {current ? (
            <Image
              src={current.url}
              alt={current.alt}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[11px] text-[#86868b]">No image</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setShowLibrary((v) => !v)}
            disabled={isPending}
            className="text-left text-[13px] text-[#0066cc] hover:underline"
          >
            {showLibrary ? "Close library" : "Choose from library"}
          </button>
          {current && (
            <button
              type="button"
              onClick={() => attach(null)}
              disabled={isPending}
              className="text-left text-[13px] text-[#86868b] hover:text-[#d70015]"
            >
              Remove image
            </button>
          )}
        </div>
      </div>

      {showLibrary && (
        <div className="rounded-[12px] border border-[#e5e5ea] bg-[#fafafa] p-3">
          <p className="mb-2 text-[12px] text-[#86868b]">
            Click an image to attach it here. Need something new? Upload it
            from the{" "}
            <a href="/admin/media" className="text-[#0066cc] hover:underline">
              Media Library
            </a>{" "}
            first, then come back.
          </p>
          {library.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-[#86868b]">
              No images uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {library.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => attach(item.id)}
                  disabled={isPending}
                  className={`aspect-square overflow-hidden rounded-[8px] border-2 transition ${
                    current?.id === item.id
                      ? "border-[#0071e3]"
                      : "border-transparent hover:border-[#d2d2d7]"
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
