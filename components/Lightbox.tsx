"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect } from "react";

export interface LightboxSlide {
  src: string;
  caption?: string;
}

interface LightboxProps {
  slides: LightboxSlide[];
  index: number | null;
  onChange: (index: number | null) => void;
}

/**
 * Minimal, dependency-free image gallery overlay that replaces GLightbox.
 * Supports backdrop / Escape to close and arrow keys / on-screen controls to
 * navigate between slides.
 */
export default function Lightbox({ slides, index, onChange }: LightboxProps) {
  const isOpen = index !== null;

  const close = useCallback(() => onChange(null), [onChange]);
  const prev = useCallback(() => {
    if (index === null) return;
    onChange((index - 1 + slides.length) % slides.length);
  }, [index, slides.length, onChange]);
  const next = useCallback(() => {
    if (index === null) return;
    onChange((index + 1) % slides.length);
  }, [index, slides.length, onChange]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, prev, next]);

  if (index === null) return null;
  const slide = slides[index];

  return (
    <div className="webman-lightbox" onClick={close} role="dialog" aria-modal="true">
      <button
        type="button"
        className="webman-lightbox__close"
        onClick={close}
        aria-label="Close"
      >
        <i className="bi bi-x-lg" />
      </button>

      {slides.length > 1 && (
        <button
          type="button"
          className="webman-lightbox__nav webman-lightbox__prev"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous"
        >
          <i className="bi bi-chevron-left" />
        </button>
      )}

      <figure
        className="webman-lightbox__figure"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={slide.src} alt={slide.caption ?? ""} />
        {slide.caption && <figcaption>{slide.caption}</figcaption>}
      </figure>

      {slides.length > 1 && (
        <button
          type="button"
          className="webman-lightbox__nav webman-lightbox__next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next"
        >
          <i className="bi bi-chevron-right" />
        </button>
      )}
    </div>
  );
}
