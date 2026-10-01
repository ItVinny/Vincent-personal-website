import { JournalForm } from "../JournalForm";

export default function NewJournalPostPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Add Journal Post
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        This will appear as a new card in your Journal section.
      </p>
      <JournalForm
        initial={{
          title: "",
          slug: "",
          date: today,
          excerpt: "",
          body: "",
          order: 0,
          published: true,
        }}
      />
    </div>
  );
}
