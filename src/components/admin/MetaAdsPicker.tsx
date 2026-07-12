"use client";

import { CloseIcon } from "@/components/icons";

/**
 * DEMO Meta Ads connector.
 *
 * A real integration would authenticate with the Meta Marketing API
 * (Facebook OAuth + access token + ad account id) and fetch creative
 * images from the user's ad campaigns. That requires credentials and
 * app review, so for this local demo we surface a stand-in creative
 * library drawn from the site's own assets.
 */
const DEMO_CREATIVES: { id: string; label: string; campaign: string; image: string }[] = [
  { id: "ad-1", label: "Advanced Dental Care", campaign: "Awareness · AL", image: "/images/dma/hero-1.jpeg" },
  { id: "ad-2", label: "Smile Makeover", campaign: "Conversions · IT", image: "/images/dma/hero-2.jpeg" },
  { id: "ad-3", label: "Implant Confidence", campaign: "Leads · DE", image: "/images/dma/clinic-xray.jpg" },
  { id: "ad-4", label: "Dental Crowns", campaign: "Traffic · AL", image: "/images/dma/blog-crowns.webp" },
  { id: "ad-5", label: "Painless Implants", campaign: "Awareness · IT", image: "/images/dma/hero-4.jpeg" },
  { id: "ad-6", label: "Meet Our Team", campaign: "Engagement · AL", image: "/images/dma/reception.jpeg" },
  { id: "ad-7", label: "Dental Tourism", campaign: "Awareness · DE", image: "/images/dma/tourism.jpg" },
  { id: "ad-8", label: "Clear Aligners", campaign: "Leads · AL", image: "/images/dma/blog-orthodontics.webp" },
  { id: "ad-9", label: "Modern Clinic", campaign: "Conversions · IT", image: "/images/dma/interiors/reception-wide.jpg" },
  { id: "ad-10", label: "Ceramic Veneers", campaign: "Engagement · AL", image: "/images/dma/blog-porcelain-cost.webp" },
  { id: "ad-11", label: "Patient Reception", campaign: "Engagement · DE", image: "/images/dma/reception.jpeg" },
  { id: "ad-12", label: "Dental Prostheses", campaign: "Traffic · AL", image: "/images/dma/blog-prostheses.webp" },
];

export function MetaAdsPicker({
  onSelect,
  onClose,
}: {
  onSelect: (image: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-[860px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#ececec] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#1877f2] text-[15px] font-bold text-white">f</span>
            <div>
              <p className="text-[15px] font-semibold text-[#1c1c1c]">Meta Ads - Creative Library</p>
              <p className="text-[12px] text-[#8a8a8a]">Demo connector · select an ad image to use</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[#666] hover:text-[#111]">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 overflow-y-auto p-6 sm:grid-cols-3">
          {DEMO_CREATIVES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.image)}
              className="group overflow-hidden rounded-md text-left ring-1 ring-[#ececec] transition hover:ring-[#1877f2]"
            >
              <div className="h-[130px] w-full bg-cover bg-center" style={{ backgroundImage: `url(${c.image})` }} />
              <div className="px-3 py-2">
                <p className="truncate text-[13px] font-medium text-[#1c1c1c]">{c.label}</p>
                <p className="truncate text-[11px] text-[#8a8a8a]">{c.campaign}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="border-t border-[#ececec] px-6 py-3 text-[12px] italic text-[#9a9a9a]">
          Connecting your real Meta Ads account requires Facebook OAuth and a Marketing API token - stubbed for this demo.
        </p>
      </div>
    </div>
  );
}
