export type Bio = {
  slug: string;
  name: string;
  role: string;
  image: string;
  credentials: string;
  paragraphs: string[];
};

export const DENTIST_BIOS: Bio[] = [];

export const HYGIENIST_BIOS: Bio[] = [];

export type Procedure = {
  slug: string;
  name: string;
  eyebrow: string;
  image: string;
  intro: string;
  body: string[];
  treatments: { title: string; text: string }[];
};

export const PROCEDURES: Procedure[] = [
  {
    slug: "dental-implants",
    name: "Dental Implants",
    eyebrow: "Restore & Replace",
    image: "/images/dma/before-after/full-mouth-rehabilitation.jpg",
    intro:
      "Our titanium dental implants deliver natural-looking, fully functional, and permanent results - the gold standard for replacing missing teeth. With more than 42,000 implants placed and a 98% success rate, you're in expert hands.",
    body: [
      "Every implant case begins with detailed digital diagnostics so that placement is precise, predictable, and as comfortable as possible. Our painless implant techniques and careful planning mean most patients are surprised by how gentle the experience is.",
      "For patients missing several or all of their teeth, our All-on-4 and All-on-6 full-arch solutions restore a complete, fixed smile on as few as four or six implants. Where bone has been lost over time, our dental bone regeneration procedures rebuild a solid foundation so an implant can be placed with confidence.",
    ],
    treatments: [
      { title: "Single Implants", text: "Permanent, natural-looking replacements for individual missing teeth." },
      { title: "All-on-4 / All-on-6", text: "A complete fixed arch supported by just four or six implants." },
      { title: "Painless Implants", text: "Gentle techniques and careful planning for a comfortable procedure." },
      { title: "Bone Regeneration", text: "Rebuilding lost bone to create a solid foundation for implants." },
    ],
  },
  {
    slug: "dental-crowns",
    name: "Dental Crowns",
    eyebrow: "Strength & Aesthetics",
    image: "/images/dma/before-after/crowns.jpg",
    intro:
      "Dental crowns restore broken, missing, or damaged teeth while improving both function and appearance. Each crown is crafted from premium materials by trusted partners such as Ivoclar.",
    body: [
      "A crown rebuilds a tooth that is too damaged for a simple filling, protecting what remains while restoring a natural shape, colour, and bite. We match every restoration to your surrounding teeth so the result blends seamlessly into your smile.",
      "From single zirconia and ceramic crowns to multi-tooth bridges and custom restorations, our laboratory work is built to last - crafted in our in-house lab to ISO 9001 and European quality standards.",
    ],
    treatments: [
      { title: "Zirconia Crowns", text: "Exceptionally strong, metal-free crowns with a lifelike finish." },
      { title: "Ceramic Crowns", text: "Beautifully natural restorations crafted from premium ceramic." },
      { title: "Bridges", text: "Fixed restorations that replace one or more missing teeth." },
      { title: "Custom Restorations", text: "Tailored solutions designed around your bite and smile." },
    ],
  },
  {
    slug: "dental-veneers",
    name: "Dental Veneers",
    eyebrow: "Design Your Smile",
    image: "/images/dma/before-after/veneers.jpg",
    intro:
      "Ceramic and composite veneers create a flawless, natural, Hollywood-level smile. Thin, custom shells transform the shape, colour, and harmony of your teeth with minimal intervention.",
    body: [
      "Veneers are one of the most powerful tools in cosmetic dentistry, correcting discolouration, chips, gaps, and uneven shapes in a single transformation. Ceramic veneers offer the most durable, light-reflective finish, while composite veneers provide a more affordable, same-visit option.",
      "Every smile makeover begins with a detailed smile design consultation, so you can see and shape your final result before treatment begins. Combined with professional teeth whitening, the outcome is a smile that looks natural and unmistakably yours.",
    ],
    treatments: [
      { title: "Ceramic Veneers", text: "Hand-crafted shells for a durable, light-reflective finish." },
      { title: "Composite Veneers", text: "An affordable, same-visit option for a refreshed smile." },
      { title: "Smile Design", text: "A bespoke plan that previews your result before treatment." },
      { title: "Teeth Whitening", text: "Safe, professional whitening for a brighter smile." },
    ],
  },
  {
    slug: "dental-prostheses",
    name: "Dental Prostheses",
    eyebrow: "Function & Comfort",
    image: "/images/dma/before-after/full-mouth-rehabilation-all-on-6.jpg",
    intro:
      "Custom dental prostheses restore missing or damaged teeth for function, comfort, and a harmonious smile. Every prosthesis is designed and fitted to feel natural and look beautiful.",
    body: [
      "Whether you need to replace a few teeth or rehabilitate an entire mouth, our prostheses are crafted to restore confident chewing, clear speech, and a balanced facial appearance. We take the time to perfect the fit so your prosthesis feels secure and comfortable every day.",
      "Our solutions range from fixed and removable prostheses to custom dentures and full-mouth rehabilitation, often combined with implants for added stability. Each plan is personalised, predictable, and fully documented, with follow-up support after your fitting.",
    ],
    treatments: [
      { title: "Fixed Prostheses", text: "Permanently secured restorations for a stable, natural feel." },
      { title: "Removable Prostheses", text: "Comfortable, custom-fitted options that are easy to maintain." },
      { title: "Custom Dentures", text: "Modern dentures designed for comfort and a natural look." },
      { title: "Full-Mouth Rehabilitation", text: "Comprehensive restoration of function and aesthetics." },
    ],
  },
  {
    slug: "orthodontics",
    name: "Orthodontics",
    eyebrow: "Straighten With Confidence",
    image: "/images/dma/before-after/bfa14.jpg",
    intro:
      "Our specialised orthodontic treatment corrects teeth and jaw alignment with traditional braces and Invisalign clear aligners. Delivered by our experienced orthodontic team, every plan is tailored to your smile.",
    body: [
      "Straight teeth aren't only beautiful - they're healthier and easier to keep clean. We carefully plan each case to guide your teeth and jaw into balanced, lasting alignment, with options to suit every age and lifestyle.",
      "Choose discreet, removable Invisalign clear aligners for everyday confidence, or reliable traditional braces for more complex movements. With early intervention for younger patients and retainers to protect your result, your new alignment is built to last.",
    ],
    treatments: [
      { title: "Traditional Braces", text: "Reliable, precise correction for a wide range of cases." },
      { title: "Invisalign", text: "Virtually invisible, removable aligners for everyday confidence." },
      { title: "Early Intervention", text: "Guiding young smiles for the best long-term outcome." },
      { title: "Retainers", text: "Protecting your beautiful new alignment for the long term." },
    ],
  },
];

