import { ServiceForm } from "../ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Add Service
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        This will appear as a new card in How I Can Help.
      </p>
      <ServiceForm
        initial={{
          title: "",
          description: "",
          iconName: "target",
          order: 0,
          published: true,
        }}
      />
    </div>
  );
}
