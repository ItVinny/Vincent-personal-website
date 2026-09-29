"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Every action re-checks the session itself. Middleware already blocks
// unauthenticated requests to /admin pages, but Server Actions can in
// principle be invoked directly, so this is the real authorization
// boundary -- never rely on middleware alone for this.
async function requireAdmin() {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
}

type ActionResult = { success: true } | { success: false; error: string };

function fail(error: unknown): ActionResult {
  if (error instanceof z.ZodError) {
    return { success: false, error: error.issues[0]?.message ?? "Invalid input." };
  }
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: "Something went wrong." };
}

// ============================================
// HERO (singleton)
// ============================================

const heroSchema = z.object({
  name: z.string().min(1, "Name is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  primaryCtaText: z.string().min(1),
  primaryCtaLink: z.string().min(1),
  secondaryCtaText: z.string().min(1),
  secondaryCtaLink: z.string().min(1),
});

export async function updateHero(data: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = heroSchema.parse(data);
    await prisma.heroSection.upsert({
      where: { id: "singleton-hero" },
      update: parsed,
      create: { id: "singleton-hero", ...parsed },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/hero");
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

// ============================================
// ABOUT (singleton)
// ============================================

const aboutSchema = z.object({
  headline: z.string().min(1, "Headline is required."),
  body: z.string().min(1, "Body text is required."),
  linkText: z.string().min(1),
  linkHref: z.string().min(1),
});

export async function updateAbout(data: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = aboutSchema.parse(data);
    await prisma.aboutSection.upsert({
      where: { id: "singleton-about" },
      update: parsed,
      create: { id: "singleton-about", ...parsed },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/about");
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

// ============================================
// FOOTER (singleton)
// ============================================

const footerSchema = z.object({
  tagline: z.string().min(1, "Tagline is required."),
  email: z.string().email("Enter a valid email address."),
  linkedin: z.string().optional().or(z.literal("")),
  behance: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  copyright: z.string().min(1),
});

export async function updateFooter(data: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = footerSchema.parse(data);
    await prisma.footerContent.upsert({
      where: { id: "singleton-footer" },
      update: parsed,
      create: { id: "singleton-footer", ...parsed },
    });
    revalidatePath("/");
    revalidatePath("/admin/content/footer");
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

// ============================================
// PROJECTS (repeatable)
// ============================================

const projectSchema = z.object({
  title: z.string().min(1, "Title is required."),
  category: z.string().min(1, "Category is required."),
  description: z.string().optional().default(""),
  link: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export async function createProject(data: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = projectSchema.parse(data);
    await prisma.project.create({ data: parsed });
    revalidatePath("/");
    revalidatePath("/admin/content/projects");
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

export async function updateProject(
  id: string,
  data: unknown
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = projectSchema.parse(data);
    await prisma.project.update({ where: { id }, data: parsed });
    revalidatePath("/");
    revalidatePath("/admin/content/projects");
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/content/projects");
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}
