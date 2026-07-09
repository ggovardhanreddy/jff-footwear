"use client";

/** Subtle film grain + vignette — kept light so content stays visible */
export default function CinematicOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[35]"
      aria-hidden
    >
      <div className="cinematic-vignette absolute inset-0 opacity-60" />
      <div className="cinematic-grain absolute inset-0 opacity-[0.03]" />
    </div>
  );
}
