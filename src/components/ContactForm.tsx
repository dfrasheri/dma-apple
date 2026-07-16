"use client";

import { useState } from "react";
import { useT, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-[#9a7638]/20 bg-white px-4 py-3 text-[15px] text-[#2a2018] placeholder:text-[#a99a8b] shadow-[var(--shadow-brand-sm)] transition-colors duration-300 focus:border-[#c6a15b] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/25";

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9a7638]";

// Submission feedback in the site's four languages (kept local to the form).
const STATUS_TEXT: Record<string, { ok: string; err: string; need: string; sending: string }> = {
  en: {
    ok: "Thank you! Your request is with our team - we reply within 24-48 hours.",
    err: "Something went wrong. Please try again, or write to us on WhatsApp.",
    need: "Please add your name and an email or phone number.",
    sending: "Sending...",
  },
  sq: {
    ok: "Faleminderit! Kërkesa juaj është te ekipi ynë - përgjigjemi brenda 24-48 orësh.",
    err: "Diçka shkoi keq. Provoni përsëri, ose na shkruani në WhatsApp.",
    need: "Ju lutem shtoni emrin dhe një email ose numër telefoni.",
    sending: "Duke dërguar...",
  },
  it: {
    ok: "Grazie! La tua richiesta è al nostro team - rispondiamo entro 24-48 ore.",
    err: "Qualcosa è andato storto. Riprova, oppure scrivici su WhatsApp.",
    need: "Aggiungi il tuo nome e un'email o un numero di telefono.",
    sending: "Invio in corso...",
  },
  de: {
    ok: "Danke! Ihre Anfrage ist bei unserem Team - wir antworten innerhalb von 24-48 Stunden.",
    err: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder per WhatsApp schreiben.",
    need: "Bitte Namen und E-Mail oder Telefonnummer angeben.",
    sending: "Wird gesendet...",
  },
};

export function ContactForm() {
  const t = useT();
  const { locale } = useLocale();
  const s = STATUS_TEXT[locale] ?? STATUS_TEXT.en;

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err" | "need">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = `${first.trim()} ${last.trim()}`.trim();
    if (name.length < 2 || (!email.trim() && !phone.trim())) {
      setStatus("need");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/crm/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          locale,
          source: "web_form",
          sourceDetail: "contact-page",
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      setFirst(""); setLast(""); setEmail(""); setPhone(""); setMessage("");
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-3xl border border-[#9a7638]/20 bg-[#fffefb] px-6 py-10 text-center shadow-[var(--shadow-brand-lg)] sm:px-10">
        <div className="gold-rule mx-auto mb-6 w-16" />
        <p className="font-serif text-[19px] font-medium leading-[1.6] text-[#2a2018]">{s.ok}</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        <label className="block">
          <span className={labelClass}>{t("footer.form.first")}</span>
          <input className={fieldClass} placeholder={t("footer.form.first")} aria-label={t("footer.form.first")} value={first} onChange={(e) => setFirst(e.target.value)} />
        </label>
        <label className="block">
          <span className={labelClass}>{t("footer.form.last")}</span>
          <input className={fieldClass} placeholder={t("footer.form.last")} aria-label={t("footer.form.last")} value={last} onChange={(e) => setLast(e.target.value)} />
        </label>
        <label className="block">
          <span className={labelClass}>{t("footer.form.email")}</span>
          <input className={fieldClass} placeholder={t("footer.form.email")} type="email" aria-label={t("footer.form.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className={labelClass}>{t("footer.form.phone")}</span>
          <input className={fieldClass} placeholder={t("footer.form.phone")} type="tel" aria-label={t("footer.form.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>{t("footer.form.message")}</span>
        <textarea className={cn(fieldClass, "min-h-[120px] resize-y")} placeholder={t("footer.form.message")} aria-label={t("footer.form.message")} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      {(status === "err" || status === "need") && (
        <p className="text-[13px] font-medium text-[#a3322d]">{status === "err" ? s.err : s.need}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="gold-shimmer-host inline-flex items-center justify-center rounded-full bg-[#c6a15b] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "sending" ? s.sending : t("footer.form.submit")}
      </button>
    </form>
  );
}
