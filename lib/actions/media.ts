"use server";

import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const utapi = new UTApi();

async function requireAdmin() {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
}

type ActionResult = { success: true } | { success: false; error: string };

function fail(error: unknown): ActionResult {
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: "Something went wrong." };
}

function revalidateEverywhereMediaShows() {
  revalidatePath("/");
  revalidatePath("/admin/media");
  revalidatePath("/admin/content/hero");
  revalidatePath("/admin/content/about");
  revalidatePath("/admin/content/projects");
  revalidatePath("/admin/content/journal");
}

// ============================================
// DELETE
// Removes both the database row AND the actual file in storage.
// Deleting a media item currently attached to a content field is
// allowed -- Prisma's default behavior for an optional 1:1 relation
// (which imageId is, on every content model) is to set that field
// back to null rather than block the delete, so the content just
// reverts to its placeholder image, nothing breaks.
// ============================================

export async function deleteMedia(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return { success: false, error: "That image no longer exists." };
    }

    if (media.key) {
      await utapi.deleteFiles(media.key);
    }
    await prisma.media.delete({ where: { id } });

    revalidateEverywhereMediaShows();
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

// ============================================
// ATTACH
// Connects (or, with mediaId null, disconnects) a Media row to one
// of the four image slots in the content models. Each content type's
// imageId column is its own independent unique 1:1 relation, so the
// same image CAN be reused across different sections (e.g. the same
// headshot as both Hero and About), but not reused twice within the
// same collection (two different Projects can't share one Project
// image slot) -- Prisma enforces that automatically via the @unique
// constraint and will throw if you try.
// ============================================

type ImageTarget =
  | { type: "hero" }
  | { type: "about" }
  | { type: "project"; id: string }
  | { type: "journal"; id: string };

export async function attachImage(
  target: ImageTarget,
  mediaId: string | null
): Promise<ActionResult> {
  try {
    await requireAdmin();

    switch (target.type) {
      case "hero":
        await prisma.heroSection.upsert({
          where: { id: "singleton-hero" },
          update: { imageId: mediaId },
          create: { id: "singleton-hero", imageId: mediaId },
        });
        break;
      case "about":
        await prisma.aboutSection.upsert({
          where: { id: "singleton-about" },
          update: { imageId: mediaId },
          create: { id: "singleton-about", imageId: mediaId },
        });
        break;
      case "project":
        await prisma.project.update({
          where: { id: target.id },
          data: { imageId: mediaId },
        });
        break;
      case "journal":
        await prisma.journalPost.update({
          where: { id: target.id },
          data: { imageId: mediaId },
        });
        break;
    }

    revalidateEverywhereMediaShows();
    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("unique constraint")
    ) {
      return {
        success: false,
        error: "That image is already attached somewhere else in this same list.",
      };
    }
    return fail(error);
  }
}
