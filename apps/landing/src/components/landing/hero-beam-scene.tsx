"use client";

import { motion, useMotionValue } from "motion/react";
import { Fragment, useId, useRef, useState, type ReactNode, type RefObject } from "react";

/**
 * TEMPORARY: drag mode for hand-placing tiles. With this on, each tile is
 * draggable and a readout panel below the diagram prints live `{ left, top }`
 * canvas coordinates as you drag — read those off and report back the final
 * numbers so they can be hardcoded into NODES and this flag flipped off.
 */
const EDIT_MODE = false;

const TEAL = "#00ccc6";
const BLUE = "#39a5db";

/** Design canvas coordinate space the whole diagram was authored in. Taller
 * than the original 4:3 so the wide top/bottom row spread doesn't clip. */
const CANVAS_W = 1456;
const CANVAS_H = 1200;
const pctX = (px: number) => `${(px / CANVAS_W) * 100}%`;
const pctY = (px: number) => `${(px / CANVAS_H) * 100}%`;

/** Icons render in `currentColor` so the animated wrapper in NodeTile can
 * fade them between the idle neutral tone and the connector's brand color. */
type IconProps = { className?: string };

function IdentityIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
      <path d="M3 8V5.5A1.5 1.5 0 0 1 4.5 4H7" />
      <path d="M21 8V5.5A1.5 1.5 0 0 0 19.5 4H17" />
      <path d="M3 16v2.5A1.5 1.5 0 0 0 4.5 20H7" />
      <path d="M21 16v2.5A1.5 1.5 0 0 1 19.5 20H17" />
      <path d="M7.5 8v8M10.5 8v8M13.5 8v8M16.5 8v8" />
    </svg>
  );
}

function ComplianceIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.2 4.8 6v5.4c0 4.4 3 7.6 7.2 9.4 4.2-1.8 7.2-5 7.2-9.4V6L12 3.2Z" />
      <path d="M8.8 11.9l2.3 2.3 4.1-4.3" />
    </svg>
  );
}

function IntelligenceIcon({ className }: IconProps) {
  return (
    <div className={`flex items-end justify-center gap-[14%] text-current ${className ?? ""}`} aria-hidden="true">
      <div className="w-[16%] rounded-sm bg-current" style={{ height: "38%", opacity: 0.55 }} />
      <div className="w-[16%] rounded-sm bg-current" style={{ height: "62%", opacity: 0.75 }} />
      <div className="w-[16%] rounded-sm bg-current" style={{ height: "88%" }} />
    </div>
  );
}

function ExperienceIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.9 20.2 7.4v9.2L12 21.1 3.8 16.6V7.4L12 2.9Z" />
      <path d="M3.9 7.5 12 12l8.1-4.5M12 12v9" />
    </svg>
  );
}

function ConsumersIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.1" />
      <path d="M3.6 19.4v-1.2A4.2 4.2 0 0 1 7.8 14h2.4a4.2 4.2 0 0 1 4.2 4.2v1.2" />
      <path d="M16.1 5.3a3 3 0 0 1 0 5.6M18.4 14.3a3.4 3.4 0 0 1 2.4 3.2v1.9" />
    </svg>
  );
}

function SustainableIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.6 5.4c1.7 4.4.5 8.6-2.3 11.4-2.8 2.8-7 4-11.4 2.3 1.5-3.6 3.5-6.4 6-8.6 2.4-2.2 5-3.9 7.7-5.1Z" />
      <path d="M8.4 15.6 15.8 8.2" />
    </svg>
  );
}

type Node = {
  label: string;
  description: [string, string];
  icon: (props: IconProps) => ReactNode;
  color: string;
  /** Node tile position/size in the 1456x1092 design canvas. */
  tile: { left: number; top: number };
  /** Label block position/width in the same canvas. Anchored by `top`
   * (below the tile, the common case) or by `bottom` (above the tile, for
   * one sitting too close to the hub to fit a label underneath it). */
  text: { left: number; width: number; top?: number; bottom?: number };
  /** Where the connecting line leaves the tile and where it lands on the hub, in canvas coordinates. */
  beam: { from: [number, number]; to: [number, number]; d: string; reverse?: boolean };
};

