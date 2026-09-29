import { prisma } from "@/lib/prisma";
import { HeroForm } from "./HeroForm";

export default async function HeroContentPage() {
  const hero = await prisma.heroSection.findFirst();

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
      <HeroForm initial={initial} />
    </div>
  );
}
