import { prisma } from "@/lib/prisma";
import { FooterForm } from "./FooterForm";

export default async function FooterContentPage() {
  const footer = await prisma.footerContent.findFirst();

  const initial = {
    tagline: footer?.tagline ?? "Designing what matters. Building with intention.",
    email: footer?.email ?? "hello@vincentomolo.com",
    linkedin: footer?.linkedin ?? "",
    behance: footer?.behance ?? "",
    instagram: footer?.instagram ?? "",
    copyright: footer?.copyright ?? "Vincent Omolo. All rights reserved.",
  };

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Footer
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        Contact details and links shown at the bottom of every page.
      </p>
      <FooterForm initial={initial} />
    </div>
  );
}
