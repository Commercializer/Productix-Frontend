"use client";

import { motion } from "motion/react";
import { useEffect, useId, useState, type RefObject } from "react";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  /**
   * "curve" draws a smooth quadratic bezier (the default). "elbow" draws a
   * circuit-trace-style path: a 45° diagonal segment near the start point
   * followed by a flat run to the end point, with no bend at all when the
   * two points already share a Y.
   */
  route?: "curve" | "elbow";
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  showStartDot?: boolean;
  showEndDot?: boolean;
  dotRadius?: number;
  /**
   * When true, the endpoints are pulled in from each element's center to
   * its actual measured edge (facing the other element) instead of
   * terminating in the middle of it. Assumes a roughly horizontal
   * approach between the two elements.
   */
  stopAtEdge?: boolean;
  /** Extra breathing room (px) pulled back past the measured edge when stopAtEdge is set. */
  edgeGap?: number;
}

/**
 * A magicui-pattern animated connector: measures two DOM nodes inside a
 * shared container and draws a curved SVG path between them with an
 * animated gradient stroke. Re-measures on resize so it stays correct
 * as the layout reflows.
 */
export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  route = "curve",
  reverse = false,
  duration = 4,
  delay = 0,
  pathColor = "rgba(10, 17, 32, 0.12)",
  pathWidth = 2,
  pathOpacity = 1,
  gradientStartColor = "#00ccc6",
  gradientStopColor = "#39a5db",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  showStartDot = false,
  showEndDot = false,
  dotRadius = 4,
  stopAtEdge = false,
  edgeGap = 8,
}: AnimatedBeamProps) {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [points, setPoints] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const svgWidth = containerRect.width;
      const svgHeight = containerRect.height;
      setSvgDimensions({ width: svgWidth, height: svgHeight });

      const rawStartX = fromRect.left - containerRect.left + fromRect.width / 2;
      const rawStartY = fromRect.top - containerRect.top + fromRect.height / 2;
      const rawEndX = toRect.left - containerRect.left + toRect.width / 2;
      const rawEndY = toRect.top - containerRect.top + toRect.height / 2;

      // Pull each endpoint in from the element's center to its real edge
      // (plus a small gap) facing the other element, instead of landing
      // in the middle of it.
      const dir = rawEndX >= rawStartX ? 1 : -1;
      const startX =
        (stopAtEdge ? rawStartX + dir * (fromRect.width / 2 + edgeGap) : rawStartX) + startXOffset;
      const endX =
        (stopAtEdge ? rawEndX - dir * (toRect.width / 2 + edgeGap) : rawEndX) + endXOffset;
      const startY = rawStartY + startYOffset;
      const endY = rawEndY + endYOffset;

      let d: string;
      if (route === "elbow") {
        if (Math.abs(endY - startY) < 0.5) {
          d = `M ${startX},${startY} L ${endX},${endY}`;
        } else {
          const bendDir = endX >= startX ? 1 : -1;
          const rawBendX = startX + bendDir * Math.abs(endY - startY);
          const bendX = bendDir === 1 ? Math.min(rawBendX, endX) : Math.max(rawBendX, endX);
          d = `M ${startX},${startY} L ${bendX},${endY} L ${endX},${endY}`;
        }
      } else {
        const controlX = startX + (endX - startX) / 2;
        const controlY = startY + (endY - startY) / 2 - curvature;
        d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
      }

      setPathD(d);
      setPoints({ startX, startY, endX, endY });
    };

    const resizeObserver = new ResizeObserver(() => updatePath());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updatePath();

    return () => resizeObserver.disconnect();
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    route,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
    stopAtEdge,
    edgeGap,
  ]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      className={`pointer-events-none absolute left-0 top-0 transform-gpu ${className ?? ""}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showStartDot && <circle cx={points.startX} cy={points.startY} r={dotRadius} fill={gradientStartColor} />}
      {showEndDot && <circle cx={points.endX} cy={points.endY} r={dotRadius} fill={gradientStopColor} />}
      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={{
            x1: reverse ? ["0%", "100%"] : ["100%", "0%"],
            x2: reverse ? ["0%", "-100%"] : ["-100%", "0%"],
          }}
          transition={{
            delay,
            duration,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