// ── Diagram geometry, all derived from a handful of tunable numbers so the
// hub/tile size balance can be retuned without hand-editing SVG path strings.
const TILE = 184;
const TEXT_W = 240;
const LABEL_GAP = 22;
/** Idle icon/tile tone; connectors fade into their brand color as the beam animates. */
const ICON_IDLE = "#c7ced7";
/** Shared with the icon color pulse so it reads as in step with the beam sweep. */
const BEAM_DURATION = 5;
const BEAM_REPEAT_DELAY = 0.5;
const BEAM_STAGGER = 0.3;

const HUB_SIZE = 260;
const HUB_PAD = 10;
const HUB_BACKDROP_SIZE = 316;
/** Not CANVAS_H/2 — the top/bottom rows sit at different distances from the
 * hub (per the hand-placed layout below), so the hub center is pinned here
 * rather than forced to the canvas's geometric middle. */
const HUB_CENTER: [number, number] = [CANVAS_W / 2, 498];
/** Vertical offset (from hub center) of the diagonal nodes' entry point onto
 * the hub rim, so their two lines don't both land on the same point on the
 * hub's left/right edge. */
const HUB_ROW_OFFSET = 60;
/** How far the connector's end tucks inside the hub's outer edge, so the
 * stroke visually merges into the hub instead of leaving a hairline gap. */
const HUB_EDGE_INSET = 4;
const CORNER_R = 12;

const HUB = { left: HUB_CENTER[0] - HUB_SIZE / 2, top: HUB_CENTER[1] - HUB_SIZE / 2, size: HUB_SIZE, padding: HUB_PAD };
const HUB_BACKDROP = {
  left: HUB_CENTER[0] - HUB_BACKDROP_SIZE / 2,
  top: HUB_CENTER[1] - HUB_BACKDROP_SIZE / 2,
  size: HUB_BACKDROP_SIZE,
};

const HUB_LEFT_ENTRY_X = HUB.left + HUB_EDGE_INSET;
const HUB_RIGHT_ENTRY_X = HUB.left + HUB.size - HUB_EDGE_INSET;
const HUB_TOP_ENTRY_Y = HUB.top + HUB_EDGE_INSET;
const HUB_BOTTOM_ENTRY_Y = HUB.top + HUB.size - HUB_EDGE_INSET;

/** A tile-to-hub connector: horizontal out of the tile, a rounded elbow to
 * the hub's row, horizontal into the hub. Degenerates to a straight line
 * when both ends already share a row (the two diagonal pairs) or a column
 * (the top/bottom spokes, which run straight into the hub). */
function elbowPath(from: [number, number], to: [number, number], cornerRadius = CORNER_R): string {
  const [fx, fy] = from;
  const [tx, ty] = to;
  if (fy === ty) return `M ${fx},${fy} H ${tx}`;
  if (fx === tx) return `M ${fx},${fy} V ${ty}`;
  const dir = tx >= fx ? 1 : -1;
  const vDir = ty > fy ? 1 : -1;
  const midX = fx + (tx - fx) / 2;
  const bend1X = midX - dir * cornerRadius;
  const bend2X = midX + dir * cornerRadius;
  const bendY1 = fy + vDir * cornerRadius;
  const bendY2 = ty - vDir * cornerRadius;
  return `M ${fx},${fy} H ${bend1X} Q ${midX},${fy} ${midX},${bendY1} V ${bendY2} Q ${midX},${ty} ${bend2X},${ty} H ${tx}`;
}

/** EDIT_MODE only: re-derives the beam path, connector dot, and label
 * position from a tile's live dragged position, so the whole node visibly
 * moves as one unit instead of just the icon tile sliding out from under
 * its line and caption. */