export type ClinicPage = {
  slug: string;
  title: string;
  eyebrow: string;
  image: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const CLINIC_PAGES: ClinicPage[] = [
  {
    slug: "our-story",
    title: "Our Story",
    eyebrow: "About Dental Med Austria",
    image: "/images/dma/interiors/reception-wide.jpg",
    intro:
      "Since 2009, Dental Med Austria has brought premium-quality dental care to Tirana - a clinic where rigorous European standards meet warm, patient-focused care.",
    sections: [
      {
        heading: "Founded on Premium Standards",
        paragraphs: [
          "Dental Med Austria was founded in 2009 and, from the very first day, was built around precise, evidence-based premium quality standards.",
          "More than a decade later, the clinic is recognised as one of Albania's leading dental practices, trusted by over 24,000 happy patients from Albania and around the world.",
        ],
      },
      {
        heading: "Quality You Can Trust",
        paragraphs: [
          "Our work is carried out to ISO 9001 standards and European hygiene protocols, using advanced technology and high-quality materials at every step.",
          "We stand behind our results with full treatment documentation - including an implant passport with verifiable serial numbers for implant patients - and dedicated aftercare support, so you can choose us with complete confidence.",
        ],
      },
    ],
  },
  {
    slug: "our-clinic",
    title: "Our Clinic",
    eyebrow: "A Modern Facility",
    image: "/images/dma/interiors/reception-led-wall.jpg",
    intro:
      "Our modern, patient-focused clinic in the heart of Tirana combines advanced technology, premium materials, and a calm, comfortable environment.",
    sections: [
      {
        heading: "Advanced Technology, Premium Materials",
        paragraphs: [
          "Every treatment is delivered using advanced dental technology and high-quality materials, ensuring safe, predictable, and lasting outcomes.",
          "We work exclusively with premium partners trusted across Europe - Straumann, Ivoclar, Biodem, and Botiss - so the components and restorations in your mouth are the very best available.",
        ],
      },
      {
        heading: "Comfortable & Patient-Focused",
        paragraphs: [
          "From your first consultation to your final result, every detail of our clinic is designed around your comfort. Our experienced professionals undertake continuous training to stay at the forefront of modern dentistry.",
          "Each patient receives a personalised treatment plan built around their goals, delivered in a calm, welcoming environment that meets ISO 9001 and European hygiene standards.",
        ],
      },
    ],
  },
  {
    slug: "dental-tourism",
    title: "Dental Tourism",
    eyebrow: "Care & Travel Combined",
    image: "/images/dma/tourism.jpg",
    intro:
      "Albania is a leading destination for dental tourism, combining breathtaking sights with world-class, affordable dental care. We make the whole journey effortless.",
    sections: [
      {
        heading: "Everything Arranged For You",
        paragraphs: [
          "We help arrange affordable flights to Tirana, and our team will meet you at Tirana Airport for a warm welcome and airport pickup.",
          "You'll stay in partner hotels offering modern comforts and free WiFi, and our team provides translation in English, Italian, German, and French throughout your stay.",
        ],
      },
      {
        heading: "Your Treatment Journey",
        paragraphs: [
          "1. Initial Consultation - we discuss your concerns and goals and build a personalised plan.",
          "2. Treatment by Experts - your care is carried out by our experienced clinical team using premium materials.",
          "3. Follow-Up Care - we stay in touch after you return home to make sure your results last.",
        ],
      },
    ],
  },
  {
    slug: "medical-insurance",
    title: "Medical Insurance",
    eyebrow: "Flexible & Supported",
    image: "/images/dma/interiors/reception-desk.jpg",
    intro:
      "We work to make high-quality dental care as accessible as possible, with flexible payment options and assistance with insurance claims.",
    sections: [
      {
        heading: "Working With Your Insurance",
        paragraphs: [
          "Our team is happy to assist with medical insurance claims and provide the documentation you need to seek reimbursement from your provider.",
          "If you're unsure whether your plan covers treatment abroad, get in touch and we'll help you understand your options before you travel.",
        ],
      },
      {
        heading: "Flexible Payment Options",
        paragraphs: [
          "We offer flexible payment options designed to make your treatment plan manageable, without compromising on quality or materials.",
          "For a personalised treatment plan and guidance on payment, simply email us at info@dentalmedaustria.com.",
        ],
      },
    ],
  },
  {
    slug: "faqs",
    title: "FAQs",
    eyebrow: "Helpful Answers",
    image: "/images/dma/interiors/sterilization-room.jpg",
    intro:
      "Answers to the questions we're asked most often by local and international patients.",
    sections: [
      {
        heading: "Where are you located?",
        paragraphs: [
          "Our clinic is located at Rruga Kristo Luarasi in Tiranë, Albania, open Monday to Saturday from 9:00 to 22:00.",
        ],
      },
      {
        heading: "Do you treat international patients?",
        paragraphs: [
          "Yes. We welcome patients from around the world and provide full dental-tourism support, including help with flights, airport pickup, partner hotels, and translation in English, Italian, German, French, and Albanian.",
        ],
      },
      {
        heading: "How do you stand behind your treatment?",
        paragraphs: [
          "Every treatment is fully documented - implant patients receive an implant passport with verifiable serial numbers - and our team stays in touch with aftercare and follow-up support after you return home.",
        ],
      },
      {
        heading: "What standards do you follow?",
        paragraphs: [
          "Our clinic operates to ISO 9001 standards and European hygiene protocols, using advanced technology and premium materials from partners such as Straumann, Ivoclar, Biodem, and Botiss.",
        ],
      },
      {
        heading: "How do I book an appointment?",
        paragraphs: [
          "Booking is simple - email us at info@dentalmedaustria.com and our team will arrange your consultation and answer any questions.",
        ],
      },
    ],
  },
];
