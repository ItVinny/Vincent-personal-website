// Seeds the database with an admin user and the content that's currently
// hardcoded in the static site, so the DB-driven version looks identical
// on first load.
//
// Run with: npx prisma db seed
// (configured via the "prisma.seed" key in package.json)

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before seeding."
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      name: "Vincent Omolo",
    },
  });

  // --- Hero ------------------------------------------------------------
  await prisma.heroSection.upsert({
    where: { id: "singleton-hero" },
    update: {},
    create: {
      id: "singleton-hero",
      name: "Vincent Omolo",
      title: "Creative Designer & Digital Craftsman",
      description:
        "I partner with forward-thinking teams to create digital products and brands that are elegant, intuitive, and built to last.",
      primaryCtaText: "View Work",
      primaryCtaLink: "#work",
      secondaryCtaText: "About Me",
      secondaryCtaLink: "#about",
    },
  });

  // --- About -------------------------------------------------------
  await prisma.aboutSection.upsert({
    where: { id: "singleton-about" },
    update: {},
    create: {
      id: "singleton-about",
      headline:
        "I design digital experiences that blend strategy, aesthetics, and technology.",
      body: "With a growing foundation in leading initiatives and crafting considered digital solutions, I help ideas turn into clear, beautiful, and impactful outcomes.",
      linkText: "More about my approach",
      linkHref: "#",
    },
  });

  // --- Footer --------------------------------------------------------
  await prisma.footerContent.upsert({
    where: { id: "singleton-footer" },
    update: {},
    create: {
      id: "singleton-footer",
      tagline: "Designing what matters. Building with intention.",
      email: "hello@vincentomolo.com",
      copyright: "Vincent Omolo. All rights reserved.",
    },
  });

  // --- Projects (placeholders, matching the current static site) ---
  const projects = [
    { title: "Lumen Studio", category: "Digital Platform", description: "", order: 0 },
    { title: "Æther", category: "Brand Identity", description: "", order: 1 },
    { title: "Oblique Interface", category: "Product Design", description: "", order: 2 },
    { title: "Nordic Atmos", category: "Digital Experience", description: "", order: 3 },
  ];
  for (const p of projects) {
    await prisma.project.upsert({
      where: { id: `seed-project-${p.order}` },
      update: {},
      create: { id: `seed-project-${p.order}`, ...p },
    });
  }

  // --- Services --------------------------------------------------------
  const services = [
    { title: "Strategy", description: "Clear direction grounded in insight and aligned to real goals.", iconName: "target", order: 0 },
    { title: "Design Systems", description: "Scalable, consistent systems that empower teams and elevate products.", iconName: "grid", order: 1 },
    { title: "Digital Experiences", description: "Thoughtful interactions and interfaces that engage and inspire.", iconName: "monitor", order: 2 },
    { title: "Brand Direction", description: "Distinctive brand worlds that connect, resonate, and endure.", iconName: "compass", order: 3 },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { id: `seed-service-${s.order}` },
      update: {},
      create: { id: `seed-service-${s.order}`, ...s },
    });
  }

  // --- Journal posts -------------------------------------------------
  const posts = [
    {
      title: "The Value of Restraint in Digital Design",
      slug: "value-of-restraint-in-digital-design",
      excerpt: "Why the best interfaces are often the ones you notice least.",
      order: 0,
    },
    {
      title: "Designing for Emotion Without the Noise",
      slug: "designing-for-emotion-without-the-noise",
      excerpt: "Balancing feeling and function without tipping into decoration.",
      order: 1,
    },
  ];
  for (const post of posts) {
    await prisma.journalPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
