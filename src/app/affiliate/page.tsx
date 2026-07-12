"use client";

/**
 * Public affiliate / partner registration ("help desk" filing).
 * Posts to /api/affiliate/register, which creates a pending affiliate that
 * staff approve in the CRM. On success the applicant sees their referral link.
 */
import { useState } from "react";

export default function AffiliateRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    audience: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ code: string; link: string } | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const field =
    "w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#071522]/50";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (form.name.trim().length < 2 || !form.email.includes("@")) {
      setError("Please enter your name and a valid email.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/affiliate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          website: form.website.trim() || undefined,
          audience: form.audience.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error("failed");
      setDone({ code: json.code, link: json.link });
    } catch {
      setError("Something went wrong. Please email info@dentalmedaustria.com.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="eyebrow text-[#071522]/70">Partner programme</p>
      <h1 className="serif-title mt-2 text-4xl">Become a Dental Med Austria affiliate</h1>
      <p className="mt-4 text-[#343434]">
        Refer patients to premium-quality dental care in Tirana and earn on every treatment. Apply
        below, our team reviews applications and sends your referral link and terms.
      </p>

      {done ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="font-serif text-2xl text-[#071522]">Application received ✨</h2>
          <p className="mt-2 text-sm text-[#343434]">
            Thank you! Your application is pending review. Your referral link will be:
          </p>
          <div className="mt-3 rounded-lg border border-black/10 bg-white px-3 py-2 font-mono text-sm break-all">
            {done.link}
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Code <strong>{done.code}</strong>. We&apos;ll confirm activation and commission terms by email.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} placeholder="Full name *" value={form.name} onChange={set("name")} />
            <input className={field} placeholder="Email *" value={form.email} onChange={set("email")} inputMode="email" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} placeholder="Phone" value={form.phone} onChange={set("phone")} inputMode="tel" />
            <input className={field} placeholder="Company / brand" value={form.company} onChange={set("company")} />
          </div>
          <input className={field} placeholder="Website or social profile" value={form.website} onChange={set("website")} />
          <textarea
            className={`${field} min-h-24`}
            placeholder="How will you promote us? (audience, channels, country)"
            value={form.audience}
            onChange={set("audience")}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-[#071522] px-4 py-3 text-sm font-medium text-white hover:bg-[#0c2236] disabled:opacity-50"
          >
            {busy ? "Submitting…" : "Apply to the partner programme"}
          </button>
          <p className="text-center text-xs text-neutral-500">
            We&apos;ll never share your details. Reviewed within a few business days.
          </p>
        </form>
      )}
    </main>
  );
}
