// Placeholder ad slot. Drop your AdSense / ad-network markup inside, or delete
// the <AdSlot /> usages if you don't want ads. Kept visually subtle.
export function AdSlot({ className }: { className?: string }) {
  return (
    <div
      className={`flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-widest text-faint/60 ${className || ""}`}
      aria-hidden
    >
      {/* Ad slot */}
      Advertisement
    </div>
  );
}
