// Central translation dictionary, pure data, safe to import from both
// Server Components (via lib/server-i18n) and Client Components (via lib/i18n).
// Locales: en (English), sq (Albanian/Shqip), it (Italian), de (German), fr (French).

export type Locale = "en" | "sq" | "it" | "de" | "fr";

export const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "sq", label: "AL", name: "Shqip" },
  { code: "it", label: "IT", name: "Italiano" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "dma_locale";

export type Dict = Record<string, string>;

const EN: Dict = {
  // ── Navigation (top level) ──
  "nav.home": "Home",
  "nav.packets": "Treatment plans",
  "nav.clinic": "Clinic",
  "nav.care": "Treatment plans",
  "nav.smiles": "Smiles",
  "nav.contact": "Contact",

  // ── Sub-navigation (mega menus) ──
  "subnav.catalogue": "Full Treatment Catalogue",
  "subnav.ourStory": "Our Story",
  "subnav.ourClinic": "Our Clinic",
  "subnav.technology": "Technology & Equipment",
  "subnav.insurance": "Medical Insurance",
  "subnav.faqs": "FAQs",
  "subnav.safety": "Safety & Hygiene",

  // ── Treatment names (shared by nav, cards, grids) ──
  "treat.implants": "Dental Implants",
  "treat.crowns": "Dental Crowns",
  "treat.veneers": "Dental Veneers",
  "treat.prostheses": "Dental Prostheses",
  "treat.orthodontics": "Orthodontics",

  // ── Hero ──
  "hero.eyebrow": "Implants  |  Cosmetic  |  Orthodontics",
  "hero.title": "Advanced Dental Care in Albania",

  // ── Intro / About ──
  "intro.h2": "World-Class Dentistry in the Heart of Tirana",
  "intro.p1":
    "Founded in 2009, Dental Med Austria brings premium quality standards to dental care in Albania, for local and international patients alike.",
  "intro.p2":
    "Our experienced team has welcomed more than 24,000 happy patients and placed over 42,000 implants with a 98% success rate, combining advanced technology, premium materials, and personalised treatment plans in a calm, patient-focused environment.",
  "intro.p3":
    "Every treatment is carried out to ISO 9001 and European hygiene standards, with rigorous sterilisation protocols and fully documented, traceable materials, so you can choose us with complete confidence.",
  "intro.quote":
    "“Other dentists gave me ‘good’ results, but here? GREAT teeth-like Hollywood-level great! The precision, the aesthetics, the feel… it’s like I was upgraded to a luxury version of myself.”",
  "intro.quoteCite": "- Meriton Mjekiqi",
  "intro.stat.patients": "Happy Patients",
  "intro.stat.implants": "Implants Placed",
  "intro.stat.success": "Implant Success",
  "intro.stat.trusted": "Trusted Care",
  "btn.services": "Our Services",

  // ── Explore Treatments ──
  "explore.title": "Explore Dental Treatments",

  // ── Tour Our Clinic ──
  "tour.title": "Tour Our Clinic",
  "tour360.eyebrow": "Step Inside",
  "tour360.title": "Explore the Clinic in 360°",
  "tour360.hint": "Drag to look around, tap the arrows to walk through every room of Dental Med Austria.",
  "tour360.cta": "Take the 360° virtual tour",
  "tour.tech.eyebrow": "State-of-the-Art Equipment",
  "tour.tech.title": "Advanced Technology",
  "tour.tourism.title": "Dental Tourism",

  // ── Smile Gallery (home) ──
  "smiles.eyebrow": "Life-Changing Dental Makeovers",
  "smiles.title": "Unveiling Beautiful Smiles",
  "smiles.cta": "View Smile Gallery",

  // ── Testimonials (Instagram patient reels) ──
  "testi.eyebrow": "Real Patients, Real Words",
  "testi.title": "Patient Stories",
  "testi.subtitle":
    "Watch real Dental Med Austria patients share their experience, filmed at our clinic in Tirana and published on Instagram.",
  "testi.badge": "Patient story",
  "testi.watch": "Watch reel",
  "testi.follow": "See more on Instagram",
  "testi.close": "Close",
  "testi.prev": "Previous story",
  "testi.next": "Next story",
  "testi.loading": "Loading reel…",

  // ── Blog strip (home) ──
  "blogstrip.eyebrow": "From the Clinic",
  "blogstrip.heading": "News, Tips & Dental Tourism",
  "blogstrip.viewAll": "View All Stories",

  // ── Brand marquee ──
  // ── Reviews (Google patient reviews) ──
  "reviews.eyebrow": "Verified Google Reviews",
  "reviews.heading": "What Our Patients Say",
  "reviews.ratingLabel": "Google reviews",

  "brand.eyebrow": "Our Trusted Partners",
  "brand.heading": "Our Trusted Partners and Brands we work with",

  // ── Common ──
  "common.prev": "Previous",
  "common.next": "Next",

  // ── Footer ──
  "footer.getDirections": "Get Directions",
  "footer.form.first": "First Name*",
  "footer.form.last": "Last Name*",
  "footer.form.email": "Email*",
  "footer.form.phone": "Phone*",
  "footer.form.patient": "New Patient or Existing Patient*",
  "footer.form.comments": "Comments",
  "footer.form.message": "How can we help?",
  "footer.form.submit": "Submit",
  "footer.rights": "All rights reserved",
  "footer.privacy": "Privacy Policy",
  "footer.risks": "Treatment Risks",
  "footer.tagline":
    "Dental Med Austria is an ISO 9001-certified dental clinic in Tirana, Albania, delivering world-class implantology, cosmetic dentistry and full-mouth rehabilitation. Since 2009, more than 24,000 patients from across Europe and beyond have trusted us to restore their smiles with precision, safety and long-lasting results. Every implant treatment includes an Implant Passport for complete traceability and lifelong confidence.",
  "footer.col.treatments": "Treatments",
  "footer.col.clinic": "The Clinic",
  "footer.col.patients": "For Patients",
  "footer.blog": "Blog",
  "footer.smiles": "Smile Gallery",
  "footer.team": "Our Team",
  "footer.langs": "This website in other languages",
  "footer.sitemap": "Sitemap",
  "footer.accredited": "Certified & member of",

  // ── Sticky CTA ──
  "sticky.appointment": "Request an Appointment",
  "sticky.call": "Call us",
  "sticky.email": "Email us",

  // ── Lead rail (detail-page form) ──
  "lead.rail.tab": "Free Treatment Plan",
  "lead.rail.title": "Get your free treatment plan",
  "lead.rail.subtitle": "Tell us how to reach you, a personalised plan within 24–48h.",
  "lead.rail.send": "Send request",
  "lead.rail.sending": "Sending…",
  "lead.rail.success": "Thank you, request received!",
  "lead.rail.successNote": "Our coordinator will reply within 24–48 hours. Your reference:",
  "lead.rail.error": "Please add at least your name and phone number, then try again.",
  "lead.rail.whatsapp": "Continue on WhatsApp",
  "lead.rail.privacy": "By sending, you agree to be contacted about your request. No spam, ever.",

  // ── Shared CTA / chrome ──
  "cta.requestAppointment": "Request an Appointment",
  "nav.team": "Team",
  "nav.catalogue": "Catalogue",
  "nav.technology": "Technology",

  // ── Care (listing) ──
  "care.hero.eyebrow": "Comprehensive Dental Solutions",
  "care.hero.title": "Our Care",
  "care.intro.eyebrow": "Implants, Crowns, Veneers & More",
  "care.intro.text":
    "From dental implants and crowns to veneers, prostheses, and orthodontics, we offer comprehensive dental solutions to premium quality standards - all under one roof.",
  "care.cta.heading": "Not sure where to start? We'll guide you.",
  "care.cta.text": "Book a consultation and we'll design the right plan for your smile.",

  // ── Care (detail) ──
  "care.detail.aboutPrefix": "About",
  "care.detail.ctaPrefix": "Ready to explore",
  "care.detail.ctaSuffix": "?",
  "care.detail.ctaText": "Book a consultation with our team today.",

  // ── Smiles ──
  "smilespage.hero.eyebrow": "Life-Changing Dental Makeovers",
  "smilespage.hero.title": "The Smile Gallery",
  "smilespage.intro.eyebrow": "Real Patients · Real Results",
  "smilespage.intro.text":
    "I Smile with DENTAL MED AUSTRIA",
  "smilespage.cta.heading": "Imagine your new smile.",
  "smilespage.cta.text":
    "Send a panoramic X-ray and a few photos for a free smile-design plan within 24-48 hours.",

  // ── Catalogue (listing) ──
  "cat.hero.eyebrow": "Premium Quality · Tirana, Albania",
  "cat.hero.title": "Treatment Catalogue",
  "cat.stats.treatments": "Treatments",
  "cat.stats.specialties": "Specialties",
  "cat.stats.requested": "Most-Requested",
  "cat.intro.heading": "Every treatment we offer, under one roof",
  "cat.intro.text":
    "From single implants to complete smile makeovers, every procedure is delivered with premium materials and premium quality standards. Every plan is tailored to your case - send us your X-ray for a free written plan in 24-48 hours.",
  "cat.cta.eyebrow": "Free · No Obligation",
  "cat.cta.heading": "Get your personalised treatment plan",
  "cat.cta.text":
    "Send us a panoramic X-ray and a few photos. Our clinical team will return a written treatment plan within 24-48 hours, in your language.",
  "cat.cta.requestPlan": "Request a Plan",
  "cat.cta.featured": "Featured Services",
  "cat.section.treatments": "Treatments",

  // ── Catalogue (detail) ──
  "cat.detail.idealFor": "Ideal for:",
  "cat.detail.materials": "Materials & Brands",
  "cat.detail.whyChoose": "Why patients choose this",
  "cat.detail.typicalSession": "Typical session",
  "cat.detail.journey": "Your Journey",
  "cat.detail.whatToExpect": "What to expect",
  "cat.detail.frequentlyAsked": "Frequently Asked",
  "cat.detail.questionsPrefix": "Questions about",
  "cat.detail.relatedTreatments": "Related treatments",
  "cat.detail.learnMore": "Learn more",
  "cat.detail.consideringPrefix": "Considering",
  "cat.detail.consideringSuffix": "?",
  "cat.detail.ctaText":
    "Send a panoramic X-ray and a few photos for a free written treatment plan within 24-48 hours.",
  "cat.detail.allTreatments": "All Treatments",
  "cat.detail.ataGlance": "At a glance",
  "cat.detail.procedureEyebrow": "The Procedure",
  "cat.detail.procedureHeading": "Step by step",
  "cat.detail.whoEyebrow": "Suitability",
  "cat.detail.whoHeading": "Who is this treatment for?",
  "cat.detail.recoveryEyebrow": "Recovery",
  "cat.detail.recoveryHeading": "Recovery & healing",
  "cat.detail.evidenceEyebrow": "The evidence",
  "cat.detail.evidenceHeading": "Success & longevity",
  "cat.detail.goodToKnowEyebrow": "Good to know",
  "cat.detail.goodToKnowHeading": "Comparisons & considerations",
  "cat.detail.careEyebrow": "Aftercare",
  "cat.detail.careHeading": "Caring for your result",
  "cat.detail.costEyebrow": "Planning",
  "cat.detail.costHeading": "Your plan & transparency",
  "cat.detail.whyEyebrow": "Why us",
  "cat.detail.whyHeading": "Why patients choose Dental Med Austria",

  // ── Contact ──
  "contactpage.hero.eyebrow": "We'd Love to Hear From You",
  "contactpage.hero.title": "Contact Us",
  "contactpage.getDirections": "Get Directions →",
  "contactpage.instagram": "Instagram",
  "contactpage.facebook": "Facebook",
  "contactpage.openingHours": "Opening Hours",
  "contactpage.hours.weekdays": "Monday - Friday",
  "contactpage.hours.weekdaysTime": "9:00 - 19:00",
  "contactpage.hours.saturday": "Saturday",
  "contactpage.hours.saturdayTime": "9:00 - 15:00",
  "contactpage.hours.sunday": "Sunday",
  "contactpage.hours.sundayTime": "Closed",

  // ── Team ──
  "team.hero.eyebrow": "Dental Med Austria",
  "team.hero.title": "Meet Our Team",
  "team.intro.eyebrow": "Experienced & Caring",
  "team.intro.text":
    "Our care is led by an experienced clinical team that combines decades of experience and premium quality standards with genuine, patient-first care.",
  "team.specialist": "Our Specialist",
  "team.cta.heading": "Ready to meet our team?",
  "team.cta.text":
    "We'd love to welcome you to the clinic. Email us to book your first consultation.",

  "team.dentists.hero.title": "Our Specialist",
  "team.dentists.intro.text":
    "Our experienced clinical team brings decades of experience and premium quality standards to the clinic's gentle, meticulous, patient-first care.",
  "team.dentists.cta.heading": "Book your consultation today.",

  "team.hygienists.hero.title": "Preventative Care",
  "team.hygienists.intro.eyebrow": "Healthy Smiles, For Life",
  "team.hygienists.intro.text":
    "At Dental Med Austria, preventative and hygiene care is delivered by our experienced clinical team to European hygiene standards - keeping your smile healthy between treatments.",
  "team.hygienists.cta.heading": "Book your next appointment.",

  "team.meet.hero.eyebrow": "The Specialist Behind Your Care",
  "team.meet.hero.title": "Meet Our Team",
  "team.meet.intro.text":
    "At Dental Med Austria your care is led by an experienced clinical team dedicated to making your experience exceptional - from your warm welcome to your final result in the chair.",
  "team.meet.cta.heading": "We can't wait to welcome you.",

  "team.bio.ctaPrefix": "Book an appointment with",

  "role.founder-managing-director": "Founder & Managing Director",

  // ── Technology ──
  "tech.hero.eyebrow": "Hospital-Grade · In-House Laboratory",
  "tech.hero.title": "Technology & Equipment",
  "tech.stats.devices": "Devices",
  "tech.stats.categories": "Categories",
  "tech.stats.oneRoof": "One Roof",
  "tech.intro.heading": "The technology behind premium-quality results",
  "tech.intro.text":
    "From 3D CBCT imaging and computer-guided surgery to our own in-house CAD/CAM milling and ceramic laboratory, every device is chosen for precision, safety, and beautiful, lasting outcomes.",
  "tech.system": "System",
  "tech.systems": "Systems",
  "tech.flagship": "Flagship",
  "tech.cta.eyebrow": "Premium Standards · Tirana",
  "tech.cta.heading": "Experience the difference precision makes",
  "tech.cta.text":
    "See our technology in person, or send an X-ray for a free remote treatment plan within 24-48 hours.",
  "tech.cta.bookVisit": "Book a Visit",
  "tech.cta.catalogue": "Treatment Catalogue",

  // ── Packets ──
  "packets.hero.eyebrow": "Curated · Combined · Complete",
  "packets.hero.title": "Treatment Packages",
  "packets.list.eyebrow": "Curated Treatment Packages",
  "packets.list.heading": "Everything you need, beautifully combined",
  "packets.list.text":
    "Our most-requested treatments, thoughtfully bundled into complete journeys - each tailored to your goals and backed by a free remote plan.",
  "packets.list.bundle": "treatments · one package",
  "packets.list.enquire": "Enquire about this package",
  "packets.cta.heading": "Not sure which package fits?",
  "packets.cta.text":
    "Send a panoramic X-ray and photos for a free written plan within 24-48 hours.",

  // ── Clinic (detail) ──
  "clinic.detail.cta.heading": "Experience the Dental Med Austria difference.",

  // ── Procedures (care detail content) ──
  "proc.dental-implants.name": "Dental Implants",
  "proc.dental-implants.eyebrow": "Restore & Replace",
  "proc.dental-implants.intro":
    "Our titanium dental implants deliver natural-looking, fully functional, and permanent results - the gold standard for replacing missing teeth. With more than 42,000 implants placed and a 98% success rate, you're in expert hands.",
  "proc.dental-implants.body.0":
    "Every implant case begins with detailed digital diagnostics so that placement is precise, predictable, and as comfortable as possible. Our painless implant techniques and careful planning mean most patients are surprised by how gentle the experience is.",
  "proc.dental-implants.body.1":
    "For patients missing several or all of their teeth, our All-on-4 and All-on-6 full-arch solutions restore a complete, fixed smile on as few as four or six implants. Where bone has been lost over time, our dental bone regeneration procedures rebuild a solid foundation so an implant can be placed with confidence.",
  "proc.dental-implants.t0.title": "Single Implants",
  "proc.dental-implants.t0.text": "Permanent, natural-looking replacements for individual missing teeth.",
  "proc.dental-implants.t1.title": "All-on-4 / All-on-6",
  "proc.dental-implants.t1.text": "A complete fixed arch supported by just four or six implants.",
  "proc.dental-implants.t2.title": "Painless Implants",
  "proc.dental-implants.t2.text": "Gentle techniques and careful planning for a comfortable procedure.",
  "proc.dental-implants.t3.title": "Bone Regeneration",
  "proc.dental-implants.t3.text": "Rebuilding lost bone to create a solid foundation for implants.",

  "proc.dental-crowns.name": "Dental Crowns",
  "proc.dental-crowns.eyebrow": "Strength & Aesthetics",
  "proc.dental-crowns.intro":
    "Dental crowns restore broken, missing, or damaged teeth while improving both function and appearance. Each crown is crafted from premium materials by trusted partners such as Ivoclar.",
  "proc.dental-crowns.body.0":
    "A crown rebuilds a tooth that is too damaged for a simple filling, protecting what remains while restoring a natural shape, colour, and bite. We match every restoration to your surrounding teeth so the result blends seamlessly into your smile.",
  "proc.dental-crowns.body.1":
    "From single zirconia and ceramic crowns to multi-tooth bridges and custom restorations, our laboratory work is built to last - crafted to European quality standards in our ISO 9001-certified workflow.",
  "proc.dental-crowns.t0.title": "Zirconia Crowns",
  "proc.dental-crowns.t0.text": "Exceptionally strong, metal-free crowns with a lifelike finish.",
  "proc.dental-crowns.t1.title": "Ceramic Crowns",
  "proc.dental-crowns.t1.text": "Beautifully natural restorations crafted from premium ceramic.",
  "proc.dental-crowns.t2.title": "Bridges",
  "proc.dental-crowns.t2.text": "Fixed restorations that replace one or more missing teeth.",
  "proc.dental-crowns.t3.title": "Custom Restorations",
  "proc.dental-crowns.t3.text": "Tailored solutions designed around your bite and smile.",

  "proc.dental-veneers.name": "Dental Veneers",
  "proc.dental-veneers.eyebrow": "Design Your Smile",
  "proc.dental-veneers.intro":
    "Ceramic and composite veneers create a flawless, natural, Hollywood-level smile. Thin, custom shells transform the shape, colour, and harmony of your teeth with minimal intervention.",
  "proc.dental-veneers.body.0":
    "Veneers are one of the most powerful tools in cosmetic dentistry, correcting discolouration, chips, gaps, and uneven shapes in a single transformation. Ceramic veneers offer the most durable, light-reflective finish, while composite veneers provide a same-visit option.",
  "proc.dental-veneers.body.1":
    "Every smile makeover begins with a detailed smile design consultation, so you can see and shape your final result before treatment begins. Combined with professional teeth whitening, the outcome is a smile that looks natural and unmistakably yours.",
  "proc.dental-veneers.t0.title": "Ceramic Veneers",
  "proc.dental-veneers.t0.text": "Hand-crafted shells for a durable, light-reflective finish.",
  "proc.dental-veneers.t1.title": "Composite Veneers",
  "proc.dental-veneers.t1.text": "An elegant, same-visit option for a refreshed smile.",
  "proc.dental-veneers.t2.title": "Smile Design",
  "proc.dental-veneers.t2.text": "A bespoke plan that previews your result before treatment.",
  "proc.dental-veneers.t3.title": "Teeth Whitening",
  "proc.dental-veneers.t3.text": "Safe, professional whitening for a brighter smile.",

  "proc.dental-prostheses.name": "Dental Prostheses",
  "proc.dental-prostheses.eyebrow": "Function & Comfort",
  "proc.dental-prostheses.intro":
    "Custom dental prostheses restore missing or damaged teeth for function, comfort, and a harmonious smile. Every prosthesis is designed and fitted to feel natural and look beautiful.",
  "proc.dental-prostheses.body.0":
    "Whether you need to replace a few teeth or rehabilitate an entire mouth, our prostheses are crafted to restore confident chewing, clear speech, and a balanced facial appearance. We take the time to perfect the fit so your prosthesis feels secure and comfortable every day.",
  "proc.dental-prostheses.body.1":
    "Our solutions range from fixed and removable prostheses to custom dentures and full-mouth rehabilitation, often combined with implants for added stability. Each plan is personalised, predictable, and carried out to ISO 9001 and European quality standards.",
  "proc.dental-prostheses.t0.title": "Fixed Prostheses",
  "proc.dental-prostheses.t0.text": "Permanently secured restorations for a stable, natural feel.",
  "proc.dental-prostheses.t1.title": "Removable Prostheses",
  "proc.dental-prostheses.t1.text": "Comfortable, custom-fitted options that are easy to maintain.",
  "proc.dental-prostheses.t2.title": "Custom Dentures",
  "proc.dental-prostheses.t2.text": "Modern dentures designed for comfort and a natural look.",
  "proc.dental-prostheses.t3.title": "Full-Mouth Rehabilitation",
  "proc.dental-prostheses.t3.text": "Comprehensive restoration of function and aesthetics.",

  "proc.orthodontics.name": "Orthodontics",
  "proc.orthodontics.eyebrow": "Straighten With Confidence",
  "proc.orthodontics.intro":
    "Our specialised orthodontic treatment corrects teeth and jaw alignment with traditional braces and Invisalign clear aligners. Delivered by our specialist orthodontic team, every plan is tailored to your smile.",
  "proc.orthodontics.body.0":
    "Straight teeth aren't only beautiful - they're healthier and easier to keep clean. We carefully plan each case to guide your teeth and jaw into balanced, lasting alignment, with options to suit every age and lifestyle.",
  "proc.orthodontics.body.1":
    "Choose discreet, removable Invisalign clear aligners for everyday confidence, or reliable traditional braces for more complex movements. With early intervention for younger patients and retainers to protect your result, your new alignment is built to last.",
  "proc.orthodontics.t0.title": "Traditional Braces",
  "proc.orthodontics.t0.text": "Reliable, precise correction for a wide range of cases.",
  "proc.orthodontics.t1.title": "Invisalign",
  "proc.orthodontics.t1.text": "Virtually invisible, removable aligners for everyday confidence.",
  "proc.orthodontics.t2.title": "Early Intervention",
  "proc.orthodontics.t2.text": "Guiding young smiles for the best long-term outcome.",
  "proc.orthodontics.t3.title": "Retainers",
  "proc.orthodontics.t3.text": "Protecting your beautiful new alignment for the long term.",

  // ── Clinic pages content ──
  "clinic.our-story.title": "Our Story",
  "clinic.our-story.eyebrow": "About Dental Med Austria",
  "clinic.our-story.intro":
    "Since 2009, Dental Med Austria has brought premium-quality dental care to Tirana - a clinic where rigorous European standards meet warm, patient-focused care.",
  "clinic.our-story.s0.heading": "Founded on Premium Standards",
  "clinic.our-story.s0.p0":
    "Dental Med Austria was founded in 2009 and, from the very first day, was built around precise, evidence-based premium quality standards.",
  "clinic.our-story.s0.p1":
    "More than a decade later, the clinic is recognised as one of Albania's leading dental practices, trusted by over 24,000 happy patients from Albania and around the world.",
  "clinic.our-story.s1.heading": "Quality You Can Trust",
  "clinic.our-story.s1.p0":
    "Our work is carried out to ISO 9001 standards and European hygiene protocols, using advanced technology and high-quality materials at every step.",
  "clinic.our-story.s1.p1":
    "We stand behind our results with documented, traceable work and follow-up support after every treatment, so you can choose us with complete confidence.",

  "clinic.our-clinic.title": "Our Clinic",
  "clinic.our-clinic.eyebrow": "A Modern Facility",
  "clinic.our-clinic.intro":
    "Our modern, patient-focused clinic in the heart of Tirana combines advanced technology, premium materials, and a calm, comfortable environment.",
  "clinic.our-clinic.s0.heading": "Advanced Technology, Premium Materials",
  "clinic.our-clinic.s0.p0":
    "Every treatment is delivered using advanced dental technology and high-quality materials, ensuring safe, predictable, and lasting outcomes.",
  "clinic.our-clinic.s0.p1":
    "We work exclusively with premium partners trusted across Europe - Straumann, Ivoclar, and Biodem - so the components and restorations in your mouth are the very best available.",
  "clinic.our-clinic.s1.heading": "Comfortable & Patient-Focused",
  "clinic.our-clinic.s1.p0":
    "From your first consultation to your final result, every detail of our clinic is designed around your comfort. Our experienced professionals undertake continuous training to stay at the forefront of modern dentistry.",
  "clinic.our-clinic.s1.p1":
    "Each patient receives a personalised treatment plan built around their goals, delivered in a calm, welcoming environment that meets ISO 9001 and European hygiene standards.",

  "clinic.dental-tourism.title": "Dental Tourism",
  "clinic.dental-tourism.eyebrow": "Care & Travel Combined",
  "clinic.dental-tourism.intro":
    "Albania is a leading destination for dental tourism, combining breathtaking sights with world-class dental care. We make the whole journey effortless.",
  "clinic.dental-tourism.s0.heading": "Everything Arranged For You",
  "clinic.dental-tourism.s0.p0":
    "We help arrange flights to Tirana, and our team will meet you at Tirana Airport for a warm welcome and airport pickup.",
  "clinic.dental-tourism.s0.p1":
    "You'll stay in partner hotels offering modern comforts and free WiFi, and our team provides translation in English, Italian, German, and French throughout your stay.",
  "clinic.dental-tourism.s1.heading": "Your Treatment Journey",
  "clinic.dental-tourism.s1.p0":
    "1. Initial Consultation - we discuss your concerns and goals and build a personalised plan.",
  "clinic.dental-tourism.s1.p1":
    "2. Treatment by Experts - your care is carried out by our experienced clinical team using premium materials.",
  "clinic.dental-tourism.s1.p2":
    "3. Follow-Up Care - we stay in touch after you return home to make sure your results last.",

  "clinic.medical-insurance.title": "Medical Insurance",
  "clinic.medical-insurance.eyebrow": "Flexible & Supported",
  "clinic.medical-insurance.intro":
    "We work to make high-quality dental care as accessible as possible, with flexible payment options and assistance with insurance claims.",
  "clinic.medical-insurance.s0.heading": "Working With Your Insurance",
  "clinic.medical-insurance.s0.p0":
    "Our team is happy to assist with medical insurance claims and provide the documentation you need to seek reimbursement from your provider.",
  "clinic.medical-insurance.s0.p1":
    "If you're unsure whether your plan covers treatment abroad, get in touch and we'll help you understand your options before you travel.",
  "clinic.medical-insurance.s1.heading": "Flexible Payment Options",
  "clinic.medical-insurance.s1.p0":
    "We offer flexible payment options designed to make your treatment plan manageable, without compromising on quality or materials.",
  "clinic.medical-insurance.s1.p1":
    "For a personalised plan and guidance on payment, simply email us at info@dentalmedaustria.com.",

  "clinic.faqs.title": "FAQs",
  "clinic.faqs.eyebrow": "Helpful Answers",
  "clinic.faqs.intro":
    "Answers to the questions we're asked most often by local and international patients.",
  "clinic.faqs.s0.heading": "Where are you located?",
  "clinic.faqs.s0.p0":
    "Our clinic is located at Rruga Kristo Luarasi in Tiranë, Albania, open Monday to Saturday from 9:00 to 22:00.",
  "clinic.faqs.s1.heading": "Do you treat international patients?",
  "clinic.faqs.s1.p0":
    "Yes. We welcome patients from around the world and provide full dental-tourism support, including help with flights, airport pickup, partner hotels, and translation in English, Italian, German, and French.",
  "clinic.faqs.s2.heading": "What aftercare do you provide after treatment?",
  "clinic.faqs.s2.p0": "Every implant patient receives an implant passport with the implant brand and verifiable serial numbers, and our team remains available for follow-up support after your treatment.",
  "clinic.faqs.s3.heading": "What standards do you follow?",
  "clinic.faqs.s3.p0":
    "Our clinic operates to ISO 9001 standards and European hygiene protocols, using advanced technology and premium materials from partners such as Straumann, Ivoclar, and Biodem.",
  "clinic.faqs.s4.heading": "How do I book an appointment?",
  "clinic.faqs.s4.p0":
    "Booking is simple - email us at info@dentalmedaustria.com and our team will arrange your consultation and answer any questions.",

  // ── Equipment categories ──
  "equipcat.imaging.label": "3D Imaging & Diagnostics",
  "equipcat.imaging.blurb":
    "Low-dose 3D and panoramic imaging - the diagnostic backbone of precise implant and surgical planning.",
  "equipcat.cadcam.label": "CAD/CAM Milling",
  "equipcat.cadcam.blurb":
    "In-house 5-axis milling that crafts crowns, bridges, and full-arch frameworks with industrial precision.",
  "equipcat.furnaces.label": "Ceramic & Sintering Furnaces",
  "equipcat.furnaces.blurb":
    "Precision furnaces that fire, press, and sinter every restoration to its final strength and beauty.",
  "equipcat.guided-surgery.label": "Guided Implant Surgery",
  "equipcat.guided-surgery.blurb":
    "Real-time navigation and controlled surgical motors for safer, more accurate implant placement.",
  "equipcat.lab.label": "Laboratory Micromotors",
  "equipcat.lab.blurb":
    "Professional brushless micromotors that shape and finish restorations by hand in our on-site lab.",
  "equipcat.air-suction.label": "Compressors & Suction",
  "equipcat.air-suction.blurb":
    "Oil-free compressed air and central suction - the clean, reliable infrastructure behind every chair.",
  "equipcat.sterilization.label": "Sterilisation",
  "equipcat.sterilization.blurb":
    "Rigorous sterilisation protocols to ISO 9001 and European hygiene standards, for your complete safety.",
  "equipcat.surgical-optics.label": "Surgical Lasers & Optics",
  "equipcat.surgical-optics.blurb":
    "Soft-tissue lasers and operating microscopes for minimally invasive, highly magnified precision.",
  "equipcat.operatory.label": "Treatment Operatories",
  "equipcat.operatory.blurb":
    "Modern operatory units and lighting designed around your comfort and the clinician's accuracy.",
  "equipcat.materials.label": "Premium Materials & Implant Brands",
  "equipcat.materials.blurb":
    "The trusted European brands behind your implants, crowns, and grafts - quality you can rely on.",

  // ── Catalogue detail: 3D stage headings ──
  "cat.3d.eyebrow": "In Three Dimensions",
  "cat.3d.crown": "Crafted in zirconia & E-max",
  "cat.3d.tooth": "Caring for your natural tooth",
  "cat.3d.aligner": "Straighten, discreetly",
  "cat.3d.dragToRotate": "drag to rotate",
  "card.discover": "Discover the treatment",
  "card.viewDetails": "See details",
  "cat.detail.treatmentFallback": "Treatment",
  "cat.detail.catalogueCrumb": "Treatment Catalogue",

  // ── Catalogue detail: "why choose us" reasons ──
  "cat.why.r0.title": "Premium quality, European standards",
  "cat.why.r0.text": "Every treatment is carried out to ISO 9001 and European clinical protocols, with premium materials from names like Straumann and Ivoclar.",
  "cat.why.r1.title": "A team that has done this before",
  "cat.why.r1.text": "Our surgeons have placed more than 42,000 implants at a 98% success rate, experience you can feel from the first consultation.",
  "cat.why.r2.title": "Advanced technology",
  "cat.why.r2.text": "3D CBCT imaging, computer-guided surgery and an in-house ceramics lab mean more precise, more comfortable, more predictable results.",
  "cat.why.r3.title": "Your whole trip, handled",
  "cat.why.r3.text": "A free remote plan before you fly, airport pickup, a multilingual coordinator and partner-hotel stays, treatment and travel organised end to end.",
  "cat.why.r4.title": "Documentation you take home",
  "cat.why.r4.text": "Implant patients receive an implant passport with verifiable serial numbers, and every treatment is documented, with aftercare support that continues after you return home.",
  "cat.why.r5.title": "Care that makes sense",
  "cat.why.r5.text": "The same premium materials and standards as Western Europe, the honest reason patients travel to Tirana. Ask for your free personalised treatment plan.",

  // ── Safety page (hardcoded copy) ──
  "safety.hero.eyebrow": "Safety & Hygiene",
  "safety.hero.title": "The Highest Standard of Sterilisation & Patient Safety",
  "safety.intro.tagline": "Every instrument. Every patient. Every time.",
  "safety.breadcrumb": "Safety & Hygiene",
  "safety.faq.heading": "Safety questions, answered",
  "safety.cta.heading": "Care you can verify, in a clinic you can trust",
  "safety.cta.text": "Documented protocols, verified materials and complete traceability - the same infection-control discipline you would expect from a leading clinic in Switzerland, Germany or the UK.",
  "safety.cta.chips": "Documented protocols·Verified materials·Complete traceability·Rigorous sterilisation",

  // ── Blog (hardcoded chrome) ──
  "blog.index.title": "News & Stories",
  "blog.hero.eyebrow": "From Dental Med Austria",
  "blog.viewAll": "View all",
  "blog.crumb": "Blog",
  "blog.category.eyebrow": "Blog",
  "blog.stories": "Stories",
  "blog.empty": "No stories here yet - check back soon.",
  "blog.notFound.title": "Story Not Found",
  "blog.notFound.text": "We couldn't find that story.",
  "blog.backToBlog": "Back to Blog",
  "blog.medicallyReviewed": "Medically reviewed",
  "blog.reviewedBy": "Medically reviewed by",
  "blog.lastReviewed": "Last reviewed",
};

const SQ: Dict = {
  "nav.home": "Kreu",
  "nav.packets": "Planet e Trajtimit",
  "nav.clinic": "Klinika",
  "nav.care": "Planet e Trajtimit",
  "nav.smiles": "Buzëqeshjet",
  "nav.contact": "Kontakt",

  "subnav.catalogue": "Katalogu i Plotë i Trajtimeve",
  "subnav.ourStory": "Historia Jonë",
  "subnav.ourClinic": "Klinika Jonë",
  "subnav.technology": "Teknologjia & Pajisjet",
  "subnav.insurance": "Sigurimi Mjekësor",
  "subnav.faqs": "Pyetjet e Shpeshta",
  "subnav.safety": "Siguria & Higjiena",

  "treat.implants": "Implante Dentare",
  "treat.crowns": "Kurora Dentare",
  "treat.veneers": "Veneera Dentare",
  "treat.prostheses": "Proteza Dentare",
  "treat.orthodontics": "Ortodonci",

  "hero.eyebrow": "Implante  |  Estetikë  |  Ortodonci",
  "hero.title": "Kujdesi Dentar më i Avancuar në Shqipëri",

  "intro.h2": "Stomatologji e Klasit Botëror në Zemër të Tiranës",
  "intro.p1":
    "Themeluar në 2009, Dental Med Austria sjell standarde premium të cilësisë në kujdesin dentar në Shqipëri, për pacientët vendas dhe ndërkombëtarë.",
  "intro.p2":
    "Ekipi ynë me përvojë ka mirëpritur mbi 24,000 pacientë të kënaqur dhe ka vendosur mbi 42,000 implante me 98% sukses, duke kombinuar teknologji të avancuar, materiale premium dhe plane trajtimi të personalizuara në një mjedis të qetë e të fokusuar te pacienti.",
  "intro.p3":
    "Çdo trajtim kryhet sipas standardeve ISO 9001 dhe higjienës evropiane, me protokolle rigoroze sterilizimi dhe materiale të dokumentuara e të gjurmueshme, që të na zgjidhni me besim të plotë.",
  "intro.quote":
    "“Dentistë të tjerë më dhanë rezultate ‘të mira’, por këtu? Dhëmbë FANTASTIKË, nivel Hollywood-i! Precizioni, estetika, ndjesia… është sikur u përmirësova në një version luksoz të vetes.”",
  "intro.quoteCite": "- Meriton Mjekiqi",
  "intro.stat.patients": "Pacientë të Kënaqur",
  "intro.stat.implants": "Implante të Vendosura",
  "intro.stat.success": "Sukses Implantesh",
  "intro.stat.trusted": "Kujdes i Besuar",
  "btn.services": "Shërbimet Tona",

  "explore.title": "Eksploroni Trajtimet Dentare",

  "tour.title": "Vizitoni Klinikën Tonë",
  "tour360.eyebrow": "Hyni Brenda",
  "tour360.title": "Eksploroni Klinikën në 360°",
  "tour360.hint": "Zvarritni për të parë përreth dhe prekni shigjetat për të ecur nëpër çdo ambient të Dental Med Austria.",
  "tour360.cta": "Bëni turin virtual 360°",
  "tour.tech.eyebrow": "Pajisje të Teknologjisë së Fundit",
  "tour.tech.title": "Teknologji e Avancuar",
  "tour.tourism.title": "Turizmi Dentar",

  "smiles.eyebrow": "Transformime Dentare që Ndryshojnë Jetën",
  "smiles.title": "Zbulojmë Buzëqeshje të Bukura",
  "smiles.cta": "Shiko Galerinë e Buzëqeshjeve",

  // ── Testimonials (Instagram patient reels) ──
  "testi.eyebrow": "Pacientë Realë, Fjalë Reale",
  "testi.title": "Histori Pacientësh",
  "testi.subtitle":
    "Shikoni pacientë realë të Dental Med Austria të tregojnë përvojën e tyre, filmuar në klinikën tonë në Tiranë dhe publikuar në Instagram.",
  "testi.badge": "Histori pacienti",
  "testi.watch": "Shiko reel-in",
  "testi.follow": "Shiko më shumë në Instagram",
  "testi.close": "Mbyll",
  "testi.prev": "Historia e mëparshme",
  "testi.next": "Historia tjetër",
  "testi.loading": "Duke ngarkuar…",

  "blogstrip.eyebrow": "Nga Klinika",
  "blogstrip.heading": "Lajme, Këshilla & Turizëm Dentar",
  "blogstrip.viewAll": "Shiko të Gjitha Artikujt",

  // ── Reviews (Google patient reviews) ──
  "reviews.eyebrow": "Vlerësime të Verifikuara në Google",
  "reviews.heading": "Çfarë Thonë Pacientët Tanë",
  "reviews.ratingLabel": "vlerësime në Google",

  "brand.eyebrow": "Partnerët Tanë të Besuar",
  "brand.heading": "Partnerët dhe Markat Tona të Besuara me të Cilat Punojmë",

  "common.prev": "Mëparshëm",
  "common.next": "Tjetër",

  "footer.getDirections": "Merr Drejtimet",
  "footer.form.first": "Emri*",
  "footer.form.last": "Mbiemri*",
  "footer.form.email": "Email*",
  "footer.form.phone": "Telefoni*",
  "footer.form.patient": "Pacient i Ri ose Ekzistues*",
  "footer.form.comments": "Komente",
  "footer.form.message": "Si mund t'ju ndihmojmë?",
  "footer.form.submit": "Dërgo",
  "footer.rights": "Të gjitha të drejtat e rezervuara",
  "footer.privacy": "Politika e Privatësisë",
  "footer.risks": "Rreziqet e Trajtimit",
  "footer.tagline":
    "Dental Med Austria është një klinikë dentare e certifikuar me ISO 9001 në Tiranë, e specializuar në implantologji, estetikë dentare dhe rehabilitim të plotë të gojës. Që prej vitit 2009, mbi 24,000 pacientë nga Shqipëria, Evropa dhe më gjerë na kanë besuar buzëqeshjen e tyre, falë standardeve të larta, teknologjisë moderne dhe rezultateve afatgjata. Çdo trajtim me implante shoqërohet me një Pasaportë Implanti, duke garantuar gjurmueshmëri të plotë dhe siguri maksimale.",
  "footer.col.treatments": "Trajtimet",
  "footer.col.clinic": "Klinika",
  "footer.col.patients": "Për Pacientët",
  "footer.blog": "Blogu",
  "footer.smiles": "Galeria e Buzëqeshjeve",
  "footer.team": "Ekipi Ynë",
  "footer.langs": "Kjo faqe në gjuhë të tjera",
  "footer.sitemap": "Harta e Faqes",
  "footer.accredited": "E certifikuar & anëtare e",

  "sticky.appointment": "Rezervoni një Takim",
  "sticky.call": "Na telefononi",
  "sticky.email": "Na shkruani",

  "lead.rail.tab": "Plan Falas Trajtimi",
  "lead.rail.title": "Merrni planin tuaj falas të trajtimit",
  "lead.rail.subtitle": "Na tregoni si t'ju kontaktojmë dhe merrni një plan me shkrim të personalizuar brenda 24–48 orësh.",
  "lead.rail.send": "Dërgo kërkesën",
  "lead.rail.sending": "Duke dërguar…",
  "lead.rail.success": "Faleminderit, kërkesa u mor!",
  "lead.rail.successNote": "Koordinatori ynë do t'ju përgjigjet brenda 24–48 orësh. Referenca juaj:",
  "lead.rail.error": "Ju lutemi shtoni të paktën emrin dhe numrin e telefonit, pastaj provoni sërish.",
  "lead.rail.whatsapp": "Vazhdo në WhatsApp",
  "lead.rail.privacy": "Duke dërguar, pranoni të kontaktoheni për kërkesën tuaj. Kurrë spam.",

  "cta.requestAppointment": "Rezervoni një Takim",
  "nav.team": "Ekipi",
  "nav.catalogue": "Katalogu",
  "nav.technology": "Teknologjia",

  "care.hero.eyebrow": "Zgjidhje Dentare Gjithëpërfshirëse",
  "care.hero.title": "Trajtimet Tona",
  "care.intro.eyebrow": "Implante, Kurora, Veneera & Më Shumë",
  "care.intro.text":
    "Nga implantet dhe kurorat dentare te veneerat, protezat dhe ortodoncia, ofrojmë zgjidhje dentare gjithëpërfshirëse sipas standardeve premium të cilësisë - të gjitha nën një çati.",
  "care.cta.heading": "Nuk dini nga të filloni? Ne ju udhëzojmë.",
  "care.cta.text": "Rezervoni një konsultë dhe ne do të hartojmë planin e duhur për buzëqeshjen tuaj.",

  "care.detail.aboutPrefix": "Rreth",
  "care.detail.ctaPrefix": "Gati të eksploroni",
  "care.detail.ctaSuffix": "?",
  "care.detail.ctaText": "Rezervoni një konsultë me ekipin tonë sot.",

  "smilespage.hero.eyebrow": "Transformime Dentare që Ndryshojnë Jetën",
  "smilespage.hero.title": "Galeria e Buzëqeshjeve",
  "smilespage.intro.eyebrow": "Pacientë Realë · Rezultate Reale",
  "smilespage.intro.text":
    "Unë Buzëqesh me DENTAL MED AUSTRIA",
  "smilespage.cta.heading": "Imagjinoni buzëqeshjen tuaj të re.",
  "smilespage.cta.text":
    "Dërgoni një radiografi panoramike dhe disa foto për një plan falas të dizajnit të buzëqeshjes brenda 24-48 orëve.",

  "cat.hero.eyebrow": "Cilësi Premium · Tiranë, Shqipëri",
  "cat.hero.title": "Katalogu i Trajtimeve",
  "cat.stats.treatments": "Trajtime",
  "cat.stats.specialties": "Specialitete",
  "cat.stats.requested": "Më të Kërkuarat",
  "cat.intro.heading": "Çdo trajtim që ofrojmë, nën një çati",
  "cat.intro.text":
    "Nga implantet e vetme te transformimet e plota të buzëqeshjes, çdo procedurë kryhet me materiale premium dhe standarde premium të cilësisë. Çdo plan përshtatet me rastin tuaj - na dërgoni radiografinë tuaj për një plan të shkruar falas brenda 24-48 orëve.",
  "cat.cta.eyebrow": "Falas · Pa Detyrim",
  "cat.cta.heading": "Merrni planin tuaj të personalizuar të trajtimit",
  "cat.cta.text":
    "Na dërgoni një radiografi panoramike dhe disa foto. Ekipi ynë klinik do t'ju kthejë një plan të shkruar të trajtimit brenda 24-48 orëve, në gjuhën tuaj.",
  "cat.cta.requestPlan": "Kërko një Plan",
  "cat.cta.featured": "Shërbimet e Veçuara",
  "cat.section.treatments": "Trajtime",

  "cat.detail.idealFor": "Ideale për:",
  "cat.detail.materials": "Materiale & Marka",
  "cat.detail.whyChoose": "Pse e zgjedhin pacientët",
  "cat.detail.typicalSession": "Seancë tipike",
  "cat.detail.journey": "Udhëtimi Juaj",
  "cat.detail.whatToExpect": "Çfarë të prisni",
  "cat.detail.frequentlyAsked": "Pyetjet e Shpeshta",
  "cat.detail.questionsPrefix": "Pyetje rreth",
  "cat.detail.relatedTreatments": "Trajtime të ngjashme",
  "cat.detail.learnMore": "Mëso më shumë",
  "cat.detail.consideringPrefix": "Po mendoni për",
  "cat.detail.consideringSuffix": "?",
  "cat.detail.ctaText":
    "Dërgoni një radiografi panoramike dhe disa foto për një plan të shkruar falas të trajtimit brenda 24-48 orëve.",
  "cat.detail.allTreatments": "Të Gjitha Trajtimet",
  "cat.detail.ataGlance": "Në pak fjalë",
  "cat.detail.procedureEyebrow": "Procedura",
  "cat.detail.procedureHeading": "Hap pas hapi",
  "cat.detail.whoEyebrow": "Përshtatshmëria",
  "cat.detail.whoHeading": "Për kë është ky trajtim?",
  "cat.detail.recoveryEyebrow": "Rikuperimi",
  "cat.detail.recoveryHeading": "Rikuperimi & shërimi",
  "cat.detail.evidenceEyebrow": "Të dhënat",
  "cat.detail.evidenceHeading": "Suksesi & jetëgjatësia",
  "cat.detail.goodToKnowEyebrow": "Mirë të dihet",
  "cat.detail.goodToKnowHeading": "Krahasime & konsiderata",
  "cat.detail.careEyebrow": "Kujdesi pas trajtimit",
  "cat.detail.careHeading": "Kujdesi për rezultatin tuaj",
  "cat.detail.costEyebrow": "Planifikimi",
  "cat.detail.costHeading": "Plani & transparenca",
  "cat.detail.whyEyebrow": "Pse ne",
  "cat.detail.whyHeading": "Pse pacientët zgjedhin Dental Med Austria",

  "contactpage.hero.eyebrow": "Do të Donim të Dëgjonim nga Ju",
  "contactpage.hero.title": "Na Kontaktoni",
  "contactpage.getDirections": "Merr Drejtimet →",
  "contactpage.instagram": "Instagram",
  "contactpage.facebook": "Facebook",
  "contactpage.openingHours": "Orari i Punës",
  "contactpage.hours.weekdays": "E hënë - E premte",
  "contactpage.hours.weekdaysTime": "9:00 - 19:00",
  "contactpage.hours.saturday": "E shtunë",
  "contactpage.hours.saturdayTime": "9:00 - 15:00",
  "contactpage.hours.sunday": "E diel",
  "contactpage.hours.sundayTime": "Mbyllur",

  "team.hero.eyebrow": "Dental Med Austria",
  "team.hero.title": "Njihuni me Ekipin Tonë",
  "team.intro.eyebrow": "Me Përvojë & të Kujdesshëm",
  "team.intro.text":
    "Kujdesi ynë drejtohet nga një ekip klinik me përvojë, i cili ndërthur dekada përvojë dhe standarde premium të cilësisë me kujdes të sinqertë, me pacientin në qendër.",
  "team.specialist": "Specialisti Ynë",
  "team.cta.heading": "Gati të njiheni me ekipin tonë?",
  "team.cta.text":
    "Do të donim t'ju mirëprisnim në klinikë. Na shkruani për të rezervuar konsultën tuaj të parë.",

  "team.dentists.hero.title": "Specialisti Ynë",
  "team.dentists.intro.text":
    "Ekipi ynë klinik me përvojë sjell dekada përvojë dhe standarde premium të cilësisë në kujdesin e butë, të përpiktë e me pacientin në qendër të klinikës.",
  "team.dentists.cta.heading": "Rezervoni konsultën tuaj sot.",

  "team.hygienists.hero.title": "Kujdesi Parandalues",
  "team.hygienists.intro.eyebrow": "Buzëqeshje të Shëndetshme, për Gjithë Jetën",
  "team.hygienists.intro.text":
    "Në Dental Med Austria, kujdesi parandalues dhe higjienik ofrohet nga ekipi ynë klinik me përvojë sipas standardeve evropiane të higjienës - duke e mbajtur buzëqeshjen tuaj të shëndetshme mes trajtimeve.",
  "team.hygienists.cta.heading": "Rezervoni takimin tuaj të radhës.",

  "team.meet.hero.eyebrow": "Specialisti pas Kujdesit Tuaj",
  "team.meet.hero.title": "Njihuni me Ekipin Tonë",
  "team.meet.intro.text":
    "Në Dental Med Austria kujdesi ynë drejtohet nga një ekip klinik me përvojë, i përkushtuar ta bëjë përvojën tuaj të jashtëzakonshme - nga mirëseardhja e ngrohtë te rezultati juaj final në karrige.",
  "team.meet.cta.heading": "Mezi presim t'ju mirëpresim.",

  "team.bio.ctaPrefix": "Rezervoni një takim me",

  "role.founder-managing-director": "Themelues & Drejtor Menaxhues",

  "tech.hero.eyebrow": "Nivel Spitalor · Laborator i Brendshëm",
  "tech.hero.title": "Teknologjia & Pajisjet",
  "tech.stats.devices": "Pajisje",
  "tech.stats.categories": "Kategori",
  "tech.stats.oneRoof": "Një Çati",
  "tech.intro.heading": "Teknologjia pas rezultateve me cilësi premium",
  "tech.intro.text":
    "Nga imazheria 3D CBCT dhe kirurgjia e udhëhequr nga kompjuteri te frezimi ynë i brendshëm CAD/CAM dhe laboratori i qeramikës, çdo pajisje zgjidhet për precizion, siguri dhe rezultate të bukura e të qëndrueshme.",
  "tech.system": "Sistem",
  "tech.systems": "Sisteme",
  "tech.flagship": "Kryesore",
  "tech.cta.eyebrow": "Standarde Premium · Tiranë",
  "tech.cta.heading": "Provojeni ndryshimin që sjell precizioni",
  "tech.cta.text":
    "Shihni teknologjinë tonë nga afër, ose dërgoni një radiografi për një plan trajtimi falas në distancë brenda 24-48 orëve.",
  "tech.cta.bookVisit": "Rezervo një Vizitë",
  "tech.cta.catalogue": "Katalogu i Trajtimeve",

  "packets.hero.eyebrow": "Të Kuruara · Të Kombinuara · Të Plota",
  "packets.hero.title": "Paketat e Trajtimit",
  "packets.list.eyebrow": "Paketa Trajtimi të Kuruara",
  "packets.list.heading": "Gjithçka që ju nevojitet, e kombinuar bukur",
  "packets.list.text":
    "Trajtimet tona më të kërkuara, të kombinuara me kujdes në udhëtime të plota - secila e përshtatur me qëllimet tuaja dhe e mbështetur nga një plan falas në distancë.",
  "packets.list.bundle": "trajtime · një paketë",
  "packets.list.enquire": "Pyet për këtë paketë",
  "packets.cta.heading": "Nuk dini cila paketë ju përshtatet?",
  "packets.cta.text":
    "Dërgoni një radiografi panoramike dhe foto për një plan të shkruar falas brenda 24-48 orëve.",

  "clinic.detail.cta.heading": "Provojeni ndryshimin Dental Med Austria.",

  "proc.dental-implants.name": "Implante Dentare",
  "proc.dental-implants.eyebrow": "Rivendos & Zëvendëso",
  "proc.dental-implants.intro":
    "Implantet tona dentare prej titani japin rezultate me pamje natyrale, plotësisht funksionale dhe të përhershme - standardi i artë për zëvendësimin e dhëmbëve që mungojnë. Me mbi 42,000 implante të vendosura dhe 98% sukses, jeni në duar eksperte.",
  "proc.dental-implants.body.0":
    "Çdo rast implanti fillon me diagnostikë dixhitale të hollësishme, që vendosja të jetë e saktë, e parashikueshme dhe sa më komode. Teknikat tona të implanteve pa dhimbje dhe planifikimi i kujdesshëm bëjnë që shumica e pacientëve të çuditen sa e butë është përvoja.",
  "proc.dental-implants.body.1":
    "Për pacientët që u mungojnë disa ose të gjithë dhëmbët, zgjidhjet tona All-on-4 dhe All-on-6 për tërë harkun rivendosin një buzëqeshje të plotë e fikse mbi vetëm katër ose gjashtë implante. Aty ku kocka është humbur me kohën, procedurat tona të rigjenerimit të kockës rindërtojnë një bazë solide që implanti të vendoset me siguri.",
  "proc.dental-implants.t0.title": "Implante të Vetme",
  "proc.dental-implants.t0.text": "Zëvendësime të përhershme me pamje natyrale për dhëmbë të veçantë që mungojnë.",
  "proc.dental-implants.t1.title": "All-on-4 / All-on-6",
  "proc.dental-implants.t1.text": "Një hark i plotë fiks i mbështetur nga vetëm katër ose gjashtë implante.",
  "proc.dental-implants.t2.title": "Implante pa Dhimbje",
  "proc.dental-implants.t2.text": "Teknika të buta dhe planifikim i kujdesshëm për një procedurë komode.",
  "proc.dental-implants.t3.title": "Rigjenerim Kocke",
  "proc.dental-implants.t3.text": "Rindërtim i kockës së humbur për të krijuar një bazë solide për implantet.",

  "proc.dental-crowns.name": "Kurora Dentare",
  "proc.dental-crowns.eyebrow": "Forcë & Estetikë",
  "proc.dental-crowns.intro":
    "Kurorat dentare rivendosin dhëmbët e thyer, që mungojnë ose të dëmtuar, duke përmirësuar njëkohësisht funksionin dhe pamjen. Çdo kurorë punohet nga materiale premium nga partnerë të besuar si Ivoclar.",
  "proc.dental-crowns.body.0":
    "Një kurorë rindërton një dhëmb shumë të dëmtuar për një mbushje të thjeshtë, duke mbrojtur atë që ka mbetur dhe duke rivendosur formën, ngjyrën dhe kafshimin natyral. E përshtatim çdo restaurim me dhëmbët përreth, që rezultati të shkrihet pa cen në buzëqeshjen tuaj.",
  "proc.dental-crowns.body.1":
    "Nga kurorat e vetme prej zirkoni dhe qeramike te urat shumëdhëmbëshe dhe restaurimet me porosi, puna jonë laboratorike është ndërtuar të zgjasë - e punuar sipas standardeve evropiane të cilësisë në procesin tonë të certifikuar ISO 9001.",
  "proc.dental-crowns.t0.title": "Kurora Zirkoni",
  "proc.dental-crowns.t0.text": "Kurora jashtëzakonisht të forta, pa metal, me një përfundim si natyral.",
  "proc.dental-crowns.t1.title": "Kurora Qeramike",
  "proc.dental-crowns.t1.text": "Restaurime mrekullisht natyrale të punuara nga qeramika premium.",
  "proc.dental-crowns.t2.title": "Ura",
  "proc.dental-crowns.t2.text": "Restaurime fikse që zëvendësojnë një ose më shumë dhëmbë që mungojnë.",
  "proc.dental-crowns.t3.title": "Restaurime me Porosi",
  "proc.dental-crowns.t3.text": "Zgjidhje të përshtatura rreth kafshimit dhe buzëqeshjes suaj.",

  "proc.dental-veneers.name": "Veneera Dentare",
  "proc.dental-veneers.eyebrow": "Dizajno Buzëqeshjen Tënde",
  "proc.dental-veneers.intro":
    "Veneerat prej qeramike dhe kompoziti krijojnë një buzëqeshje të përsosur, natyrale, në nivel Hollywood-i. Guaska të holla me porosi transformojnë formën, ngjyrën dhe harmoninë e dhëmbëve me ndërhyrje minimale.",
  "proc.dental-veneers.body.0":
    "Veneerat janë një nga mjetet më të fuqishme në stomatologjinë estetike, duke korrigjuar zbardhjen, çarjet, hapësirat dhe format e parregullta në një transformim të vetëm. Veneerat prej qeramike ofrojnë përfundimin më të qëndrueshëm e reflektues, ndërsa veneerat kompozite ofrojnë një opsion brenda së njëjtës vizitë.",
  "proc.dental-veneers.body.1":
    "Çdo transformim buzëqeshjeje fillon me një konsultë të hollësishme të dizajnit të buzëqeshjes, që ta shihni dhe ta formësoni rezultatin final para fillimit të trajtimit. Të kombinuara me zbardhimin profesional të dhëmbëve, rezultati është një buzëqeshje që duket natyrale dhe pa mëdyshje e juaja.",
  "proc.dental-veneers.t0.title": "Faseta Qeramike",
  "proc.dental-veneers.t0.text": "Guaska të punuara me dorë për një përfundim të qëndrueshëm e reflektues.",
  "proc.dental-veneers.t1.title": "Veneera Kompozite",
  "proc.dental-veneers.t1.text": "Një opsion elegant, brenda së njëjtës vizitë, për një buzëqeshje të freskuar.",
  "proc.dental-veneers.t2.title": "Dizajn Buzëqeshjeje",
  "proc.dental-veneers.t2.text": "Një plan i posaçëm që ju jep paraprakisht rezultatin para trajtimit.",
  "proc.dental-veneers.t3.title": "Zbardhim Dhëmbësh",
  "proc.dental-veneers.t3.text": "Zbardhim i sigurt dhe profesional për një buzëqeshje më të ndritshme.",

  "proc.dental-prostheses.name": "Proteza Dentare",
  "proc.dental-prostheses.eyebrow": "Funksion & Komoditet",
  "proc.dental-prostheses.intro":
    "Protezat dentare me porosi rivendosin dhëmbët që mungojnë ose të dëmtuar për funksion, komoditet dhe një buzëqeshje harmonike. Çdo protezë dizajnohet dhe përshtatet të ndihet natyrale dhe të duket e bukur.",
  "proc.dental-prostheses.body.0":
    "Qoftë nëse ju duhet të zëvendësoni disa dhëmbë apo të rehabilitoni tërë gojën, protezat tona janë punuar të rivendosin përtypjen me besim, të folurit e qartë dhe një pamje të balancuar të fytyrës. Marrim kohën të përsosim përshtatjen, që proteza juaj të ndihet e sigurt dhe komode çdo ditë.",
  "proc.dental-prostheses.body.1":
    "Zgjidhjet tona shtrihen nga protezat fikse dhe të lëvizshme te protezat me porosi dhe rehabilitimi i tërë gojës, shpesh të kombinuara me implante për stabilitet shtesë. Çdo plan është i personalizuar, i parashikueshëm dhe kryhet sipas standardeve ISO 9001 dhe atyre evropiane të cilësisë.",
  "proc.dental-prostheses.t0.title": "Proteza Fikse",
  "proc.dental-prostheses.t0.text": "Restaurime të fiksuara përgjithmonë për një ndjesi të qëndrueshme e natyrale.",
  "proc.dental-prostheses.t1.title": "Proteza të Lëvizshme",
  "proc.dental-prostheses.t1.text": "Opsione komode, të përshtatura me porosi dhe të lehta për t'u mirëmbajtur.",
  "proc.dental-prostheses.t2.title": "Proteza me Porosi",
  "proc.dental-prostheses.t2.text": "Proteza moderne të dizajnuara për komoditet dhe një pamje natyrale.",
  "proc.dental-prostheses.t3.title": "Rehabilitim i Tërë Gojës",
  "proc.dental-prostheses.t3.text": "Restaurim gjithëpërfshirës i funksionit dhe estetikës.",

  "proc.orthodontics.name": "Ortodonci",
  "proc.orthodontics.eyebrow": "Drejtoji me Besim",
  "proc.orthodontics.intro":
    "Trajtimi ynë i specializuar ortodontik korrigjon drejtimin e dhëmbëve dhe nofullës me apareta tradicionale dhe aligner-a transparentë Invisalign. I ofruar nga ekipi ynë i specializuar ortodontik, çdo plan përshtatet me buzëqeshjen tuaj.",
  "proc.orthodontics.body.0":
    "Dhëmbët e drejtë nuk janë vetëm të bukur - janë më të shëndetshëm dhe më të lehtë për t'u pastruar. E planifikojmë me kujdes çdo rast për të udhëhequr dhëmbët dhe nofullën drejt një drejtimi të balancuar e të qëndrueshëm, me opsione për çdo moshë dhe stil jete.",
  "proc.orthodontics.body.1":
    "Zgjidhni aligner-at transparentë e të lëvizshëm Invisalign për besim të përditshëm, ose apareta të besueshme tradicionale për lëvizje më komplekse. Me ndërhyrje të hershme për pacientët më të rinj dhe mbajtëse për të mbrojtur rezultatin tuaj, drejtimi juaj i ri është ndërtuar të zgjasë.",
  "proc.orthodontics.t0.title": "Apareta Tradicionale",
  "proc.orthodontics.t0.text": "Korrigjim i besueshëm dhe i saktë për një gamë të gjerë rastesh.",
  "proc.orthodontics.t1.title": "Invisalign",
  "proc.orthodontics.t1.text": "Aligner-a pothuajse të padukshëm, të lëvizshëm, për besim të përditshëm.",
  "proc.orthodontics.t2.title": "Ndërhyrje e Hershme",
  "proc.orthodontics.t2.text": "Udhëheqje e buzëqeshjeve të reja për rezultatin më të mirë afatgjatë.",
  "proc.orthodontics.t3.title": "Mbajtëse",
  "proc.orthodontics.t3.text": "Mbrojtja e drejtimit tuaj të ri e të bukur për një kohë të gjatë.",

  "clinic.our-story.title": "Historia Jonë",
  "clinic.our-story.eyebrow": "Rreth Dental Med Austria",
  "clinic.our-story.intro":
    "Që nga viti 2009, Dental Med Austria ka sjellë kujdes dentar me cilësi premium në Tiranë - një klinikë ku standardet rigoroze evropiane takohen me kujdesin e ngrohtë, me pacientin në qendër.",
  "clinic.our-story.s0.heading": "Themeluar mbi Standarde Premium",
  "clinic.our-story.s0.p0":
    "Dental Med Austria u themelua në vitin 2009 dhe, që nga dita e parë, u ndërtua rreth standardeve të sakta premium të cilësisë, të bazuara në fakte.",
  "clinic.our-story.s0.p1":
    "Më shumë se një dekadë më vonë, klinika njihet si një nga praktikat dentare lider në Shqipëri, e besuar nga mbi 24,000 pacientë të kënaqur nga Shqipëria dhe e gjithë bota.",
  "clinic.our-story.s1.heading": "Cilësi që Mund ta Besoni",
  "clinic.our-story.s1.p0":
    "Puna jonë kryhet sipas standardeve ISO 9001 dhe protokolleve evropiane të higjienës, duke përdorur teknologji të avancuar dhe materiale me cilësi të lartë në çdo hap.",
  "clinic.our-story.s1.p1":
    "Qëndrojmë pas rezultateve tona me punë të dokumentuar e të gjurmueshme dhe mbështetje pas çdo trajtimi, që të na zgjidhni me besim të plotë.",

  "clinic.our-clinic.title": "Klinika Jonë",
  "clinic.our-clinic.eyebrow": "Një Strukturë Moderne",
  "clinic.our-clinic.intro":
    "Klinika jonë moderne, me pacientin në qendër, në zemër të Tiranës, ndërthur teknologji të avancuar, materiale premium dhe një mjedis të qetë e komod.",
  "clinic.our-clinic.s0.heading": "Teknologji e Avancuar, Materiale Premium",
  "clinic.our-clinic.s0.p0":
    "Çdo trajtim ofrohet duke përdorur teknologji të avancuar dentare dhe materiale me cilësi të lartë, duke siguruar rezultate të sigurta, të parashikueshme dhe të qëndrueshme.",
  "clinic.our-clinic.s0.p1":
    "Punojmë ekskluzivisht me partnerë premium të besuar në të gjithë Evropën - Straumann, Ivoclar dhe Biodem - që komponentët dhe restaurimet në gojën tuaj të jenë më të mirat e mundshme.",
  "clinic.our-clinic.s1.heading": "Komod & me Pacientin në Qendër",
  "clinic.our-clinic.s1.p0":
    "Nga konsulta juaj e parë te rezultati juaj final, çdo detaj i klinikës sonë është dizajnuar rreth komoditetit tuaj. Profesionistët tanë me përvojë ndjekin trajnime të vazhdueshme për të qëndruar në krye të stomatologjisë moderne.",
  "clinic.our-clinic.s1.p1":
    "Çdo pacient merr një plan trajtimi të personalizuar të ndërtuar rreth qëllimeve të tij, të ofruar në një mjedis të qetë e mikpritës që plotëson standardet ISO 9001 dhe ato evropiane të higjienës.",

  "clinic.dental-tourism.title": "Turizmi Dentar",
  "clinic.dental-tourism.eyebrow": "Kujdesi dhe Udhëtimi së Bashku",
  "clinic.dental-tourism.intro":
    "Shqipëria është një destinacion lider për turizmin dentar, duke kombinuar pamje mahnitëse me kujdes dentar të klasit botëror. Ne e bëjmë tërë udhëtimin pa mundim.",
  "clinic.dental-tourism.s0.heading": "Gjithçka e Organizuar për Ju",
  "clinic.dental-tourism.s0.p0":
    "Ndihmojmë në organizimin e fluturimeve drejt Tiranës, dhe ekipi ynë do t'ju presë në Aeroportin e Tiranës me një mirëseardhje të ngrohtë dhe marrje nga aeroporti.",
  "clinic.dental-tourism.s0.p1":
    "Do të qëndroni në hotele partnere që ofrojnë komoditete moderne dhe WiFi falas, dhe ekipi ynë ofron përkthim në anglisht, italisht, gjermanisht dhe frëngjisht gjatë gjithë qëndrimit tuaj.",
  "clinic.dental-tourism.s1.heading": "Udhëtimi Juaj i Trajtimit",
  "clinic.dental-tourism.s1.p0":
    "1. Konsulta Fillestare - diskutojmë shqetësimet dhe qëllimet tuaja dhe ndërtojmë një plan të personalizuar.",
  "clinic.dental-tourism.s1.p1":
    "2. Trajtim nga Ekspertët - kujdesi juaj kryhet nga ekipi ynë klinik me përvojë duke përdorur materiale premium.",
  "clinic.dental-tourism.s1.p2":
    "3. Kujdes Pasues - qëndrojmë në kontakt pasi ktheheni në shtëpi për t'u siguruar që rezultatet tuaja zgjasin.",

  "clinic.medical-insurance.title": "Sigurimi Mjekësor",
  "clinic.medical-insurance.eyebrow": "Fleksibël & i Mbështetur",
  "clinic.medical-insurance.intro":
    "Punojmë ta bëjmë kujdesin dentar me cilësi të lartë sa më të aksesueshëm, me opsione fleksibël pagese dhe ndihmë me kërkesat e sigurimit.",
  "clinic.medical-insurance.s0.heading": "Duke Punuar me Sigurimin Tuaj",
  "clinic.medical-insurance.s0.p0":
    "Ekipi ynë ndihmon me kënaqësi në kërkesat e sigurimit mjekësor dhe ofron dokumentacionin që ju nevojitet për të kërkuar rimbursim nga ofruesi juaj.",
  "clinic.medical-insurance.s0.p1":
    "Nëse nuk jeni i sigurt nëse plani juaj mbulon trajtimin jashtë vendit, na kontaktoni dhe do t'ju ndihmojmë t'i kuptoni opsionet tuaja para se të udhëtoni.",
  "clinic.medical-insurance.s1.heading": "Opsione Fleksibël Pagese",
  "clinic.medical-insurance.s1.p0":
    "Ofrojmë opsione fleksibël pagese të dizajnuara ta bëjnë planin tuaj të trajtimit të menaxhueshëm, pa kompromis në cilësi apo materiale.",
  "clinic.medical-insurance.s1.p1":
    "Për një plan të përshtatur dhe udhëzime për pagesën, thjesht na shkruani në info@dentalmedaustria.com.",

  "clinic.faqs.title": "Pyetjet e Shpeshta",
  "clinic.faqs.eyebrow": "Përgjigje të Dobishme",
  "clinic.faqs.intro":
    "Përgjigje për pyetjet që na bëhen më shpesh nga pacientët vendas dhe ndërkombëtarë.",
  "clinic.faqs.s0.heading": "Ku ndodheni?",
  "clinic.faqs.s0.p0":
    "Klinika jonë ndodhet në Rrugën Kristo Luarasi në Tiranë, Shqipëri, e hapur nga e hëna në të shtunë nga ora 9:00 deri në 22:00.",
  "clinic.faqs.s1.heading": "A trajtoni pacientë ndërkombëtarë?",
  "clinic.faqs.s1.p0":
    "Po. Mirëpresim pacientë nga e gjithë bota dhe ofrojmë mbështetje të plotë për turizmin dentar, përfshirë ndihmë me fluturimet, marrjen nga aeroporti, hotelet partnere dhe përkthimin në anglisht, italisht, gjermanisht dhe frëngjisht.",
  "clinic.faqs.s2.heading": "Çfarë kujdesi ofroni pas trajtimit?",
  "clinic.faqs.s2.p0": "Çdo pacient me implante merr një pasaportë implanti me markën e implantit dhe numra serialë të verifikueshëm, dhe ekipi ynë mbetet në dispozicion për mbështetje pas trajtimit.",
  "clinic.faqs.s3.heading": "Cilat standarde ndiqni?",
  "clinic.faqs.s3.p0":
    "Klinika jonë operon sipas standardeve ISO 9001 dhe protokolleve evropiane të higjienës, duke përdorur teknologji të avancuar dhe materiale premium nga partnerë si Straumann, Ivoclar dhe Biodem.",
  "clinic.faqs.s4.heading": "Si mund të rezervoj një takim?",
  "clinic.faqs.s4.p0":
    "Rezervimi është i thjeshtë - na shkruani në info@dentalmedaustria.com dhe ekipi ynë do të organizojë konsultën tuaj dhe do t'i përgjigjet çdo pyetjeje.",

  "equipcat.imaging.label": "Imazheri & Diagnostikë 3D",
  "equipcat.imaging.blurb":
    "Imazheri 3D dhe panoramike me dozë të ulët - shtylla kurrizore diagnostike e planifikimit të saktë të implanteve dhe kirurgjisë.",
  "equipcat.cadcam.label": "Frezim CAD/CAM",
  "equipcat.cadcam.blurb":
    "Frezim i brendshëm me 5 akse që punon kurora, ura dhe korniza për tërë harkun me precizion industrial.",
  "equipcat.furnaces.label": "Furra Qeramike & Sinterimi",
  "equipcat.furnaces.blurb":
    "Furra precize që pjekin, presin dhe sinterojnë çdo restaurim deri në forcën dhe bukurinë e tij përfundimtare.",
  "equipcat.guided-surgery.label": "Kirurgji Implantesh e Udhëhequr",
  "equipcat.guided-surgery.blurb":
    "Navigim në kohë reale dhe motorë kirurgjikë të kontrolluar për një vendosje implantesh më të sigurt e më të saktë.",
  "equipcat.lab.label": "Mikromotorë Laboratori",
  "equipcat.lab.blurb":
    "Mikromotorë profesionalë pa brusha që formësojnë dhe përfundojnë restaurimet me dorë në laboratorin tonë në vend.",
  "equipcat.air-suction.label": "Kompresorë & Thithje",
  "equipcat.air-suction.blurb":
    "Ajër i kompresuar pa vaj dhe thithje qendrore - infrastruktura e pastër e e besueshme pas çdo karrigeje.",
  "equipcat.sterilization.label": "Sterilizim",
  "equipcat.sterilization.blurb":
    "Protokolle rigoroze sterilizimi sipas standardeve ISO 9001 dhe evropiane të higjienës, për sigurinë tuaj të plotë.",
  "equipcat.surgical-optics.label": "Lazerë Kirurgjikë & Optikë",
  "equipcat.surgical-optics.blurb":
    "Lazerë për indin e butë dhe mikroskopë operues për precizion minimalisht invaziv dhe shumë të zmadhuar.",
  "equipcat.operatory.label": "Dhoma Trajtimi",
  "equipcat.operatory.blurb":
    "Njësi moderne trajtimi dhe ndriçim të dizajnuara rreth komoditetit tuaj dhe saktësisë së klinicistit.",
  "equipcat.materials.label": "Materiale Premium & Marka Implantesh",
  "equipcat.materials.blurb":
    "Markat evropiane të besuara pas implanteve, kurorave dhe grafteve tuaja - cilësi që mund të mbështeteni.",

  // ── Catalogue detail: 3D stage headings ──
  "cat.3d.eyebrow": "Në Tri Dimensione",
  "cat.3d.crown": "E punuar në zirkon & e.max",
  "cat.3d.tooth": "Kujdesi për dhëmbin tuaj natyral",
  "cat.3d.aligner": "Drejtoni dhëmbët, në mënyrë diskrete",
  "cat.3d.dragToRotate": "tërhiqni për ta rrotulluar",
  "card.discover": "Zbulo trajtimin",
  "card.viewDetails": "Shiko detajet",
  "cat.detail.treatmentFallback": "Trajtim",
  "cat.detail.catalogueCrumb": "Katalogu i Trajtimeve",

  // ── Catalogue detail: "why choose us" reasons ──
  "cat.why.r0.title": "Cilësi premium, standarde evropiane",
  "cat.why.r0.text": "Çdo trajtim kryhet sipas standardeve ISO 9001 dhe protokolleve klinike evropiane, me materiale premium nga emra si Straumann dhe Ivoclar.",
  "cat.why.r1.title": "Një ekip që e ka bërë këtë më parë",
  "cat.why.r1.text": "Kirurgët tanë kanë vendosur mbi 42,000 implante me 98% sukses, përvojë që e ndjeni që nga konsulta e parë.",
  "cat.why.r2.title": "Teknologji e avancuar",
  "cat.why.r2.text": "Imazheria 3D CBCT, kirurgjia e udhëhequr nga kompjuteri dhe laboratori ynë i brendshëm i qeramikës sjellin rezultate më të sakta, më komode dhe më të parashikueshme.",
  "cat.why.r3.title": "I gjithë udhëtimi juaj, i organizuar",
  "cat.why.r3.text": "Një plan falas në distancë para se të fluturoni, marrje nga aeroporti, një koordinator shumëgjuhësh dhe qëndrime në hotele partnere, trajtimi dhe udhëtimi të organizuara nga fillimi në fund.",
  "cat.why.r4.title": "Dokumentacion që merrni me vete",
  "cat.why.r4.text": "Pacientët me implante marrin një pasaportë implanti me numra serialë të verifikueshëm, dhe çdo trajtim dokumentohet, me mbështetje pas trajtimit që vazhdon edhe pasi ktheheni në shtëpi.",
  "cat.why.r5.title": "Kujdes që ka kuptim",
  "cat.why.r5.text": "Të njëjtat materiale dhe standarde premium si në Evropën Perëndimore, arsyeja e sinqertë pse pacientët udhëtojnë në Tiranë. Kërkoni planin tuaj falas të personalizuar të trajtimit.",

  // ── Safety page (hardcoded copy) ──
  "safety.hero.eyebrow": "Siguria & Higjiena",
  "safety.hero.title": "Standardi më i Lartë i Sterilizimit dhe Siguria e Pacientit",
  "safety.intro.tagline": "Çdo instrument. Çdo pacient. Çdo herë.",
  "safety.breadcrumb": "Siguria & Higjiena",
  "safety.faq.heading": "Pyetje për sigurinë, me përgjigje",
  "safety.cta.heading": "Kujdes që mund ta verifikoni, në një klinikë që mund t'i besoni",
  "safety.cta.text": "Protokolle të dokumentuara, materiale të verifikuara dhe gjurmueshmëri e plotë - e njëjta disiplinë e kontrollit të infeksioneve që do të prisnit nga një klinikë kryesore në Zvicër, Gjermani apo Britani.",
  "safety.cta.chips": "Protokolle të dokumentuara·Materiale të verifikuara·Gjurmueshmëri e plotë·Sterilizim rigoroz",

  // ── Blog (hardcoded chrome) ──
  "blog.index.title": "Lajme & Histori",
  "blog.hero.eyebrow": "Nga Dental Med Austria",
  "blog.viewAll": "Shiko të gjitha",
  "blog.crumb": "Blog",
  "blog.category.eyebrow": "Blog",
  "blog.stories": "Histori",
  "blog.empty": "Ende nuk ka artikuj këtu, kthehuni së shpejti.",
  "blog.notFound.title": "Artikulli nuk u gjet",
  "blog.notFound.text": "Nuk arritëm ta gjejmë atë artikull.",
  "blog.backToBlog": "Kthehu te Blogu",
  "blog.medicallyReviewed": "Rishikuar mjekësisht",
  "blog.reviewedBy": "Rishikuar mjekësisht nga",
  "blog.lastReviewed": "Rishikuar së fundmi",
};

const IT: Dict = {
  "nav.home": "Home",
  "nav.packets": "Piani di Trattamento",
  "nav.clinic": "Clinica",
  "nav.care": "Piani di Trattamento",
  "nav.smiles": "Sorrisi",
  "nav.contact": "Contatti",

  "subnav.catalogue": "Catalogo Completo dei Trattamenti",
  "subnav.ourStory": "La Nostra Storia",
  "subnav.ourClinic": "La Nostra Clinica",
  "subnav.technology": "Tecnologia e Attrezzature",
  "subnav.insurance": "Assicurazione Medica",
  "subnav.faqs": "Domande Frequenti",
  "subnav.safety": "Sicurezza & Igiene",

  "treat.implants": "Impianti Dentali",
  "treat.crowns": "Corone Dentali",
  "treat.veneers": "Faccette Dentali",
  "treat.prostheses": "Protesi Dentali",
  "treat.orthodontics": "Ortodonzia",

  "hero.eyebrow": "Impianti  |  Estetica  |  Ortodonzia",
  "hero.title": "Cure Dentali Avanzate in Albania",

  "intro.h2": "Odontoiatria di Livello Mondiale nel Cuore di Tirana",
  "intro.p1":
    "Fondata nel 2009, Dental Med Austria porta standard di qualità premium nelle cure dentali in Albania, per pazienti locali e internazionali.",
  "intro.p2":
    "Il nostro team esperto ha accolto oltre 24.000 pazienti soddisfatti e posizionato più di 42.000 impianti con un tasso di successo del 98%, unendo tecnologia avanzata, materiali premium e piani di trattamento personalizzati in un ambiente tranquillo e attento al paziente.",
  "intro.p3":
    "Ogni trattamento è eseguito secondo gli standard ISO 9001 e igienici europei, con protocolli di sterilizzazione rigorosi e materiali documentati e tracciabili, così puoi sceglierci in tutta tranquillità.",
  "intro.quote":
    "“Altri dentisti mi hanno dato risultati ‘buoni’, ma qui? Denti FANTASTICI, da livello Hollywood! La precisione, l'estetica, la sensazione… è come essere stato aggiornato a una versione di lusso di me stesso.”",
  "intro.quoteCite": "- Meriton Mjekiqi",
  "intro.stat.patients": "Pazienti Soddisfatti",
  "intro.stat.implants": "Impianti Posizionati",
  "intro.stat.success": "Successo Impianti",
  "intro.stat.trusted": "Cura Affidabile",
  "btn.services": "I Nostri Servizi",

  "explore.title": "Esplora i Trattamenti Dentali",
  "card.discover": "Scopri il trattamento",
  "card.viewDetails": "Vedi i dettagli",

  "tour.title": "Visita la Nostra Clinica",
  "tour360.eyebrow": "Entrate con Noi",
  "tour360.title": "Esplorate la Clinica a 360°",
  "tour360.hint": "Trascinate per guardarvi intorno e toccate le frecce per attraversare ogni ambiente di Dental Med Austria.",
  "tour360.cta": "Fate il tour virtuale a 360°",
  "tour.tech.eyebrow": "Attrezzature all'Avanguardia",
  "tour.tech.title": "Tecnologia Avanzata",
  "tour.tourism.title": "Turismo Dentale",

  "smiles.eyebrow": "Trasformazioni del Sorriso che Cambiano la Vita",
  "smiles.title": "Sveliamo Sorrisi Splendidi",
  "smiles.cta": "Vedi la Galleria dei Sorrisi",

  // ── Testimonials (Instagram patient reels) ──
  "testi.eyebrow": "Pazienti Veri, Parole Vere",
  "testi.title": "Storie dei Pazienti",
  "testi.subtitle":
    "Guarda i veri pazienti di Dental Med Austria raccontare la loro esperienza, girato nella nostra clinica di Tirana e pubblicato su Instagram.",
  "testi.badge": "Storia del paziente",
  "testi.watch": "Guarda il reel",
  "testi.follow": "Scopri di più su Instagram",
  "testi.close": "Chiudi",
  "testi.prev": "Storia precedente",
  "testi.next": "Storia successiva",
  "testi.loading": "Caricamento…",

  "blogstrip.eyebrow": "Dalla Clinica",
  "blogstrip.heading": "Notizie, Consigli & Turismo Dentale",
  "blogstrip.viewAll": "Vedi Tutte le Storie",

  // ── Reviews (Google patient reviews) ──
  "reviews.eyebrow": "Recensioni Google Verificate",
  "reviews.heading": "Cosa Dicono i Nostri Pazienti",
  "reviews.ratingLabel": "recensioni Google",

  "brand.eyebrow": "I Nostri Partner di Fiducia",
  "brand.heading": "I Nostri Partner e i Marchi di Fiducia con cui Lavoriamo",

  "common.prev": "Precedente",
  "common.next": "Successivo",

  "footer.getDirections": "Indicazioni Stradali",
  "footer.form.first": "Nome*",
  "footer.form.last": "Cognome*",
  "footer.form.email": "Email*",
  "footer.form.phone": "Telefono*",
  "footer.form.patient": "Paziente Nuovo o Esistente*",
  "footer.form.comments": "Commenti",
  "footer.form.message": "Come possiamo aiutarti?",
  "footer.form.submit": "Invia",
  "footer.rights": "Tutti i diritti riservati",
  "footer.privacy": "Privacy",
  "footer.risks": "Rischi del Trattamento",
  "footer.tagline":
    "Dental Med Austria è una clinica odontoiatrica certificata ISO 9001 a Tirana, specializzata in implantologia, odontoiatria estetica e riabilitazioni complete della bocca. Dal 2009, oltre 24.000 pazienti provenienti da tutta Europa e da altri Paesi hanno scelto la nostra esperienza per ottenere sorrisi naturali, sicuri e duraturi. Ogni trattamento implantare include un Passaporto Implantare che garantisce la completa tracciabilità degli impianti.",
  "footer.col.treatments": "Trattamenti",
  "footer.col.clinic": "La Clinica",
  "footer.col.patients": "Per i Pazienti",
  "footer.blog": "Blog",
  "footer.smiles": "Galleria dei Sorrisi",
  "footer.team": "Il Nostro Team",
  "footer.langs": "Questo sito in altre lingue",
  "footer.sitemap": "Mappa del sito",
  "footer.accredited": "Certificata & membro di",

  "sticky.appointment": "Richiedi un Appuntamento",
  "sticky.call": "Chiamaci",
  "sticky.email": "Scrivici",

  "lead.rail.tab": "Piano di Cura Gratuito",
  "lead.rail.title": "Richiedi il tuo piano di cura gratuito",
  "lead.rail.subtitle": "Dicci come contattarti, piano scritto personalizzato entro 24–48 ore.",
  "lead.rail.send": "Invia richiesta",
  "lead.rail.sending": "Invio in corso…",
  "lead.rail.success": "Grazie, richiesta ricevuta!",
  "lead.rail.successNote": "Il nostro coordinatore risponderà entro 24–48 ore. Il tuo riferimento:",
  "lead.rail.error": "Aggiungi almeno nome e numero di telefono, poi riprova.",
  "lead.rail.whatsapp": "Continua su WhatsApp",
  "lead.rail.privacy": "Inviando, accetti di essere contattato per la tua richiesta. Mai spam.",

  "cta.requestAppointment": "Richiedi un Appuntamento",
  "nav.team": "Team",
  "nav.catalogue": "Catalogo",
  "nav.technology": "Tecnologia",

  "care.hero.eyebrow": "Soluzioni Dentali Complete",
  "care.hero.title": "Le Nostre Cure",
  "care.intro.eyebrow": "Impianti, Corone, Faccette & Altro",
  "care.intro.text":
    "Dagli impianti dentali e dalle corone alle faccette, protesi e ortodonzia, offriamo soluzioni dentali complete secondo gli standard di qualità premium - tutto sotto lo stesso tetto.",
  "care.cta.heading": "Non sai da dove iniziare? Ti guidiamo noi.",
  "care.cta.text": "Prenota una consulenza e progetteremo il piano giusto per il tuo sorriso.",

  "care.detail.aboutPrefix": "Informazioni su",
  "care.detail.ctaPrefix": "Pronto a esplorare",
  "care.detail.ctaSuffix": "?",
  "care.detail.ctaText": "Prenota oggi una consulenza con il nostro team.",

  "smilespage.hero.eyebrow": "Trasformazioni del Sorriso che Cambiano la Vita",
  "smilespage.hero.title": "La Galleria dei Sorrisi",
  "smilespage.intro.eyebrow": "Pazienti Veri · Risultati Veri",
  "smilespage.intro.text":
    "Io Sorrido con DENTAL MED AUSTRIA",
  "smilespage.cta.heading": "Immagina il tuo nuovo sorriso.",
  "smilespage.cta.text":
    "Invia una radiografia panoramica e qualche foto per un piano gratuito di smile design entro 24-48 ore.",

  "cat.hero.eyebrow": "Qualità Premium · Tirana, Albania",
  "cat.hero.title": "Catalogo dei Trattamenti",
  "cat.stats.treatments": "Trattamenti",
  "cat.stats.specialties": "Specialità",
  "cat.stats.requested": "Più Richiesti",
  "cat.intro.heading": "Ogni trattamento che offriamo, sotto lo stesso tetto",
  "cat.intro.text":
    "Dagli impianti singoli alle trasformazioni complete del sorriso, ogni procedura è eseguita con materiali premium e standard di qualità premium. Ogni piano è personalizzato per il tuo caso - inviaci la tua radiografia per un piano scritto gratuito in 24-48 ore.",
  "cat.cta.eyebrow": "Gratuito · Senza Impegno",
  "cat.cta.heading": "Ricevi il tuo piano di trattamento personalizzato",
  "cat.cta.text":
    "Inviaci una radiografia panoramica e qualche foto. Il nostro team clinico ti restituirà un piano di trattamento scritto entro 24-48 ore, nella tua lingua.",
  "cat.cta.requestPlan": "Richiedi un Piano",
  "cat.cta.featured": "Servizi in Evidenza",
  "cat.section.treatments": "Trattamenti",

  "cat.detail.idealFor": "Ideale per:",
  "cat.detail.materials": "Materiali & Marchi",
  "cat.detail.whyChoose": "Perché i pazienti lo scelgono",
  "cat.detail.typicalSession": "Sessione tipica",
  "cat.detail.journey": "Il Tuo Percorso",
  "cat.detail.whatToExpect": "Cosa aspettarsi",
  "cat.detail.frequentlyAsked": "Domande Frequenti",
  "cat.detail.questionsPrefix": "Domande su",
  "cat.detail.relatedTreatments": "Trattamenti correlati",
  "cat.detail.learnMore": "Scopri di più",
  "cat.detail.consideringPrefix": "Stai valutando",
  "cat.detail.consideringSuffix": "?",
  "cat.detail.ctaText":
    "Invia una radiografia panoramica e qualche foto per un piano di trattamento scritto gratuito entro 24-48 ore.",
  "cat.detail.allTreatments": "Tutti i Trattamenti",
  "cat.detail.ataGlance": "In sintesi",
  "cat.detail.procedureEyebrow": "La Procedura",
  "cat.detail.procedureHeading": "Passo dopo passo",
  "cat.detail.whoEyebrow": "Idoneità",
  "cat.detail.whoHeading": "A chi è rivolto questo trattamento?",
  "cat.detail.recoveryEyebrow": "Recupero",
  "cat.detail.recoveryHeading": "Recupero e guarigione",
  "cat.detail.evidenceEyebrow": "Le evidenze",
  "cat.detail.evidenceHeading": "Successo e durata",
  "cat.detail.goodToKnowEyebrow": "Da sapere",
  "cat.detail.goodToKnowHeading": "Confronti e considerazioni",
  "cat.detail.careEyebrow": "Post-trattamento",
  "cat.detail.careHeading": "Prendersi cura del risultato",
  "cat.detail.costEyebrow": "Pianificazione",
  "cat.detail.costHeading": "Il tuo piano e trasparenza",
  "cat.detail.whyEyebrow": "Perché noi",
  "cat.detail.whyHeading": "Perché i pazienti scelgono Dental Med Austria",

  "contactpage.hero.eyebrow": "Ci Farebbe Piacere Sentirti",
  "contactpage.hero.title": "Contattaci",
  "contactpage.getDirections": "Indicazioni Stradali →",
  "contactpage.instagram": "Instagram",
  "contactpage.facebook": "Facebook",
  "contactpage.openingHours": "Orari di Apertura",
  "contactpage.hours.weekdays": "Lunedì - Venerdì",
  "contactpage.hours.weekdaysTime": "9:00 - 19:00",
  "contactpage.hours.saturday": "Sabato",
  "contactpage.hours.saturdayTime": "9:00 - 15:00",
  "contactpage.hours.sunday": "Domenica",
  "contactpage.hours.sundayTime": "Chiuso",

  "team.hero.eyebrow": "Dental Med Austria",
  "team.hero.title": "Conosci il Nostro Team",
  "team.intro.eyebrow": "Esperti & Premurosi",
  "team.intro.text":
    "Le nostre cure sono guidate da un esperto team clinico che unisce decenni di esperienza e standard di qualità premium a una cura autentica, incentrata sul paziente.",
  "team.specialist": "Il Nostro Specialista",
  "team.cta.heading": "Pronto a conoscere il nostro team?",
  "team.cta.text":
    "Saremmo lieti di accoglierti in clinica. Scrivici per prenotare la tua prima consulenza.",

  "team.dentists.hero.title": "Il Nostro Specialista",
  "team.dentists.intro.text":
    "Il nostro esperto team clinico porta decenni di esperienza e standard di qualità premium alla cura delicata, meticolosa e incentrata sul paziente della clinica.",
  "team.dentists.cta.heading": "Prenota oggi la tua consulenza.",

  "team.hygienists.hero.title": "Cure Preventive",
  "team.hygienists.intro.eyebrow": "Sorrisi Sani, per Tutta la Vita",
  "team.hygienists.intro.text":
    "Presso Dental Med Austria, le cure preventive e l'igiene sono erogate dal nostro esperto team clinico secondo gli standard igienici europei - mantenendo il tuo sorriso sano tra un trattamento e l'altro.",
  "team.hygienists.cta.heading": "Prenota il tuo prossimo appuntamento.",

  "team.meet.hero.eyebrow": "Lo Specialista Dietro le Tue Cure",
  "team.meet.hero.title": "Conosci il Nostro Team",
  "team.meet.intro.text":
    "Presso Dental Med Austria le tue cure sono guidate da un esperto team clinico, dedicato a rendere la tua esperienza eccezionale - dall'accoglienza calorosa al tuo risultato finale sulla poltrona.",
  "team.meet.cta.heading": "Non vediamo l'ora di accoglierti.",

  "team.bio.ctaPrefix": "Prenota un appuntamento con",

  "role.founder-managing-director": "Fondatore & Direttore Generale",

  "tech.hero.eyebrow": "Livello Ospedaliero · Laboratorio Interno",
  "tech.hero.title": "Tecnologia & Attrezzature",
  "tech.stats.devices": "Dispositivi",
  "tech.stats.categories": "Categorie",
  "tech.stats.oneRoof": "Un Unico Tetto",
  "tech.intro.heading": "La tecnologia dietro i risultati di qualità premium",
  "tech.intro.text":
    "Dall'imaging 3D CBCT e dalla chirurgia computer-guidata alla nostra fresatura CAD/CAM interna e al laboratorio ceramico, ogni dispositivo è scelto per precisione, sicurezza e risultati belli e duraturi.",
  "tech.system": "Sistema",
  "tech.systems": "Sistemi",
  "tech.flagship": "Di Punta",
  "tech.cta.eyebrow": "Standard Premium · Tirana",
  "tech.cta.heading": "Scopri la differenza che fa la precisione",
  "tech.cta.text":
    "Vieni a vedere la nostra tecnologia di persona, oppure invia una radiografia per un piano di trattamento gratuito a distanza entro 24-48 ore.",
  "tech.cta.bookVisit": "Prenota una Visita",
  "tech.cta.catalogue": "Catalogo dei Trattamenti",

  "packets.hero.eyebrow": "Curati · Combinati · Completi",
  "packets.hero.title": "Pacchetti di Trattamento",
  "packets.list.eyebrow": "Pacchetti di Trattamento Curati",
  "packets.list.heading": "Tutto ciò di cui hai bisogno, splendidamente combinato",
  "packets.list.text":
    "I nostri trattamenti più richiesti, sapientemente riuniti in percorsi completi - ognuno su misura per i tuoi obiettivi e supportato da un piano gratuito a distanza.",
  "packets.list.bundle": "trattamenti · un pacchetto",
  "packets.list.enquire": "Richiedi info su questo pacchetto",
  "packets.cta.heading": "Non sai quale pacchetto fa per te?",
  "packets.cta.text":
    "Invia una radiografia panoramica e delle foto per un piano scritto gratuito entro 24-48 ore.",

  "clinic.detail.cta.heading": "Scopri la differenza Dental Med Austria.",

  "proc.dental-implants.name": "Impianti Dentali",
  "proc.dental-implants.eyebrow": "Ripristina & Sostituisci",
  "proc.dental-implants.intro":
    "I nostri impianti dentali in titanio offrono risultati dall'aspetto naturale, pienamente funzionali e permanenti - lo standard di riferimento per sostituire i denti mancanti. Con oltre 42.000 impianti posizionati e un tasso di successo del 98%, sei in mani esperte.",
  "proc.dental-implants.body.0":
    "Ogni caso implantare inizia con una diagnostica digitale dettagliata, affinché il posizionamento sia preciso, prevedibile e il più confortevole possibile. Le nostre tecniche implantari indolori e la pianificazione accurata fanno sì che la maggior parte dei pazienti si sorprenda di quanto sia delicata l'esperienza.",
  "proc.dental-implants.body.1":
    "Per i pazienti a cui mancano diversi o tutti i denti, le nostre soluzioni full-arch All-on-4 e All-on-6 ripristinano un sorriso completo e fisso con appena quattro o sei impianti. Dove l'osso è andato perso nel tempo, le nostre procedure di rigenerazione ossea ricostruiscono una base solida così l'impianto può essere posizionato con sicurezza.",
  "proc.dental-implants.t0.title": "Impianti Singoli",
  "proc.dental-implants.t0.text": "Sostituzioni permanenti e dall'aspetto naturale per singoli denti mancanti.",
  "proc.dental-implants.t1.title": "All-on-4 / All-on-6",
  "proc.dental-implants.t1.text": "Un'arcata completa fissa sostenuta da soli quattro o sei impianti.",
  "proc.dental-implants.t2.title": "Impianti Indolori",
  "proc.dental-implants.t2.text": "Tecniche delicate e pianificazione accurata per una procedura confortevole.",
  "proc.dental-implants.t3.title": "Rigenerazione Ossea",
  "proc.dental-implants.t3.text": "Ricostruzione dell'osso perso per creare una base solida per gli impianti.",

  "proc.dental-crowns.name": "Corone Dentali",
  "proc.dental-crowns.eyebrow": "Forza & Estetica",
  "proc.dental-crowns.intro":
    "Le corone dentali ripristinano denti rotti, mancanti o danneggiati migliorando sia la funzione sia l'aspetto. Ogni corona è realizzata con materiali premium da partner fidati come Ivoclar.",
  "proc.dental-crowns.body.0":
    "Una corona ricostruisce un dente troppo danneggiato per una semplice otturazione, proteggendo ciò che resta e ripristinando forma, colore e occlusione naturali. Abbiniamo ogni restauro ai denti circostanti così il risultato si fonde perfettamente nel tuo sorriso.",
  "proc.dental-crowns.body.1":
    "Dalle singole corone in zirconia e ceramica ai ponti multi-dente e ai restauri su misura, il nostro lavoro di laboratorio è costruito per durare - realizzato secondo gli standard di qualità europei nel nostro flusso di lavoro certificato ISO 9001.",
  "proc.dental-crowns.t0.title": "Corone in Zirconia",
  "proc.dental-crowns.t0.text": "Corone eccezionalmente resistenti, senza metallo, con una finitura realistica.",
  "proc.dental-crowns.t1.title": "Corone in Ceramica",
  "proc.dental-crowns.t1.text": "Restauri splendidamente naturali realizzati in ceramica premium.",
  "proc.dental-crowns.t2.title": "Ponti",
  "proc.dental-crowns.t2.text": "Restauri fissi che sostituiscono uno o più denti mancanti.",
  "proc.dental-crowns.t3.title": "Restauri su Misura",
  "proc.dental-crowns.t3.text": "Soluzioni personalizzate progettate attorno alla tua occlusione e al tuo sorriso.",

  "proc.dental-veneers.name": "Faccette Dentali",
  "proc.dental-veneers.eyebrow": "Progetta il Tuo Sorriso",
  "proc.dental-veneers.intro":
    "Le faccette in ceramica e composito creano un sorriso impeccabile, naturale, da livello Hollywood. Sottili gusci su misura trasformano forma, colore e armonia dei tuoi denti con un intervento minimo.",
  "proc.dental-veneers.body.0":
    "Le faccette sono uno degli strumenti più potenti dell'odontoiatria estetica, correggendo discromie, scheggiature, spazi e forme irregolari in un'unica trasformazione. Le faccette in ceramica offrono la finitura più duratura e riflettente, mentre le faccette in composito offrono un'opzione nella stessa visita.",
  "proc.dental-veneers.body.1":
    "Ogni trasformazione del sorriso inizia con una consulenza dettagliata di smile design, così puoi vedere e modellare il risultato finale prima dell'inizio del trattamento. Combinato con uno sbiancamento professionale dei denti, il risultato è un sorriso dall'aspetto naturale e inconfondibilmente tuo.",
  "proc.dental-veneers.t0.title": "Faccette in Ceramica",
  "proc.dental-veneers.t0.text": "Gusci realizzati a mano per una finitura duratura e riflettente.",
  "proc.dental-veneers.t1.title": "Faccette in Composito",
  "proc.dental-veneers.t1.text": "Un'opzione elegante, nella stessa visita, per un sorriso rinnovato.",
  "proc.dental-veneers.t2.title": "Smile Design",
  "proc.dental-veneers.t2.text": "Un piano su misura che anticipa il tuo risultato prima del trattamento.",
  "proc.dental-veneers.t3.title": "Sbiancamento Dentale",
  "proc.dental-veneers.t3.text": "Sbiancamento sicuro e professionale per un sorriso più luminoso.",

  "proc.dental-prostheses.name": "Protesi Dentali",
  "proc.dental-prostheses.eyebrow": "Funzione & Comfort",
  "proc.dental-prostheses.intro":
    "Le protesi dentali su misura ripristinano i denti mancanti o danneggiati per funzione, comfort e un sorriso armonioso. Ogni protesi è progettata e adattata per sentirsi naturale e apparire bella.",
  "proc.dental-prostheses.body.0":
    "Che tu debba sostituire qualche dente o riabilitare un'intera bocca, le nostre protesi sono realizzate per ripristinare una masticazione sicura, un eloquio chiaro e un aspetto facciale equilibrato. Dedichiamo il tempo necessario a perfezionare la calzata così la tua protesi risulta sicura e confortevole ogni giorno.",
  "proc.dental-prostheses.body.1":
    "Le nostre soluzioni spaziano dalle protesi fisse e rimovibili alle dentiere su misura e alla riabilitazione dell'intera bocca, spesso combinate con impianti per maggiore stabilità. Ogni piano è personalizzato, prevedibile ed eseguito secondo gli standard ISO 9001 e di qualità europei.",
  "proc.dental-prostheses.t0.title": "Protesi Fisse",
  "proc.dental-prostheses.t0.text": "Restauri fissati in modo permanente per una sensazione stabile e naturale.",
  "proc.dental-prostheses.t1.title": "Protesi Rimovibili",
  "proc.dental-prostheses.t1.text": "Opzioni comode, su misura e facili da mantenere.",
  "proc.dental-prostheses.t2.title": "Dentiere su Misura",
  "proc.dental-prostheses.t2.text": "Dentiere moderne progettate per comfort e un aspetto naturale.",
  "proc.dental-prostheses.t3.title": "Riabilitazione dell'Intera Bocca",
  "proc.dental-prostheses.t3.text": "Ripristino completo di funzione ed estetica.",

  "proc.orthodontics.name": "Ortodonzia",
  "proc.orthodontics.eyebrow": "Allinea con Fiducia",
  "proc.orthodontics.intro":
    "Il nostro trattamento ortodontico specializzato corregge l'allineamento di denti e mascella con apparecchi tradizionali e allineatori trasparenti Invisalign. Seguito dal nostro team ortodontico specializzato, ogni piano è su misura per il tuo sorriso.",
  "proc.orthodontics.body.0":
    "I denti dritti non sono solo belli - sono più sani e più facili da mantenere puliti. Pianifichiamo con cura ogni caso per guidare denti e mascella verso un allineamento equilibrato e duraturo, con opzioni adatte a ogni età e stile di vita.",
  "proc.orthodontics.body.1":
    "Scegli gli allineatori trasparenti e rimovibili Invisalign per una fiducia quotidiana, o gli affidabili apparecchi tradizionali per movimenti più complessi. Con l'intervento precoce per i pazienti più giovani e i contenitori per proteggere il tuo risultato, il tuo nuovo allineamento è costruito per durare.",
  "proc.orthodontics.t0.title": "Apparecchi Tradizionali",
  "proc.orthodontics.t0.text": "Correzione affidabile e precisa per un'ampia gamma di casi.",
  "proc.orthodontics.t1.title": "Invisalign",
  "proc.orthodontics.t1.text": "Allineatori praticamente invisibili e rimovibili per una fiducia quotidiana.",
  "proc.orthodontics.t2.title": "Intervento Precoce",
  "proc.orthodontics.t2.text": "Guidare i giovani sorrisi per il miglior risultato a lungo termine.",
  "proc.orthodontics.t3.title": "Contenitori",
  "proc.orthodontics.t3.text": "Proteggere il tuo bel nuovo allineamento a lungo termine.",

  "clinic.our-story.title": "La Nostra Storia",
  "clinic.our-story.eyebrow": "Informazioni su Dental Med Austria",
  "clinic.our-story.intro":
    "Dal 2009, Dental Med Austria porta cure dentali di qualità premium a Tirana - una clinica dove rigorosi standard europei incontrano un'assistenza calorosa e incentrata sul paziente.",
  "clinic.our-story.s0.heading": "Fondata su Standard Premium",
  "clinic.our-story.s0.p0":
    "Dental Med Austria è stata fondata nel 2009 e, fin dal primo giorno, è stata costruita attorno a precisi standard di qualità premium, basati sull'evidenza.",
  "clinic.our-story.s0.p1":
    "Oltre un decennio dopo, la clinica è riconosciuta come una delle principali strutture dentali dell'Albania, scelta da oltre 24.000 pazienti soddisfatti dall'Albania e da tutto il mondo.",
  "clinic.our-story.s1.heading": "Una Qualità di cui Fidarsi",
  "clinic.our-story.s1.p0":
    "Il nostro lavoro è eseguito secondo gli standard ISO 9001 e i protocolli igienici europei, utilizzando tecnologia avanzata e materiali di alta qualità in ogni fase.",
  "clinic.our-story.s1.p1":
    "Sosteniamo i nostri risultati con un lavoro documentato e tracciabile e un supporto di follow-up dopo ogni trattamento, così puoi sceglierci in piena fiducia.",

  "clinic.our-clinic.title": "La Nostra Clinica",
  "clinic.our-clinic.eyebrow": "Una Struttura Moderna",
  "clinic.our-clinic.intro":
    "La nostra clinica moderna e incentrata sul paziente nel cuore di Tirana unisce tecnologia avanzata, materiali premium e un ambiente tranquillo e confortevole.",
  "clinic.our-clinic.s0.heading": "Tecnologia Avanzata, Materiali Premium",
  "clinic.our-clinic.s0.p0":
    "Ogni trattamento è eseguito utilizzando tecnologia dentale avanzata e materiali di alta qualità, garantendo risultati sicuri, prevedibili e duraturi.",
  "clinic.our-clinic.s0.p1":
    "Lavoriamo esclusivamente con partner premium affidabili in tutta Europa - Straumann, Ivoclar e Biodem - così i componenti e i restauri nella tua bocca sono i migliori disponibili.",
  "clinic.our-clinic.s1.heading": "Confortevole & Incentrata sul Paziente",
  "clinic.our-clinic.s1.p0":
    "Dalla tua prima consulenza al tuo risultato finale, ogni dettaglio della nostra clinica è progettato attorno al tuo comfort. I nostri esperti professionisti seguono una formazione continua per restare all'avanguardia dell'odontoiatria moderna.",
  "clinic.our-clinic.s1.p1":
    "Ogni paziente riceve un piano di trattamento personalizzato costruito attorno ai suoi obiettivi, erogato in un ambiente tranquillo e accogliente che rispetta gli standard ISO 9001 e igienici europei.",

  "clinic.dental-tourism.title": "Turismo Dentale",
  "clinic.dental-tourism.eyebrow": "Cura e Viaggio Insieme",
  "clinic.dental-tourism.intro":
    "L'Albania è una destinazione di primo piano per il turismo dentale, combinando panorami mozzafiato con cure dentali di livello mondiale. Rendiamo l'intero viaggio senza sforzo.",
  "clinic.dental-tourism.s0.heading": "Tutto Organizzato per Te",
  "clinic.dental-tourism.s0.p0":
    "Aiutiamo a organizzare i voli per Tirana, e il nostro team ti accoglierà all'Aeroporto di Tirana con un caloroso benvenuto e il transfer dall'aeroporto.",
  "clinic.dental-tourism.s0.p1":
    "Soggiornerai in hotel partner che offrono comfort moderni e WiFi gratuito, e il nostro team fornisce traduzione in inglese, italiano, tedesco e francese per tutta la tua permanenza.",
  "clinic.dental-tourism.s1.heading": "Il Tuo Percorso di Trattamento",
  "clinic.dental-tourism.s1.p0":
    "1. Consulenza Iniziale - discutiamo le tue preoccupazioni e i tuoi obiettivi e costruiamo un piano personalizzato.",
  "clinic.dental-tourism.s1.p1":
    "2. Trattamento da parte di Esperti - le tue cure sono eseguite dal nostro esperto team clinico con materiali premium.",
  "clinic.dental-tourism.s1.p2":
    "3. Cure di Follow-Up - restiamo in contatto dopo il tuo rientro a casa per assicurarci che i tuoi risultati durino.",

  "clinic.medical-insurance.title": "Assicurazione Medica",
  "clinic.medical-insurance.eyebrow": "Flessibile & Supportata",
  "clinic.medical-insurance.intro":
    "Lavoriamo per rendere le cure dentali di alta qualità il più accessibili possibile, con opzioni di pagamento flessibili e assistenza con le richieste assicurative.",
  "clinic.medical-insurance.s0.heading": "Lavorare con la Tua Assicurazione",
  "clinic.medical-insurance.s0.p0":
    "Il nostro team è lieto di assistere con le richieste di assicurazione medica e di fornire la documentazione necessaria per richiedere il rimborso al tuo fornitore.",
  "clinic.medical-insurance.s0.p1":
    "Se non sei sicuro che il tuo piano copra il trattamento all'estero, contattaci e ti aiuteremo a capire le tue opzioni prima di partire.",
  "clinic.medical-insurance.s1.heading": "Opzioni di Pagamento Flessibili",
  "clinic.medical-insurance.s1.p0":
    "Offriamo opzioni di pagamento flessibili pensate per rendere gestibile il tuo piano di trattamento, senza compromessi su qualità o materiali.",
  "clinic.medical-insurance.s1.p1":
    "Per un piano su misura e indicazioni sul pagamento, scrivici semplicemente a info@dentalmedaustria.com.",

  "clinic.faqs.title": "Domande Frequenti",
  "clinic.faqs.eyebrow": "Risposte Utili",
  "clinic.faqs.intro":
    "Risposte alle domande che ci vengono poste più spesso dai pazienti locali e internazionali.",
  "clinic.faqs.s0.heading": "Dove vi trovate?",
  "clinic.faqs.s0.p0":
    "La nostra clinica si trova in Rruga Kristo Luarasi a Tirana, Albania, aperta dal lunedì al sabato dalle 9:00 alle 22:00.",
  "clinic.faqs.s1.heading": "Trattate pazienti internazionali?",
  "clinic.faqs.s1.p0":
    "Sì. Accogliamo pazienti da tutto il mondo e forniamo un supporto completo per il turismo dentale, inclusi aiuto con i voli, transfer dall'aeroporto, hotel partner e traduzione in inglese, italiano, tedesco e francese.",
  "clinic.faqs.s2.heading": "Quale assistenza offrite dopo il trattamento?",
  "clinic.faqs.s2.p0": "Ogni paziente implantare riceve un passaporto implantare con la marca dell'impianto e numeri di serie verificabili, e il nostro team resta a disposizione per il follow-up dopo il trattamento.",
  "clinic.faqs.s3.heading": "Quali standard seguite?",
  "clinic.faqs.s3.p0":
    "La nostra clinica opera secondo gli standard ISO 9001 e i protocolli igienici europei, utilizzando tecnologia avanzata e materiali premium di partner come Straumann, Ivoclar e Biodem.",
  "clinic.faqs.s4.heading": "Come prenoto un appuntamento?",
  "clinic.faqs.s4.p0":
    "Prenotare è semplice - scrivici a info@dentalmedaustria.com e il nostro team organizzerà la tua consulenza e risponderà a ogni domanda.",

  "equipcat.imaging.label": "Imaging & Diagnostica 3D",
  "equipcat.imaging.blurb":
    "Imaging 3D e panoramico a basso dosaggio - la spina dorsale diagnostica di una precisa pianificazione implantare e chirurgica.",
  "equipcat.cadcam.label": "Fresatura CAD/CAM",
  "equipcat.cadcam.blurb":
    "Fresatura interna a 5 assi che realizza corone, ponti e strutture full-arch con precisione industriale.",
  "equipcat.furnaces.label": "Forni Ceramici & di Sinterizzazione",
  "equipcat.furnaces.blurb":
    "Forni di precisione che cuociono, pressano e sinterizzano ogni restauro fino alla sua forza e bellezza finale.",
  "equipcat.guided-surgery.label": "Chirurgia Implantare Guidata",
  "equipcat.guided-surgery.blurb":
    "Navigazione in tempo reale e motori chirurgici controllati per un posizionamento implantare più sicuro e accurato.",
  "equipcat.lab.label": "Micromotori da Laboratorio",
  "equipcat.lab.blurb":
    "Micromotori brushless professionali che modellano e rifiniscono i restauri a mano nel nostro laboratorio interno.",
  "equipcat.air-suction.label": "Compressori & Aspirazione",
  "equipcat.air-suction.blurb":
    "Aria compressa senza olio e aspirazione centralizzata - l'infrastruttura pulita e affidabile dietro ogni poltrona.",
  "equipcat.sterilization.label": "Sterilizzazione",
  "equipcat.sterilization.blurb":
    "Protocolli di sterilizzazione rigorosi secondo gli standard ISO 9001 e igienici europei, per la tua completa sicurezza.",
  "equipcat.surgical-optics.label": "Laser Chirurgici & Ottica",
  "equipcat.surgical-optics.blurb":
    "Laser per tessuti molli e microscopi operatori per una precisione minimamente invasiva e altamente ingrandita.",
  "equipcat.operatory.label": "Sale di Trattamento",
  "equipcat.operatory.blurb":
    "Unità operative moderne e illuminazione progettate attorno al tuo comfort e alla precisione del clinico.",
  "equipcat.materials.label": "Materiali Premium & Marchi di Impianti",
  "equipcat.materials.blurb":
    "I marchi europei affidabili dietro i tuoi impianti, corone e innesti - una qualità su cui puoi contare.",
};

const DE: Dict = {
  "nav.home": "Start",
  "nav.packets": "Behandlungspläne",
  "nav.clinic": "Klinik",
  "nav.care": "Behandlungspläne",
  "nav.smiles": "Lächeln",
  "nav.contact": "Kontakt",

  "subnav.catalogue": "Vollständiger Behandlungskatalog",
  "subnav.ourStory": "Unsere Geschichte",
  "subnav.ourClinic": "Unsere Klinik",
  "subnav.technology": "Technologie & Ausstattung",
  "subnav.insurance": "Krankenversicherung",
  "subnav.faqs": "Häufige Fragen",
  "subnav.safety": "Sicherheit & Hygiene",

  "treat.implants": "Zahnimplantate",
  "treat.crowns": "Zahnkronen",
  "treat.veneers": "Veneers",
  "treat.prostheses": "Zahnprothesen",
  "treat.orthodontics": "Kieferorthopädie",

  "hero.eyebrow": "Implantate  |  Ästhetik  |  Kieferorthopädie",
  "hero.title": "Moderne Zahnmedizin in Albanien",

  "intro.h2": "Weltklasse-Zahnmedizin im Herzen von Tirana",
  "intro.p1":
    "2009 gegründet, bringt Dental Med Austria Premium-Qualitätsstandards in die Zahnmedizin in Albanien, für einheimische und internationale Patienten.",
  "intro.p2":
    "Unser erfahrenes Team hat über 24.000 zufriedene Patienten begrüßt und mehr als 42.000 Implantate mit einer Erfolgsquote von 98% gesetzt, mit modernster Technologie, hochwertigen Materialien und individuellen Behandlungsplänen in einer ruhigen, patientenorientierten Umgebung.",
  "intro.p3":
    "Jede Behandlung erfolgt nach ISO 9001 und europäischen Hygienestandards, mit strengen Sterilisationsprotokollen und vollständig dokumentierten, nachverfolgbaren Materialien, damit Sie uns mit vollem Vertrauen wählen können.",
  "intro.quote":
    "“Andere Zahnärzte gaben mir ‘gute’ Ergebnisse, aber hier? GROSSARTIGE Zähne, auf Hollywood-Niveau! Die Präzision, die Ästhetik, das Gefühl… als wäre ich zu einer Luxusversion meiner selbst aufgewertet worden.”",
  "intro.quoteCite": "- Meriton Mjekiqi",
  "intro.stat.patients": "Zufriedene Patienten",
  "intro.stat.implants": "Gesetzte Implantate",
  "intro.stat.success": "Implantat-Erfolg",
  "intro.stat.trusted": "Vertrauensvolle Pflege",
  "btn.services": "Unsere Leistungen",

  "explore.title": "Zahnbehandlungen Entdecken",
  "card.discover": "Behandlung entdecken",
  "card.viewDetails": "Details ansehen",

  "tour.title": "Unsere Klinik Entdecken",
  "tour360.eyebrow": "Treten Sie Ein",
  "tour360.title": "Erkunden Sie die Klinik in 360°",
  "tour360.hint": "Ziehen Sie, um sich umzusehen, und tippen Sie auf die Pfeile, um durch jeden Raum von Dental Med Austria zu gehen.",
  "tour360.cta": "360°-Rundgang starten",
  "tour.tech.eyebrow": "Modernste Ausstattung",
  "tour.tech.title": "Fortschrittliche Technologie",
  "tour.tourism.title": "Zahntourismus",

  "smiles.eyebrow": "Lebensverändernde Dentale Verwandlungen",
  "smiles.title": "Wir Enthüllen Schöne Lächeln",
  "smiles.cta": "Lächeln-Galerie Ansehen",

  // ── Testimonials (Instagram patient reels) ──
  "testi.eyebrow": "Echte Patienten, echte Worte",
  "testi.title": "Patientengeschichten",
  "testi.subtitle":
    "Sehen Sie echte Patienten von Dental Med Austria über ihre Erfahrung sprechen, aufgenommen in unserer Klinik in Tirana und auf Instagram veröffentlicht.",
  "testi.badge": "Patientengeschichte",
  "testi.watch": "Reel ansehen",
  "testi.follow": "Mehr auf Instagram ansehen",
  "testi.close": "Schließen",
  "testi.prev": "Vorherige Geschichte",
  "testi.next": "Nächste Geschichte",
  "testi.loading": "Wird geladen…",

  "blogstrip.eyebrow": "Aus der Klinik",
  "blogstrip.heading": "News, Tipps & Zahntourismus",
  "blogstrip.viewAll": "Alle Beiträge Ansehen",

  // ── Reviews (Google patient reviews) ──
  "reviews.eyebrow": "Verifizierte Google-Bewertungen",
  "reviews.heading": "Was Unsere Patienten Sagen",
  "reviews.ratingLabel": "Google-Bewertungen",

  "brand.eyebrow": "Unsere vertrauenswürdigen Partner",
  "brand.heading": "Unsere vertrauenswürdigen Partner und Marken, mit denen wir arbeiten",

  "common.prev": "Zurück",
  "common.next": "Weiter",

  "footer.getDirections": "Route planen",
  "footer.form.first": "Vorname*",
  "footer.form.last": "Nachname*",
  "footer.form.email": "E-Mail*",
  "footer.form.phone": "Telefon*",
  "footer.form.patient": "Neuer oder bestehender Patient*",
  "footer.form.comments": "Anmerkungen",
  "footer.form.message": "Wie können wir helfen?",
  "footer.form.submit": "Senden",
  "footer.rights": "Alle Rechte vorbehalten",
  "footer.privacy": "Datenschutz",
  "footer.risks": "Behandlungsrisiken",
  "footer.tagline":
    "Dental Med Austria ist eine nach ISO 9001 zertifizierte Zahnklinik in Tirana, Albanien, spezialisiert auf Implantologie, ästhetische Zahnmedizin und vollständige Zahnsanierungen. Seit 2009 haben uns über 24.000 Patientinnen und Patienten aus ganz Europa und darüber hinaus ihr Vertrauen geschenkt. Modernste Technologie, höchste Qualitätsstandards und ein Implantatpass mit vollständiger Rückverfolgbarkeit sorgen für langfristige Sicherheit und hervorragende Ergebnisse.",
  "footer.col.treatments": "Behandlungen",
  "footer.col.clinic": "Die Klinik",
  "footer.col.patients": "Für Patienten",
  "footer.blog": "Blog",
  "footer.smiles": "Lächeln-Galerie",
  "footer.team": "Unser Team",
  "footer.langs": "Diese Website in anderen Sprachen",
  "footer.sitemap": "Sitemap",
  "footer.accredited": "Zertifiziert & Mitglied von",

  "sticky.appointment": "Termin anfragen",
  "sticky.call": "Rufen Sie uns an",
  "sticky.email": "Schreiben Sie uns",

  "lead.rail.tab": "Kostenloser Heilplan",
  "lead.rail.title": "Ihr kostenloser Heilplan",
  "lead.rail.subtitle": "Sagen Sie uns, wie wir Sie erreichen, persönlicher schriftlicher Plan in 24–48 Std.",
  "lead.rail.send": "Anfrage senden",
  "lead.rail.sending": "Wird gesendet…",
  "lead.rail.success": "Danke, Anfrage erhalten!",
  "lead.rail.successNote": "Unser Koordinator antwortet innerhalb von 24–48 Stunden. Ihre Referenz:",
  "lead.rail.error": "Bitte geben Sie mindestens Name und Telefonnummer an und versuchen Sie es erneut.",
  "lead.rail.whatsapp": "Weiter auf WhatsApp",
  "lead.rail.privacy": "Mit dem Senden stimmen Sie der Kontaktaufnahme zu Ihrer Anfrage zu. Kein Spam.",

  "cta.requestAppointment": "Termin anfragen",
  "nav.team": "Team",
  "nav.catalogue": "Katalog",
  "nav.technology": "Technologie",

  "care.hero.eyebrow": "Umfassende Zahnlösungen",
  "care.hero.title": "Unsere Behandlungen",
  "care.intro.eyebrow": "Implantate, Kronen, Veneers & Mehr",
  "care.intro.text":
    "Von Zahnimplantaten und Kronen über Veneers bis hin zu Prothesen und Kieferorthopädie bieten wir umfassende Zahnlösungen nach Premium-Qualitätsstandards - alles unter einem Dach.",
  "care.cta.heading": "Sie wissen nicht, wo Sie anfangen sollen? Wir begleiten Sie.",
  "care.cta.text": "Buchen Sie eine Beratung und wir gestalten den passenden Plan für Ihr Lächeln.",

  "care.detail.aboutPrefix": "Über",
  "care.detail.ctaPrefix": "Bereit für",
  "care.detail.ctaSuffix": "?",
  "care.detail.ctaText": "Buchen Sie noch heute eine Beratung mit unserem Team.",

  "smilespage.hero.eyebrow": "Lebensverändernde Dentale Verwandlungen",
  "smilespage.hero.title": "Die Lächeln-Galerie",
  "smilespage.intro.eyebrow": "Echte Patienten · Echte Ergebnisse",
  "smilespage.intro.text":
    "Ich Lächle mit DENTAL MED AUSTRIA",
  "smilespage.cta.heading": "Stellen Sie sich Ihr neues Lächeln vor.",
  "smilespage.cta.text":
    "Senden Sie ein Panorama-Röntgenbild und ein paar Fotos für einen kostenlosen Smile-Design-Plan innerhalb von 24-48 Stunden.",

  "cat.hero.eyebrow": "Premium-Qualität · Tirana, Albanien",
  "cat.hero.title": "Behandlungskatalog",
  "cat.stats.treatments": "Behandlungen",
  "cat.stats.specialties": "Fachbereiche",
  "cat.stats.requested": "Am häufigsten gewünscht",
  "cat.intro.heading": "Jede Behandlung, die wir anbieten, unter einem Dach",
  "cat.intro.text":
    "Von Einzelimplantaten bis zu kompletten Lächeln-Verwandlungen wird jeder Eingriff mit hochwertigen Materialien und Premium-Qualitätsstandards durchgeführt. Jeder Plan richtet sich nach Ihrem Fall - senden Sie uns Ihr Röntgenbild für einen kostenlosen schriftlichen Plan in 24-48 Stunden.",
  "cat.cta.eyebrow": "Kostenlos · Unverbindlich",
  "cat.cta.heading": "Erhalten Sie Ihren individuellen Behandlungsplan",
  "cat.cta.text":
    "Senden Sie uns ein Panorama-Röntgenbild und ein paar Fotos. Unser klinisches Team erstellt Ihnen innerhalb von 24-48 Stunden einen schriftlichen Behandlungsplan, in Ihrer Sprache.",
  "cat.cta.requestPlan": "Plan anfragen",
  "cat.cta.featured": "Ausgewählte Leistungen",
  "cat.section.treatments": "Behandlungen",

  "cat.detail.idealFor": "Ideal für:",
  "cat.detail.materials": "Materialien & Marken",
  "cat.detail.whyChoose": "Warum Patienten sich dafür entscheiden",
  "cat.detail.typicalSession": "Typische Sitzung",
  "cat.detail.journey": "Ihr Weg",
  "cat.detail.whatToExpect": "Was Sie erwartet",
  "cat.detail.frequentlyAsked": "Häufig gestellt",
  "cat.detail.questionsPrefix": "Fragen zu",
  "cat.detail.relatedTreatments": "Verwandte Behandlungen",
  "cat.detail.learnMore": "Mehr erfahren",
  "cat.detail.consideringPrefix": "Erwägen Sie",
  "cat.detail.consideringSuffix": "?",
  "cat.detail.ctaText":
    "Senden Sie ein Panorama-Röntgenbild und ein paar Fotos für einen kostenlosen schriftlichen Behandlungsplan innerhalb von 24-48 Stunden.",
  "cat.detail.allTreatments": "Alle Behandlungen",
  "cat.detail.ataGlance": "Auf einen Blick",
  "cat.detail.procedureEyebrow": "Der Ablauf",
  "cat.detail.procedureHeading": "Schritt für Schritt",
  "cat.detail.whoEyebrow": "Eignung",
  "cat.detail.whoHeading": "Für wen ist diese Behandlung?",
  "cat.detail.recoveryEyebrow": "Heilung",
  "cat.detail.recoveryHeading": "Heilung & Erholung",
  "cat.detail.evidenceEyebrow": "Die Fakten",
  "cat.detail.evidenceHeading": "Erfolg & Langlebigkeit",
  "cat.detail.goodToKnowEyebrow": "Gut zu wissen",
  "cat.detail.goodToKnowHeading": "Vergleiche & Hinweise",
  "cat.detail.careEyebrow": "Nachsorge",
  "cat.detail.careHeading": "Pflege Ihres Ergebnisses",
  "cat.detail.costEyebrow": "Planung",
  "cat.detail.costHeading": "Ihr Plan & Transparenz",
  "cat.detail.whyEyebrow": "Warum wir",
  "cat.detail.whyHeading": "Warum Patienten Dental Med Austria wählen",

  "contactpage.hero.eyebrow": "Wir freuen uns auf Ihre Nachricht",
  "contactpage.hero.title": "Kontaktieren Sie uns",
  "contactpage.getDirections": "Route planen →",
  "contactpage.instagram": "Instagram",
  "contactpage.facebook": "Facebook",
  "contactpage.openingHours": "Öffnungszeiten",
  "contactpage.hours.weekdays": "Montag - Freitag",
  "contactpage.hours.weekdaysTime": "9:00 - 19:00",
  "contactpage.hours.saturday": "Samstag",
  "contactpage.hours.saturdayTime": "9:00 - 15:00",
  "contactpage.hours.sunday": "Sonntag",
  "contactpage.hours.sundayTime": "Geschlossen",

  "team.hero.eyebrow": "Dental Med Austria",
  "team.hero.title": "Lernen Sie unser Team kennen",
  "team.intro.eyebrow": "Erfahren & Einfühlsam",
  "team.intro.text":
    "Unsere Behandlung wird von einem erfahrenen klinischen Team geleitet, das jahrzehntelange Erfahrung und Premium-Qualitätsstandards mit echter, patientenorientierter Betreuung verbindet.",
  "team.specialist": "Unser Spezialist",
  "team.cta.heading": "Bereit, unser Team kennenzulernen?",
  "team.cta.text":
    "Wir würden Sie gerne in unserer Klinik begrüßen. Schreiben Sie uns, um Ihre erste Beratung zu buchen.",

  "team.dentists.hero.title": "Unser Spezialist",
  "team.dentists.intro.text":
    "Unser erfahrenes klinisches Team bringt jahrzehntelange Erfahrung und Premium-Qualitätsstandards in die sanfte, sorgfältige und patientenorientierte Betreuung der Klinik ein.",
  "team.dentists.cta.heading": "Buchen Sie noch heute Ihre Beratung.",

  "team.hygienists.hero.title": "Prophylaxe",
  "team.hygienists.intro.eyebrow": "Gesundes Lächeln, ein Leben lang",
  "team.hygienists.intro.text":
    "Bei Dental Med Austria wird Prophylaxe und Mundhygiene von unserem erfahrenen klinischen Team nach europäischen Hygienestandards durchgeführt - damit Ihr Lächeln zwischen den Behandlungen gesund bleibt.",
  "team.hygienists.cta.heading": "Buchen Sie Ihren nächsten Termin.",

  "team.meet.hero.eyebrow": "Der Spezialist hinter Ihrer Behandlung",
  "team.meet.hero.title": "Lernen Sie unser Team kennen",
  "team.meet.intro.text":
    "Bei Dental Med Austria wird Ihre Behandlung von einem erfahrenen klinischen Team geleitet, das sich dafür einsetzt, Ihre Erfahrung außergewöhnlich zu gestalten - von der herzlichen Begrüßung bis zu Ihrem Endergebnis auf dem Behandlungsstuhl.",
  "team.meet.cta.heading": "Wir freuen uns darauf, Sie willkommen zu heißen.",

  "team.bio.ctaPrefix": "Buchen Sie einen Termin mit",

  "role.founder-managing-director": "Gründer & Geschäftsführer",

  "tech.hero.eyebrow": "Klinikniveau · Eigenes Labor",
  "tech.hero.title": "Technologie & Ausstattung",
  "tech.stats.devices": "Geräte",
  "tech.stats.categories": "Kategorien",
  "tech.stats.oneRoof": "Ein Dach",
  "tech.intro.heading": "Die Technologie hinter Ergebnissen in Premium-Qualität",
  "tech.intro.text":
    "Von der 3D-DVT-Bildgebung und computergestützter Chirurgie bis zu unserer eigenen CAD/CAM-Fräsung und unserem Keramiklabor wird jedes Gerät für Präzision, Sicherheit und schöne, dauerhafte Ergebnisse ausgewählt.",
  "tech.system": "System",
  "tech.systems": "Systeme",
  "tech.flagship": "Flaggschiff",
  "tech.cta.eyebrow": "Premium-Standards · Tirana",
  "tech.cta.heading": "Erleben Sie den Unterschied, den Präzision macht",
  "tech.cta.text":
    "Sehen Sie unsere Technologie persönlich, oder senden Sie ein Röntgenbild für einen kostenlosen Behandlungsplan aus der Ferne innerhalb von 24-48 Stunden.",
  "tech.cta.bookVisit": "Besuch buchen",
  "tech.cta.catalogue": "Behandlungskatalog",

  "packets.hero.eyebrow": "Kuratiert · Kombiniert · Komplett",
  "packets.hero.title": "Behandlungspakete",
  "packets.list.eyebrow": "Kuratierte Behandlungspakete",
  "packets.list.heading": "Alles, was Sie brauchen, wunderschön kombiniert",
  "packets.list.text":
    "Unsere gefragtesten Behandlungen, durchdacht zu kompletten Behandlungswegen gebündelt - jeder auf Ihre Ziele zugeschnitten und durch einen kostenlosen Fernplan abgesichert.",
  "packets.list.bundle": "Behandlungen · ein Paket",
  "packets.list.enquire": "Zu diesem Paket anfragen",
  "packets.cta.heading": "Nicht sicher, welches Paket passt?",
  "packets.cta.text":
    "Senden Sie ein Panorama-Röntgenbild und Fotos für einen kostenlosen schriftlichen Plan innerhalb von 24-48 Stunden.",

  "clinic.detail.cta.heading": "Erleben Sie den Dental Med Austria Unterschied.",

  "proc.dental-implants.name": "Zahnimplantate",
  "proc.dental-implants.eyebrow": "Wiederherstellen & Ersetzen",
  "proc.dental-implants.intro":
    "Unsere Titan-Zahnimplantate liefern natürlich aussehende, voll funktionsfähige und dauerhafte Ergebnisse - der Goldstandard für den Ersatz fehlender Zähne. Mit über 42.000 gesetzten Implantaten und einer Erfolgsquote von 98% sind Sie in erfahrenen Händen.",
  "proc.dental-implants.body.0":
    "Jeder Implantatfall beginnt mit einer detaillierten digitalen Diagnostik, damit die Platzierung präzise, vorhersehbar und so angenehm wie möglich ist. Unsere schmerzfreien Implantattechniken und die sorgfältige Planung sorgen dafür, dass die meisten Patienten überrascht sind, wie sanft die Erfahrung ist.",
  "proc.dental-implants.body.1":
    "Für Patienten, denen mehrere oder alle Zähne fehlen, stellen unsere All-on-4- und All-on-6-Lösungen für den ganzen Kiefer ein komplettes, festsitzendes Lächeln auf nur vier oder sechs Implantaten wieder her. Wo mit der Zeit Knochen verloren ging, bauen unsere Verfahren zur Knochenregeneration ein solides Fundament auf, damit ein Implantat sicher gesetzt werden kann.",
  "proc.dental-implants.t0.title": "Einzelimplantate",
  "proc.dental-implants.t0.text": "Dauerhafter, natürlich aussehender Ersatz für einzelne fehlende Zähne.",
  "proc.dental-implants.t1.title": "All-on-4 / All-on-6",
  "proc.dental-implants.t1.text": "Ein kompletter festsitzender Kiefer, getragen von nur vier oder sechs Implantaten.",
  "proc.dental-implants.t2.title": "Schmerzfreie Implantate",
  "proc.dental-implants.t2.text": "Sanfte Techniken und sorgfältige Planung für einen angenehmen Eingriff.",
  "proc.dental-implants.t3.title": "Knochenregeneration",
  "proc.dental-implants.t3.text": "Wiederaufbau verlorenen Knochens für ein solides Fundament für Implantate.",

  "proc.dental-crowns.name": "Zahnkronen",
  "proc.dental-crowns.eyebrow": "Stärke & Ästhetik",
  "proc.dental-crowns.intro":
    "Zahnkronen stellen abgebrochene, fehlende oder beschädigte Zähne wieder her und verbessern sowohl Funktion als auch Aussehen. Jede Krone wird aus hochwertigen Materialien von vertrauenswürdigen Partnern wie Ivoclar gefertigt.",
  "proc.dental-crowns.body.0":
    "Eine Krone baut einen Zahn wieder auf, der für eine einfache Füllung zu stark beschädigt ist, schützt das Verbliebene und stellt eine natürliche Form, Farbe und Bisslage wieder her. Wir passen jede Restauration an Ihre umliegenden Zähne an, sodass sich das Ergebnis nahtlos in Ihr Lächeln einfügt.",
  "proc.dental-crowns.body.1":
    "Von einzelnen Zirkon- und Keramikkronen bis zu mehrgliedrigen Brücken und individuellen Restaurationen ist unsere Laborarbeit auf Langlebigkeit ausgelegt - gefertigt nach europäischen Qualitätsstandards in unserem ISO-9001-zertifizierten Arbeitsablauf.",
  "proc.dental-crowns.t0.title": "Zirkonkronen",
  "proc.dental-crowns.t0.text": "Außergewöhnlich starke, metallfreie Kronen mit naturgetreuer Oberfläche.",
  "proc.dental-crowns.t1.title": "Keramikkronen",
  "proc.dental-crowns.t1.text": "Wunderbar natürliche Restaurationen aus hochwertiger Keramik.",
  "proc.dental-crowns.t2.title": "Brücken",
  "proc.dental-crowns.t2.text": "Festsitzende Restaurationen, die einen oder mehrere fehlende Zähne ersetzen.",
  "proc.dental-crowns.t3.title": "Individuelle Restaurationen",
  "proc.dental-crowns.t3.text": "Maßgeschneiderte Lösungen, gestaltet rund um Ihren Biss und Ihr Lächeln.",

  "proc.dental-veneers.name": "Veneers",
  "proc.dental-veneers.eyebrow": "Gestalten Sie Ihr Lächeln",
  "proc.dental-veneers.intro":
    "Keramik- und Composite-Veneers schaffen ein makelloses, natürliches Lächeln auf Hollywood-Niveau. Dünne, individuelle Schalen verwandeln Form, Farbe und Harmonie Ihrer Zähne mit minimalem Eingriff.",
  "proc.dental-veneers.body.0":
    "Veneers gehören zu den wirkungsvollsten Mitteln der ästhetischen Zahnmedizin und korrigieren Verfärbungen, Absplitterungen, Lücken und ungleichmäßige Formen in einer einzigen Verwandlung. Keramik-Veneers bieten die langlebigste, lichtreflektierende Oberfläche, während Composite-Veneers eine Option im selben Termin sind.",
  "proc.dental-veneers.body.1":
    "Jede Lächeln-Verwandlung beginnt mit einer detaillierten Smile-Design-Beratung, sodass Sie Ihr Endergebnis vor Behandlungsbeginn sehen und mitgestalten können. In Kombination mit professionellem Bleaching ist das Ergebnis ein Lächeln, das natürlich und unverkennbar Ihres aussieht.",
  "proc.dental-veneers.t0.title": "Keramik-Veneers",
  "proc.dental-veneers.t0.text": "Handgefertigte Schalen für eine langlebige, lichtreflektierende Oberfläche.",
  "proc.dental-veneers.t1.title": "Composite-Veneers",
  "proc.dental-veneers.t1.text": "Eine elegante Option im selben Termin für ein aufgefrischtes Lächeln.",
  "proc.dental-veneers.t2.title": "Smile Design",
  "proc.dental-veneers.t2.text": "Ein maßgeschneiderter Plan, der Ihr Ergebnis vor der Behandlung zeigt.",
  "proc.dental-veneers.t3.title": "Zahnaufhellung",
  "proc.dental-veneers.t3.text": "Sicheres, professionelles Bleaching für ein strahlenderes Lächeln.",

  "proc.dental-prostheses.name": "Zahnprothesen",
  "proc.dental-prostheses.eyebrow": "Funktion & Komfort",
  "proc.dental-prostheses.intro":
    "Individuelle Zahnprothesen stellen fehlende oder beschädigte Zähne für Funktion, Komfort und ein harmonisches Lächeln wieder her. Jede Prothese wird so gestaltet und angepasst, dass sie sich natürlich anfühlt und schön aussieht.",
  "proc.dental-prostheses.body.0":
    "Ob Sie einige Zähne ersetzen oder einen ganzen Kiefer rehabilitieren müssen - unsere Prothesen sind so gefertigt, dass sie sicheres Kauen, klares Sprechen und ein ausgewogenes Gesichtsbild wiederherstellen. Wir nehmen uns die Zeit, die Passform zu perfektionieren, damit sich Ihre Prothese jeden Tag sicher und angenehm anfühlt.",
  "proc.dental-prostheses.body.1":
    "Unsere Lösungen reichen von festsitzenden und herausnehmbaren Prothesen bis zu individuellen Zahnersatz und der Rehabilitation des gesamten Kiefers, oft kombiniert mit Implantaten für zusätzliche Stabilität. Jeder Plan ist individuell, vorhersehbar und wird nach ISO 9001 und europäischen Qualitätsstandards umgesetzt.",
  "proc.dental-prostheses.t0.title": "Festsitzende Prothesen",
  "proc.dental-prostheses.t0.text": "Dauerhaft befestigte Restaurationen für ein stabiles, natürliches Gefühl.",
  "proc.dental-prostheses.t1.title": "Herausnehmbare Prothesen",
  "proc.dental-prostheses.t1.text": "Bequeme, individuell angepasste Optionen, die leicht zu pflegen sind.",
  "proc.dental-prostheses.t2.title": "Individueller Zahnersatz",
  "proc.dental-prostheses.t2.text": "Moderner Zahnersatz, gestaltet für Komfort und ein natürliches Aussehen.",
  "proc.dental-prostheses.t3.title": "Rehabilitation des gesamten Kiefers",
  "proc.dental-prostheses.t3.text": "Umfassende Wiederherstellung von Funktion und Ästhetik.",

  "proc.orthodontics.name": "Kieferorthopädie",
  "proc.orthodontics.eyebrow": "Selbstbewusst Begradigen",
  "proc.orthodontics.intro":
    "Unsere spezialisierte kieferorthopädische Behandlung korrigiert die Ausrichtung von Zähnen und Kiefer mit traditionellen Zahnspangen und transparenten Invisalign-Alignern. Betreut von unserem spezialisierten kieferorthopädischen Team, wird jeder Plan auf Ihr Lächeln zugeschnitten.",
  "proc.orthodontics.body.0":
    "Gerade Zähne sind nicht nur schön - sie sind gesünder und leichter sauber zu halten. Wir planen jeden Fall sorgfältig, um Ihre Zähne und Ihren Kiefer in eine ausgewogene, dauerhafte Ausrichtung zu führen, mit Optionen für jedes Alter und jeden Lebensstil.",
  "proc.orthodontics.body.1":
    "Wählen Sie diskrete, herausnehmbare transparente Invisalign-Aligner für tägliches Selbstvertrauen oder zuverlässige traditionelle Zahnspangen für komplexere Bewegungen. Mit frühzeitiger Intervention bei jüngeren Patienten und Retainern zum Schutz Ihres Ergebnisses ist Ihre neue Ausrichtung auf Dauer angelegt.",
  "proc.orthodontics.t0.title": "Traditionelle Zahnspangen",
  "proc.orthodontics.t0.text": "Zuverlässige, präzise Korrektur für eine Vielzahl von Fällen.",
  "proc.orthodontics.t1.title": "Invisalign",
  "proc.orthodontics.t1.text": "Nahezu unsichtbare, herausnehmbare Aligner für tägliches Selbstvertrauen.",
  "proc.orthodontics.t2.title": "Frühzeitige Intervention",
  "proc.orthodontics.t2.text": "Junge Lächeln für das beste langfristige Ergebnis führen.",
  "proc.orthodontics.t3.title": "Retainer",
  "proc.orthodontics.t3.text": "Schützen Sie Ihre schöne neue Ausrichtung langfristig.",

  "clinic.our-story.title": "Unsere Geschichte",
  "clinic.our-story.eyebrow": "Über Dental Med Austria",
  "clinic.our-story.intro":
    "Seit 2009 bringt Dental Med Austria zahnmedizinische Versorgung in Premium-Qualität nach Tirana - eine Klinik, in der strenge europäische Standards auf herzliche, patientenorientierte Betreuung treffen.",
  "clinic.our-story.s0.heading": "Auf Premium-Standards gegründet",
  "clinic.our-story.s0.p0":
    "Dental Med Austria wurde 2009 gegründet und vom ersten Tag an um präzise, evidenzbasierte Premium-Qualitätsstandards aufgebaut.",
  "clinic.our-story.s0.p1":
    "Mehr als ein Jahrzehnt später gilt die Klinik als eine der führenden Zahnarztpraxen Albaniens, der über 24.000 zufriedene Patienten aus Albanien und der ganzen Welt vertrauen.",
  "clinic.our-story.s1.heading": "Qualität, der Sie vertrauen können",
  "clinic.our-story.s1.p0":
    "Unsere Arbeit erfolgt nach ISO-9001-Standards und europäischen Hygieneprotokollen, mit moderner Technologie und hochwertigen Materialien bei jedem Schritt.",
  "clinic.our-story.s1.p1":
    "Wir stehen mit dokumentierter, nachverfolgbarer Arbeit und Nachsorge nach jeder Behandlung hinter unseren Ergebnissen, damit Sie uns mit vollem Vertrauen wählen können.",

  "clinic.our-clinic.title": "Unsere Klinik",
  "clinic.our-clinic.eyebrow": "Eine moderne Einrichtung",
  "clinic.our-clinic.intro":
    "Unsere moderne, patientenorientierte Klinik im Herzen von Tirana verbindet moderne Technologie, hochwertige Materialien und eine ruhige, angenehme Umgebung.",
  "clinic.our-clinic.s0.heading": "Moderne Technologie, hochwertige Materialien",
  "clinic.our-clinic.s0.p0":
    "Jede Behandlung erfolgt mit moderner Zahntechnologie und hochwertigen Materialien und gewährleistet sichere, vorhersehbare und dauerhafte Ergebnisse.",
  "clinic.our-clinic.s0.p1":
    "Wir arbeiten ausschließlich mit europaweit vertrauenswürdigen Premium-Partnern - Straumann, Ivoclar und Biodem - damit die Komponenten und Restaurationen in Ihrem Mund die allerbesten verfügbaren sind.",
  "clinic.our-clinic.s1.heading": "Komfortabel & patientenorientiert",
  "clinic.our-clinic.s1.p0":
    "Von Ihrer ersten Beratung bis zu Ihrem Endergebnis ist jedes Detail unserer Klinik auf Ihren Komfort ausgerichtet. Unsere erfahrenen Fachkräfte bilden sich kontinuierlich weiter, um an der Spitze der modernen Zahnmedizin zu bleiben.",
  "clinic.our-clinic.s1.p1":
    "Jeder Patient erhält einen individuellen Behandlungsplan, der um seine Ziele herum aufgebaut ist, in einer ruhigen, einladenden Umgebung, die ISO-9001- und europäische Hygienestandards erfüllt.",

  "clinic.dental-tourism.title": "Zahntourismus",
  "clinic.dental-tourism.eyebrow": "Behandlung & Reise Vereint",
  "clinic.dental-tourism.intro":
    "Albanien ist ein führendes Reiseziel für Zahntourismus und verbindet atemberaubende Sehenswürdigkeiten mit erstklassiger zahnmedizinischer Versorgung. Wir gestalten die gesamte Reise mühelos.",
  "clinic.dental-tourism.s0.heading": "Alles für Sie organisiert",
  "clinic.dental-tourism.s0.p0":
    "Wir helfen bei der Organisation Ihrer Flüge nach Tirana, und unser Team empfängt Sie am Flughafen Tirana mit einer herzlichen Begrüßung und Flughafenabholung.",
  "clinic.dental-tourism.s0.p1":
    "Sie übernachten in Partnerhotels mit modernem Komfort und kostenlosem WLAN, und unser Team bietet während Ihres gesamten Aufenthalts Übersetzung in Englisch, Italienisch, Deutsch und Französisch.",
  "clinic.dental-tourism.s1.heading": "Ihr Behandlungsweg",
  "clinic.dental-tourism.s1.p0":
    "1. Erstberatung - wir besprechen Ihre Anliegen und Ziele und erstellen einen individuellen Plan.",
  "clinic.dental-tourism.s1.p1":
    "2. Behandlung durch Experten - Ihre Versorgung erfolgt durch unser erfahrenes klinisches Team mit hochwertigen Materialien.",
  "clinic.dental-tourism.s1.p2":
    "3. Nachsorge - wir bleiben auch nach Ihrer Rückkehr nach Hause in Kontakt, um sicherzustellen, dass Ihre Ergebnisse anhalten.",

  "clinic.medical-insurance.title": "Krankenversicherung",
  "clinic.medical-insurance.eyebrow": "Flexibel & Unterstützt",
  "clinic.medical-insurance.intro":
    "Wir arbeiten daran, hochwertige zahnmedizinische Versorgung so zugänglich wie möglich zu machen, mit flexiblen Zahlungsoptionen und Unterstützung bei Versicherungsanträgen.",
  "clinic.medical-insurance.s0.heading": "Zusammenarbeit mit Ihrer Versicherung",
  "clinic.medical-insurance.s0.p0":
    "Unser Team unterstützt Sie gerne bei Krankenversicherungsanträgen und stellt die Unterlagen bereit, die Sie für eine Erstattung durch Ihren Anbieter benötigen.",
  "clinic.medical-insurance.s0.p1":
    "Wenn Sie unsicher sind, ob Ihr Tarif eine Behandlung im Ausland abdeckt, kontaktieren Sie uns, und wir helfen Ihnen, Ihre Optionen vor der Reise zu verstehen.",
  "clinic.medical-insurance.s1.heading": "Flexible Zahlungsoptionen",
  "clinic.medical-insurance.s1.p0":
    "Wir bieten flexible Zahlungsoptionen, die Ihren Behandlungsplan überschaubar machen, ohne Kompromisse bei Qualität oder Materialien.",
  "clinic.medical-insurance.s1.p1":
    "Für einen individuellen Behandlungsplan und eine Beratung zur Zahlung schreiben Sie uns einfach an info@dentalmedaustria.com.",

  "clinic.faqs.title": "Häufige Fragen",
  "clinic.faqs.eyebrow": "Hilfreiche Antworten",
  "clinic.faqs.intro":
    "Antworten auf die Fragen, die uns von lokalen und internationalen Patienten am häufigsten gestellt werden.",
  "clinic.faqs.s0.heading": "Wo befinden Sie sich?",
  "clinic.faqs.s0.p0":
    "Unsere Klinik befindet sich in der Rruga Kristo Luarasi in Tiranë, Albanien, geöffnet von Montag bis Samstag von 9:00 bis 22:00 Uhr.",
  "clinic.faqs.s1.heading": "Behandeln Sie internationale Patienten?",
  "clinic.faqs.s1.p0":
    "Ja. Wir empfangen Patienten aus der ganzen Welt und bieten umfassende Zahntourismus-Unterstützung, einschließlich Hilfe bei Flügen, Flughafenabholung, Partnerhotels und Übersetzung in Englisch, Italienisch, Deutsch und Französisch.",
  "clinic.faqs.s2.heading": "Welche Nachsorge bieten Sie nach der Behandlung?",
  "clinic.faqs.s2.p0": "Jeder Implantatpatient erhält einen Implantatpass mit der Implantatmarke und überprüfbaren Seriennummern, und unser Team steht Ihnen nach der Behandlung für die Nachsorge zur Verfügung.",
  "clinic.faqs.s3.heading": "Welche Standards befolgen Sie?",
  "clinic.faqs.s3.p0":
    "Unsere Klinik arbeitet nach ISO-9001-Standards und europäischen Hygieneprotokollen, mit moderner Technologie und hochwertigen Materialien von Partnern wie Straumann, Ivoclar und Biodem.",
  "clinic.faqs.s4.heading": "Wie buche ich einen Termin?",
  "clinic.faqs.s4.p0":
    "Die Buchung ist einfach - schreiben Sie uns an info@dentalmedaustria.com und unser Team organisiert Ihre Beratung und beantwortet alle Fragen.",

  "equipcat.imaging.label": "3D-Bildgebung & Diagnostik",
  "equipcat.imaging.blurb":
    "Strahlungsarme 3D- und Panoramabildgebung - das diagnostische Rückgrat präziser Implantat- und chirurgischer Planung.",
  "equipcat.cadcam.label": "CAD/CAM-Fräsung",
  "equipcat.cadcam.blurb":
    "Hauseigene 5-Achs-Fräsung, die Kronen, Brücken und Full-Arch-Gerüste mit industrieller Präzision fertigt.",
  "equipcat.furnaces.label": "Keramik- & Sinteröfen",
  "equipcat.furnaces.blurb":
    "Präzisionsöfen, die jede Restauration brennen, pressen und sintern, bis zu ihrer endgültigen Festigkeit und Schönheit.",
  "equipcat.guided-surgery.label": "Geführte Implantatchirurgie",
  "equipcat.guided-surgery.blurb":
    "Echtzeit-Navigation und kontrollierte chirurgische Motoren für eine sicherere, genauere Implantatplatzierung.",
  "equipcat.lab.label": "Labor-Mikromotoren",
  "equipcat.lab.blurb":
    "Professionelle bürstenlose Mikromotoren, die Restaurationen in unserem hauseigenen Labor von Hand formen und finishen.",
  "equipcat.air-suction.label": "Kompressoren & Absaugung",
  "equipcat.air-suction.blurb":
    "Ölfreie Druckluft und zentrale Absaugung - die saubere, zuverlässige Infrastruktur hinter jedem Behandlungsstuhl.",
  "equipcat.sterilization.label": "Sterilisation",
  "equipcat.sterilization.blurb":
    "Strenge Sterilisationsprotokolle nach ISO-9001- und europäischen Hygienestandards, für Ihre vollständige Sicherheit.",
  "equipcat.surgical-optics.label": "Chirurgische Laser & Optik",
  "equipcat.surgical-optics.blurb":
    "Weichgewebelaser und Operationsmikroskope für minimalinvasive, stark vergrößerte Präzision.",
  "equipcat.operatory.label": "Behandlungsräume",
  "equipcat.operatory.blurb":
    "Moderne Behandlungseinheiten und Beleuchtung, gestaltet rund um Ihren Komfort und die Genauigkeit des Behandlers.",
  "equipcat.materials.label": "Hochwertige Materialien & Implantatmarken",
  "equipcat.materials.blurb":
    "Die vertrauenswürdigen europäischen Marken hinter Ihren Implantaten, Kronen und Transplantaten - Qualität, auf die Sie sich verlassen können.",
};

const FR: Dict = {
  // ── Navigation (top level) ──
  "nav.home": "Accueil",
  "nav.packets": "Plans de traitement",
  "nav.clinic": "Clinique",
  "nav.care": "Plans de traitement",
  "nav.smiles": "Sourires",
  "nav.contact": "Contact",

  // ── Sub-navigation (mega menus) ──
  "subnav.catalogue": "Catalogue complet des traitements",
  "subnav.ourStory": "Notre histoire",
  "subnav.ourClinic": "Notre clinique",
  "subnav.technology": "Technologie et équipements",
  "subnav.insurance": "Assurance médicale",
  "subnav.faqs": "Questions fréquentes",
  "subnav.safety": "Sécurité et hygiène",

  // ── Treatment names (shared by nav, cards, grids) ──
  "treat.implants": "Implants dentaires",
  "treat.crowns": "Couronnes dentaires",
  "treat.veneers": "Facettes dentaires",
  "treat.prostheses": "Prothèses dentaires",
  "treat.orthodontics": "Orthodontie",

  // ── Hero ──
  "hero.eyebrow": "Implants  |  Esthétique  |  Orthodontie",
  "hero.title": "Soins dentaires de pointe en Albanie",

  // ── Intro / About ──
  "intro.h2": "Une dentisterie d'excellence au cœur de Tirana",
  "intro.p1":
    "Fondée en 2009, Dental Med Austria apporte des standards de qualité premium aux soins dentaires en Albanie, pour les patients locaux comme internationaux.",
  "intro.p2":
    "Notre équipe expérimentée a accueilli plus de 24 000 patients satisfaits et posé plus de 42 000 implants avec un taux de réussite de 98 %, en alliant technologie de pointe, matériaux premium et plans de traitement personnalisés dans un environnement calme et centré sur le patient.",
  "intro.p3":
    "Chaque traitement est réalisé selon les normes ISO 9001 et les standards d'hygiène européens, avec des protocoles de stérilisation rigoureux et des matériaux documentés et traçables, pour que vous puissiez nous choisir en toute confiance.",
  "intro.quote":
    "« D'autres dentistes m'ont donné de ‘bons' résultats, mais ici ? Des dents SUBLIMES, dignes d'Hollywood ! La précision, l'esthétique, la sensation… c'est comme si j'avais été mis à niveau vers une version de luxe de moi-même. »",
  "intro.quoteCite": "- Meriton Mjekiqi",
  "intro.stat.patients": "Patients satisfaits",
  "intro.stat.implants": "Implants posés",
  "intro.stat.success": "Réussite des implants",
  "intro.stat.trusted": "Soins de confiance",
  "btn.services": "Nos services",

  // ── Explore Treatments ──
  "explore.title": "Découvrir les traitements dentaires",
  "card.discover": "Découvrir le soin",
  "card.viewDetails": "Voir les détails",

  // ── Tour Our Clinic ──
  "tour.title": "Visiter notre clinique",
  "tour360.eyebrow": "Entrez avec Nous",
  "tour360.title": "Explorez la clinique à 360°",
  "tour360.hint": "Faites glisser pour regarder autour de vous et touchez les flèches pour parcourir chaque espace de Dental Med Austria.",
  "tour360.cta": "Faire la visite virtuelle 360°",
  "tour.tech.eyebrow": "Équipements de dernière génération",
  "tour.tech.title": "Technologie de pointe",
  "tour.tourism.title": "Tourisme dentaire",

  // ── Smile Gallery (home) ──
  "smiles.eyebrow": "Des transformations dentaires qui changent la vie",
  "smiles.title": "Révéler de beaux sourires",
  "smiles.cta": "Voir la galerie des sourires",

  // ── Testimonials (Instagram patient reels) ──
  "testi.eyebrow": "De vrais patients, de vrais mots",
  "testi.title": "Témoignages de patients",
  "testi.subtitle":
    "Regardez de vrais patients de Dental Med Austria partager leur expérience, filmé dans notre clinique à Tirana et publié sur Instagram.",
  "testi.badge": "Témoignage",
  "testi.watch": "Voir le reel",
  "testi.follow": "Plus sur Instagram",
  "testi.close": "Fermer",
  "testi.prev": "Témoignage précédent",
  "testi.next": "Témoignage suivant",
  "testi.loading": "Chargement…",

  // ── Blog strip (home) ──
  "blogstrip.eyebrow": "Depuis la clinique",
  "blogstrip.heading": "Actualités, conseils et tourisme dentaire",
  "blogstrip.viewAll": "Voir tous les articles",

  // ── Brand marquee ──
  // ── Reviews (Google patient reviews) ──
  "reviews.eyebrow": "Avis Google Vérifiés",
  "reviews.heading": "Ce Que Disent Nos Patients",
  "reviews.ratingLabel": "avis Google",

  "brand.eyebrow": "Nos partenaires de confiance",
  "brand.heading": "Nos partenaires et marques de confiance avec lesquels nous travaillons",

  // ── Common ──
  "common.prev": "Précédent",
  "common.next": "Suivant",

  // ── Footer ──
  "footer.getDirections": "Obtenir l'itinéraire",
  "footer.form.first": "Prénom*",
  "footer.form.last": "Nom*",
  "footer.form.email": "E-mail*",
  "footer.form.phone": "Téléphone*",
  "footer.form.patient": "Nouveau patient ou patient existant*",
  "footer.form.comments": "Commentaires",
  "footer.form.message": "Comment pouvons-nous vous aider ?",
  "footer.form.submit": "Envoyer",
  "footer.rights": "Tous droits réservés",
  "footer.privacy": "Politique de confidentialité",
  "footer.risks": "Risques du traitement",
  "footer.tagline":
    "Dental Med Austria est une clinique dentaire certifiée ISO 9001 située à Tirana, en Albanie, spécialisée en implantologie, dentisterie esthétique et réhabilitation complète de la bouche. Depuis 2009, plus de 24 000 patients venus de toute l'Europe et d'ailleurs nous ont confié leur sourire grâce à notre expertise, nos technologies modernes et nos résultats durables. Chaque traitement implantaire comprend un Passeport Implantaire, garantissant une traçabilité complète et une sécurité optimale.",
  "footer.col.treatments": "Traitements",
  "footer.col.clinic": "La Clinique",
  "footer.col.patients": "Pour les Patients",
  "footer.blog": "Blog",
  "footer.smiles": "Galerie des Sourires",
  "footer.team": "Notre Équipe",
  "footer.langs": "Ce site dans d'autres langues",
  "footer.sitemap": "Plan du site",
  "footer.accredited": "Certifiée & membre de",

  // ── Sticky CTA ──
  "sticky.appointment": "Demander un rendez-vous",
  "sticky.call": "Appelez-nous",
  "sticky.email": "Écrivez-nous",

  "lead.rail.tab": "Plan de Traitement Gratuit",
  "lead.rail.title": "Recevez votre plan de traitement gratuit",
  "lead.rail.subtitle": "Dites-nous comment vous joindre, plan écrit personnalisé sous 24–48 h.",
  "lead.rail.send": "Envoyer la demande",
  "lead.rail.sending": "Envoi en cours…",
  "lead.rail.success": "Merci, demande reçue !",
  "lead.rail.successNote": "Notre coordinateur vous répondra sous 24 à 48 heures. Votre référence :",
  "lead.rail.error": "Veuillez indiquer au moins votre nom et votre numéro de téléphone, puis réessayez.",
  "lead.rail.whatsapp": "Continuer sur WhatsApp",
  "lead.rail.privacy": "En envoyant, vous acceptez d'être contacté au sujet de votre demande. Jamais de spam.",

  // ── Shared CTA / chrome ──
  "cta.requestAppointment": "Demander un rendez-vous",
  "nav.team": "Équipe",
  "nav.catalogue": "Catalogue",
  "nav.technology": "Technologie",

  // ── Care (listing) ──
  "care.hero.eyebrow": "Des solutions dentaires complètes",
  "care.hero.title": "Nos soins",
  "care.intro.eyebrow": "Implants, couronnes, facettes et plus",
  "care.intro.text":
    "Des implants dentaires et couronnes aux facettes, prothèses et orthodontie, nous proposons des solutions dentaires complètes selon les standards de qualité premium - le tout sous un même toit.",
  "care.cta.heading": "Vous ne savez pas par où commencer ? Nous vous guidons.",
  "care.cta.text": "Réservez une consultation et nous concevrons le plan idéal pour votre sourire.",

  // ── Care (detail) ──
  "care.detail.aboutPrefix": "À propos de",
  "care.detail.ctaPrefix": "Prêt à découvrir",
  "care.detail.ctaSuffix": "?",
  "care.detail.ctaText": "Réservez dès aujourd'hui une consultation avec notre équipe.",

  // ── Smiles ──
  "smilespage.hero.eyebrow": "Des transformations dentaires qui changent la vie",
  "smilespage.hero.title": "La galerie des sourires",
  "smilespage.intro.eyebrow": "Vrais patients · Vrais résultats",
  "smilespage.intro.text":
    "Je Souris avec DENTAL MED AUSTRIA",
  "smilespage.cta.heading": "Imaginez votre nouveau sourire.",
  "smilespage.cta.text":
    "Envoyez une radiographie panoramique et quelques photos pour un plan gratuit de conception du sourire sous 24 à 48 heures.",

  // ── Catalogue (listing) ──
  "cat.hero.eyebrow": "Qualité premium · Tirana, Albanie",
  "cat.hero.title": "Catalogue des traitements",
  "cat.stats.treatments": "Traitements",
  "cat.stats.specialties": "Spécialités",
  "cat.stats.requested": "Les plus demandés",
  "cat.intro.heading": "Chaque traitement que nous proposons, sous un même toit",
  "cat.intro.text":
    "De l'implant unique aux transformations complètes du sourire, chaque intervention est réalisée avec des matériaux premium et selon des standards de qualité premium. Chaque plan est adapté à votre cas - envoyez-nous votre radiographie pour un plan écrit gratuit sous 24 à 48 heures.",
  "cat.cta.eyebrow": "Gratuit · Sans engagement",
  "cat.cta.heading": "Obtenez votre plan de traitement personnalisé",
  "cat.cta.text":
    "Envoyez-nous une radiographie panoramique et quelques photos. Notre équipe clinique vous renverra un plan de traitement écrit sous 24 à 48 heures, dans votre langue.",
  "cat.cta.requestPlan": "Demander un plan",
  "cat.cta.featured": "Services phares",
  "cat.section.treatments": "Traitements",

  // ── Catalogue (detail) ──
  "cat.detail.idealFor": "Idéal pour :",
  "cat.detail.materials": "Matériaux et marques",
  "cat.detail.whyChoose": "Pourquoi les patients le choisissent",
  "cat.detail.typicalSession": "Séance type",
  "cat.detail.journey": "Votre parcours",
  "cat.detail.whatToExpect": "À quoi s'attendre",
  "cat.detail.frequentlyAsked": "Questions fréquentes",
  "cat.detail.questionsPrefix": "Questions sur",
  "cat.detail.relatedTreatments": "Traitements associés",
  "cat.detail.learnMore": "En savoir plus",
  "cat.detail.consideringPrefix": "Vous envisagez",
  "cat.detail.consideringSuffix": "?",
  "cat.detail.ctaText":
    "Envoyez une radiographie panoramique et quelques photos pour un plan écrit et un plan de traitement gratuit sous 24 à 48 heures.",
  "cat.detail.allTreatments": "Tous les traitements",
  "cat.detail.ataGlance": "En bref",
  "cat.detail.procedureEyebrow": "La Procédure",
  "cat.detail.procedureHeading": "Étape par étape",
  "cat.detail.whoEyebrow": "Indications",
  "cat.detail.whoHeading": "À qui s'adresse ce traitement ?",
  "cat.detail.recoveryEyebrow": "Récupération",
  "cat.detail.recoveryHeading": "Récupération & guérison",
  "cat.detail.evidenceEyebrow": "Les données",
  "cat.detail.evidenceHeading": "Succès & longévité",
  "cat.detail.goodToKnowEyebrow": "Bon à savoir",
  "cat.detail.goodToKnowHeading": "Comparaisons & considérations",
  "cat.detail.careEyebrow": "Après le traitement",
  "cat.detail.careHeading": "Prendre soin de votre résultat",
  "cat.detail.costEyebrow": "Planification",
  "cat.detail.costHeading": "Votre plan & transparence",
  "cat.detail.whyEyebrow": "Pourquoi nous",
  "cat.detail.whyHeading": "Pourquoi les patients choisissent Dental Med Austria",

  // ── Contact ──
  "contactpage.hero.eyebrow": "Nous serions ravis d'avoir de vos nouvelles",
  "contactpage.hero.title": "Contactez-nous",
  "contactpage.getDirections": "Obtenir l'itinéraire →",
  "contactpage.instagram": "Instagram",
  "contactpage.facebook": "Facebook",
  "contactpage.openingHours": "Horaires d'ouverture",
  "contactpage.hours.weekdays": "Lundi - Vendredi",
  "contactpage.hours.weekdaysTime": "9:00 - 19:00",
  "contactpage.hours.saturday": "Samedi",
  "contactpage.hours.saturdayTime": "9:00 - 15:00",
  "contactpage.hours.sunday": "Dimanche",
  "contactpage.hours.sundayTime": "Fermé",

  // ── Team ──
  "team.hero.eyebrow": "Dental Med Austria",
  "team.hero.title": "Rencontrez notre équipe",
  "team.intro.eyebrow": "Expérimentés et attentionnés",
  "team.intro.text":
    "Nos soins sont dirigés par une équipe clinique expérimentée, qui allie des décennies d'expérience et des standards de qualité premium à des soins sincères, centrés sur le patient.",
  "team.specialist": "Notre spécialiste",
  "team.cta.heading": "Prêt à rencontrer notre équipe ?",
  "team.cta.text":
    "Nous serions ravis de vous accueillir à la clinique. Écrivez-nous pour réserver votre première consultation.",

  "team.dentists.hero.title": "Notre spécialiste",
  "team.dentists.intro.text":
    "Notre équipe clinique expérimentée apporte des décennies d'expérience et des standards de qualité premium aux soins doux, minutieux et centrés sur le patient de la clinique.",
  "team.dentists.cta.heading": "Réservez votre consultation dès aujourd'hui.",

  "team.hygienists.hero.title": "Soins préventifs",
  "team.hygienists.intro.eyebrow": "Des sourires sains, pour la vie",
  "team.hygienists.intro.text":
    "Chez Dental Med Austria, les soins préventifs et d'hygiène sont assurés par notre équipe clinique expérimentée selon les standards d'hygiène européens - pour garder votre sourire en bonne santé entre les traitements.",
  "team.hygienists.cta.heading": "Réservez votre prochain rendez-vous.",

  "team.meet.hero.eyebrow": "Le spécialiste derrière vos soins",
  "team.meet.hero.title": "Rencontrez notre équipe",
  "team.meet.intro.text":
    "Chez Dental Med Austria, vos soins sont dirigés par une équipe clinique expérimentée, déterminée à rendre votre expérience exceptionnelle - de votre accueil chaleureux à votre résultat final au fauteuil.",
  "team.meet.cta.heading": "Nous avons hâte de vous accueillir.",

  "team.bio.ctaPrefix": "Réservez un rendez-vous avec",

  "role.founder-managing-director": "Fondateur et directeur général",

  // ── Technology ──
  "tech.hero.eyebrow": "Niveau hospitalier · Laboratoire intégré",
  "tech.hero.title": "Technologie et équipements",
  "tech.stats.devices": "Appareils",
  "tech.stats.categories": "Catégories",
  "tech.stats.oneRoof": "Un même toit",
  "tech.intro.heading": "La technologie derrière des résultats de qualité premium",
  "tech.intro.text":
    "De l'imagerie 3D CBCT et de la chirurgie assistée par ordinateur à notre propre fraisage CAD/CAM intégré et notre laboratoire de céramique, chaque appareil est choisi pour la précision, la sécurité et des résultats beaux et durables.",
  "tech.system": "Système",
  "tech.systems": "Systèmes",
  "tech.flagship": "Fleuron",
  "tech.cta.eyebrow": "Standards premium · Tirana",
  "tech.cta.heading": "Découvrez la différence que fait la précision",
  "tech.cta.text":
    "Venez voir notre technologie en personne, ou envoyez une radiographie pour un plan de traitement à distance gratuit sous 24 à 48 heures.",
  "tech.cta.bookVisit": "Réserver une visite",
  "tech.cta.catalogue": "Catalogue des traitements",

  // ── Packets ──
  "packets.hero.eyebrow": "Sélectionnés · Combinés · Complets",
  "packets.hero.title": "Forfaits de traitement",
  "packets.list.eyebrow": "Forfaits de traitement sélectionnés",
  "packets.list.heading": "Tout ce dont vous avez besoin, magnifiquement combiné",
  "packets.list.text":
    "Nos traitements les plus demandés, judicieusement réunis en parcours complets - chacun adapté à vos objectifs et soutenu par un plan gratuit à distance.",
  "packets.list.bundle": "traitements · un forfait",
  "packets.list.enquire": "Se renseigner sur ce forfait",
  "packets.cta.heading": "Vous ne savez pas quel forfait vous convient ?",
  "packets.cta.text":
    "Envoyez une radiographie panoramique et des photos pour un plan écrit gratuit sous 24 à 48 heures.",

  // ── Clinic (detail) ──
  "clinic.detail.cta.heading": "Découvrez la différence Dental Med Austria.",

  // ── Procedures (care detail content) ──
  "proc.dental-implants.name": "Implants dentaires",
  "proc.dental-implants.eyebrow": "Restaurer et remplacer",
  "proc.dental-implants.intro":
    "Nos implants dentaires en titane offrent des résultats d'aspect naturel, entièrement fonctionnels et permanents - la référence absolue pour remplacer les dents manquantes. Avec plus de 42 000 implants posés et un taux de réussite de 98 %, vous êtes entre des mains expertes.",
  "proc.dental-implants.body.0":
    "Chaque cas d'implant commence par un diagnostic numérique détaillé afin que la pose soit précise, prévisible et aussi confortable que possible. Nos techniques d'implantation sans douleur et notre planification minutieuse font que la plupart des patients sont surpris de la douceur de l'expérience.",
  "proc.dental-implants.body.1":
    "Pour les patients à qui il manque plusieurs dents ou toutes leurs dents, nos solutions d'arcade complète All-on-4 et All-on-6 rétablissent un sourire complet et fixe sur seulement quatre ou six implants. Lorsque l'os s'est résorbé avec le temps, nos procédures de régénération osseuse reconstruisent une base solide pour poser un implant en toute confiance.",
  "proc.dental-implants.t0.title": "Implants unitaires",
  "proc.dental-implants.t0.text": "Des remplacements permanents et d'aspect naturel pour les dents manquantes individuelles.",
  "proc.dental-implants.t1.title": "All-on-4 / All-on-6",
  "proc.dental-implants.t1.text": "Une arcade complète fixe soutenue par seulement quatre ou six implants.",
  "proc.dental-implants.t2.title": "Implants sans douleur",
  "proc.dental-implants.t2.text": "Des techniques douces et une planification minutieuse pour une intervention confortable.",
  "proc.dental-implants.t3.title": "Régénération osseuse",
  "proc.dental-implants.t3.text": "Reconstruire l'os perdu pour créer une base solide pour les implants.",

  "proc.dental-crowns.name": "Couronnes dentaires",
  "proc.dental-crowns.eyebrow": "Solidité et esthétique",
  "proc.dental-crowns.intro":
    "Les couronnes dentaires restaurent les dents cassées, manquantes ou abîmées tout en améliorant à la fois la fonction et l'apparence. Chaque couronne est réalisée avec des matériaux premium par des partenaires de confiance tels que Ivoclar.",
  "proc.dental-crowns.body.0":
    "Une couronne reconstruit une dent trop abîmée pour un simple plombage, protégeant ce qui reste tout en restaurant une forme, une couleur et une occlusion naturelles. Nous assortissons chaque restauration à vos dents environnantes pour que le résultat se fonde parfaitement dans votre sourire.",
  "proc.dental-crowns.body.1":
    "Des couronnes unitaires en zircone et en céramique aux bridges multi-dents et aux restaurations sur mesure, notre travail de laboratoire est conçu pour durer - réalisé selon les standards de qualité européens dans notre flux de travail certifié ISO 9001.",
  "proc.dental-crowns.t0.title": "Couronnes en zircone",
  "proc.dental-crowns.t0.text": "Des couronnes exceptionnellement solides, sans métal, à la finition réaliste.",
  "proc.dental-crowns.t1.title": "Couronnes en céramique",
  "proc.dental-crowns.t1.text": "Des restaurations magnifiquement naturelles réalisées en céramique premium.",
  "proc.dental-crowns.t2.title": "Bridges",
  "proc.dental-crowns.t2.text": "Des restaurations fixes qui remplacent une ou plusieurs dents manquantes.",
  "proc.dental-crowns.t3.title": "Restaurations sur mesure",
  "proc.dental-crowns.t3.text": "Des solutions personnalisées conçues autour de votre occlusion et de votre sourire.",

  "proc.dental-veneers.name": "Facettes dentaires",
  "proc.dental-veneers.eyebrow": "Concevez votre sourire",
  "proc.dental-veneers.intro":
    "Les facettes en céramique et en composite créent un sourire impeccable, naturel, digne d'Hollywood. De fines coques sur mesure transforment la forme, la couleur et l'harmonie de vos dents avec une intervention minimale.",
  "proc.dental-veneers.body.0":
    "Les facettes comptent parmi les outils les plus puissants de la dentisterie esthétique, corrigeant décolorations, éclats, espaces et formes irrégulières en une seule transformation. Les facettes en céramique offrent la finition la plus durable et réfléchissant la lumière, tandis que les facettes en composite offrent une option réalisée en une seule visite.",
  "proc.dental-veneers.body.1":
    "Chaque transformation du sourire commence par une consultation détaillée de conception du sourire, afin que vous puissiez voir et façonner votre résultat final avant le début du traitement. Associé à un blanchiment professionnel des dents, le résultat est un sourire d'aspect naturel et indéniablement vôtre.",
  "proc.dental-veneers.t0.title": "Facettes en céramique",
  "proc.dental-veneers.t0.text": "Des coques réalisées à la main pour une finition durable et réfléchissant la lumière.",
  "proc.dental-veneers.t1.title": "Facettes en composite",
  "proc.dental-veneers.t1.text": "Une option élégante, en une seule visite, pour un sourire rafraîchi.",
  "proc.dental-veneers.t2.title": "Conception du sourire",
  "proc.dental-veneers.t2.text": "Un plan sur mesure qui prévisualise votre résultat avant le traitement.",
  "proc.dental-veneers.t3.title": "Blanchiment des dents",
  "proc.dental-veneers.t3.text": "Un blanchiment sûr et professionnel pour un sourire plus éclatant.",

  "proc.dental-prostheses.name": "Prothèses dentaires",
  "proc.dental-prostheses.eyebrow": "Fonction et confort",
  "proc.dental-prostheses.intro":
    "Les prothèses dentaires sur mesure restaurent les dents manquantes ou abîmées pour la fonction, le confort et un sourire harmonieux. Chaque prothèse est conçue et ajustée pour être naturelle au toucher et belle à regarder.",
  "proc.dental-prostheses.body.0":
    "Que vous ayez besoin de remplacer quelques dents ou de réhabiliter une bouche entière, nos prothèses sont conçues pour restaurer une mastication assurée, une élocution claire et un visage équilibré. Nous prenons le temps de perfectionner l'ajustement pour que votre prothèse soit stable et confortable au quotidien.",
  "proc.dental-prostheses.body.1":
    "Nos solutions vont des prothèses fixes et amovibles aux dentiers sur mesure et à la réhabilitation complète de la bouche, souvent combinées à des implants pour plus de stabilité. Chaque plan est personnalisé, prévisible et réalisé selon les normes ISO 9001 et les standards de qualité européens.",
  "proc.dental-prostheses.t0.title": "Prothèses fixes",
  "proc.dental-prostheses.t0.text": "Des restaurations fixées de façon permanente pour une sensation stable et naturelle.",
  "proc.dental-prostheses.t1.title": "Prothèses amovibles",
  "proc.dental-prostheses.t1.text": "Des options confortables, sur mesure et faciles à entretenir.",
  "proc.dental-prostheses.t2.title": "Dentiers sur mesure",
  "proc.dental-prostheses.t2.text": "Des dentiers modernes conçus pour le confort et un aspect naturel.",
  "proc.dental-prostheses.t3.title": "Réhabilitation complète de la bouche",
  "proc.dental-prostheses.t3.text": "Une restauration complète de la fonction et de l'esthétique.",

  "proc.orthodontics.name": "Orthodontie",
  "proc.orthodontics.eyebrow": "Aligner en toute confiance",
  "proc.orthodontics.intro":
    "Notre traitement orthodontique spécialisé corrige l'alignement des dents et de la mâchoire avec des appareils traditionnels et des gouttières transparentes Invisalign. Assuré par notre équipe orthodontique spécialisée, chaque plan est adapté à votre sourire.",
  "proc.orthodontics.body.0":
    "Des dents bien alignées ne sont pas seulement belles - elles sont plus saines et plus faciles à garder propres. Nous planifions soigneusement chaque cas pour guider vos dents et votre mâchoire vers un alignement équilibré et durable, avec des options adaptées à tous les âges et à tous les modes de vie.",
  "proc.orthodontics.body.1":
    "Choisissez les gouttières transparentes et amovibles Invisalign pour une confiance au quotidien, ou les fiables appareils traditionnels pour les mouvements plus complexes. Grâce à une intervention précoce pour les patients plus jeunes et à des contentions pour protéger votre résultat, votre nouvel alignement est conçu pour durer.",
  "proc.orthodontics.t0.title": "Appareils traditionnels",
  "proc.orthodontics.t0.text": "Une correction fiable et précise pour un large éventail de cas.",
  "proc.orthodontics.t1.title": "Invisalign",
  "proc.orthodontics.t1.text": "Des gouttières pratiquement invisibles et amovibles pour une confiance au quotidien.",
  "proc.orthodontics.t2.title": "Intervention précoce",
  "proc.orthodontics.t2.text": "Guider les jeunes sourires pour le meilleur résultat à long terme.",
  "proc.orthodontics.t3.title": "Contentions",
  "proc.orthodontics.t3.text": "Protéger votre bel alignement neuf sur le long terme.",

  // ── Clinic pages content ──
  "clinic.our-story.title": "Notre histoire",
  "clinic.our-story.eyebrow": "À propos de Dental Med Austria",
  "clinic.our-story.intro":
    "Depuis 2009, Dental Med Austria apporte des soins dentaires de qualité premium à Tirana - une clinique où de rigoureux standards européens rencontrent des soins chaleureux et centrés sur le patient.",
  "clinic.our-story.s0.heading": "Fondée sur des standards premium",
  "clinic.our-story.s0.p0":
    "Dental Med Austria a été fondée en 2009 et, dès le premier jour, a été bâtie autour de standards de qualité premium précis et fondés sur les preuves.",
  "clinic.our-story.s0.p1":
    "Plus d'une décennie plus tard, la clinique est reconnue comme l'un des principaux cabinets dentaires d'Albanie, à qui plus de 24 000 patients satisfaits d'Albanie et du monde entier font confiance.",
  "clinic.our-story.s1.heading": "Une qualité en laquelle vous pouvez avoir confiance",
  "clinic.our-story.s1.p0":
    "Notre travail est réalisé selon les normes ISO 9001 et les protocoles d'hygiène européens, en utilisant une technologie de pointe et des matériaux de haute qualité à chaque étape.",
  "clinic.our-story.s1.p1":
    "Nous répondons de nos résultats par un travail documenté et traçable et un suivi après chaque traitement, pour que vous puissiez nous choisir en toute confiance.",

  "clinic.our-clinic.title": "Notre clinique",
  "clinic.our-clinic.eyebrow": "Un établissement moderne",
  "clinic.our-clinic.intro":
    "Notre clinique moderne et centrée sur le patient, au cœur de Tirana, allie technologie de pointe, matériaux premium et un environnement calme et confortable.",
  "clinic.our-clinic.s0.heading": "Technologie de pointe, matériaux premium",
  "clinic.our-clinic.s0.p0":
    "Chaque traitement est réalisé avec une technologie dentaire de pointe et des matériaux de haute qualité, garantissant des résultats sûrs, prévisibles et durables.",
  "clinic.our-clinic.s0.p1":
    "Nous travaillons exclusivement avec des partenaires premium reconnus dans toute l'Europe - Straumann, Ivoclar et Biodem - pour que les composants et les restaurations dans votre bouche soient les meilleurs disponibles.",
  "clinic.our-clinic.s1.heading": "Confortable et centrée sur le patient",
  "clinic.our-clinic.s1.p0":
    "De votre première consultation à votre résultat final, chaque détail de notre clinique est pensé autour de votre confort. Nos professionnels expérimentés suivent une formation continue pour rester à la pointe de la dentisterie moderne.",
  "clinic.our-clinic.s1.p1":
    "Chaque patient reçoit un plan de traitement personnalisé bâti autour de ses objectifs, dispensé dans un environnement calme et accueillant qui répond aux normes ISO 9001 et aux standards d'hygiène européens.",

  "clinic.dental-tourism.title": "Tourisme dentaire",
  "clinic.dental-tourism.eyebrow": "Soins et voyage réunis",
  "clinic.dental-tourism.intro":
    "L'Albanie est une destination de premier plan pour le tourisme dentaire, alliant des paysages à couper le souffle à des soins dentaires d'excellence. Nous rendons tout le parcours facile.",
  "clinic.dental-tourism.s0.heading": "Tout est organisé pour vous",
  "clinic.dental-tourism.s0.p0":
    "Nous aidons à organiser vos vols vers Tirana, et notre équipe vous accueillera à l'aéroport de Tirana avec un accueil chaleureux et un transfert depuis l'aéroport.",
  "clinic.dental-tourism.s0.p1":
    "Vous séjournerez dans des hôtels partenaires offrant un confort moderne et le WiFi gratuit, et notre équipe assure la traduction en anglais, italien, allemand et français tout au long de votre séjour.",
  "clinic.dental-tourism.s1.heading": "Votre parcours de traitement",
  "clinic.dental-tourism.s1.p0":
    "1. Consultation initiale - nous discutons de vos préoccupations et de vos objectifs et élaborons un plan personnalisé.",
  "clinic.dental-tourism.s1.p1":
    "2. Traitement par des experts - vos soins sont réalisés par notre équipe clinique expérimentée avec des matériaux premium.",
  "clinic.dental-tourism.s1.p2":
    "3. Suivi - nous restons en contact après votre retour chez vous pour garantir la durabilité de vos résultats.",

  "clinic.medical-insurance.title": "Assurance médicale",
  "clinic.medical-insurance.eyebrow": "Flexible et accompagnée",
  "clinic.medical-insurance.intro":
    "Nous œuvrons pour rendre des soins dentaires de haute qualité aussi accessibles que possible, avec des options de paiement flexibles et une aide pour les demandes de remboursement auprès de votre assurance.",
  "clinic.medical-insurance.s0.heading": "Travailler avec votre assurance",
  "clinic.medical-insurance.s0.p0":
    "Notre équipe est ravie de vous aider avec les demandes d'assurance médicale et de fournir les documents dont vous avez besoin pour obtenir un remboursement de votre assureur.",
  "clinic.medical-insurance.s0.p1":
    "Si vous ne savez pas si votre contrat couvre les soins à l'étranger, contactez-nous et nous vous aiderons à comprendre vos options avant votre voyage.",
  "clinic.medical-insurance.s1.heading": "Options de paiement flexibles",
  "clinic.medical-insurance.s1.p0":
    "Nous proposons des options de paiement flexibles conçues pour rendre votre plan de traitement gérable, sans compromis sur la qualité ni sur les matériaux.",
  "clinic.medical-insurance.s1.p1":
    "Pour un plan sur mesure et des conseils sur le paiement, écrivez-nous simplement à info@dentalmedaustria.com.",

  "clinic.faqs.title": "Questions fréquentes",
  "clinic.faqs.eyebrow": "Des réponses utiles",
  "clinic.faqs.intro":
    "Les réponses aux questions que nous posent le plus souvent nos patients locaux et internationaux.",
  "clinic.faqs.s0.heading": "Où êtes-vous situés ?",
  "clinic.faqs.s0.p0":
    "Notre clinique est située Rruga Kristo Luarasi à Tirana, en Albanie, ouverte du lundi au samedi de 9:00 à 22:00.",
  "clinic.faqs.s1.heading": "Traitez-vous les patients internationaux ?",
  "clinic.faqs.s1.p0":
    "Oui. Nous accueillons des patients du monde entier et offrons un accompagnement complet en tourisme dentaire, incluant une aide pour les vols, le transfert depuis l'aéroport, des hôtels partenaires et la traduction en anglais, italien, allemand et français.",
  "clinic.faqs.s2.heading": "Quel suivi proposez-vous après le traitement ?",
  "clinic.faqs.s2.p0": "Chaque patient implantaire reçoit un passeport implantaire indiquant la marque de l'implant et des numéros de série vérifiables, et notre équipe reste disponible pour le suivi après votre traitement.",
  "clinic.faqs.s3.heading": "Quels standards suivez-vous ?",
  "clinic.faqs.s3.p0":
    "Notre clinique fonctionne selon les normes ISO 9001 et les protocoles d'hygiène européens, en utilisant une technologie de pointe et des matériaux premium de partenaires tels que Straumann, Ivoclar et Biodem.",
  "clinic.faqs.s4.heading": "Comment prendre rendez-vous ?",
  "clinic.faqs.s4.p0":
    "La prise de rendez-vous est simple - écrivez-nous à info@dentalmedaustria.com et notre équipe organisera votre consultation et répondra à toutes vos questions.",

  // ── Equipment categories ──
  "equipcat.imaging.label": "Imagerie et diagnostic 3D",
  "equipcat.imaging.blurb":
    "Imagerie 3D et panoramique à faible dose - la colonne vertébrale diagnostique d'une planification implantaire et chirurgicale précise.",
  "equipcat.cadcam.label": "Fraisage CAD/CAM",
  "equipcat.cadcam.blurb":
    "Fraisage 5 axes intégré qui façonne couronnes, bridges et armatures d'arcade complète avec une précision industrielle.",
  "equipcat.furnaces.label": "Fours à céramique et de frittage",
  "equipcat.furnaces.blurb":
    "Des fours de précision qui cuisent, pressent et frittent chaque restauration jusqu'à sa solidité et sa beauté finales.",
  "equipcat.guided-surgery.label": "Chirurgie implantaire guidée",
  "equipcat.guided-surgery.blurb":
    "Navigation en temps réel et moteurs chirurgicaux contrôlés pour une pose d'implant plus sûre et plus précise.",
  "equipcat.lab.label": "Micromoteurs de laboratoire",
  "equipcat.lab.blurb":
    "Des micromoteurs professionnels sans balais qui façonnent et finissent les restaurations à la main dans notre laboratoire intégré.",
  "equipcat.air-suction.label": "Compresseurs et aspiration",
  "equipcat.air-suction.blurb":
    "Air comprimé sans huile et aspiration centralisée - l'infrastructure propre et fiable derrière chaque fauteuil.",
  "equipcat.sterilization.label": "Stérilisation",
  "equipcat.sterilization.blurb":
    "Protocoles de stérilisation rigoureux selon les normes ISO 9001 et les standards d'hygiène européens, pour votre entière sécurité.",
  "equipcat.surgical-optics.label": "Lasers chirurgicaux et optiques",
  "equipcat.surgical-optics.blurb":
    "Lasers pour tissus mous et microscopes opératoires pour une précision minimalement invasive et fortement grossie.",
  "equipcat.operatory.label": "Salles de traitement",
  "equipcat.operatory.blurb":
    "Des units de traitement modernes et un éclairage conçus autour de votre confort et de la précision du praticien.",
  "equipcat.materials.label": "Matériaux premium et marques d'implants",
  "equipcat.materials.blurb":
    "Les marques européennes de confiance derrière vos implants, couronnes et greffes - une qualité sur laquelle vous pouvez compter.",
};

export const DICT: Record<Locale, Dict> = { en: EN, sq: SQ, it: IT, de: DE, fr: FR };

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "sq" || value === "it" || value === "de" || value === "fr";
}

/** Resolve a key for a locale, falling back to English, then the key itself. */
export function translate(locale: Locale, key: string): string {
  return DICT[locale]?.[key] ?? DICT.en[key] ?? key;
}
