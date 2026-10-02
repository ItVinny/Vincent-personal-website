import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  // Single upload endpoint used everywhere in the admin: the Media
  // Library's "Upload" button and every content form's image picker.
  // Every upload becomes its own Media row -- attaching it to a
  // specific Hero/About/Project/Journal field happens separately,
  // via the attachImage server action, after the file lands here.
  mediaUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session) {
        throw new UploadThingError("You must be signed in to upload images.");
      }
      const userId = (session.user as { id?: string } | undefined)?.id;
      return { userId: userId ?? "unknown" };
    })
    .onUploadComplete(async ({ file }) => {
      await prisma.media.create({
        data: {
          url: file.url,
          key: file.key,
          alt: file.name,
        },
      });
      // Nothing returned to the client is used right now, but
      // UploadThing requires onUploadComplete to return a plain object.
      return { uploaded: true };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
