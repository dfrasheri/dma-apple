"use client";

import { useEffect, useState } from "react";
import { CATALOGUE_SERVICES, CATALOGUE_CATEGORIES } from "@/lib/catalogue";
import { locServiceName, locCategoryLabel } from "@/lib/catalogue-names-sq";
import type { Locale } from "@/lib/dictionaries";

export const MAX_PACKETS = 5;
export const MIN_TREATMENTS = 2;
export const MAX_TREATMENTS = 5;

export type Packet = {
  id: string;
  title: string;
  subtitle: string;
  treatmentSlugs: string[]; // 2-5, referencing CATALOGUE_SERVICES slugs
  cover?: string; // optional uploaded/pasted cover image (data URL or path)
};

export type TreatmentMeta = { slug: string; name: string; image: string; category: string };

/** Resolve a treatment slug to its display name + image (the category image). */
export function treatmentMeta(slug: string, locale: Locale = "en"): TreatmentMeta | null {
  const s = CATALOGUE_SERVICES.find((x) => x.slug === slug);
  if (!s) return null;
  const cat = CATALOGUE_CATEGORIES.find((c) => c.slug === s.category);
  return {
    slug,
    name: locServiceName(slug, s.name, locale),
    image: cat?.image ?? "/images/dma/interiors/reception-wide.jpg",
    category: locCategoryLabel(cat?.slug, cat?.label ?? "", locale),
  };
}

/** Every treatment available to compose into a packet, grouped by category. */
export function treatmentOptions() {
  return CATALOGUE_CATEGORIES.map((c) => ({
    category: c.label,
    items: CATALOGUE_SERVICES.filter((s) => s.category === c.slug).map((s) => ({ slug: s.slug, name: s.name })),
  })).filter((g) => g.items.length > 0);
}

// Each seed packet uses a dedicated Higgsfield cover image (public/images/dma/packets/<id>.jpg).
export const SEED_PACKETS: Packet[] = [
  {
    id: "pkt-hollywood",
    title: "The Hollywood Smile",
    subtitle: "A complete cosmetic transformation, designed around you.",
    treatmentSlugs: ["smile-design", "hollywood-smile-16", "laser-whitening", "gingival-contouring"],
    cover: "/images/dma/packets/pkt-hollywood.jpg",
  },
  {
    id: "pkt-newsmile",
    title: "New Smile in a Day",
    subtitle: "Full-arch implants with same-day fixed teeth.",
    treatmentSlugs: ["cbct-scan", "all-on-4-single", "guided-implant-surgery"],
    cover: "/images/dma/packets/pkt-newsmile.jpg",
  },
  {
    id: "pkt-restore",
    title: "Full Smile Restoration",
    subtitle: "Rebuild strength, function, and beauty - tooth by tooth.",
    treatmentSlugs: ["teeth-cleaning", "single-implant-crown", "zirconia-emax-layered-crown", "smile-design"],
    cover: "/images/dma/packets/pkt-restore.jpg",
  },
];

const STORAGE_KEY = "dma_packets_v1";
const EVENT = "dma-packets-updated";

export function loadPackets(): Packet[] {
  if (typeof window === "undefined") return SEED_PACKETS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_PACKETS;
    const parsed = JSON.parse(raw) as Packet[];
    if (!Array.isArray(parsed)) return SEED_PACKETS;
    return parsed.slice(0, MAX_PACKETS);
  } catch {
    return SEED_PACKETS;
  }
}

export function savePackets(packets: Packet[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(packets.slice(0, MAX_PACKETS)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage unavailable - ignore for demo */
  }
}

export function resetPackets(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function makePacketId(): string {
  return "pkt-" + Math.random().toString(36).slice(2, 9);
}

/** SSR-safe hook: deterministic seeds first, then hydrate from localStorage. */
export function usePackets(): Packet[] {
  const [packets, setPackets] = useState<Packet[]>(SEED_PACKETS);
  useEffect(() => {
    // SSR-safe: seeds render first (see doc comment above), this hydrates
    // the real localStorage-backed value once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPackets(loadPackets());
    const onUpdate = () => setPackets(loadPackets());
    window.addEventListener(EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);
  return packets;
}