function liveNodeGeometry(node: Node, live: { left: number; top: number }) {
  const dx = live.left - node.tile.left;
  const dy = live.top - node.tile.top;
  const beamFrom: [number, number] = [node.beam.from[0] + dx, node.beam.from[1] + dy];
  return {
    text: {
      ...node.text,
      left: node.text.left + dx,
      ...(node.text.top !== undefined ? { top: node.text.top + dy } : {}),
      ...(node.text.bottom !== undefined ? { bottom: node.text.bottom - dy } : {}),
    },
    beamFrom,
    beamD: elbowPath(beamFrom, node.beam.to),
  };
}

function tile(centerX: number, rowY: number) {
  return { left: centerX - TILE / 2, top: rowY - TILE / 2 };
}

function label(centerX: number, tileTop: number) {
  return { left: centerX - TEXT_W / 2, top: tileTop + TILE + LABEL_GAP, width: TEXT_W };
}

/** For a tile with too little clearance below it (e.g. sitting right above
 * the hub) — mounts the label above the tile instead of underneath it.
 * Anchored by `bottom` rather than `top` so the label grows upward away
 * from the tile regardless of how many lines the description wraps to. */
function topLabel(centerX: number, tileTop: number) {
  return { left: centerX - TEXT_W / 2, bottom: CANVAS_H - (tileTop - LABEL_GAP), width: TEXT_W };
}

/** Six nodes fan out from the hub in a symmetric hexagon: one straight
 * above, one straight below, and two mirrored pairs on the diagonals.
 * Offsets are distances from HUB_CENTER (not raw coordinates), which is
 * what keeps the shape symmetric left-right and top-bottom even though the
 * hub itself isn't centered in the canvas. */
const TOP_BOTTOM_OFFSET = 366;
const DIAGONAL_X_OFFSET = 628;
const DIAGONAL_Y_OFFSET = 240;

const TOP_CENTER: [number, number] = [HUB_CENTER[0], HUB_CENTER[1] - TOP_BOTTOM_OFFSET];
const BOTTOM_CENTER: [number, number] = [HUB_CENTER[0], HUB_CENTER[1] + TOP_BOTTOM_OFFSET];
const UPPER_LEFT: [number, number] = [HUB_CENTER[0] - DIAGONAL_X_OFFSET, HUB_CENTER[1] - DIAGONAL_Y_OFFSET];
const LOWER_LEFT: [number, number] = [HUB_CENTER[0] - DIAGONAL_X_OFFSET, HUB_CENTER[1] + DIAGONAL_Y_OFFSET];
const UPPER_RIGHT: [number, number] = [HUB_CENTER[0] + DIAGONAL_X_OFFSET, HUB_CENTER[1] - DIAGONAL_Y_OFFSET];
const LOWER_RIGHT: [number, number] = [HUB_CENTER[0] + DIAGONAL_X_OFFSET, HUB_CENTER[1] + DIAGONAL_Y_OFFSET];

