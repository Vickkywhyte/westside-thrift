"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=90",
    label: "The Archive",
    line1: "Dress with",
    line2: "intention.",
    position: "object-top",
  },
  {
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=90",
    label: "New Arrivals",
    line1: "Vintage.",
    line2: "Curated.",
    position: "object-center",
  },
  {
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=90",
    label: "The Collection",
    line1: "Find your",
    line2: "signature.",
    position: "object-center",
  },
  {
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=90",
    label: "Jericho, Ibadan",
    line1: "The archive",
    line2: "is open.",
    position: "object-top",
  },
];

const DURATION = 5500;

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const goTo = useCallback((index: number) => {
    setActive(index);
    setAnimKey((k) => k + 1);
    setProgress(0);
  }, []);

  const advance = useCallback(() => {
    setActive((a) => {
      const next = (a + 1) % SLIDES.length;
      return next;
    });
    setAnimKey((k) => k + 1);
    setProgress(0);
  }, []);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(advance, DURATION);
    return () => clearInterval(id);
  }, [advance]);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(((now - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const slide = SLIDES[active];

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "100dvh" }}>

        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: i === active ? 1 : 0,
              transition: "opacity 1.2s ease",
              zIndex: i === active ? 1 : 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.img}
              alt=""
              className={`w-full h-full object-cover ${s.position}`}
              style={
                i === active
                  ? { animation: `kenBurns ${DURATION}ms ease-out forwards` }
                  : { transform: "scale(1)" }
              }
            />
          </div>
        ))}

        {/* Gradient layers */}
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%)" }} />
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />

        {/* Vertical side label — left */}
        <div className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
          <div className="w-px h-12 bg-white/20" />
          <span
            className="font-technical text-[9px] tracking-[0.35em] text-white/40 uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Curated Vintage Menswear
          </span>
          <div className="w-px h-12 bg-white/20" />
        </div>

        {/* Slide counter — right */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2">
          <span className="font-technical text-[13px] font-bold tracking-widest text-white">
            {String(active + 1).padStart(2, "0")}
          </span>
          <div className="w-px h-10 bg-white/20" />
          <span className="font-technical text-[11px] tracking-widest text-white/30">
            {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-16 pb-20">
          <div className="max-w-4xl">
            {/* Label */}
            <p
              key={`lbl-${animKey}`}
              className="font-technical text-[10px] md:text-[11px] tracking-[0.35em] text-white/50 uppercase mb-5"
              style={{ animation: "heroUp 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              {slide.label}&ensp;—&ensp;Est. 2021 Jericho
            </p>

            {/* Headline */}
            <h1
              key={`h1-${animKey}`}
              className="font-display font-semibold text-white leading-[0.95] tracking-tight mb-10"
              style={{
                fontSize: "clamp(56px, 10vw, 128px)",
                animation: "heroUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.08s both",
              }}
            >
              {slide.line1}<br />
              <em className="not-italic" style={{ color: "rgba(220,170,140,0.9)" }}>
                {slide.line2}
              </em>
            </h1>

            {/* CTAs */}
            <div
              key={`cta-${animKey}`}
              className="flex gap-3 flex-wrap"
              style={{ animation: "heroUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.18s both" }}
            >
              <Link
                href="/shop"
                className="inline-block bg-(--color-primary) text-white px-8 md:px-10 py-4 font-label text-[11px] tracking-[0.2em] uppercase hover:bg-white hover:text-(--color-primary) transition-all duration-300"
              >
                Shop the Collection
              </Link>
              <Link
                href="/about"
                className="inline-block border border-white/40 text-white px-8 md:px-10 py-4 font-label text-[11px] tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="absolute bottom-7 right-6 md:right-16 z-20 flex gap-2 items-center">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="p-1"
            >
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === active ? "24px" : "6px",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: i === active ? "white" : "rgba(255,255,255,0.3)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10">
          <div
            className="h-full transition-none"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-primary)",
            }}
          />
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{ animation: "heroFadeIn 1s ease 1.5s both" }}
        >
          <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-white/60 rounded-full" style={{ animation: "scrollDot 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="bg-[#0f0f0f] overflow-hidden py-3.5 border-y border-white/5">
        <div
          className="flex items-center whitespace-nowrap"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {[0, 1].map((rep) => (
            <span key={rep} className="flex items-center shrink-0">
              {[
                "WESTSIDE",
                "JERICHO · IBADAN",
                "EST. 2021",
                "CURATED VINTAGE",
                "1960s – 1990s",
                "HAND-SELECTED",
                "ONE OF A KIND",
                "FREE RETURNS",
                "WESTSIDE",
                "AUTHENTIC PIECES",
                "IBADAN · NIGERIA",
                "THE ARCHIVE",
              ].map((text, j) => (
                <span key={j} className="flex items-center">
                  <span className="font-technical text-[10px] tracking-[0.3em] text-white/50 uppercase px-5">
                    {text}
                  </span>
                  <span className="text-[var(--color-primary)] text-[8px] opacity-60">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1) translateY(0px); }
          to   { transform: scale(1.12) translateY(-1.5%); }
        }
        @keyframes heroUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(8px); opacity: 0.2; }
        }
      `}</style>
    </>
  );
}
