// Dental Med Austria technology & equipment.
// Public-safe fields only (brand, model, what it does) - costs, suppliers and
// internal notes from the source sheet are intentionally excluded.

export type EquipmentCategory = {
  slug: string;
  label: string;
  blurb: string;
};

export type Equipment = {
  category: string; // category slug
  brand: string;
  model: string;
  summary: string;
  flagship?: boolean;
};

/** Recognisable brand partners for the scrolling logo wall. */
export const TECH_BRANDS: string[] = [
  "Straumann",
  "Ivoclar Vivadent",
  "Vatech",
  "Botiss",
  "iMES iCORE",
  "Dekema",
  "Navident",
  "ETK",
  "Werther",
  "Mariotti",
  "3Shape",
  "W&H",
  "Zeiss",
  "Biodem",
];

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    slug: "imaging",
    label: "3D Imaging & Diagnostics",
    blurb: "Low-dose 3D and panoramic imaging - the diagnostic backbone of precise implant and surgical planning.",
  },
  {
    slug: "cadcam",
    label: "CAD/CAM Milling",
    blurb: "In-house 5-axis milling that crafts crowns, bridges, and full-arch frameworks with industrial precision.",
  },
  {
    slug: "furnaces",
    label: "Ceramic & Sintering Furnaces",
    blurb: "Precision furnaces that fire, press, and sinter every restoration to its final strength and beauty.",
  },
  {
    slug: "guided-surgery",
    label: "Guided Implant Surgery",
    blurb: "Real-time navigation and controlled surgical motors for safer, more accurate implant placement.",
  },
  {
    slug: "lab",
    label: "Laboratory Micromotors",
    blurb: "Professional brushless micromotors that shape and finish restorations by hand in our on-site lab.",
  },
  {
    slug: "air-suction",
    label: "Compressors & Suction",
    blurb: "Oil-free compressed air and central suction - the clean, reliable infrastructure behind every chair.",
  },
  {
    slug: "sterilization",
    label: "Sterilisation",
    blurb: "Medical-grade sterilisation to ISO 9001 and European hygiene standards, for your complete safety.",
  },
  {
    slug: "surgical-optics",
    label: "Surgical Lasers & Optics",
    blurb: "Soft-tissue lasers and operating microscopes for minimally invasive, highly magnified precision.",
  },
  {
    slug: "operatory",
    label: "Treatment Operatories",
    blurb: "Modern operatory units and lighting designed around your comfort and the clinician's accuracy.",
  },
  {
    slug: "materials",
    label: "Premium Materials & Implant Brands",
    blurb: "The trusted European brands behind your implants, crowns, and grafts - quality you can rely on.",
  },
];

