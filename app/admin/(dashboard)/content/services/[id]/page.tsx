import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "../ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Edit Service
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">{service.title}</p>
      <ServiceForm
        id={service.id}
        initial={{
          title: service.title,
          description: service.description,
          iconName: service.iconName as "target" | "grid" | "monitor" | "compass",
          order: service.order,
          published: service.published,
        }}
      />
    </div>
  );
}
