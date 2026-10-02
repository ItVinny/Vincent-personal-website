import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../ProjectForm";
import { ImagePicker } from "../../../_components/ImagePicker";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, library] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { image: true } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Edit Project
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">{project.title}</p>

      <div className="mb-8 max-w-xl rounded-[18px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h2 className="mb-3 text-[13px] font-medium text-[#1d1d1f]">
          Project image
        </h2>
        <ImagePicker
          target={{ type: "project", id: project.id }}
          current={project.image ? { id: project.image.id, url: project.image.url, alt: project.image.alt } : null}
          library={library.map((m) => ({ id: m.id, url: m.url, alt: m.alt }))}
        />
      </div>

      <ProjectForm
        id={project.id}
        initial={{
          title: project.title,
          category: project.category,
          description: project.description,
          link: project.link ?? "",
          order: project.order,
          published: project.published,
        }}
      />
    </div>
  );
}