const NODES: Node[] = [
  {
    label: "Identity",
    description: ["GS1 Digital Link", "Product Identity"],
    icon: IdentityIcon,
    color: BLUE,
    tile: tile(...UPPER_LEFT),
    text: label(UPPER_LEFT[0], tile(...UPPER_LEFT).top),
    beam: {
      from: [UPPER_LEFT[0] + TILE / 2, UPPER_LEFT[1]],
      to: [HUB_LEFT_ENTRY_X, HUB_CENTER[1] - HUB_ROW_OFFSET],
      d: elbowPath([UPPER_LEFT[0] + TILE / 2, UPPER_LEFT[1]], [HUB_LEFT_ENTRY_X, HUB_CENTER[1] - HUB_ROW_OFFSET]),
      reverse: true,
    },
  },
  {
    label: "Compliance",
    description: ["DPP · PPWR · EPR", "Regulatory Ready"],
    icon: ComplianceIcon,
    color: TEAL,
    tile: tile(...TOP_CENTER),
    // Sits right above the hub with little clearance below, so its label
    // is mounted above the tile instead of underneath (which would crowd the hub).
    text: topLabel(TOP_CENTER[0], tile(...TOP_CENTER).top),
    beam: {
      from: [TOP_CENTER[0], TOP_CENTER[1] + TILE / 2],
      to: [HUB_CENTER[0], HUB_TOP_ENTRY_Y],
      d: elbowPath([TOP_CENTER[0], TOP_CENTER[1] + TILE / 2], [HUB_CENTER[0], HUB_TOP_ENTRY_Y]),
      reverse: true,
    },
  },
  {
    label: "Intelligence",
    description: ["Analytics & Insights", "Consumer Feedback"],
    icon: IntelligenceIcon,
    color: BLUE,
    tile: tile(...LOWER_LEFT),
    text: label(LOWER_LEFT[0], tile(...LOWER_LEFT).top),
    beam: {
      from: [LOWER_LEFT[0] + TILE / 2, LOWER_LEFT[1]],
      to: [HUB_LEFT_ENTRY_X, HUB_CENTER[1] + HUB_ROW_OFFSET],
      d: elbowPath([LOWER_LEFT[0] + TILE / 2, LOWER_LEFT[1]], [HUB_LEFT_ENTRY_X, HUB_CENTER[1] + HUB_ROW_OFFSET]),
      reverse: true,
    },
  },
  {
    label: "Experience",
    description: ["Dynamic Product Pages", "Campaign Activation"],
    icon: ExperienceIcon,
    color: TEAL,
    tile: tile(...UPPER_RIGHT),
    text: label(UPPER_RIGHT[0], tile(...UPPER_RIGHT).top),
    beam: {
      from: [UPPER_RIGHT[0] - TILE / 2, UPPER_RIGHT[1]],
      to: [HUB_RIGHT_ENTRY_X, HUB_CENTER[1] - HUB_ROW_OFFSET],
      d: elbowPath([UPPER_RIGHT[0] - TILE / 2, UPPER_RIGHT[1]], [HUB_RIGHT_ENTRY_X, HUB_CENTER[1] - HUB_ROW_OFFSET]),
    },
  },
  {
    label: "Consumers",
    description: ["Engage & Build Trust", "Meaningful Connections"],
    icon: ConsumersIcon,
    color: BLUE,
    tile: tile(...BOTTOM_CENTER),
    text: label(BOTTOM_CENTER[0], tile(...BOTTOM_CENTER).top),
    beam: {
      from: [BOTTOM_CENTER[0], BOTTOM_CENTER[1] - TILE / 2],
      to: [HUB_CENTER[0], HUB_BOTTOM_ENTRY_Y],
      d: elbowPath([BOTTOM_CENTER[0], BOTTOM_CENTER[1] - TILE / 2], [HUB_CENTER[0], HUB_BOTTOM_ENTRY_Y]),
    },
  },
  {
    label: "A Sustainable Future",
    description: ["Transparency", "Circular Economy"],
    icon: SustainableIcon,
    color: TEAL,
    tile: tile(...LOWER_RIGHT),
    text: label(LOWER_RIGHT[0], tile(...LOWER_RIGHT).top),
    beam: {
      from: [LOWER_RIGHT[0] - TILE / 2, LOWER_RIGHT[1]],
      to: [HUB_RIGHT_ENTRY_X, HUB_CENTER[1] + HUB_ROW_OFFSET],
      d: elbowPath([LOWER_RIGHT[0] - TILE / 2, LOWER_RIGHT[1]], [HUB_RIGHT_ENTRY_X, HUB_CENTER[1] + HUB_ROW_OFFSET]),
    },
  },
];

function ConnectorGradient({
  id,
  color,
  duration,
  delay,
  reverse,
}: {
  id: string;
  color: string;
  duration: number;
  delay: number;
  reverse?: boolean;
}) {
  return (
    <motion.linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      x1="0%"
      y1="0%"
      x2="0%"
      y2="0%"
      animate={{
        x1: reverse ? ["0%", "100%"] : ["100%", "0%"],
        x2: reverse ? ["0%", "-100%"] : ["-100%", "0%"],
      }}
      transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: BEAM_REPEAT_DELAY }}
    >
      <stop stopColor={color} stopOpacity="0" />
      <stop stopColor={color} />
      <stop offset="32.5%" stopColor={color} />
      <stop offset="100%" stopColor={color} stopOpacity="0" />
    </motion.linearGradient>
  );
}

