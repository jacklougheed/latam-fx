import type { RatePoint } from "@/lib/types";

// Lightweight, dependency-free SVG area chart. Renders on the server.
export function Sparkline({
  points,
  idKey,
  emptyLabel = "Not enough history yet",
  width = 720,
  height = 180,
  className,
}: {
  points: RatePoint[];
  idKey: string;
  emptyLabel?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (!points || points.length < 2) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-faint">
        {emptyLabel}
      </div>
    );
  }

  const xs = points.map((p) => p.t);
  const ys = points.map((p) => p.v);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 8;
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;

  const X = (t: number) => pad + ((t - minX) / spanX) * (width - 2 * pad);
  const Y = (v: number) =>
    height - pad - ((v - minY) / spanY) * (height - 2 * pad);

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${X(p.t).toFixed(1)} ${Y(p.v).toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${X(maxX).toFixed(1)} ${height - pad} L ${X(minX).toFixed(1)} ${height - pad} Z`;

  const up = ys[ys.length - 1] >= ys[0];
  const stroke = up ? "#37d39a" : "#fb7185";
  const gid = `spark-${idKey}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="Recent rate trend"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
