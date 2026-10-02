import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Add Project
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        This will appear as a new card in Selected Work. You can attach an
        image after creating it.
      </p>
      <ProjectForm
        initial={{
          title: "",
          category: "",
          description: "",
          link: "",
          order: 0,
          published: true,
        }}
      />
    </div>
  );
}
