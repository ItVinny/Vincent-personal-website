// Renders an uploaded image when one exists on the content item, or an
// abstract CSS-gradient "sculpture" placeholder matching the original
// design when it doesn't (e.g. before the owner has uploaded real photos
// via the Media Library).

import Image from "next/image";

type MediaLike = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
} | null;

export function MediaOrPlaceholder({
  media,
  placeholderClassName,
  imageClassName,
  fallbackAlt,
}: {
  media: MediaLike;
  placeholderClassName: string;
  imageClassName?: string;
  fallbackAlt: string;
}) {
  if (media) {
    return (
      <Image
        src={media.url}
        alt={media.alt || fallbackAlt}
        width={media.width ?? 800}
        height={media.height ?? 800}
        className={imageClassName ?? "h-full w-full rounded-[18px] object-cover"}
      />
    );
  }

  return <div className={placeholderClassName} aria-hidden="true" />;
}
