"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MetaAdsPicker } from "@/components/admin/MetaAdsPicker";
import { PacketManager } from "@/components/admin/PacketManager";
import {
  BLOG_CATEGORIES,
  loadPosts,
  savePosts,
  resetPosts,
  slugify,
  makeId,
  type BlogPost,
} from "@/lib/blog";

const ADMIN_PASSWORD = "Pass123";
const SESSION_KEY = "tpds_admin_unlocked";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // sessionStorage only exists client-side; render a neutral placeholder
    // (checked=false) on the server and sync the real gate state on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "1");
    setChecked(true);
  }, []);

  if (!checked) return <div className="min-h-screen bg-[#0e1726]" />;

  return unlocked ? (
    <Dashboard onLock={() => { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false); }} />
  ) : (
    <Gate
      onUnlock={() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setUnlocked(true);
      }}
    />
  );
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1726] px-4">
      <form onSubmit={submit} className="w-full max-w-[380px] rounded-xl bg-white p-8 shadow-2xl">
        <p className="text-[12px] uppercase tracking-[1.4px] text-[#9a9a9a]">Dental Med Austria</p>
        <h1 className="mt-2 font-serif text-[26px] font-normal text-[#071522]">Admin Access</h1>
        <p className="mt-2 text-[14px] text-[#6f6f6f]">Enter the password to manage blog content.</p>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-md border border-[#d4d4d4] px-4 py-3 text-[15px] focus:border-[#071522] focus:outline-none"
        />
        {error && <p className="mt-2 text-[13px] text-[#c0392b]">Incorrect password. Try again.</p>}

        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-[#071522] py-3 text-[14px] uppercase tracking-[1.2px] text-white transition-colors hover:bg-[#0e2740]"
        >
          Unlock
        </button>
        <p className="mt-4 text-center text-[11px] text-[#b0b0b0]">Demo gate - not a secure login.</p>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-[#d4d4d4] px-4 py-2.5 text-[15px] text-[#1c1c1c] focus:border-[#071522] focus:outline-none";

function Dashboard({ onLock }: { onLock: () => void }) {
  const [tab, setTab] = useState<"blog" | "packets">("packets");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(BLOG_CATEGORIES[0].slug);
  const [body, setBody] = useState("");
  const [keywords, setKeywords] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // localStorage-backed; hydrate the real posts list once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(loadPosts());
  }, []);

  function refresh() {
    setPosts(loadPosts());
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setImage("");
    setTitle("");
    setBody("");
    setKeywords("");
    setCategory(BLOG_CATEGORIES[0].slug);
    if (fileRef.current) fileRef.current.value = "";
  }

  function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!image || !title.trim() || !body.trim()) return;

    const current = loadPosts();
    let slug = slugify(title);
    if (current.some((p) => p.category === category && p.slug === slug)) {
      slug = `${slug}-${makeId().slice(0, 4)}`;
    }
    const excerpt = body.trim().split("\n")[0].slice(0, 150);
    const post: BlogPost = {
      id: makeId(),
      title: title.trim(),
      slug,
      category,
      excerpt,
      body: body.trim(),
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      image,
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [post, ...current];
    savePosts(next);
    setPosts(next);
    resetForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function remove(id: string) {
    const next = loadPosts().filter((p) => p.id !== id);
    savePosts(next);
    setPosts(next);
  }

  const canAddDetails = Boolean(image);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#1c1c1c]">
      {pickerOpen && (
        <MetaAdsPicker
          onSelect={(img) => {
            setImage(img);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {/* top bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e2e2] bg-white px-6 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[1.4px] text-[#9a9a9a]">Admin Dashboard</p>
          <h1 className="font-serif text-[22px] font-normal text-[#071522]">Dental Med Austria</h1>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-[#f3f4f6] p-1">
          {(["packets", "blog"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-5 py-2 text-[13px] font-medium uppercase tracking-[1px] transition-colors ${
                tab === t ? "bg-[#071522] text-white" : "text-[#555] hover:text-[#071522]"
              }`}
            >
              {t === "packets" ? "Packets" : "Blog"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href={tab === "packets" ? "/packets" : "/blog"} target="_blank" className="text-[13px] uppercase tracking-[1px] text-[#071522] hover:opacity-60">
            View {tab === "packets" ? "Packets" : "Blog"}
          </Link>
          <button onClick={onLock} className="rounded-md border border-[#d4d4d4] px-4 py-2 text-[13px] uppercase tracking-[1px] hover:bg-[#f3f4f6]">
            Lock
          </button>
        </div>
      </header>

      {tab === "packets" && <PacketManager />}

      {tab === "blog" && (
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1.1fr_1fr]">
        {/* composer */}
        <form onSubmit={publish} className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-[24px] font-normal text-[#071522]">New Blog Post</h2>

          {/* Step 1 - photo */}
          <div className="mt-6">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[1.2px] text-[#9a9a9a]">Step 1 · Add a photo</p>
            {image ? (
              <div className="relative overflow-hidden rounded-lg">
                <div className="h-[220px] w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                <button
                  type="button"
                  onClick={() => { setImage(""); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute right-3 top-3 rounded-md bg-black/70 px-3 py-1.5 text-[12px] text-white hover:bg-black"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-stretch gap-3 rounded-lg border-2 border-dashed border-[#d4d4d4] p-5">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-md bg-[#1877f2] py-3 text-[14px] font-medium text-white hover:bg-[#1466d6]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-[12px] font-bold text-[#1877f2]">f</span>
                  Import from Meta Ads
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-md border border-[#d4d4d4] py-2.5 text-[14px] hover:bg-[#f3f4f6]"
                >
                  Upload from computer
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="…or paste an image URL"
                    className={inputClass}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const v = (e.target as HTMLInputElement).value.trim();
                        if (v) setImage(v);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2 - details */}
          <div className={canAddDetails ? "mt-7" : "mt-7 pointer-events-none opacity-40"}>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[1.2px] text-[#9a9a9a]">Step 2 · Add the details</p>

            <label className="mb-1 block text-[13px] font-medium text-[#555]">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className={inputClass} />

            <label className="mb-1 mt-4 block text-[13px] font-medium text-[#555]">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {BLOG_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>

            <label className="mb-1 mt-4 block text-[13px] font-medium text-[#555]">Text</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your post… (blank lines separate paragraphs)"
              className={`${inputClass} min-h-[140px] resize-y`}
            />

            <label className="mb-1 mt-4 block text-[13px] font-medium text-[#555]">Keywords</label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="comma, separated, keywords"
              className={inputClass}
            />
          </div>

          <div className="mt-7 flex items-center gap-4">
            <button
              type="submit"
              disabled={!image || !title.trim() || !body.trim()}
              className="rounded-md bg-[#071522] px-7 py-3 text-[14px] uppercase tracking-[1.2px] text-white transition-colors hover:bg-[#0e2740] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Publish Post
            </button>
            {saved && <span className="text-[14px] font-medium text-[#1e8e4e]">Published ✓</span>}
          </div>
        </form>

        {/* existing posts */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-[24px] font-normal text-[#071522]">Published ({posts.length})</h2>
            <button
              onClick={() => { resetPosts(); refresh(); }}
              className="text-[12px] uppercase tracking-[1px] text-[#b0392b] hover:opacity-70"
            >
              Reset to defaults
            </button>
          </div>

          <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-lg border border-[#ececec] p-3">
                <div className="h-[58px] w-[58px] shrink-0 rounded bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-[#1c1c1c]">{p.title}</p>
                  <p className="text-[12px] uppercase tracking-[1px] text-[#9a9a9a]">{p.category.replace(/-/g, " ")} · {p.date}</p>
                </div>
                <Link
                  href={`/blog/${p.category}/${p.slug}`}
                  target="_blank"
                  className="shrink-0 text-[12px] uppercase tracking-[1px] text-[#071522] hover:opacity-60"
                >
                  View
                </Link>
                <button
                  onClick={() => remove(p.id)}
                  className="shrink-0 text-[12px] uppercase tracking-[1px] text-[#b0392b] hover:opacity-70"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
