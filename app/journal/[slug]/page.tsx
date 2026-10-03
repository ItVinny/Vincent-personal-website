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

  const related = await prisma.journalPost.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { date: "desc" },
    take: 2,
  });

  return (
    <>
      <AnalyticsTracker path={`/journal/${slug}`} />
      <PublicNav />

      <main className="bg-white font-mongo text-[16px] leading-[1.6] text-[#001e2b] dark:bg-[#001e2b] dark:text-white">
        <article className="mx-auto max-w-[680px] px-6 py-16 md:py-20">
          <Link
            href="/#journal"
            className="mb-8 inline-block text-[14px] font-medium text-[#00684a] hover:text-[#00a35c] dark:text-[#00ed64] dark:hover:text-[#3ff590]"
          >
            &larr; Back to Journal
          </Link>

          <p className="mb-3 text-[13px] text-[#5c6c7a] dark:text-[#a8b3bc]">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <h1 className="mb-6 text-[2.2rem] font-medium leading-[1.15] tracking-[-0.5px] md:text-[2.6rem]">
            {post.title}
          </h1>

          <div className="mb-10 aspect-[16/9] overflow-hidden rounded-[12px]">
            <MediaOrPlaceholder
              media={post.image}
              fallbackAlt={post.title}
              placeholderClassName="h-full w-full bg-[linear-gradient(160deg,#00a35c_0%,#00684a_45%,#001e2b_100%)]"
              imageClassName="h-full w-full object-cover"
            />
          </div>

          <p className="mb-8 text-[18px] text-[#3d4f5b] dark:text-[#c3d0d6]">
            {post.excerpt}
          </p>

          {post.body ? (
            <div
              className="[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-[1.4rem] [&_h2]:font-medium [&_h2]:tracking-[-0.3px] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-[1.15rem] [&_h3]:font-medium [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_mark]:rounded-sm [&_mark]:bg-[#c3f0d2] [&_mark]:px-0.5 [&_mark]:text-[#001e2b]"
              // This content is produced only by the site owner through
              // the admin's rich text editor -- there's no public
              // submission path, so rendering it directly is safe here.
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p className="text-[14px] italic text-[#7c8c9a]">
              The full article text hasn&apos;t been added yet.
            </p>
          )}
        </article>

        {related.length > 0 && (
          <section className="border-t border-[#e1e5e8] bg-[#f9fbfa] py-16 dark:border-[#1c2d38] dark:bg-[#003d4f]">
            <div className="mx-auto max-w-[680px] px-6">
              <h2 className="mb-6 text-[18px] font-medium">
                More from the Journal
              </h2>
              <div className="flex flex-col gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/journal/${p.slug}`}
                    className="rounded-[12px] bg-white p-5 transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:bg-[#001e2b] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  >
                    <p className="mb-1 text-[13px] text-[#7c8c9a] dark:text-[#a8b3bc]">
                      {new Date(p.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="text-[16px] font-medium">{p.title}</h3>
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
