import { prisma } from "@/lib/prisma";
import { HeroForm } from "./HeroForm";
import { ImagePicker } from "../../_components/ImagePicker";

export default async function HeroContentPage() {
  const [hero, library] = await Promise.all([
    prisma.heroSection.findFirst({ include: { image: true } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const initial = {
    name: hero?.name ?? "Vincent Omolo",
    title: hero?.title ?? "Creative Designer & Digital Craftsman",
    description:
      hero?.description ??
      "I partner with forward-thinking teams to create digital products and brands that are elegant, intuitive, and built to last.",
    primaryCtaText: hero?.primaryCtaText ?? "View Work",
    primaryCtaLink: hero?.primaryCtaLink ?? "#work",
    secondaryCtaText: hero?.secondaryCtaText ?? "About Me",
    secondaryCtaLink: hero?.secondaryCtaLink ?? "#about",
  };

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Hero Section
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        This is the first thing visitors see on your homepage.
      </p>

      <div className="mb-8 max-w-xl rounded-[18px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h2 className="mb-3 text-[13px] font-medium text-[#1d1d1f]">
          Hero image
        </h2>
        <ImagePicker
          target={{ type: "hero" }}
          current={hero?.image ? { id: hero.image.id, url: hero.image.url, alt: hero.image.alt } : null}
          library={library.map((m) => ({ id: m.id, url: m.url, alt: m.alt }))}
        />
      </div>

      <HeroForm initial={initial} />
    </div>
  );
}
