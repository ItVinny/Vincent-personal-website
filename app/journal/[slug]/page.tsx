import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicNav } from "../../_components/PublicNav";
import { AnalyticsTracker } from "../../_components/AnalyticsTracker";
import { MediaOrPlaceholder } from "../../_components/MediaOrPlaceholder";

export const revalidate = 60;

async function getPost(slug: string) {
  const post = await prisma.journalPost.findUnique({
    where: { slug },
    include: { image: true },
  });
  if (!post || !post.published) return null;
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found — Vincent Omolo" };
  return {
    title: `${post.title} — Vincent Omolo`,
    description: post.excerpt,
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Related posts: everything else published, most recent first, capped at 2.
  const related = await prisma.journalPost.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { date: "desc" },
    take: 2,
  });

  return (
    <>
      <AnalyticsTracker path={`/journal/${slug}`} />
      <PublicNav />

      <main className="font-body text-[17px] leading-[1.6] text-[#1d1d1f]">
        <article className="mx-auto max-w-[680px] px-6 py-16 md:py-20">
          <Link
            href="/#journal"
            className="mb-8 inline-block text-[14px] text-[#0066cc] hover:text-[#0071e3]"
          >
            &larr; Back to Journal
          </Link>

          <p className="mb-3 text-[14px] text-[#7a7a7a]">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <h1 className="mb-6 font-display text-[2.2rem] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[2.8rem]">
            {post.title}
          </h1>

          <div className="mb-10 aspect-[16/9] overflow-hidden rounded-[18px]">
            <MediaOrPlaceholder
              media={post.image}
              fallbackAlt={post.title}
              placeholderClassName="h-full w-full bg-[linear-gradient(160deg,#6b7a6c_0%,#3c463d_45%,#1c211c_100%)]"
              imageClassName="h-full w-full object-cover"
            />
          </div>

          <p className="mb-8 text-[19px] text-[#333333]">{post.excerpt}</p>

          {post.body ? (
            <div
              className="[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-[1.4rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-[1.15rem] [&_h3]:font-semibold [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_mark]:rounded-sm [&_mark]:bg-[#fff59d] [&_mark]:px-0.5"
              // This content is produced only by the site owner through
              // the admin's rich text editor -- there's no public
              // submission path, so rendering it directly is safe here.
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p className="text-[15px] italic text-[#86868b]">
              The full article text hasn&apos;t been added yet.
            </p>
          )}
        </article>

        {related.length > 0 && (
          <section className="border-t border-[#e5e5ea] bg-[#f5f5f7] py-16">
            <div className="mx-auto max-w-[680px] px-6">
              <h2 className="mb-6 font-display text-[18px] font-semibold">
                More from the Journal
              </h2>
              <div className="flex flex-col gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/journal/${p.slug}`}
                    className="rounded-[14px] bg-white p-5 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  >
                    <p className="mb-1 text-[13px] text-[#86868b]">
                      {new Date(p.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-display text-[16px] font-semibold">
                      {p.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
