import { formatPercent } from "@/lib/format";

export function ChangeBadge({
  value,
  locale,
  label,
}: {
  value: number | null;
  locale: string;
  label?: string;
}) {
  if (value == null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-faint">
        {label ? <span>{label}</span> : null}
        <span className="tabular-nums">—</span>
      </span>
    );
  }

  const up = value > 0.0001;
  const down = value < -0.0001;
  const color = up
    ? "text-up bg-up/10 border-up/20"
    : down
      ? "text-down bg-down/10 border-down/20"
      : "text-muted bg-white/5 border-white/10";
  const arrow = up ? "▲" : down ? "▼" : "•";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums ${color}`}
    >
      <span aria-hidden>{arrow}</span>
      {formatPercent(value, locale)}
      {label ? (
        <span className="ml-0.5 font-normal text-faint">{label}</span>
      ) : null}
    </span>
  );
}
