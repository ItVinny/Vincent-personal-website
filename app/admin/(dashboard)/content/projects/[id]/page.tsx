import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Edit Project
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">{project.title}</p>
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
