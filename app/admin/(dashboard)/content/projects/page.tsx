import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteProjectButton } from "./DeleteProjectButton";

export default async function ProjectsListPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
            Selected Work
          </h1>
          <p className="text-[15px] text-[#6e6e73]">
            The project cards shown on your homepage.
          </p>
        </div>
        <Link
          href="/admin/content/projects/new"
          className="rounded-full bg-[#0066cc] px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#0071e3]"
        >
          Add project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-[15px] text-[#86868b]">
          No projects yet. Click "Add project" to create your first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`flex items-center justify-between px-5 py-4 ${
                i !== projects.length - 1 ? "border-b border-[#e5e5ea]" : ""
              }`}
            >
              <div>
                <p className="text-[15px] font-medium text-[#1d1d1f]">
                  {project.title}
                  {!project.published && (
                    <span className="ml-2 rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[11px] text-[#86868b]">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="text-[13px] text-[#86868b]">{project.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/content/projects/${project.id}`}
                  className="text-[13px] text-[#0066cc] hover:underline"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
