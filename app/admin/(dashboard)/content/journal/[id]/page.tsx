import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JournalForm } from "../JournalForm";

export default async function EditJournalPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.journalPost.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Edit Journal Post
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">{post.title}</p>
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
