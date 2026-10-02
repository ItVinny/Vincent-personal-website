import { prisma } from "@/lib/prisma";
import { AboutForm } from "./AboutForm";
import { ImagePicker } from "../../_components/ImagePicker";

export default async function AboutContentPage() {
  const [about, library] = await Promise.all([
    prisma.aboutSection.findFirst({ include: { image: true } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

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

      <div className="mb-8 max-w-xl rounded-[18px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h2 className="mb-3 text-[13px] font-medium text-[#1d1d1f]">
          About image
        </h2>
        <ImagePicker
          target={{ type: "about" }}
          current={about?.image ? { id: about.image.id, url: about.image.url, alt: about.image.alt } : null}
          library={library.map((m) => ({ id: m.id, url: m.url, alt: m.alt }))}
        />
      </div>

      <AboutForm initial={initial} />
    </div>
  );
}
