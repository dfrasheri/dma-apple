"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PacketCollage } from "@/components/PacketCollage";
import {
  loadPackets,
  savePackets,
  resetPackets,
  makePacketId,
  treatmentOptions,
  MAX_PACKETS,
  MIN_TREATMENTS,
  MAX_TREATMENTS,
  type Packet,
} from "@/lib/packets";

const inputClass =
  "w-full rounded-md border border-[#d4d4d4] px-4 py-2.5 text-[15px] text-[#1c1c1c] focus:border-[#071522] focus:outline-none";

export function PacketManager() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slugs, setSlugs] = useState<string[]>([]);
  const [cover, setCover] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const groups = treatmentOptions();

  useEffect(() => {
    // localStorage-backed; hydrate the real packets list once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPackets(loadPackets());
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setSlugs([]);
    setCover("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function toggleSlug(slug: string) {
    setSlugs((cur) => {
      if (cur.includes(slug)) return cur.filter((s) => s !== slug);
      if (cur.length >= MAX_TREATMENTS) return cur; // cap at 5
      return [...cur, slug];
    });
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(String(reader.result));
    reader.readAsDataURL(file);
  }

  function startEdit(p: Packet) {
    setEditingId(p.id);
    setTitle(p.title);
    setSubtitle(p.subtitle);
    setSlugs(p.treatmentSlugs);
    setCover(p.cover ?? "");
    if (fileRef.current) fileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function remove(id: string) {
    const next = loadPackets().filter((p) => p.id !== id);
    savePackets(next);
    setPackets(next);
    if (editingId === id) resetForm();
  }

  const valid = title.trim().length > 0 && slugs.length >= MIN_TREATMENTS && slugs.length <= MAX_TREATMENTS;
  const atCapacity = packets.length >= MAX_PACKETS && !editingId;

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || atCapacity) return;
    const current = loadPackets();
    const packet: Packet = {
      id: editingId ?? makePacketId(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      treatmentSlugs: slugs,
      ...(cover ? { cover } : {}),
    };
    const next = editingId
      ? current.map((p) => (p.id === editingId ? packet : p))
      : [...current, packet].slice(0, MAX_PACKETS);
    savePackets(next);
    setPackets(next);
    resetForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1.1fr_1fr]">
      {/* composer */}
      <form onSubmit={save} className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[24px] font-normal text-[#071522]">
            {editingId ? "Edit Packet" : "New Packet"}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-[12px] uppercase tracking-[1px] text-[#9a9a9a] hover:text-[#071522]">
              Cancel edit
            </button>
          )}
        </div>

        {atCapacity && (
          <p className="mt-4 rounded-md bg-[#fdf3e7] px-4 py-3 text-[13px] text-[#8a6b3f]">
            You have the maximum of {MAX_PACKETS} packets. Edit or delete one to add another.
          </p>
        )}

        {/* title + subtitle */}
        <label className="mb-1 mt-6 block text-[13px] font-medium text-[#555]">Packet title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Hollywood Smile" className={inputClass} />

        <label className="mb-1 mt-4 block text-[13px] font-medium text-[#555]">Subtitle</label>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="One-line description" className={inputClass} />

        {/* treatments */}
        <div className="mt-5 flex items-center justify-between">
          <label className="text-[13px] font-medium text-[#555]">
            Treatments <span className="text-[#9a9a9a]">({MIN_TREATMENTS}-{MAX_TREATMENTS})</span>
          </label>
          <span className={`text-[12px] font-medium ${slugs.length >= MIN_TREATMENTS && slugs.length <= MAX_TREATMENTS ? "text-[#1e8e4e]" : "text-[#9a9a9a]"}`}>
            {slugs.length} selected
          </span>
        </div>
        <div className="mt-2 max-h-[260px] space-y-3 overflow-y-auto rounded-md border border-[#ececec] p-3">
          {groups.map((g) => (
            <div key={g.category}>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-[#9a9a9a]">{g.category}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((it) => {
                  const on = slugs.includes(it.slug);
                  const disabled = !on && slugs.length >= MAX_TREATMENTS;
                  return (
                    <button
                      type="button"
                      key={it.slug}
                      onClick={() => toggleSlug(it.slug)}
                      disabled={disabled}
                      className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${
                        on
                          ? "border-[#071522] bg-[#071522] text-white"
                          : disabled
                            ? "cursor-not-allowed border-[#ececec] text-[#cbcbcb]"
                            : "border-[#d4d4d4] text-[#444] hover:border-[#071522]"
                      }`}
                    >
                      {it.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* optional cover */}
        <label className="mb-1 mt-5 block text-[13px] font-medium text-[#555]">Cover image (optional - defaults to a composed collage)</label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md border border-[#d4d4d4] px-4 py-2.5 text-[13px] hover:bg-[#f3f4f6]">
            Upload image
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          {cover && (
            <button type="button" onClick={() => { setCover(""); if (fileRef.current) fileRef.current.value = ""; }} className="text-[12px] uppercase tracking-[1px] text-[#b0392b] hover:opacity-70">
              Remove cover
            </button>
          )}
        </div>

        {/* live preview */}
        {slugs.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[12px] uppercase tracking-[1.2px] text-[#9a9a9a]">Live preview</p>
            <div className="group relative h-[200px] w-full overflow-hidden rounded-lg">
              <PacketCollage slugs={slugs} cover={cover || undefined} className="h-full w-full" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-serif text-[22px] leading-tight">{title || "Packet title"}</p>
                {subtitle && <p className="mt-1 text-[13px] font-light text-white/85">{subtitle}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={!valid || atCapacity}
            className="rounded-md bg-[#071522] px-7 py-3 text-[14px] uppercase tracking-[1.2px] text-white transition-colors hover:bg-[#0e2740] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editingId ? "Save changes" : "Create packet"}
          </button>
          {saved && <span className="text-[14px] font-medium text-[#1e8e4e]">Saved ✓</span>}
        </div>
      </form>

      {/* existing packets */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-[24px] font-normal text-[#071522]">Packets ({packets.length}/{MAX_PACKETS})</h2>
          <button onClick={() => { resetPackets(); setPackets(loadPackets()); resetForm(); }} className="text-[12px] uppercase tracking-[1px] text-[#b0392b] hover:opacity-70">
            Reset to defaults
          </button>
        </div>

        <div className="space-y-4">
          {packets.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg border border-[#ececec]">
              <div className="group relative h-[120px] w-full overflow-hidden">
                <PacketCollage slugs={p.treatmentSlugs} cover={p.cover} className="h-full w-full" />
                <p className="absolute bottom-3 left-4 font-serif text-[20px] text-white">{p.title}</p>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="min-w-0 flex-1 truncate text-[12px] uppercase tracking-[1px] text-[#9a9a9a]">
                  {p.treatmentSlugs.length} treatments
                </p>
                <Link href="/packets" target="_blank" className="text-[12px] uppercase tracking-[1px] text-[#071522] hover:opacity-60">View</Link>
                <button onClick={() => startEdit(p)} className="text-[12px] uppercase tracking-[1px] text-[#071522] hover:opacity-60">Edit</button>
                <button onClick={() => remove(p.id)} className="text-[12px] uppercase tracking-[1px] text-[#b0392b] hover:opacity-70">Delete</button>
              </div>
            </div>
          ))}
          {packets.length === 0 && <p className="text-[14px] text-[#9a9a9a]">No packets yet - create one on the left.</p>}
        </div>
      </div>
    </div>
  );
}
