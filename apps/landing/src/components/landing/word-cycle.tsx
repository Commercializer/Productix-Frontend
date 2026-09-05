"use client";

import { useEffect, useState } from "react";

export function WordCycle({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className="relative inline-grid" aria-live="off">
      {words.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== index}
          className="col-start-1 row-start-1 text-accent transition-opacity duration-500"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {word}
        </span>
      ))}
      <span className="invisible col-start-1 row-start-1">
        {words.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
    </span>
  );
}
