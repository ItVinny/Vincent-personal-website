import { prisma } from "@/lib/prisma";
import { UploadSection, MediaGrid } from "./MediaLibraryClient";

export default async function MediaLibraryPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  const items = media.map((m) => ({
    id: m.id,
    url: m.url,
    alt: m.alt,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Media Library
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        Upload images here, then attach them to your Hero, About, Project, or
        Journal content from each section's editor.
      </p>

      <UploadSection />
      <MediaGrid items={items} />
    </div>
  );
}