/**
 * Tile and label are rendered as two separate passes (all tiles, then all
 * labels) rather than interleaved per node — with six absolutely-positioned
 * tiles this close together, a later tile can otherwise paint over an
 * earlier tile's label text. Keeping every label above every tile in paint
 * order means a tight layout degrades to "label overlaps a tile's corner"
 * instead of "text silently disappears under an opaque tile."
 */
function NodeTileGraphic({
  node,
  delay,
  containerRef,
  onMove,
}: {
  node: Node;
  delay: number;
  containerRef?: RefObject<HTMLDivElement | null>;
  onMove?: (left: number, top: number) => void;
}) {
  const Icon = node.icon;
  const pulseTransition = {
    duration: BEAM_DURATION,
    delay,
    repeat: Infinity,
    repeatDelay: BEAM_REPEAT_DELAY,
    times: [0, 0.35, 0.65, 1],
    ease: "easeInOut" as const,
  };

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragEnabled = Boolean(containerRef);

  const reportMove = () => {
    if (!containerRef?.current || !onMove) return;
    const canvasPerPx = CANVAS_W / containerRef.current.getBoundingClientRect().width;
    onMove(node.tile.left + dragX.get() * canvasPerPx, node.tile.top + dragY.get() * canvasPerPx);
  };

  return (
    <motion.div
      drag={dragEnabled}
      dragMomentum={false}
      dragElastic={0.15}
      dragConstraints={containerRef}
      onDrag={reportMove}
      whileHover={dragEnabled ? undefined : { y: -3 }}
      whileDrag={{ scale: 1.06 }}
      className={`absolute rounded-[28%] bg-white drop-shadow-[0_14px_28px_-8px_rgba(10,17,32,0.18)] ${dragEnabled ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
      style={{
        left: pctX(node.tile.left),
        top: pctY(node.tile.top),
        width: pctX(TILE),
        height: pctY(TILE),
        x: dragX,
        y: dragY,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-[28%] blur-md"
        style={{ backgroundColor: node.color }}
        animate={{ opacity: [0, 0.16, 0.16, 0] }}
        transition={pulseTransition}
        aria-hidden="true"
      />
      <motion.div
        className="relative flex h-full w-full items-center justify-center"
        animate={{ color: [ICON_IDLE, node.color, node.color, ICON_IDLE] }}
        transition={pulseTransition}
      >
        <Icon className="h-[36%] w-[36%]" />
      </motion.div>
    </motion.div>
  );
}

function NodeTileLabel({ node }: { node: Node }) {
  return (
    <div
      className="absolute text-center"
      style={{
        left: pctX(node.text.left),
        width: pctX(node.text.width),
        ...(node.text.top !== undefined ? { top: pctY(node.text.top) } : {}),
        ...(node.text.bottom !== undefined ? { bottom: pctY(node.text.bottom) } : {}),
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink sm:text-[12px] lg:text-[13px]">
        {node.label}
      </p>
      <p className="mt-1 hidden text-[9.5px] leading-snug text-ink/45 sm:block lg:text-[10.5px]">
        {node.description[0]}
        <br />
        {node.description[1]}
      </p>
    </div>
  );
}

export function HeroBeamScene() {
  const gradientBaseId = useId();
  const gradientIds = NODES.map((_, i) => `${gradientBaseId}-${i}`);
  const containerRef = useRef<HTMLDivElement>(null);
  const [livePositions, setLivePositions] = useState<Record<string, { left: number; top: number }>>(() =>
    Object.fromEntries(NODES.map((n) => [n.label, { left: n.tile.left, top: n.tile.top }])),
  );

  // EDIT_MODE only: recomputed on every drag frame so the beam, connector
  // dot, and label follow the tile instead of staying pinned to its
  // hardcoded start position.
  const geometry = Object.fromEntries(
    NODES.map((node) => [
      node.label,
      EDIT_MODE ? liveNodeGeometry(node, livePositions[node.label]!) : { text: node.text, beamFrom: node.beam.from, beamD: node.beam.d },
    ]),
  );

  return (
    <>
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[1456/1200] w-full max-w-md translate-y-10 lg:max-w-none"
      >
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {NODES.map((node, i) => (
            <ConnectorGradient
              key={node.label}
              id={gradientIds[i]!}
              color={node.color}
              duration={BEAM_DURATION}
              delay={i * BEAM_STAGGER}
              reverse={node.beam.reverse}
            />
          ))}
        </defs>
        {NODES.map((node) => (
          <path
            key={`${node.label}-base`}
            d={geometry[node.label]!.beamD}
            stroke="rgba(10, 17, 32, 0.1)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {NODES.map((node, i) => (
          <path
            key={`${node.label}-gradient`}
            d={geometry[node.label]!.beamD}
            stroke={`url(#${gradientIds[i]!})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {NODES.map((node) => (
        <Fragment key={`${node.label}-dots`}>
          <span
            className="pointer-events-none absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: pctX(geometry[node.label]!.beamFrom[0]),
              top: pctY(geometry[node.label]!.beamFrom[1]),
              backgroundColor: node.color,
            }}
          />
          <span
            className="pointer-events-none absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: pctX(node.beam.to[0]), top: pctY(node.beam.to[1]), backgroundColor: node.color }}
          />
        </Fragment>
      ))}

      {NODES.map((node, i) => (
        <NodeTileGraphic
          key={node.label}
          node={node}
          delay={i * BEAM_STAGGER}
          containerRef={EDIT_MODE ? containerRef : undefined}
          onMove={
            EDIT_MODE
              ? (left, top) => setLivePositions((prev) => ({ ...prev, [node.label]: { left, top } }))
              : undefined
          }
        />
      ))}

      {NODES.map((node) => (
        <NodeTileLabel key={node.label} node={{ ...node, text: geometry[node.label]!.text }} />
      ))}

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full bg-accent/15 blur-2xl"
        style={{
          left: pctX(HUB_BACKDROP.left + HUB_BACKDROP.size / 2),
          top: pctY(HUB_BACKDROP.top + HUB_BACKDROP.size / 2),
          width: pctX(HUB_BACKDROP.size * 0.85),
          height: pctY(HUB_BACKDROP.size * 0.85),
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        className="absolute rounded-[22%] bg-white/40 backdrop-blur-sm"
        style={{
          left: pctX(HUB_BACKDROP.left),
          top: pctY(HUB_BACKDROP.top),
          width: pctX(HUB_BACKDROP.size),
          height: pctY(HUB_BACKDROP.size),
        }}
      />

      <div
        className="absolute rounded-[22%] shadow-[0_18px_36px_-14px_rgba(10,17,32,0.3)]"
        style={{
          left: pctX(HUB.left),
          top: pctY(HUB.top),
          width: pctX(HUB.size),
          height: pctY(HUB.size),
          padding: pctX(HUB.padding),
          background: "linear-gradient(135deg, #00ccc6 0%, #10d6e5 35%, #26b9cc 65%, #39a5db 100%)",
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-[18%] bg-white">
          <span className="text-[15px] font-extrabold italic leading-none text-gradient-brand sm:text-[18px] lg:text-[20px]">
            Px
          </span>
          <span className="text-[6px] font-semibold uppercase tracking-[0.08em] text-ink/60 sm:text-[7px] lg:text-[8px]">
            productix
          </span>
        </div>
      </div>
      </div>
      {EDIT_MODE && (
        <div className="relative mx-auto mt-4 w-full max-w-md rounded-lg border border-ink/10 bg-white p-3 font-mono text-[11px] leading-relaxed text-ink/70 lg:max-w-none">
          <p className="mb-1 font-semibold text-ink">
            Drag tiles into place, then send these back so they can be hardcoded:
          </p>
          {NODES.map((node) => {
            const p = livePositions[node.label]!;
            return (
              <div key={node.label}>
                {node.label}: {"{ left: "}
                {Math.round(p.left)}
                {", top: "}
                {Math.round(p.top)}
                {" }"}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
