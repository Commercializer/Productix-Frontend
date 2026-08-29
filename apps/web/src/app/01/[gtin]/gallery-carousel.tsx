"use client";

// One-at-a-time image carousel for the DPP passport view's product gallery
// (see dpp-view.tsx). Replaces a plain scroll strip so a visitor focuses on
// one photo at a time - swipe on mobile (the primary way this page is
// viewed, via a scanned QR code), or the arrow/dot controls on desktop.
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  url: string;
  name: string;
}

const SWIPE_THRESHOLD_PX = 40;

export function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) return null;

  const goTo = (i: number) => setIndex((i + images.length) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]!.clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0]!.clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    goTo(index + (delta < 0 ? 1 : -1));
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          background: "#f1f5f9",
          aspectRatio: "4 / 3",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 300ms ease",
          }}
        >
          {images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.url}
              src={img.url}
              alt={img.name}
              style={{ flex: "0 0 100%", width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              style={arrowStyle("left")}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              style={arrowStyle("right")}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: i === index ? 16 : 6,
                height: 6,
                borderRadius: 999,
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: i === index ? "#0f172a" : "#cbd5e1",
                transition: "all 200ms ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function arrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: 10,
    transform: "translateY(-50%)",
    width: 32,
    height: 32,
    borderRadius: 999,
    border: "none",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };
}
