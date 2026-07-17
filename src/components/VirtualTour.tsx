import { getT } from "@/lib/server-i18n";
import { CONTACT } from "@/lib/site";

/**
 * 360° Tourmake walkthrough of the clinic (same tour as
 * dentalmedtravel.com/our-clinic/), embedded responsively on the Gilded
 * system: sunk ivory band, gold-framed plate, giant serif heading. The
 * iframe is lazy-loaded so the heavy tour never blocks first paint.
 */
const TOUR_URL = "https://tourmake.net/en/tour/fc58c6776f2de688a8c88576cde2c0ad";

export async function VirtualTour() {
  const t = await getT();
  return (
    <section id="virtual-tour" className="section-y bg-[#f4ecdd]">
      <div className="tpds-container">
        <div className="mb-10 text-center">
          <p className="eyebrow gold-foil mb-4">{t("tour360.eyebrow")}</p>
          <h2 className="serif-title text-h2 [text-wrap:balance]">{t("tour360.title")}</h2>
          <span className="mx-auto mt-6 block h-px w-20 bg-gradient-to-r from-transparent via-[#c6a15b] to-transparent" />
          <p className="mx-auto mt-5 max-w-[560px] text-[15.5px] leading-relaxed text-[#6e6152]">
            {t("tour360.hint")}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-brand-xl)]">
          {/* gold hairline frame over the plate */}
          <span aria-hidden className="pointer-events-none absolute inset-3 z-10 rounded-2xl border border-[#e4cd9a]/40" />
          <iframe
            src={TOUR_URL}
            title="Dental Med Austria 360° virtual clinic tour"
            loading="lazy"
            allowFullScreen
            allow="gyroscope; accelerometer; vr; fullscreen"
            className="block aspect-[4/3] w-full border-0 bg-[#171310] sm:aspect-[16/9]"
          />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-[13.5px] text-[#6e6152] sm:flex-row">
          <p>
            {CONTACT.address1}, {CONTACT.address2}
          </p>
          <a
            href={CONTACT.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#9a7638] underline decoration-[#c6a15b]/60 underline-offset-4 transition-colors hover:text-[#c6a15b]"
          >
            Google Maps →
          </a>
        </div>
      </div>
    </section>
  );
}
