import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Typed against ourFileRouter, so TypeScript knows "mediaUploader" is a
// valid endpoint name anywhere this is used, and catches typos at
// compile time instead of failing silently at runtime.
export const UploadButton = generateUploadButton<OurFileRouter>();
