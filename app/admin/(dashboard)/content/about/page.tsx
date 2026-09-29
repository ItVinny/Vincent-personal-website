import { prisma } from "@/lib/prisma";
import { AboutForm } from "./AboutForm";

export default async function AboutContentPage() {
  const about = await prisma.aboutSection.findFirst();

  const initial = {
    headline:
      about?.headline ??
      "I design digital experiences that blend strategy, aesthetics, and technology.",
    body:
      about?.body ??
      "With a growing foundation in leading initiatives and crafting considered digital solutions, I help ideas turn into clear, beautiful, and impactful outcomes.",
    linkText: about?.linkText ?? "More about my approach",
    linkHref: about?.linkHref ?? "#",
  };

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        About Section
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        The headline and body text on your homepage's About section.
      </p>
      <AboutForm initial={initial} />
    </div>
  );
}
