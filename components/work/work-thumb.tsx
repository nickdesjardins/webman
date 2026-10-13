import Image from "next/image";
import { cn } from "@/lib/utils";

/** Every capture under /public/img/work is exported at this size. */
export const THUMB_WIDTH = 800;
export const THUMB_HEIGHT = 506;

interface WorkThumbProps {
  /** Public path to an 800x506 JPEG. The gradient frame renders alone when absent. */
  src?: string;
  /** Pass an empty string when the surrounding link or heading already names the item. */
  alt: string;
  /** Responsive sizes hint for next/image. */
  sizes: string;
  className?: string;
  /** Applied to the image element, for hover scale inside group containers. */
  imageClassName?: string;
  /** Overlays, positioned against the frame. */
  children?: React.ReactNode;
}

/**
 * Framed 800x506 thumbnail. A token gradient sits behind the image so a slow
 * or missing capture still reads as an intentional surface.
 */
export function WorkThumb({ src, alt, sizes, className, imageClassName, children }: WorkThumbProps) {
  return (
    <div
      className={cn(
        "relative aspect-[800/506] w-full overflow-hidden rounded-xl border border-border/70 bg-linear-to-br from-secondary to-card",
        className
      )}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          width={THUMB_WIDTH}
          height={THUMB_HEIGHT}
          sizes={sizes}
          className={cn("absolute inset-0 size-full object-cover object-top", imageClassName)}
        />
      )}
      {children}
    </div>
  );
}
