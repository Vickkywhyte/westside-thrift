"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imgRef.current) return;
      const moveX = (e.clientX - window.innerWidth / 2) * 0.012;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.012;
      imgRef.current.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-end">
      {/* Background image with CSS motion */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80&auto=format&fit=crop"
          alt="Fashionista in curated vintage outfit"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out"
          style={{ transform: "scale(1.08)" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Animated floating badge */}
      <div
        className="absolute top-12 right-8 md:right-16 z-10 rotate-12"
        style={{ animation: "float 4s ease-in-out infinite" }}
      >
        <div className="w-20 h-20 rounded-full border-2 border-white/60 flex flex-col items-center justify-center text-center bg-black/20 backdrop-blur-sm">
          <span className="font-technical text-[9px] tracking-widest text-white/80 uppercase leading-tight">Est.</span>
          <span className="font-headline text-lg font-semibold text-white leading-none">2021</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-(--spacing-margin-desktop) pb-16 max-w-(--spacing-container-max) mx-auto w-full">
        <div className="max-w-2xl">
          <p
            className="font-technical text-[11px] text-(--color-secondary-fixed) mb-5 uppercase tracking-[0.25em]"
            style={{ animation: "fadeUp 0.8s ease-out 0.2s both" }}
          >
            Bodija, Ibadan — Curated Vintage
          </p>
          <h1
            className="font-display font-semibold text-(--color-surface-bright) leading-none mb-8 tracking-tight"
            style={{ fontSize: "clamp(40px, 7vw, 80px)", animation: "fadeUp 0.8s ease-out 0.35s both" }}
          >
            Dress with<br />
            <span className="italic text-(--color-primary-fixed-dim)">intention.</span>
          </h1>
          <div
            className="flex gap-4 flex-wrap"
            style={{ animation: "fadeUp 0.8s ease-out 0.5s both" }}
          >
            <Link
              href="/shop"
              className="bg-(--color-primary) text-white px-8 py-4 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors shadow-lg"
            >
              Shop the Collection
            </Link>
            <Link
              href="/about"
              className="border border-white/70 text-white px-8 py-4 font-label text-xs tracking-widest uppercase hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ animation: "fadeIn 1s ease-out 1.2s both" }}
      >
        <span className="font-label text-[10px] tracking-widest uppercase text-white/50">Scroll</span>
        <div className="w-px h-8 bg-white/30" style={{ animation: "pulse 2s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.3); }
        }
      `}</style>
    </section>
  );
}
