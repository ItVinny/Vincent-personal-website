import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JournalForm } from "../JournalForm";
import { ImagePicker } from "../../../_components/ImagePicker";

export default async function EditJournalPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, library] = await Promise.all([
    prisma.journalPost.findUnique({ where: { id }, include: { image: true } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Edit Journal Post
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">{post.title}</p>

      <div className="mb-8 max-w-xl rounded-[18px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h2 className="mb-3 text-[13px] font-medium text-[#1d1d1f]">
          Cover image
        </h2>
        <ImagePicker
          target={{ type: "journal", id: post.id }}
          current={post.image ? { id: post.image.id, url: post.image.url, alt: post.image.alt } : null}
          library={library.map((m) => ({ id: m.id, url: m.url, alt: m.alt }))}
        />
      </div>

      <JournalForm
        id={post.id}
        initial={{
          title: post.title,
          slug: post.slug,
          date: post.date.toISOString().slice(0, 10),
          excerpt: post.excerpt,
          body: post.body ?? "",
          order: post.order,
          published: post.published,
        }}
      />
    </div>
  );
}
