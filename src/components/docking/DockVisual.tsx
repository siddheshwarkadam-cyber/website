"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useCanvasPresence } from "@/components/three/useCanvasPresence";
import type { DockSceneKey } from "./dockScenes";
import type { Drag } from "./DockCanvas";

const DockCanvas = dynamic(() => import("./DockCanvas"), { ssr: false });

const ALT: Record<DockSceneKey, string> = {
  pose: "Cartoon ribbon model of HIV-1 protease (PDB 1HSG); the indinavir ligand tries several orientations, then settles into the binding pocket where its hydrogen-bond contacts appear",
  interface: "Cartoon ribbon model of barnase and barstar (PDB 1BRS) coming together, with interface residues within 4.5 Å and hydrogen bonds highlighted in gold",
  residues: "Cartoon ribbon model of the HyHEL-10 antibody Fv bound to lysozyme (PDB 3HFM), highlighting one contacting residue pair at a time with its contact type and distance",
};

/**
 * A real-structure docking scene that loads only near the viewport, runs only
 * while visible and, under reduced motion, shows one representative frame
 * with its labels (drag still rotates it). The scene narrates itself in the
 * chip; contact labels are projected into the overlay layer. Drag rotates
 * with a mouse; on touch, only horizontal swipes rotate, so vertical page
 * scrolling is never captured.
 */
export default function DockVisual({ scene, className = "" }: { scene: DockSceneKey; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLDivElement>(null);
  const { near, visible, lite } = useCanvasPresence(box);
  const reduced = useReducedMotion() ?? false;
  const setChip = useCallback((t: string) => {
    if (chip.current && chip.current.textContent !== t) chip.current.textContent = t;
  }, []);
  const drag = useRef<Drag>({ yaw: 0, pitch: 0 });
  const invalidate = useRef<(() => void) | null>(null);
  const ptr = useRef<{ id: number; x: number; y: number; mouse: boolean } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    const mouse = e.pointerType === "mouse";
    if (mouse && e.button !== 0) return;
    ptr.current = { id: e.pointerId, x: e.clientX, y: e.clientY, mouse };
    if (mouse) e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const p = ptr.current;
    if (!p || p.id !== e.pointerId) return;
    drag.current.yaw += (e.clientX - p.x) * 0.008;
    if (p.mouse) drag.current.pitch = Math.max(-1, Math.min(1, drag.current.pitch + (e.clientY - p.y) * 0.006));
    p.x = e.clientX;
    p.y = e.clientY;
    invalidate.current?.();
  };
  const onUp = () => { ptr.current = null; };

  return (
    <div
      ref={box}
      role="img"
      aria-label={ALT[scene]}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className={`relative overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing bg-gradient-to-br from-cream-100 to-[#EEE7D8] ${className}`}
    >
      {near && <DockCanvas scene={scene} lite={lite} reduced={reduced} running={visible} layer={layer} setChip={setChip} drag={drag} invalidateRef={invalidate} />}
      <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 opacity-85 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div
        ref={chip}
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-xl border border-black/10 bg-[#FFFDF8]/90 px-3 py-1 text-[11px] leading-snug text-ink-muted"
      />
    </div>
  );
}
