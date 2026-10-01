import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteJournalButton } from "./DeleteJournalButton";

export default async function JournalListPage() {
  const posts = await prisma.journalPost.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
            Journal Posts
          </h1>
          <p className="text-[15px] text-[#6e6e73]">
            The articles shown in your homepage's Journal section.
          </p>
        </div>
        <Link
          href="/admin/content/journal/new"
          className="rounded-full bg-[#0066cc] px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#0071e3]"
        >
          Add post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-[15px] text-[#86868b]">
          No posts yet. Click "Add post" to write your first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className={`flex items-center justify-between px-5 py-4 ${
                i !== posts.length - 1 ? "border-b border-[#e5e5ea]" : ""
              }`}
            >
              <div>
                <p className="text-[15px] font-medium text-[#1d1d1f]">
                  {post.title}
                  {!post.published && (
                    <span className="ml-2 rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[11px] text-[#86868b]">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="text-[13px] text-[#86868b]">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  &middot; /{post.slug}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/content/journal/${post.id}`}
                  className="text-[13px] text-[#0066cc] hover:underline"
                >
                  Edit
                </Link>
                <DeleteJournalButton id={post.id} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
