"use client";

import { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-(--color-surface-container-low) border border-(--color-outline-variant) flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl text-(--color-outline)">hanger</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse gap-4">
      {/* Main image */}
      <div className="flex-1 bg-(--color-surface-container-low) border border-(--color-outline-variant) overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={name}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex flex-col gap-3 w-20 shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-20 h-20 border overflow-hidden transition-all ${
                active === i
                  ? "border-(--color-primary)"
                  : "border-(--color-outline-variant)/30 hover:border-(--color-outline)"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
