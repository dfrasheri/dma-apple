"use client";

/** First-paint / loading / no-WebGL fallback. Navy panel + implant silhouette. */
export function StagePoster({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#071522]">
      <svg width="86" height="180" viewBox="0 0 86 180" fill="none" aria-hidden>
        {/* crown */}
        <path d="M20 6 C30 0 56 0 66 6 C70 24 64 40 43 48 C22 40 16 24 20 6 Z" fill="#ffffff" fillOpacity="0.14" />
        {/* abutment */}
        <path d="M34 54 L52 54 L48 78 L38 78 Z" fill="#ffffff" fillOpacity="0.1" />
        {/* fixture */}
        <path d="M36 84 L50 84 L46 168 C45 174 41 174 40 168 Z" fill="#ffffff" fillOpacity="0.12" />
        {[92, 104, 116, 128, 140, 152].map((y) => (
          <line key={y} x1="33" y1={y} x2="53" y2={y - 5} stroke="#ffffff" strokeOpacity="0.16" strokeWidth="2" />
        ))}
      </svg>
      {!reducedMotion && (
        <div className="mt-6 h-[2px] w-28 overflow-hidden rounded bg-white/10">
          <div className="h-full w-1/3 animate-[poster-shimmer_1.4s_ease-in-out_infinite] bg-white/40" />
        </div>
      )}
      <style>{`@keyframes poster-shimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(420%); } }`}</style>
    </div>
  );
}
