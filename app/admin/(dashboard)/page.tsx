import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [projectCount, postCount, mediaCount] = await Promise.all([
    prisma.project.count(),
    prisma.journalPost.count(),
    prisma.media.count(),
  ]);

  const stats = [
    { label: "Projects", value: projectCount },
    { label: "Journal posts", value: postCount },
    { label: "Media items", value: mediaCount },
  ];

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Dashboard
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        A quick overview of your site content.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[14px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[13px] text-[#86868b]">{stat.label}</p>
            <p className="mt-1 text-[28px] font-semibold text-[#1d1d1f]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-[13px] text-[#86868b]">
        Content editing, media, and analytics pages are the next build
        steps — say the word and I&apos;ll add them here.
      </p>
    </div>
  );
}
