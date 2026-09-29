import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ContentIndexPage() {
  const [projectCount, serviceCount, postCount] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.journalPost.count(),
  ]);

  const singletons = [
    {
      href: "/admin/content/hero",
      title: "Hero Section",
      description: "Your name, title, intro, and the two call-to-action buttons.",
    },
    {
      href: "/admin/content/about",
      title: "About Section",
      description: "The headline and body text on your About section.",
    },
    {
      href: "/admin/content/footer",
      title: "Footer",
      description: "Tagline, contact email, social links, and copyright line.",
    },
  ];

  const collections = [
    {
      href: "/admin/content/projects",
      title: "Selected Work",
      description: "Your project cards \u2014 add, edit, reorder, or remove.",
      count: projectCount,
    },
    {
      href: "/admin/content/services",
      title: "How I Can Help",
      description: "Your service cards. Coming next.",
      count: serviceCount,
      disabled: true,
    },
    {
      href: "/admin/content/journal",
      title: "Journal Posts",
      description: "Your articles. Coming next.",
      count: postCount,
      disabled: true,
    },
  ];

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Content
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        Everything here is live on your homepage \u2014 changes save straight to
        the database.
      </p>

      <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-[#86868b]">
        Page sections
      </h2>
      <div className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {singletons.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[14px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            <h3 className="mb-1 text-[15px] font-medium text-[#1d1d1f]">
              {item.title}
            </h3>
            <p className="text-[13px] text-[#86868b]">{item.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-[#86868b]">
        Collections
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {collections.map((item) =>
          item.disabled ? (
            <div
              key={item.href}
              className="rounded-[14px] bg-white/60 p-5 opacity-60"
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-[15px] font-medium text-[#1d1d1f]">
                  {item.title}
                </h3>
                <span className="text-[13px] text-[#86868b]">{item.count}</span>
              </div>
              <p className="text-[13px] text-[#86868b]">{item.description}</p>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[14px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-[15px] font-medium text-[#1d1d1f]">
                  {item.title}
                </h3>
                <span className="text-[13px] text-[#86868b]">{item.count}</span>
              </div>
              <p className="text-[13px] text-[#86868b]">{item.description}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