export const EQUIPMENT: Equipment[] = [
  // imaging
  {
    category: "imaging",
    brand: "Vatech",
    model: "A9 CBCT",
    summary:
      "A cone-beam 3D scanner with AI-assisted panoramic reconstruction - the diagnostic cornerstone for implant, All-on-X, and complex surgical planning.",
    flagship: true,
  },
  { category: "imaging", brand: "Vatech", model: "PaX-i3D Smart", summary: "A second cone-beam CT unit for efficient 3D diagnostics across multiple operatories." },
  { category: "imaging", brand: "Vatech", model: "Green Smart", summary: "Low-dose 2D digital panoramic imaging for fast, first-line diagnosis." },
  { category: "imaging", brand: "Vatech", model: "EzSensor", summary: "A digital intraoral sensor for instant, film-free single-tooth X-rays at the chair." },
  {
    category: "imaging",
    brand: "3Shape / Medit",
    model: "Intraoral Scanner",
    summary: "A digital wand that captures 3D impressions in minutes - no putty, feeding our CAD/CAM workflow.",
    flagship: true,
  },

  // cadcam
  { category: "cadcam", brand: "iMES iCORE", model: "CORiTEC One+", summary: "A compact chairside mill for same-day crowns, inlays, and onlays - no outside lab required." },
  {
    category: "cadcam",
    brand: "iMES iCORE",
    model: "CORiTEC 250i PRO+",
    summary: "A 5-axis laboratory mill that machines zirconia, PMMA, wax, and composite with a vibration-damping monoblock frame.",
    flagship: true,
  },
  { category: "cadcam", brand: "iMES iCORE", model: "CORiTEC 350i PRO+", summary: "A high-throughput 5-axis mill with a wider material range for our busy in-house laboratory." },
  { category: "cadcam", brand: "iMES iCORE", model: "350i Loader", summary: "An automated blank loader enabling unattended, around-the-clock milling for high volume." },
  { category: "cadcam", brand: "iMES iCORE", model: "CORiTEC 650i", summary: "An industrial 5-axis machine that mills implant bars and full-arch frameworks in-house." },

  // furnaces
  { category: "furnaces", brand: "Dekema", model: "AUSTROMAT 624i", summary: "A ceramic firing furnace that bakes layered ceramic onto crowns, bridges, and veneers." },
  { category: "furnaces", brand: "Dekema", model: "AUSTROMAT 654i", summary: "A press furnace for Ivoclar E-max and lithium-disilicate restorations." },
  {
    category: "furnaces",
    brand: "Dekema",
    model: "AUSTROMAT 664i",
    summary: "A high-temperature sintering furnace that brings milled zirconia to its final, full strength.",
    flagship: true,
  },
  { category: "furnaces", brand: "Dekema", model: "AUSTROMAT 674i", summary: "A versatile combined fire-and-press furnace for the most demanding ceramic work." },

  // guided surgery
  {
    category: "guided-surgery",
    brand: "Navident",
    model: "EVO Navigation",
    summary:
      "Dynamic 3D surgical navigation - real-time guidance from your CBCT scan that places implants with sub-millimetre accuracy.",
    flagship: true,
  },
  { category: "guided-surgery", brand: "W&H / NSK", model: "Surgical Motor", summary: "A torque-controlled surgical motor for precise, controlled implant osteotomy." },

  // lab micromotors
  { category: "lab", brand: "Mariotti", model: "Vortix3", summary: "A high-end brushless laboratory micromotor used by our ceramists to shape and finish restorations." },
  { category: "lab", brand: "Mariotti", model: "Spring 2", summary: "A water-spray micromotor for clean, dust-free wet grinding of zirconia." },
  { category: "lab", brand: "Mariotti", model: "FLY Brushless", summary: "A versatile clinical micromotor for everyday precision tasks." },

  // air & suction
  { category: "air-suction", brand: "Werther International", model: "TANDEM 2 Compressor", summary: "An oil-free Italian compressor with a backup pump, delivering clean air to every chair." },
  { category: "air-suction", brand: "Werther International", model: "DENTAL3 Compressor", summary: "A reliable oil-free compressor sized for a busy multi-chair clinic." },
  { category: "air-suction", brand: "Werther International", model: "Central Suction", summary: "A clinic-wide suction system providing consistent vacuum at every operatory." },

  // sterilization
  { category: "sterilization", brand: "Tuttnauer / Faro", model: "Medical-Grade Vacuum Autoclave", summary: "A vacuum steam steriliser that processes every reusable instrument between patients to ISO 9001 standards.", flagship: true },
  { category: "sterilization", brand: "Clinical", model: "Ultrasonic Cleaner", summary: "The first decontamination step, removing debris before instruments are sterilised." },
  { category: "sterilization", brand: "Clinical", model: "Pouch Sealer", summary: "Heat-seals instruments into sterile pouches ready for the autoclave." },

  // surgical optics
  { category: "surgical-optics", brand: "Clinical", model: "Diode Laser 980nm", summary: "A soft-tissue laser for bloodless gum contouring, frenectomy, and aesthetic reshaping." },
  {
    category: "surgical-optics",
    brand: "Zeiss / Leica",
    model: "Operating Microscope",
    summary: "Surgical magnification for root-canal and microsurgery - the detail behind predictable results.",
    flagship: true,
  },

  // operatory
  { category: "operatory", brand: "Castellini / Stern Weber", model: "Dental Operatory Unit", summary: "Fully-equipped patient chairs with integrated delivery, lighting, and suction in every treatment room." },
  { category: "operatory", brand: "Clinical", model: "LED Operating Light", summary: "Bright, shadow-free LED lighting for a clear, accurate view during every procedure." },

  // materials
  { category: "materials", brand: "Straumann", model: "BLX Implant System", summary: "The Swiss gold-standard implant system - the most clinically documented in the world.", flagship: true },
  { category: "materials", brand: "Biodem", model: "German Implant System", summary: "CE-marked German implants with a personal implant passport and verifiable serial numbers." },
  { category: "materials", brand: "ETK", model: "Premium Implant", summary: "A French premium implant with 30+ years of clinical heritage and the iPhysio prosthetic platform." },
  { category: "materials", brand: "Botiss", model: "Cerabone & Jason Membrane", summary: "Premium German biomaterials for bone regeneration and guided tissue healing." },
  { category: "materials", brand: "Zirconia Discs", model: "Bio ZX2 Zirconia", summary: "Premium German zirconia discs milled in-house into strong, lifelike crowns and bridges." },
  { category: "materials", brand: "Ivoclar Vivadent", model: "IPS E-max", summary: "Industry-leading lithium-disilicate ceramic for translucent, natural front-tooth restorations." },
  { category: "materials", brand: "Feldspathic Ceramic", model: "Willi Geller Layering", summary: "Premium feldspathic ceramic, hand-layered for the lifelike colour of every restoration." },
];

export function equipmentByCategory(slug: string): Equipment[] {
  return EQUIPMENT.filter((e) => e.category === slug);
}

/** Stable slug for a device, used for its image at /images/technology/<slug>.jpg. */
export function equipmentSlug(e: Pick<Equipment, "brand" | "model">): string {
  return `${e.brand}-${e.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
