import { prisma } from "@/lib/prisma";
import { PublicNav } from "./_components/PublicNav";
import { AnalyticsTracker } from "./_components/AnalyticsTracker";
import { SectionViewTracker } from "./_components/SectionViewTracker";
import { MediaOrPlaceholder } from "./_components/MediaOrPlaceholder";
import { ServiceIcon } from "./_components/ServiceIcon";

// Revalidate periodically rather than on every request, since content
// only changes when the owner edits it in /admin. Tune this down (or
// switch to on-demand revalidation from the save actions later) once
// the content editing pages exist.
export const revalidate = 60;

const sculptureBase =
  "rounded-full shadow-[3px_5px_30px_rgba(0,0,0,0.22)]";

export default async function HomePage() {
  const [hero, about, footer, projects, services, posts] = await Promise.all([
    prisma.heroSection.findFirst({ include: { image: true } }),
    prisma.aboutSection.findFirst({ include: { image: true } }),
    prisma.footerContent.findFirst(),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { image: true },
    }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.journalPost.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { image: true },
    }),
  ]);

  const workGradients = [
    "bg-[radial-gradient(circle_at_40%_35%,#f6f6f8,#a9a9b1_75%)]",
    "bg-[radial-gradient(circle_at_45%_30%,#ffffff,#c4c4ca_80%)]",
    "bg-[linear-gradient(135deg,#efefef,#9d9da5)]",
    "bg-[linear-gradient(120deg,#2f2f33,#6d6d75,#2f2f33)]",
  ];
  const journalGradients = [
    "bg-[linear-gradient(160deg,#6b7a6c_0%,#3c463d_45%,#1c211c_100%)]",
    "bg-[radial-gradient(circle_at_65%_55%,#7a5230,#1a1a1c_60%)]",
  ];

  return (
    <>
      <AnalyticsTracker path="/" />
      <SectionViewTracker />
      <PublicNav />

      <main className="font-body text-[17px] leading-[1.5] text-[#1d1d1f]">
        {/* HERO */}
        <section id="home" className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-8 px-6 md:grid-cols-[1fr_0.9fr]">
            <div>
              <h1 className="mb-3 font-display text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[5rem]">
                {hero?.name ?? "Vincent Omolo"}
              </h1>
              <p className="mb-5 font-display text-[1.2rem] text-[#7a7a7a] md:text-[1.6rem]">
                {hero?.title ?? "Creative Designer & Digital Craftsman"}
              </p>
              <p className="mb-8 max-w-[42ch] text-[#333333]">
                {hero?.description ??
                  "I partner with forward-thinking teams to create digital products and brands that are elegant, intuitive, and built to last."}
              </p>
              <div className="flex flex-wrap gap-3.5">
                <a
                  href={hero?.primaryCtaLink ?? "#work"}
                  className="rounded-full bg-[#0066cc] px-[22px] py-[11px] text-[15px] text-white transition hover:bg-[#0071e3]"
                >
                  {hero?.primaryCtaText ?? "View Work"}
                </a>
                <a
                  href={hero?.secondaryCtaLink ?? "#about"}
                  className="rounded-full bg-[#f5f5f7] px-[22px] py-[11px] text-[15px] text-[#1d1d1f] transition hover:bg-[#e8e8ed]"
                >
                  {hero?.secondaryCtaText ?? "About Me"}
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative aspect-square w-[min(360px,78vw)]">
                <MediaOrPlaceholder
                  media={hero?.image ?? null}
                  fallbackAlt={hero?.name ?? "Vincent Omolo"}
                  placeholderClassName={`h-full w-full ${sculptureBase} bg-[radial-gradient(circle_at_32%_28%,#ffffff,#e4e4e8_55%,#c9c9cf_100%)]`}
                  imageClassName={`h-full w-full object-cover ${sculptureBase}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section id="work" className="bg-[#272729] py-16 md:py-20">
          <div className="mx-auto max-w-[1120px] px-6">
            <p className="mb-2 text-[13px] text-[#0066cc]">Selected Work</p>
            <h2 className="mb-11 font-display text-[1.9rem] font-semibold tracking-[-0.02em] text-white md:text-[2.6rem]">
              Selected Work
            </h2>

            {projects.length === 0 ? (
              <p className="text-white/60">
                No projects yet — add some from the admin Content pages.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((project, i) => (
                  <article
                    key={project.id}
                    className="rounded-[18px] bg-[#2a2a2c] p-[18px]"
                  >
                    <div className="mb-4 aspect-square overflow-hidden rounded-xl">
                      <MediaOrPlaceholder
                        media={project.image}
                        fallbackAlt={project.title}
                        placeholderClassName={`h-full w-full ${workGradients[i % workGradients.length]}`}
                        imageClassName="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mb-1 font-display text-[17px] font-semibold text-white">
                      {project.title}
                    </h3>
                    <p className="mb-3 text-[14px] text-white/60">
                      {project.category}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        className="group inline-block text-[15px] text-[#0066cc] transition hover:text-[#0071e3]"
                      >
                        Learn more{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-[3px]">
                          &rarr;
                        </span>
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="mb-4 font-display text-[1.9rem] font-semibold tracking-[-0.02em] md:text-[2.6rem]">
                {about?.headline ??
                  "I design digital experiences that blend strategy, aesthetics, and technology."}
              </h2>
              <p className="mb-5 max-w-[46ch] text-[#333333]">
                {about?.body ??
                  "With a growing foundation in leading initiatives and crafting considered digital solutions, I help ideas turn into clear, beautiful, and impactful outcomes."}
              </p>
              <a
                href={about?.linkHref ?? "#"}
                className="group inline-block text-[15px] text-[#0066cc] transition hover:text-[#0071e3]"
              >
                {about?.linkText ?? "More about my approach"}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-[3px]">
                  &rarr;
                </span>
              </a>
            </div>

            <div className="flex justify-center">
              <div className="w-[min(320px,70vw)]" style={{ aspectRatio: 0.85 }}>
                <MediaOrPlaceholder
                  media={about?.image ?? null}
                  fallbackAlt="About Vincent Omolo"
                  placeholderClassName="h-full w-full rounded-[46%_54%_38%_62%/55%_45%_55%_45%] bg-[radial-gradient(circle_at_40%_25%,#f2f2f4,#7d7d85_85%)]"
                  imageClassName="h-full w-full rounded-[46%_54%_38%_62%/55%_45%_55%_45%] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* HOW I CAN HELP */}
        <section id="help" className="bg-[#f5f5f7] py-16 md:py-20">
          <div className="mx-auto max-w-[1120px] px-6">
            <p className="mb-2 text-[13px] text-[#0066cc]">How I can help</p>
            <h2 className="mb-11 font-display text-[1.9rem] font-semibold tracking-[-0.02em] md:text-[2.6rem]">
              How I can help
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-[18px] bg-white p-[26px_22px]"
                >
                  <div className="mb-[18px]">
                    <ServiceIcon name={service.iconName} />
                  </div>
                  <h3 className="mb-2 font-display text-[17px] font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-[15px] text-[#7a7a7a]">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* JOURNAL */}
        <section id="journal" className="bg-[#272729] py-16 md:py-20">
          <div className="mx-auto max-w-[1120px] px-6">
            <p className="mb-2 text-[13px] text-[#0066cc]">Journal</p>
            <h2 className="mb-11 font-display text-[1.9rem] font-semibold tracking-[-0.02em] text-white md:text-[2.6rem]">
              Latest thoughts
            </h2>

            {posts.length === 0 ? (
              <p className="text-white/60">No posts yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {posts.map((post, i) => (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-[18px] bg-[#2a2a2c]"
                  >
                    <div className="aspect-[16/10]">
                      <MediaOrPlaceholder
                        media={post.image}
                        fallbackAlt={post.title}
                        placeholderClassName={`h-full w-full ${journalGradients[i % journalGradients.length]}`}
                        imageClassName="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-[20px_22px]">
                      <h3 className="mb-1 font-display text-[18px] font-semibold text-white">
                        {post.title}
                      </h3>
                      <p className="mb-3.5 text-[14px] text-white/55">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <a
                        href={`/journal/${post.slug}`}
                        className="group inline-block text-[15px] text-[#0066cc] transition hover:text-[#0071e3]"
                      >
                        Read article{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-[3px]">
                          &rarr;
                        </span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-white py-16 text-center md:py-20">
          <div className="mx-auto max-w-[560px] px-6">
            <h2 className="mb-4 font-display text-[1.9rem] font-semibold tracking-[-0.02em] md:text-[2.6rem]">
              Let&apos;s create something meaningful together.
            </h2>
            <p className="mb-7 text-[#333333]">
              Reach out about a project, a collaboration, or just to say hello.
            </p>
            <a
              href={`mailto:${footer?.email ?? "hello@vincentomolo.com"}`}
              className="inline-block rounded-full bg-[#0066cc] px-[22px] py-[11px] text-[15px] text-white transition hover:bg-[#0071e3]"
            >
              {footer?.email ?? "hello@vincentomolo.com"}
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#f5f5f7] pt-14">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 border-b border-black/10 px-6 pb-10 md:grid-cols-[1fr_2fr]">
          <div className="max-w-[220px]">
            <span className="font-display text-[17px] font-semibold">VO</span>
            <p className="mt-3.5 text-[14px] leading-[1.5] text-[#7a7a7a]">
              {footer?.tagline ??
                "Designing what matters. Building with intention."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <h4 className="mb-3.5 font-display text-[13px] font-semibold">
                Work
              </h4>
              <a href="#work" className="mb-2.5 block text-[14px] text-[#7a7a7a] hover:text-[#1d1d1f]">
                Selected Work
              </a>
            </div>
            <div>
              <h4 className="mb-3.5 font-display text-[13px] font-semibold">
                About
              </h4>
              <a href="#about" className="mb-2.5 block text-[14px] text-[#7a7a7a] hover:text-[#1d1d1f]">
                About Me
              </a>
            </div>
            <div>
              <h4 className="mb-3.5 font-display text-[13px] font-semibold">
                Journal
              </h4>
              <a href="#journal" className="mb-2.5 block text-[14px] text-[#7a7a7a] hover:text-[#1d1d1f]">
                Latest Articles
              </a>
            </div>
            <div>
              <h4 className="mb-3.5 font-display text-[13px] font-semibold">
                Contact
              </h4>
              <a
                href={`mailto:${footer?.email ?? "hello@vincentomolo.com"}`}
                className="mb-2.5 block text-[14px] text-[#7a7a7a] hover:text-[#1d1d1f]"
              >
                {footer?.email ?? "hello@vincentomolo.com"}
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-6 py-6 text-[13px] text-[#7a7a7a]">
          <div className="flex gap-4">
            {footer?.linkedin && (
              <a href={footer.linkedin} className="hover:text-[#1d1d1f]">
                LinkedIn
              </a>
            )}
            {footer?.behance && (
              <a href={footer.behance} className="hover:text-[#1d1d1f]">
                Behance
              </a>
            )}
            {footer?.instagram && (
              <a href={footer.instagram} className="hover:text-[#1d1d1f]">
                Instagram
              </a>
            )}
          </div>
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {footer?.copyright ?? "Vincent Omolo. All rights reserved."}
          </p>
        </div>
      </footer>
    </>
  );
}
