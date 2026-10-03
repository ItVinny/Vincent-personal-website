import { prisma } from "@/lib/prisma";
import { PublicNav } from "./_components/PublicNav";
import { AnalyticsTracker } from "./_components/AnalyticsTracker";
import { SectionViewTracker } from "./_components/SectionViewTracker";
import { MediaOrPlaceholder } from "./_components/MediaOrPlaceholder";
import { ServiceIcon } from "./_components/ServiceIcon";

// Revalidate periodically rather than on every request, since content
// only changes when the owner edits it in /admin.
export const revalidate = 60;

const sculptureBase = "rounded-full shadow-[3px_5px_30px_rgba(0,0,0,0.3)]";

// Hero, Selected Work, Journal, and the Footer stay permanently
// dark-teal regardless of the light/dark toggle -- per the MongoDB
// design system, these are the brand-signature dark bands ("Don't
// replace deep teal hero bands with white hero bands"). The toggle
// governs the nav, About, Services, and Contact sections instead.

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
    "bg-[radial-gradient(circle_at_40%_35%,#2d5f6e,#003d4f_75%)]",
    "bg-[radial-gradient(circle_at_45%_30%,#00a35c,#00684a_80%)]",
    "bg-[linear-gradient(135deg,#1c2d38,#003d4f)]",
    "bg-[linear-gradient(120deg,#00684a,#001e2b,#00684a)]",
  ];
  const journalGradients = [
    "bg-[linear-gradient(160deg,#00a35c_0%,#00684a_45%,#001e2b_100%)]",
    "bg-[radial-gradient(circle_at_65%_55%,#003d4f,#001e2b_60%)]",
  ];

  return (
    <>
      <AnalyticsTracker path="/" />
      <SectionViewTracker />
      <PublicNav />

      <main className="font-mongo text-[16px] leading-[1.55] text-[#001e2b] dark:text-white">
        {/* HERO -- permanently dark-teal */}
        <section id="home" className="bg-[#001e2b] py-16 md:py-24">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1fr_0.9fr]">
            <div>
              <h1 className="mb-4 text-[3rem] font-medium leading-[1.08] tracking-[-1.5px] text-white md:text-[4.3rem]">
                {hero?.name ?? "Vincent Omolo"}
              </h1>
              <p className="mb-5 text-[1.15rem] font-normal text-[#a8b3bc] md:text-[1.4rem]">
                {hero?.title ?? "Creative Designer & Digital Craftsman"}
              </p>
              <p className="mb-8 max-w-[42ch] text-[#c3d0d6]">
                {hero?.description ??
                  "I partner with forward-thinking teams to create digital products and brands that are elegant, intuitive, and built to last."}
              </p>
              <div className="flex flex-wrap gap-3.5">
                <a
                  href={hero?.primaryCtaLink ?? "#work"}
                  className="rounded-full bg-[#00ed64] px-[22px] py-[11px] text-[14px] font-semibold text-[#001e2b] transition hover:bg-[#00b545]"
                >
                  {hero?.primaryCtaText ?? "View Work"}
                </a>
                <a
                  href={hero?.secondaryCtaLink ?? "#about"}
                  className="rounded-full border border-[#1c2d38] px-[22px] py-[11px] text-[14px] font-semibold text-white transition hover:bg-white/5"
                >
                  {hero?.secondaryCtaText ?? "About Me"}
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative aspect-square w-[min(340px,78vw)]">
                <MediaOrPlaceholder
                  media={hero?.image ?? null}
                  fallbackAlt={hero?.name ?? "Vincent Omolo"}
                  placeholderClassName={`h-full w-full ${sculptureBase} bg-[radial-gradient(circle_at_32%_28%,#00a35c,#00684a_55%,#001e2b_100%)]`}
                  imageClassName={`h-full w-full object-cover ${sculptureBase}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SELECTED WORK -- permanently dark-teal */}
        <section id="work" className="bg-[#001e2b] py-16 md:py-20">
          <div className="mx-auto max-w-[1180px] px-6">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-[1px] text-[#00ed64]">
              Selected Work
            </p>
            <h2 className="mb-11 text-[1.9rem] font-medium tracking-[-0.5px] text-white md:text-[2.4rem]">
              Selected Work
            </h2>

            {projects.length === 0 ? (
              <p className="text-[#a8b3bc]">
                No projects yet — add some from the admin Content pages.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((project, i) => (
                  <article
                    key={project.id}
                    className="rounded-[12px] bg-[#003d4f] p-[18px]"
                  >
                    <div className="mb-4 aspect-square overflow-hidden rounded-[8px]">
                      <MediaOrPlaceholder
                        media={project.image}
                        fallbackAlt={project.title}
                        placeholderClassName={`h-full w-full ${workGradients[i % workGradients.length]}`}
                        imageClassName="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mb-1 text-[16px] font-medium text-white">
                      {project.title}
                    </h3>
                    <p className="mb-3 text-[13px] text-[#a8b3bc]">
                      {project.category}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        className="group inline-block text-[14px] font-medium text-[#00ed64] transition hover:text-[#3ff590]"
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

        {/* ABOUT -- toggles with theme */}
        <section id="about" className="bg-white py-16 dark:bg-[#001e2b] md:py-20">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="mb-4 text-[1.9rem] font-medium tracking-[-0.5px] text-[#001e2b] dark:text-white md:text-[2.4rem]">
                {about?.headline ??
                  "I design digital experiences that blend strategy, aesthetics, and technology."}
              </h2>
              <p className="mb-5 max-w-[46ch] text-[#3d4f5b] dark:text-[#a8b3bc]">
                {about?.body ??
                  "With a growing foundation in leading initiatives and crafting considered digital solutions, I help ideas turn into clear, beautiful, and impactful outcomes."}
              </p>
              <a
                href={about?.linkHref ?? "#"}
                className="group inline-block text-[14px] font-medium text-[#00684a] transition hover:text-[#00a35c] dark:text-[#00ed64] dark:hover:text-[#3ff590]"
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
                  placeholderClassName="h-full w-full rounded-[46%_54%_38%_62%/55%_45%_55%_45%] bg-[radial-gradient(circle_at_40%_25%,#c3f0d2,#00a35c_85%)]"
                  imageClassName="h-full w-full rounded-[46%_54%_38%_62%/55%_45%_55%_45%] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* HOW I CAN HELP -- toggles with theme */}
        <section id="help" className="bg-[#f9fbfa] py-16 dark:bg-[#001e2b] md:py-20">
          <div className="mx-auto max-w-[1180px] px-6">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-[1px] text-[#00684a] dark:text-[#00ed64]">
              How I can help
            </p>
            <h2 className="mb-11 text-[1.9rem] font-medium tracking-[-0.5px] text-[#001e2b] dark:text-white md:text-[2.4rem]">
              How I can help
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-[12px] border border-[#e1e5e8] bg-white p-[26px_22px] dark:border-[#1c2d38] dark:bg-[#003d4f]"
                >
                  <div className="mb-[18px]">
                    <ServiceIcon name={service.iconName} />
                  </div>
                  <h3 className="mb-2 text-[16px] font-medium text-[#001e2b] dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-[14px] text-[#5c6c7a] dark:text-[#a8b3bc]">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* JOURNAL -- permanently dark-teal */}
        <section id="journal" className="bg-[#001e2b] py-16 md:py-20">
          <div className="mx-auto max-w-[1180px] px-6">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-[1px] text-[#00ed64]">
              Journal
            </p>
            <h2 className="mb-11 text-[1.9rem] font-medium tracking-[-0.5px] text-white md:text-[2.4rem]">
              Latest thoughts
            </h2>

            {posts.length === 0 ? (
              <p className="text-[#a8b3bc]">No posts yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {posts.map((post, i) => (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-[12px] bg-[#003d4f]"
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
                      <h3 className="mb-1 text-[17px] font-medium text-white">
                        {post.title}
                      </h3>
                      <p className="mb-3.5 text-[13px] text-[#a8b3bc]">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <a
                        href={`/journal/${post.slug}`}
                        className="group inline-block text-[14px] font-medium text-[#00ed64] transition hover:text-[#3ff590]"
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

        {/* CONTACT -- toggles with theme */}
        <section id="contact" className="bg-white py-16 text-center dark:bg-[#001e2b] md:py-20">
          <div className="mx-auto max-w-[560px] px-6">
            <h2 className="mb-4 text-[1.9rem] font-medium tracking-[-0.5px] text-[#001e2b] dark:text-white md:text-[2.4rem]">
              Let&apos;s create something meaningful together.
            </h2>
            <p className="mb-7 text-[#3d4f5b] dark:text-[#a8b3bc]">
              Reach out about a project, a collaboration, or just to say hello.
            </p>
            <a
              href={`mailto:${footer?.email ?? "hello@vincentomolo.com"}`}
              className="inline-block rounded-full bg-[#00ed64] px-[22px] py-[11px] text-[14px] font-semibold text-[#001e2b] transition hover:bg-[#00b545]"
            >
              {footer?.email ?? "hello@vincentomolo.com"}
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER -- permanently dark-teal, per the MongoDB footer-region spec */}
      <footer className="bg-[#001e2b] pt-14 font-mongo">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 border-b border-white/10 px-6 pb-10 md:grid-cols-[1fr_2fr]">
          <div className="max-w-[220px]">
            <span className="text-[17px] font-semibold text-white">VO</span>
            <p className="mt-3.5 text-[14px] leading-[1.5] text-[#a8b3bc]">
              {footer?.tagline ??
                "Designing what matters. Building with intention."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <h4 className="mb-3.5 text-[13px] font-medium text-white">
                Work
              </h4>
              <a href="#work" className="mb-2.5 block text-[14px] text-[#a8b3bc] hover:text-white">
                Selected Work
              </a>
            </div>
            <div>
              <h4 className="mb-3.5 text-[13px] font-medium text-white">
                About
              </h4>
              <a href="#about" className="mb-2.5 block text-[14px] text-[#a8b3bc] hover:text-white">
                About Me
              </a>
            </div>
            <div>
              <h4 className="mb-3.5 text-[13px] font-medium text-white">
                Journal
              </h4>
              <a href="#journal" className="mb-2.5 block text-[14px] text-[#a8b3bc] hover:text-white">
                Latest Articles
              </a>
            </div>
            <div>
              <h4 className="mb-3.5 text-[13px] font-medium text-white">
                Contact
              </h4>
              <a
                href={`mailto:${footer?.email ?? "hello@vincentomolo.com"}`}
                className="mb-2.5 block text-[14px] text-[#a8b3bc] hover:text-white"
              >
                {footer?.email ?? "hello@vincentomolo.com"}
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-6 py-6 text-[13px] text-[#a8b3bc]">
          <div className="flex gap-4">
            {footer?.linkedin && (
              <a href={footer.linkedin} className="hover:text-white">
                LinkedIn
              </a>
            )}
            {footer?.behance && (
              <a href={footer.behance} className="hover:text-white">
                Behance
              </a>
            )}
            {footer?.instagram && (
              <a href={footer.instagram} className="hover:text-white">
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
