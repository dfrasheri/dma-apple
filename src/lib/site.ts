export type NavChild = { label: string; href: string; tKey?: string };
export type NavGroup = { label: string; href: string; children?: NavChild[] };

export const DENTISTS: NavChild[] = [];

export const HYGIENISTS: NavChild[] = [];

export const CARE: NavChild[] = [
  { label: "Full Treatment Catalogue", href: "/catalogue", tKey: "subnav.catalogue" },
  { label: "Dental Implants", href: "/care/dental-implants", tKey: "treat.implants" },
  { label: "Dental Crowns", href: "/care/dental-crowns", tKey: "treat.crowns" },
  { label: "Dental Veneers", href: "/care/dental-veneers", tKey: "treat.veneers" },
  { label: "Dental Prostheses", href: "/care/dental-prostheses", tKey: "treat.prostheses" },
  { label: "Orthodontics", href: "/care/orthodontics", tKey: "treat.orthodontics" },
];

export const CLINIC: NavChild[] = [
  { label: "Our Story", href: "/clinic/our-story", tKey: "subnav.ourStory" },
  { label: "Our Clinic", href: "/clinic/our-clinic", tKey: "subnav.ourClinic" },
  { label: "Technology & Equipment", href: "/technology", tKey: "subnav.technology" },
  { label: "Safety & Hygiene", href: "/safety", tKey: "subnav.safety" },
  { label: "FAQs", href: "/clinic/faqs", tKey: "subnav.faqs" },
];

export const NAV: NavGroup[] = [
  { label: "Home", href: "/" },
  { label: "Clinic", href: "/clinic/our-story", children: CLINIC },
  { label: "Care", href: "/catalogue", children: CARE },
  { label: "Smiles", href: "/smiles" },
  { label: "Contact", href: "/contact" },
];

export const CONTACT = {
  name: "Dental Med Austria",
  email: "info@dentalmedaustria.com",
  emailHref: "mailto:info@dentalmedaustria.com",
  address1: "Lake View Residence, Building B, Rruga Kristo Luarasi",
  address2: "Tiranë, Albania",
  hours: "Mon - Fri: 9:00 - 19:00  |  Sat: 9:00 - 15:00",
  // One NAP (name/address/phone) everywhere, same number as the WhatsApp line
  // so every citation/directory listing matches (critical for local SEO).
  phone: "+355 67 556 2354",
  phoneHref: "tel:+355675562354",
  whatsapp: "https://wa.me/355675562354",
  instagram: "https://www.instagram.com/dentalmedaustria/",
  facebook: "https://www.facebook.com/dentalmedaustria/",
  maps: "https://www.google.com/maps/search/?api=1&query=Dental%20Med%20Austria%2C%20Tiran%C3%AB",
};
