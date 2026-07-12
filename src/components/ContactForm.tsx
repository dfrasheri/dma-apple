"use client";

import { useState } from "react";
import { useT, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full border-0 border-b border-[#c9c9c9] bg-transparent pb-2 pt-1 text-[15px] text-[#343434] placeholder:text-[#8a8a8a] focus:border-[#071522] focus:outline-none";

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
      <div className="border border-[#dfe7df] bg-[#f2f8f2] px-6 py-8 text-center">
        <p className="text-[16px] font-light leading-[1.6] text-[#2e5d3a]">{s.ok}</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <input className={fieldClass} placeholder={t("footer.form.first")} aria-label={t("footer.form.first")} value={first} onChange={(e) => setFirst(e.target.value)} />
        <input className={fieldClass} placeholder={t("footer.form.last")} aria-label={t("footer.form.last")} value={last} onChange={(e) => setLast(e.target.value)} />
        <input className={fieldClass} placeholder={t("footer.form.email")} type="email" aria-label={t("footer.form.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={fieldClass} placeholder={t("footer.form.phone")} type="tel" aria-label={t("footer.form.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <textarea className={cn(fieldClass, "min-h-[120px] resize-y")} placeholder={t("footer.form.message")} aria-label={t("footer.form.message")} value={message} onChange={(e) => setMessage(e.target.value)} />
      {(status === "err" || status === "need") && (
        <p className="text-[13px] font-medium text-[#a3322d]">{status === "err" ? s.err : s.need}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-[#f1f1f1] px-[34px] py-[14px] text-[15px] uppercase tracking-[1px] text-[#343434] transition-colors hover:bg-[#e2e2e2] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? s.sending : t("footer.form.submit")}
      </button>
    </form>
  );
}
