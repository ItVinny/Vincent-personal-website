import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceIcon } from "@/app/_components/ServiceIcon";
import { DeleteServiceButton } from "./DeleteServiceButton";

export default async function ServicesListPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
            How I Can Help
          </h1>
          <p className="text-[15px] text-[#6e6e73]">
            The service cards shown on your homepage.
          </p>
        </div>
        <Link
          href="/admin/content/services/new"
          className="rounded-full bg-[#0066cc] px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#0071e3]"
        >
          Add service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-[15px] text-[#86868b]">
          No services yet. Click "Add service" to create your first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`flex items-center justify-between px-5 py-4 ${
                i !== services.length - 1 ? "border-b border-[#e5e5ea]" : ""
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f5f7]">
                  <ServiceIcon name={service.iconName} />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1d1d1f]">
                    {service.title}
                    {!service.published && (
                      <span className="ml-2 rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[11px] text-[#86868b]">
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="text-[13px] text-[#86868b]">
                    {service.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/content/services/${service.id}`}
                  className="text-[13px] text-[#0066cc] hover:underline"
                >
                  Edit
                </Link>
                <DeleteServiceButton id={service.id} title={service.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
