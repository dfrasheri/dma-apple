import type { Locale } from "@/lib/dictionaries";

/**
 * Full Privacy & Cookie Policy, professionally translated for every locale the
 * site serves (EN, SQ, IT, DE, FR). The Albanian text is the legal source; the
 * other languages are faithful professional translations of it.
 *
 * Identity/contact details are aligned to this site: the data controller is
 * named as "Dental Med Austria" (no individual's name), with the site's
 * official seat (Rruga Kristo Luarasi, Tirana), site www.dentalmedaustria.al
 * and contact info@dentalmedaustria.com. If the controller name, seat or
 * contact email change, update them here (per locale) - this module is the
 * single source of truth for the page's body copy.
 */

export type PrivacyBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] };

export type PrivacySection = {
  heading: string;
  blocks: PrivacyBlock[];
};

export type PrivacyContent = {
  eyebrow: string;
  title: string;
  updated: string;
  /** Opening notes, controller statement, form intro and the numbered contents. */
  intro: PrivacyBlock[];
  sections: PrivacySection[];
};

const EN: PrivacyContent = {
  eyebrow: "Data protection",
  title: "Privacy Policy",
  updated: "Last updated: 11 July 2026",
  intro: [
    {
      kind: "p",
      text:
        "First note: Before you read our Privacy and Cookie Policy, Dental Med Austria wishes to explain and assure all of its visitors that our privacy practices, the collection and management of your personal data, as well as the use of third-party applications for the various data-collection processes, are in full compliance with the General Data Protection Regulation (GDPR) and also in full compliance with Albanian Law No. 9887, dated 10 March 2008, “On the protection of personal data”.",
    },
    {
      kind: "p",
      text:
        "The GDPR was enacted by the European Union on 25 May 2018 to protect the personal data of EU and EEA citizens, and it also sets out the rules that companies must follow when transferring the personal data of EU and EEA citizens outside these two areas.",
    },
    {
      kind: "p",
      text:
        "Second note: The registered seat of Dental Med Austria is located at Rruga Kristo Luarasi, Tirana, Albania. Dental Med Austria protects the privacy and personal data of individuals under Albanian Law No. 9887, dated 10 March 2008, “On the protection of personal data”, and in full compliance with the GDPR.",
    },
    {
      kind: "p",
      text:
        "OUR PRIVACY AND COOKIE POLICIES ARE FULLY DEDICATED TO PROTECTING YOUR PERSONAL DATA. Dental Med Austria acts as the “Controller” of the personal data that users provide to us. We collect, manage and store your data in full compliance with the GDPR and Albanian Law No. 9887, dated 10 March 2008, “On the protection of personal data”.",
    },
    {
      kind: "p",
      text:
        "The website www.dentalmedaustria.al wishes to inform its visitors that on this website they may be asked to complete various contact forms. These forms ask users to provide personal data such as name, telephone number, email, country of residence, etc.",
    },
    {
      kind: "p",
      text: "In this privacy policy you will be fully informed about the following topics:",
    },
    {
      kind: "list",
      items: [
        "All categories of personal data that Dental Med Austria collects",
        "What cookies are and how Dental Med Austria collects them",
        "Who processes personal data at Dental Med Austria",
        "The legal basis on which Dental Med Austria collects users' data",
        "The purposes for which we collect your personal data",
        "How long Dental Med Austria keeps your personal data",
        "Whether Dental Med Austria transfers your data internationally",
        "The third parties with which Dental Med Austria shares data",
        "Your rights over the personal data held by Dental Med Austria",
        "How you will be informed when Dental Med Austria changes its privacy policy",
      ],
    },
  ],
  sections: [
    {
      heading:
        "1. The categories of personal data collected, managed and stored by Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text: "Dental Med Austria collects the personal data of its users through the following channels:",
        },
        {
          kind: "p",
          text:
            "Website. The Dental Med Austria website, known as “dentalmedaustria.al” and “www.dentalmedaustria.al”, collects personal data from its visitors in the following ways:",
        },
        {
          kind: "list",
          items: [
            "Cookies, small text files stored on your computer when you visit our website.",
            "The personal data you provide voluntarily through the booking form (found on the Contact page), through WhatsApp chat, and through our official telephone number and email.",
            "Google Analytics, Dental Med Austria has installed and uses Google Analytics to obtain general information about its overall website audience, such as country of residence, average age, interests, etc.",
          ],
        },
        {
          kind: "p",
          text:
            "Social media. Dental Med Austria uses Facebook, Messenger, WhatsApp and Instagram (personal and company pages) to communicate directly with individuals who show interest in our services and to promote its products and services.",
        },
        {
          kind: "p",
          text:
            "The personal data that individuals provide through these online communication channels is collected, stored and protected ONLY by Dental Med Austria, securely, in our private database, and may be used in the future for marketing purposes (email marketing via newsletters (Mailchimp), Facebook marketing and direct email marketing via Gmail).",
        },
        {
          kind: "p",
          text:
            "What type of personal data do we collect from users? We collect your first name, last name, email address, telephone number and home address, where you have voluntarily provided this personal data to help us offer you better and faster services.",
        },
      ],
    },
    {
      heading: "2. What cookies are and how Dental Med Austria collects them",
      blocks: [
        {
          kind: "p",
          text:
            "Cookies are small text files stored on your computer when you visit our website. Cookies record your actions on our website and remember your choices when you revisit it in the future.",
        },
        {
          kind: "p",
          text:
            "For example, if you visit our website and choose to read the Albanian-language version, this action is recorded by your browser (Google Chrome, Firefox, Edge, Safari or others). Your browser remembers this action, and when you revisit our website you are taken directly to the Albanian-language version.",
        },
      ],
    },
    {
      heading: "3. Who processes personal data at Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria collects, manages and stores your personal data in full compliance with Albanian Law No. 9887, dated 10 March 2008, “On the protection of personal data”, and with the GDPR.",
        },
        {
          kind: "p",
          text:
            "The only entity responsible for collecting the personal data that users provide in the booking form on “dentalmedaustria.al” is Dental Med Austria. The booking form was built from scratch by our webmaster, and all information submitted through the form is recorded directly in our private database within our website.",
        },
        {
          kind: "p",
          text:
            "We may also collect your personal data through third-party applications such as Google Analytics, Gmail and WhatsApp. You can read Google's Privacy Policy at https://policies.google.com/privacy and WhatsApp's at https://www.whatsapp.com/legal/privacy-policy.",
        },
        {
          kind: "p",
          text:
            "All personal data collected through our website is processed and used only by Dental Med Austria and by none of its third-party applications.",
        },
      ],
    },
    {
      heading: "4. The legal basis on which Dental Med Austria collects users' data",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria collects, manages and stores your personal data in full compliance with Albanian Law No. 9887, dated 10 March 2008, “On the protection of personal data”, and with the GDPR.",
        },
      ],
    },
    {
      heading: "5. The purposes for which we collect your personal data",
      blocks: [
        { kind: "p", text: "We collect your personal data in order to:" },
        {
          kind: "list",
          items: [
            "provide you with a better website experience;",
            "register you as a potential patient in our database;",
            "add you to our email database so we can send you future newsletters about our offers, discounts, new products or services, etc.;",
            "contact you directly by email or telephone while you are receiving services at our clinic.",
          ],
        },
      ],
    },
    {
      heading: "6. How long Dental Med Austria keeps your personal data",
      blocks: [
        {
          kind: "p",
          text:
            "We may retain your personal data for an indefinite period, and we will immediately remove all of your personal data if you no longer wish Dental Med Austria to use it.",
        },
      ],
    },
    {
      heading: "7. Does Dental Med Austria transfer your data internationally?",
      blocks: [
        {
          kind: "p",
          text:
            "Never. Using, transferring or modifying the personal data of “dentalmedaustria.al” users, or of our social-media followers, for any purpose other than those stated in topic 5 (five) above is strictly prohibited.",
        },
        {
          kind: "p",
          text:
            "Please read topic 5 to understand why and when Dental Med Austria uses your personal data (first name, last name, email, telephone number, etc.).",
        },
      ],
    },
    {
      heading: "8. The third parties with which Dental Med Austria shares data",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria does not share the personal data of its website users or social-media followers with any third party. We use Google Analytics, Gmail and WhatsApp as third-party applications that are committed to guaranteeing the privacy and protection of your personal data.",
        },
        {
          kind: "p",
          text:
            "Dental Med Austria is not responsible for personal data that these third-party applications may collect lawfully or unlawfully.",
        },
        {
          kind: "p",
          text:
            "You can read Google's Privacy Policy at https://policies.google.com/privacy and WhatsApp's at https://www.whatsapp.com/legal/privacy-policy.",
        },
      ],
    },
    {
      heading: "9. Your rights over the personal data held by Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Website users who have provided personal information through any of the contact channels on “dentalmedaustria.al” have the right to request the modification or deletion of their personal data from our website and databases.",
        },
      ],
    },
    {
      heading:
        "10. How you will be informed when Dental Med Austria changes its privacy policy",
      blocks: [
        {
          kind: "p",
          text:
            "If and when Dental Med Austria changes its privacy policy or terms of service, you will be notified by a disclaimer at the top or bottom of the website. You will be asked to read our new Privacy Policy carefully and to accept it if you consider it reasonable.",
        },
        {
          kind: "p",
          text:
            "For any suggestion that would help us improve our Privacy Policy, please contact us at info@dentalmedaustria.com.",
        },
      ],
    },
  ],
};

const SQ: PrivacyContent = {
  eyebrow: "Mbrojtja e të dhënave",
  title: "Politika e Privatësisë",
  updated: "Përditësuar së fundmi: 11 korrik 2026",
  intro: [
    {
      kind: "p",
      text:
        "Shënimi i parë: Përpara se të lexoni Politikat tona të Privatësisë dhe të Cookies, Dental Med Austria dëshiron të sqarojë dhe të sigurojë të gjithë vizitorët e saj se politikat tona të privatësisë, mbledhja dhe menaxhimi i të dhënave tuaja personale, si dhe përdorimi i aplikacioneve të palëve të treta për procese të ndryshme të mbledhjes së të dhënave, janë në përputhje të plotë me Rregulloren e Përgjithshme të Mbrojtjes së të Dhënave (GDPR) dhe gjithashtu në përputhje të plotë me ligjin shqiptar nr. 9887, datë 10.03.2008 “Për mbrojtjen e të dhënave personale”.",
    },
    {
      kind: "p",
      text:
        "GDPR u zbatua nga Bashkimi Evropian më 25 maj 2018 për mbrojtjen e të dhënave personale të qytetarëve të BE-së dhe ZEE-së, dhe gjithashtu përcakton rregullat që kompanitë duhet të ndjekin për transferimin e të dhënave personale të qytetarëve të BE-së dhe ZEE-së jashtë këtyre dy zonave.",
    },
    {
      kind: "p",
      text:
        "Shënimi i dytë: Selia e Dental Med Austria ndodhet në Rruga Kristo Luarasi, Tiranë, Shqipëri. Dental Med Austria mbron privatësinë dhe të dhënat personale të individëve sipas ligjit shqiptar nr. 9887, datë 10.03.2008 “Për mbrojtjen e të dhënave personale” dhe në përputhje të plotë me GDPR.",
    },
    {
      kind: "p",
      text:
        "POLITIKAT TONA TË PRIVATËSISË DHE TË COOKIES JANË PLOTËSISHT TË DEDIKUARA PËR MBROJTJEN E TË DHËNAVE TUAJA PERSONALE. Dental Med Austria njihet si “Kontrolluesi” i të dhënave personale që përdoruesit na ofrojnë. Ne mbledhim, menaxhojmë dhe ruajmë të dhënat tuaja në përputhje të plotë me GDPR dhe ligjin shqiptar nr. 9887, datë 10.03.2008 “Për mbrojtjen e të dhënave personale”.",
    },
    {
      kind: "p",
      text:
        "Faqja e internetit www.dentalmedaustria.al dëshiron të informojë vizitorët e saj se në këtë faqe mund t'u kërkohet të plotësojnë forma të ndryshme kontakti. Këto formularë kërkojnë që përdoruesit të japin të dhëna personale si emri, numri i telefonit, emaili, vendi i banimit, etj.",
    },
    {
      kind: "p",
      text: "Në këtë politikë të privatësisë do të informoheni plotësisht për temat e mëposhtme:",
    },
    {
      kind: "list",
      items: [
        "Të gjitha llojet e të dhënave personale që mbledh Dental Med Austria",
        "Çfarë janë cookies dhe si i mbledh ato Dental Med Austria",
        "Kush i përpunon të dhënat personale në Dental Med Austria",
        "Cila bazë ligjore i lejon Dental Med Austria të mbledhë të dhënat e përdoruesit",
        "Cilat janë qëllimet e mbledhjes së të dhënave tuaja personale",
        "Sa kohë i ruan Dental Med Austria të dhënat tuaja personale",
        "Nëse Dental Med Austria i transferon të dhënat tuaja ndërkombëtarisht",
        "Me çfarë palësh të treta i ndan të dhënat Dental Med Austria",
        "Të drejtat tuaja mbi të dhënat personale të zotëruara nga Dental Med Austria",
        "Si do të informoheni kur Dental Med Austria të ndryshojë politikat e saj të privatësisë",
      ],
    },
  ],
  sections: [
    {
      heading:
        "1. Të gjitha llojet e të dhënave personale të mbledhura, menaxhuara dhe ruajtura nga Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text: "Dental Med Austria mbledh të dhënat personale të përdoruesve të saj nëpërmjet këtyre kanaleve:",
        },
        {
          kind: "p",
          text:
            "Faqja e internetit. Faqja e internetit e Dental Med Austria, e njohur si “dentalmedaustria.al” dhe “www.dentalmedaustria.al”, mbledh të dhëna personale nga vizitorët e saj në mënyrat e mëposhtme:",
        },
        {
          kind: "list",
          items: [
            "Cookies, skedarë të vegjël teksti që ruhen në kompjuterin tuaj kur vizitoni faqen tonë të internetit.",
            "Të dhënat personale që jepni vullnetarisht përmes Formularit të Rezervimit (i gjendet në faqen e Kontaktit), përmes bisedës në WhatsApp dhe gjithashtu përmes numrit tonë zyrtar të telefonit dhe emailit.",
            "Google Analytics, Dental Med Austria ka instaluar dhe përdor Google Analytics për të marrë informacione të përgjithshme nga totali i vizitorëve të faqes, si vendi i banimit, mosha mesatare, interesat, etj.",
          ],
        },
        {
          kind: "p",
          text:
            "Mediat sociale. Dental Med Austria përdor Facebook, Messenger, WhatsApp dhe Instagram (faqe personale dhe të kompanisë) për të komunikuar drejtpërdrejt me individët që tregojnë interes për shërbimet tona dhe për të promovuar produktet/shërbimet e saj.",
        },
        {
          kind: "p",
          text:
            "Të dhënat personale që individët na ofrojnë nëpërmjet këtyre kanaleve të komunikimit online mblidhen, ruhen dhe mbrohen VETËM nga Dental Med Austria, në mënyrë të sigurt, në bazën tonë të të dhënave private, dhe mund të përdoren në të ardhmen për qëllime marketingu (marketing me email përmes Newsletters (Mailchimp), marketing në Facebook dhe marketing direkt me email përmes Gmail).",
        },
        {
          kind: "p",
          text:
            "Çfarë lloji të dhënash personale mbledhim nga përdoruesit? Ne mbledhim emrin, mbiemrin, adresën e emailit, numrin e telefonit dhe adresën tuaj të banimit, nëse i keni dhënë vullnetarisht këto të dhëna personale për të na ndihmuar t'ju ofrojmë shërbime më të mira dhe më të shpejta.",
        },
      ],
    },
    {
      heading: "2. Çfarë janë cookies dhe si i mbledh ato Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Cookies janë skedarë të vegjël teksti që ruhen në kompjuterin tuaj kur vizitoni faqen tonë të internetit. Cookies regjistrojnë veprimet tuaja në faqen tonë dhe kujtojnë zgjedhjet tuaja kur ta rivizitoni atë në të ardhmen.",
        },
        {
          kind: "p",
          text:
            "Për shembull, nëse vizitoni faqen tonë dhe zgjidhni të lexoni versionin në gjuhën shqipe, ky veprim regjistrohet nga shfletuesi juaj (Google Chrome, Firefox, Edge, Safari ose të tjerë). Shfletuesi juaj e mban mend këtë veprim dhe, kur ta rivizitoni faqen tonë, do të ridrejtoheni menjëherë në versionin në gjuhën shqipe.",
        },
      ],
    },
    {
      heading: "3. Kush i përpunon të dhënat personale në Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria mbledh, menaxhon dhe ruan të dhënat tuaja personale në përputhje të plotë me ligjin shqiptar nr. 9887, datë 10.03.2008 “Për mbrojtjen e të dhënave personale” dhe me GDPR.",
        },
        {
          kind: "p",
          text:
            "Subjekti i vetëm përgjegjës për mbledhjen e të dhënave personale që përdoruesit ofrojnë në formularin e rezervimit të “dentalmedaustria.al” është Dental Med Austria. Formulari i rezervimit është krijuar nga e para nga masteri ynë i uebit dhe i gjithë informacioni i dhënë përmes tij regjistrohet drejtpërdrejt në bazën tonë të të dhënave private brenda faqes.",
        },
        {
          kind: "p",
          text:
            "Ne gjithashtu mund t'i mbledhim të dhënat tuaja personale përmes aplikacioneve të palëve të treta si Google Analytics, Gmail dhe WhatsApp. Politikën e Privatësisë së Google mund ta lexoni në https://policies.google.com/privacy dhe atë të WhatsApp në https://www.whatsapp.com/legal/privacy-policy.",
        },
        {
          kind: "p",
          text:
            "Të gjitha të dhënat personale të mbledhura nga faqja jonë përpunohen dhe përdoren vetëm nga Dental Med Austria dhe nga asnjë prej aplikacioneve të saj të palëve të treta.",
        },
      ],
    },
    {
      heading: "4. Cila bazë ligjore i lejon Dental Med Austria të mbledhë të dhënat e përdoruesit",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria mbledh, menaxhon dhe ruan të dhënat tuaja personale në përputhje të plotë me ligjin shqiptar nr. 9887, datë 10.03.2008 “Për mbrojtjen e të dhënave personale” dhe me GDPR.",
        },
      ],
    },
    {
      heading: "5. Cilat janë qëllimet e mbledhjes së të dhënave tuaja personale",
      blocks: [
        { kind: "p", text: "Ne i mbledhim të dhënat tuaja personale me qëllim që:" },
        {
          kind: "list",
          items: [
            "t'ju ofrojmë një përvojë më të mirë në faqen tonë të internetit;",
            "t'ju regjistrojmë si pacient potencial në bazën tonë të të dhënave;",
            "t'ju shtojmë në bazën tonë të të dhënave të emailit për t'ju dërguar buletinet e ardhshme në lidhje me ofertat, zbritjet, produktet ose shërbimet tona të reja, etj.;",
            "t'ju kontaktojmë drejtpërdrejt me email ose telefon gjatë kohës që po merrni shërbime në klinikën tonë.",
          ],
        },
      ],
    },
    {
      heading: "6. Sa kohë i ruan Dental Med Austria të dhënat tuaja personale",
      blocks: [
        {
          kind: "p",
          text:
            "Ne mund t'i ruajmë të dhënat tuaja personale për një periudhë të papërcaktuar kohore dhe do t'i heqim menjëherë të gjitha të dhënat tuaja personale nëse nuk dëshironi që Dental Med Austria t'i përdorë ato.",
        },
      ],
    },
    {
      heading: "7. A i transferon Dental Med Austria të dhënat tuaja ndërkombëtarisht?",
      blocks: [
        {
          kind: "p",
          text:
            "Kurrë. Ndalohet rreptësisht përdorimi, transferimi ose modifikimi i të dhënave personale të përdoruesve të “dentalmedaustria.al” ose i ndjekësve të mediave sociale për qëllime të tjera, përveç atyre të përmendura në temën numër 5 (pesë) më sipër.",
        },
        {
          kind: "p",
          text:
            "Ju lutemi lexoni temën 5 për t'u informuar se pse dhe kur Dental Med Austria i përdor të dhënat tuaja personale (emri, mbiemri, emaili, numri i telefonit, etj.).",
        },
      ],
    },
    {
      heading: "8. Me çfarë palësh të treta i ndan të dhënat Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria nuk i ndan të dhënat personale të përdoruesve të faqes së saj ose të ndjekësve të mediave sociale me asnjë palë të tretë. Ne përdorim Google Analytics, Gmail dhe WhatsApp si aplikacione të palëve të treta të cilat janë të përkushtuara për të garantuar privatësinë dhe mbrojtjen e të dhënave tuaja personale.",
        },
        {
          kind: "p",
          text:
            "Dental Med Austria nuk është përgjegjëse për të dhënat personale që këto aplikacione të palëve të treta mund të mbledhin ligjërisht ose paligjshëm.",
        },
        {
          kind: "p",
          text:
            "Politikën e Privatësisë së Google mund ta lexoni në https://policies.google.com/privacy dhe atë të WhatsApp në https://www.whatsapp.com/legal/privacy-policy.",
        },
      ],
    },
    {
      heading: "9. Të drejtat tuaja mbi të dhënat personale të zotëruara nga Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Përdoruesit e faqes që kanë dhënë informacion personal përmes cilitdo prej kanaleve të kontaktit që gjenden në “dentalmedaustria.al” kanë të drejtë të kërkojnë modifikimin ose fshirjen e të dhënave të tyre personale nga faqja dhe bazat tona të të dhënave.",
        },
      ],
    },
    {
      heading:
        "10. Si do të informoheni kur Dental Med Austria të ndryshojë politikat e saj të privatësisë",
      blocks: [
        {
          kind: "p",
          text:
            "Nëse dhe kur Dental Med Austria ndryshon politikën e saj të privatësisë ose kushtet e shërbimit, do të njoftoheni me një shënim në krye ose në fund të faqes së internetit. Do t'ju kërkohet të lexoni me kujdes Politikat tona të reja të Privatësisë dhe t'i pranoni ato nëse i shihni të arsyeshme.",
        },
        {
          kind: "p",
          text:
            "Për çdo sugjerim që do të na ndihmonte të përmirësojmë Politikat tona të Privatësisë, ju lutemi na kontaktoni në info@dentalmedaustria.com.",
        },
      ],
    },
  ],
};

const IT: PrivacyContent = {
  eyebrow: "Protezione dei dati",
  title: "Informativa sulla Privacy",
  updated: "Ultimo aggiornamento: 11 luglio 2026",
  intro: [
    {
      kind: "p",
      text:
        "Prima nota: Prima di leggere la nostra Informativa sulla Privacy e sui Cookie, Dental Med Austria desidera chiarire e assicurare a tutti i suoi visitatori che le nostre pratiche in materia di privacy, la raccolta e la gestione dei vostri dati personali, nonché l'utilizzo di applicazioni di terze parti per i diversi processi di raccolta dei dati, sono pienamente conformi al Regolamento Generale sulla Protezione dei Dati (GDPR) e altresì pienamente conformi alla legge albanese n. 9887 del 10.03.2008 “Sulla protezione dei dati personali”.",
    },
    {
      kind: "p",
      text:
        "Il GDPR è stato adottato dall'Unione Europea il 25 maggio 2018 per proteggere i dati personali dei cittadini dell'UE e dello SEE e stabilisce inoltre le regole che le aziende devono seguire per il trasferimento dei dati personali dei cittadini dell'UE e dello SEE al di fuori di queste due aree.",
    },
    {
      kind: "p",
      text:
        "Seconda nota: La sede legale di Dental Med Austria si trova a Rruga Kristo Luarasi, Tirana, Albania. Dental Med Austria tutela la riservatezza e i dati personali delle persone ai sensi della legge albanese n. 9887 del 10.03.2008 “Sulla protezione dei dati personali” e in piena conformità con il GDPR.",
    },
    {
      kind: "p",
      text:
        "LE NOSTRE INFORMATIVE SULLA PRIVACY E SUI COOKIE SONO INTERAMENTE DEDICATE ALLA PROTEZIONE DEI VOSTRI DATI PERSONALI. Dental Med Austria agisce come “Titolare del trattamento” dei dati personali che gli utenti ci forniscono. Raccogliamo, gestiamo e conserviamo i vostri dati in piena conformità con il GDPR e con la legge albanese n. 9887 del 10.03.2008 “Sulla protezione dei dati personali”.",
    },
    {
      kind: "p",
      text:
        "Il sito web www.dentalmedaustria.al desidera informare i suoi visitatori che su questo sito potrebbe essere richiesto di compilare diversi moduli di contatto. Tali moduli chiedono agli utenti di fornire dati personali quali nome, numero di telefono, email, paese di residenza, ecc.",
    },
    {
      kind: "p",
      text: "In questa informativa sulla privacy sarete pienamente informati sui seguenti argomenti:",
    },
    {
      kind: "list",
      items: [
        "Tutte le categorie di dati personali raccolti da Dental Med Austria",
        "Cosa sono i cookie e come Dental Med Austria li raccoglie",
        "Chi tratta i dati personali presso Dental Med Austria",
        "Su quale base giuridica Dental Med Austria raccoglie i dati degli utenti",
        "Quali sono le finalità della raccolta dei vostri dati personali",
        "Per quanto tempo Dental Med Austria conserva i vostri dati personali",
        "Se Dental Med Austria trasferisce i vostri dati a livello internazionale",
        "Con quali terze parti Dental Med Austria condivide i dati",
        "I vostri diritti sui dati personali detenuti da Dental Med Austria",
        "Come sarete informati quando Dental Med Austria modifica la sua informativa sulla privacy",
      ],
    },
  ],
  sections: [
    {
      heading:
        "1. Le categorie di dati personali raccolti, gestiti e conservati da Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text: "Dental Med Austria raccoglie i dati personali dei suoi utenti attraverso i seguenti canali:",
        },
        {
          kind: "p",
          text:
            "Sito web. Il sito web di Dental Med Austria, noto come “dentalmedaustria.al” e “www.dentalmedaustria.al”, raccoglie i dati personali dei suoi visitatori nei seguenti modi:",
        },
        {
          kind: "list",
          items: [
            "Cookie, piccoli file di testo memorizzati sul vostro computer quando visitate il nostro sito web.",
            "I dati personali che fornite volontariamente tramite il Modulo di Prenotazione (presente nella pagina Contatti), tramite la chat di WhatsApp e tramite il nostro numero di telefono e la nostra email ufficiali.",
            "Google Analytics, Dental Med Austria ha installato e utilizza Google Analytics per ottenere informazioni generali sul totale dei visitatori del sito, quali il paese di residenza, l'età media, gli interessi, ecc.",
          ],
        },
        {
          kind: "p",
          text:
            "Social media. Dental Med Austria utilizza Facebook, Messenger, WhatsApp e Instagram (pagine personali e aziendali) per comunicare direttamente con le persone che mostrano interesse per i nostri servizi e per promuovere i suoi prodotti e servizi.",
        },
        {
          kind: "p",
          text:
            "I dati personali che le persone ci forniscono tramite questi canali di comunicazione online vengono raccolti, conservati e protetti ESCLUSIVAMENTE da Dental Med Austria, in modo sicuro, nel nostro database privato, e potranno essere utilizzati in futuro per finalità di marketing (email marketing tramite Newsletter (Mailchimp), marketing su Facebook e email marketing diretto tramite Gmail).",
        },
        {
          kind: "p",
          text:
            "Quale tipo di dati personali raccogliamo dagli utenti? Raccogliamo il vostro nome, cognome, indirizzo email, numero di telefono e indirizzo di residenza, qualora abbiate fornito volontariamente questi dati personali per aiutarci a offrirvi servizi migliori e più rapidi.",
        },
      ],
    },
    {
      heading: "2. Cosa sono i cookie e come Dental Med Austria li raccoglie",
      blocks: [
        {
          kind: "p",
          text:
            "I cookie sono piccoli file di testo memorizzati sul vostro computer quando visitate il nostro sito web. I cookie registrano le vostre azioni sul nostro sito e ricordano le vostre scelte quando lo visitate nuovamente in futuro.",
        },
        {
          kind: "p",
          text:
            "Ad esempio, se visitate il nostro sito e scegliete di leggere la versione in lingua albanese, questa azione viene registrata dal vostro browser (Google Chrome, Firefox, Edge, Safari o altri). Il vostro browser ricorda questa azione e, quando visiterete nuovamente il nostro sito, sarete indirizzati direttamente alla versione in lingua albanese.",
        },
      ],
    },
    {
      heading: "3. Chi tratta i dati personali presso Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria raccoglie, gestisce e conserva i vostri dati personali in piena conformità con la legge albanese n. 9887 del 10.03.2008 “Sulla protezione dei dati personali” e con il GDPR.",
        },
        {
          kind: "p",
          text:
            "L'unico soggetto responsabile della raccolta dei dati personali che gli utenti forniscono nel modulo di prenotazione di “dentalmedaustria.al” è Dental Med Austria. Il modulo di prenotazione è stato creato da zero dal nostro webmaster e tutte le informazioni fornite tramite di esso vengono registrate direttamente nel nostro database privato all'interno del sito.",
        },
        {
          kind: "p",
          text:
            "Potremmo inoltre raccogliere i vostri dati personali tramite applicazioni di terze parti come Google Analytics, Gmail e WhatsApp. Potete leggere l'Informativa sulla Privacy di Google su https://policies.google.com/privacy e quella di WhatsApp su https://www.whatsapp.com/legal/privacy-policy.",
        },
        {
          kind: "p",
          text:
            "Tutti i dati personali raccolti tramite il nostro sito web vengono trattati e utilizzati esclusivamente da Dental Med Austria e da nessuna delle sue applicazioni di terze parti.",
        },
      ],
    },
    {
      heading: "4. Su quale base giuridica Dental Med Austria raccoglie i dati degli utenti",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria raccoglie, gestisce e conserva i vostri dati personali in piena conformità con la legge albanese n. 9887 del 10.03.2008 “Sulla protezione dei dati personali” e con il GDPR.",
        },
      ],
    },
    {
      heading: "5. Quali sono le finalità della raccolta dei vostri dati personali",
      blocks: [
        { kind: "p", text: "Raccogliamo i vostri dati personali al fine di:" },
        {
          kind: "list",
          items: [
            "offrirvi una migliore esperienza di navigazione sul sito web;",
            "registrarvi come potenziale paziente nel nostro database;",
            "aggiungervi al nostro database email per inviarvi le future newsletter relative alle nostre offerte, sconti, nuovi prodotti o servizi, ecc.;",
            "contattarvi direttamente via email o telefono mentre fruendo dei servizi presso la nostra clinica.",
          ],
        },
      ],
    },
    {
      heading: "6. Per quanto tempo Dental Med Austria conserva i vostri dati personali",
      blocks: [
        {
          kind: "p",
          text:
            "Potremmo conservare i vostri dati personali per un periodo di tempo indeterminato e rimuoveremo immediatamente tutti i vostri dati personali qualora non desideriate più che Dental Med Austria li utilizzi.",
        },
      ],
    },
    {
      heading: "7. Dental Med Austria trasferisce i vostri dati a livello internazionale?",
      blocks: [
        {
          kind: "p",
          text:
            "Mai. È severamente vietato l'uso, il trasferimento o la modifica dei dati personali degli utenti di “dentalmedaustria.al” o dei follower dei social media per finalità diverse da quelle indicate al punto 5 (cinque) di cui sopra.",
        },
        {
          kind: "p",
          text:
            "Vi preghiamo di leggere il punto 5 per sapere perché e quando Dental Med Austria utilizza i vostri dati personali (nome, cognome, email, numero di telefono, ecc.).",
        },
      ],
    },
    {
      heading: "8. Con quali terze parti Dental Med Austria condivide i dati",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria non condivide i dati personali degli utenti del suo sito web o dei follower dei social media con alcuna terza parte. Utilizziamo Google Analytics, Gmail e WhatsApp come applicazioni di terze parti impegnate a garantire la riservatezza e la protezione dei vostri dati personali.",
        },
        {
          kind: "p",
          text:
            "Dental Med Austria non è responsabile dei dati personali che tali applicazioni di terze parti possano raccogliere in modo lecito o illecito.",
        },
        {
          kind: "p",
          text:
            "Potete leggere l'Informativa sulla Privacy di Google su https://policies.google.com/privacy e quella di WhatsApp su https://www.whatsapp.com/legal/privacy-policy.",
        },
      ],
    },
    {
      heading: "9. I vostri diritti sui dati personali detenuti da Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Gli utenti del sito che hanno fornito informazioni personali tramite uno qualsiasi dei canali di contatto presenti su “dentalmedaustria.al” hanno il diritto di richiedere la modifica o la cancellazione dei propri dati personali dal nostro sito e dai nostri database.",
        },
      ],
    },
    {
      heading:
        "10. Come sarete informati quando Dental Med Austria modifica la sua informativa sulla privacy",
      blocks: [
        {
          kind: "p",
          text:
            "Se e quando Dental Med Austria modifica la sua informativa sulla privacy o le condizioni di servizio, sarete avvisati tramite un avviso nella parte superiore o inferiore del sito web. Vi verrà chiesto di leggere attentamente la nostra nuova Informativa sulla Privacy e di accettarla qualora la riteniate ragionevole.",
        },
        {
          kind: "p",
          text:
            "Per qualsiasi suggerimento che possa aiutarci a migliorare la nostra Informativa sulla Privacy, vi preghiamo di contattarci all'indirizzo info@dentalmedaustria.com.",
        },
      ],
    },
  ],
};

const DE: PrivacyContent = {
  eyebrow: "Datenschutz",
  title: "Datenschutzerklärung",
  updated: "Zuletzt aktualisiert: 11. Juli 2026",
  intro: [
    {
      kind: "p",
      text:
        "Erster Hinweis: Bevor Sie unsere Datenschutz- und Cookie-Richtlinie lesen, möchte Dental Med Austria allen Besuchern erläutern und versichern, dass unsere Datenschutzpraktiken, die Erhebung und Verwaltung Ihrer personenbezogenen Daten sowie die Nutzung von Anwendungen Dritter für die verschiedenen Prozesse der Datenerhebung, vollständig mit der Datenschutz-Grundverordnung (DSGVO) sowie vollständig mit dem albanischen Gesetz Nr. 9887 vom 10.03.2008 „Über den Schutz personenbezogener Daten” übereinstimmen.",
    },
    {
      kind: "p",
      text:
        "Die DSGVO wurde von der Europäischen Union am 25. Mai 2018 zum Schutz der personenbezogenen Daten der Bürgerinnen und Bürger der EU und des EWR erlassen und legt zudem die Regeln fest, die Unternehmen bei der Übermittlung personenbezogener Daten von EU- und EWR-Bürgern außerhalb dieser beiden Räume einhalten müssen.",
    },
    {
      kind: "p",
      text:
        "Zweiter Hinweis: Der Geschäftssitz von Dental Med Austria befindet sich in Rruga Kristo Luarasi, Tirana, Albanien. Dental Med Austria schützt die Privatsphäre und die personenbezogenen Daten von Personen gemäß dem albanischen Gesetz Nr. 9887 vom 10.03.2008 „Über den Schutz personenbezogener Daten” und in vollständiger Übereinstimmung mit der DSGVO.",
    },
    {
      kind: "p",
      text:
        "UNSERE DATENSCHUTZ- UND COOKIE-RICHTLINIEN SIND VOLLSTÄNDIG DEM SCHUTZ IHRER PERSONENBEZOGENEN DATEN GEWIDMET. Dental Med Austria gilt als „Verantwortlicher” für die personenbezogenen Daten, die die Nutzer uns zur Verfügung stellen. Wir erheben, verwalten und speichern Ihre Daten in vollständiger Übereinstimmung mit der DSGVO und dem albanischen Gesetz Nr. 9887 vom 10.03.2008 „Über den Schutz personenbezogener Daten”.",
    },
    {
      kind: "p",
      text:
        "Die Website www.dentalmedaustria.al möchte ihre Besucher darüber informieren, dass sie auf dieser Website möglicherweise gebeten werden, verschiedene Kontaktformulare auszufüllen. Diese Formulare fordern die Nutzer auf, personenbezogene Daten wie Name, Telefonnummer, E-Mail, Wohnsitzland usw. anzugeben.",
    },
    {
      kind: "p",
      text: "In dieser Datenschutzerklärung werden Sie umfassend über die folgenden Themen informiert:",
    },
    {
      kind: "list",
      items: [
        "Alle Kategorien personenbezogener Daten, die Dental Med Austria erhebt",
        "Was Cookies sind und wie Dental Med Austria sie erhebt",
        "Wer bei Dental Med Austria personenbezogene Daten verarbeitet",
        "Auf welcher Rechtsgrundlage Dental Med Austria die Daten der Nutzer erhebt",
        "Zu welchen Zwecken wir Ihre personenbezogenen Daten erheben",
        "Wie lange Dental Med Austria Ihre personenbezogenen Daten speichert",
        "Ob Dental Med Austria Ihre Daten international übermittelt",
        "An welche Dritten Dental Med Austria Daten weitergibt",
        "Ihre Rechte an den von Dental Med Austria gespeicherten personenbezogenen Daten",
        "Wie Sie informiert werden, wenn Dental Med Austria seine Datenschutzerklärung ändert",
      ],
    },
  ],
  sections: [
    {
      heading:
        "1. Die von Dental Med Austria erhobenen, verwalteten und gespeicherten Kategorien personenbezogener Daten",
      blocks: [
        {
          kind: "p",
          text: "Dental Med Austria erhebt die personenbezogenen Daten seiner Nutzer über die folgenden Kanäle:",
        },
        {
          kind: "p",
          text:
            "Website. Die Website von Dental Med Austria, bekannt als „dentalmedaustria.al” und „www.dentalmedaustria.al”, erhebt personenbezogene Daten ihrer Besucher auf folgende Weise:",
        },
        {
          kind: "list",
          items: [
            "Cookies, kleine Textdateien, die beim Besuch unserer Website auf Ihrem Computer gespeichert werden.",
            "Die personenbezogenen Daten, die Sie freiwillig über das Buchungsformular (auf der Kontaktseite), über den WhatsApp-Chat sowie über unsere offizielle Telefonnummer und E-Mail-Adresse angeben.",
            "Google Analytics, Dental Med Austria hat Google Analytics installiert und nutzt es, um allgemeine Informationen über die Gesamtheit der Website-Besucher zu erhalten, etwa Wohnsitzland, Durchschnittsalter, Interessen usw.",
          ],
        },
        {
          kind: "p",
          text:
            "Soziale Medien. Dental Med Austria nutzt Facebook, Messenger, WhatsApp und Instagram (persönliche und Unternehmensseiten), um direkt mit Personen zu kommunizieren, die Interesse an unseren Leistungen zeigen, und um seine Produkte und Dienstleistungen zu bewerben.",
        },
        {
          kind: "p",
          text:
            "Die personenbezogenen Daten, die Personen uns über diese Online-Kommunikationskanäle zur Verfügung stellen, werden AUSSCHLIESSLICH von Dental Med Austria sicher in unserer privaten Datenbank erhoben, gespeichert und geschützt und können künftig für Marketingzwecke verwendet werden (E-Mail-Marketing über Newsletter (Mailchimp), Facebook-Marketing und direktes E-Mail-Marketing über Gmail).",
        },
        {
          kind: "p",
          text:
            "Welche Art personenbezogener Daten erheben wir von den Nutzern? Wir erheben Ihren Vornamen, Nachnamen, Ihre E-Mail-Adresse, Telefonnummer und Wohnadresse, sofern Sie diese personenbezogenen Daten freiwillig angegeben haben, damit wir Ihnen bessere und schnellere Leistungen bieten können.",
        },
      ],
    },
    {
      heading: "2. Was Cookies sind und wie Dental Med Austria sie erhebt",
      blocks: [
        {
          kind: "p",
          text:
            "Cookies sind kleine Textdateien, die beim Besuch unserer Website auf Ihrem Computer gespeichert werden. Cookies zeichnen Ihre Aktionen auf unserer Website auf und merken sich Ihre Auswahl, wenn Sie unsere Website in Zukunft erneut besuchen.",
        },
        {
          kind: "p",
          text:
            "Wenn Sie beispielsweise unsere Website besuchen und die albanischsprachige Version lesen möchten, wird diese Aktion von Ihrem Browser (Google Chrome, Firefox, Edge, Safari oder anderen) aufgezeichnet. Ihr Browser merkt sich diese Aktion, und beim erneuten Besuch unserer Website werden Sie direkt zur albanischsprachigen Version geleitet.",
        },
      ],
    },
    {
      heading: "3. Wer bei Dental Med Austria personenbezogene Daten verarbeitet",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria erhebt, verwaltet und speichert Ihre personenbezogenen Daten in vollständiger Übereinstimmung mit dem albanischen Gesetz Nr. 9887 vom 10.03.2008 „Über den Schutz personenbezogener Daten” und mit der DSGVO.",
        },
        {
          kind: "p",
          text:
            "Die einzige für die Erhebung der personenbezogenen Daten, die Nutzer im Buchungsformular von „dentalmedaustria.al” angeben, verantwortliche Stelle ist Dental Med Austria. Das Buchungsformular wurde von unserem Webmaster von Grund auf neu erstellt, und alle über das Formular übermittelten Informationen werden direkt in unserer privaten Datenbank innerhalb unserer Website gespeichert.",
        },
        {
          kind: "p",
          text:
            "Wir können Ihre personenbezogenen Daten auch über Anwendungen Dritter wie Google Analytics, Gmail und WhatsApp erheben. Die Datenschutzerklärung von Google können Sie unter https://policies.google.com/privacy und die von WhatsApp unter https://www.whatsapp.com/legal/privacy-policy lesen.",
        },
        {
          kind: "p",
          text:
            "Alle über unsere Website erhobenen personenbezogenen Daten werden ausschließlich von Dental Med Austria und von keiner seiner Drittanwendungen verarbeitet und verwendet.",
        },
      ],
    },
    {
      heading: "4. Auf welcher Rechtsgrundlage Dental Med Austria die Daten der Nutzer erhebt",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria erhebt, verwaltet und speichert Ihre personenbezogenen Daten in vollständiger Übereinstimmung mit dem albanischen Gesetz Nr. 9887 vom 10.03.2008 „Über den Schutz personenbezogener Daten” und mit der DSGVO.",
        },
      ],
    },
    {
      heading: "5. Zu welchen Zwecken wir Ihre personenbezogenen Daten erheben",
      blocks: [
        { kind: "p", text: "Wir erheben Ihre personenbezogenen Daten, um:" },
        {
          kind: "list",
          items: [
            "Ihnen ein besseres Website-Erlebnis zu bieten;",
            "Sie als potenziellen Patienten in unserer Datenbank zu registrieren;",
            "Sie in unsere E-Mail-Datenbank aufzunehmen, um Ihnen künftige Newsletter über unsere Angebote, Rabatte, neue Produkte oder Dienstleistungen usw. zu senden;",
            "Sie direkt per E-Mail oder Telefon zu kontaktieren, während Sie Leistungen in unserer Klinik in Anspruch nehmen.",
          ],
        },
      ],
    },
    {
      heading: "6. Wie lange Dental Med Austria Ihre personenbezogenen Daten speichert",
      blocks: [
        {
          kind: "p",
          text:
            "Wir können Ihre personenbezogenen Daten für einen unbestimmten Zeitraum speichern und werden alle Ihre personenbezogenen Daten unverzüglich entfernen, wenn Sie nicht mehr möchten, dass Dental Med Austria sie verwendet.",
        },
      ],
    },
    {
      heading: "7. Übermittelt Dental Med Austria Ihre Daten international?",
      blocks: [
        {
          kind: "p",
          text:
            "Niemals. Die Verwendung, Übermittlung oder Änderung der personenbezogenen Daten der Nutzer von „dentalmedaustria.al” oder unserer Social-Media-Follower zu anderen als den unter Thema 5 (fünf) oben genannten Zwecken ist strengstens untersagt.",
        },
        {
          kind: "p",
          text:
            "Bitte lesen Sie Thema 5, um zu erfahren, warum und wann Dental Med Austria Ihre personenbezogenen Daten (Vorname, Nachname, E-Mail, Telefonnummer usw.) verwendet.",
        },
      ],
    },
    {
      heading: "8. An welche Dritten Dental Med Austria Daten weitergibt",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria gibt die personenbezogenen Daten der Nutzer seiner Website oder seiner Social-Media-Follower an keine Dritten weiter. Wir nutzen Google Analytics, Gmail und WhatsApp als Anwendungen Dritter, die sich dem Schutz der Privatsphäre und der Sicherheit Ihrer personenbezogenen Daten verpflichtet haben.",
        },
        {
          kind: "p",
          text:
            "Dental Med Austria ist nicht verantwortlich für personenbezogene Daten, die diese Anwendungen Dritter rechtmäßig oder unrechtmäßig erheben könnten.",
        },
        {
          kind: "p",
          text:
            "Die Datenschutzerklärung von Google können Sie unter https://policies.google.com/privacy und die von WhatsApp unter https://www.whatsapp.com/legal/privacy-policy lesen.",
        },
      ],
    },
    {
      heading: "9. Ihre Rechte an den von Dental Med Austria gespeicherten personenbezogenen Daten",
      blocks: [
        {
          kind: "p",
          text:
            "Nutzer der Website, die personenbezogene Daten über einen der auf „dentalmedaustria.al” verfügbaren Kontaktkanäle angegeben haben, haben das Recht, die Änderung oder Löschung ihrer personenbezogenen Daten aus unserer Website und unseren Datenbanken zu verlangen.",
        },
      ],
    },
    {
      heading:
        "10. Wie Sie informiert werden, wenn Dental Med Austria seine Datenschutzerklärung ändert",
      blocks: [
        {
          kind: "p",
          text:
            "Falls und sobald Dental Med Austria seine Datenschutzerklärung oder Nutzungsbedingungen ändert, werden Sie durch einen Hinweis am oberen oder unteren Rand der Website benachrichtigt. Sie werden gebeten, unsere neue Datenschutzerklärung sorgfältig zu lesen und sie zu akzeptieren, sofern Sie sie für angemessen halten.",
        },
        {
          kind: "p",
          text:
            "Für jeden Vorschlag, der uns helfen würde, unsere Datenschutzerklärung zu verbessern, kontaktieren Sie uns bitte unter info@dentalmedaustria.com.",
        },
      ],
    },
  ],
};

const FR: PrivacyContent = {
  eyebrow: "Protection des données",
  title: "Politique de confidentialité",
  updated: "Dernière mise à jour : 11 juillet 2026",
  intro: [
    {
      kind: "p",
      text:
        "Première note : Avant de lire notre Politique de confidentialité et de cookies, Dental Med Austria souhaite expliquer et assurer à tous ses visiteurs que nos pratiques en matière de confidentialité, la collecte et la gestion de vos données personnelles, ainsi que l'utilisation d'applications tierces pour les différents processus de collecte de données, sont pleinement conformes au Règlement Général sur la Protection des Données (RGPD) et également pleinement conformes à la loi albanaise n° 9887 du 10.03.2008 « Sur la protection des données personnelles ».",
    },
    {
      kind: "p",
      text:
        "Le RGPD a été adopté par l'Union européenne le 25 mai 2018 afin de protéger les données personnelles des citoyens de l'UE et de l'EEE, et il définit également les règles que les entreprises doivent suivre pour le transfert des données personnelles des citoyens de l'UE et de l'EEE en dehors de ces deux espaces.",
    },
    {
      kind: "p",
      text:
        "Deuxième note : Le siège social de Dental Med Austria est situé à Rruga Kristo Luarasi, Tirana, Albanie. Dental Med Austria protège la vie privée et les données personnelles des personnes conformément à la loi albanaise n° 9887 du 10.03.2008 « Sur la protection des données personnelles » et en pleine conformité avec le RGPD.",
    },
    {
      kind: "p",
      text:
        "NOS POLITIQUES DE CONFIDENTIALITÉ ET DE COOKIES SONT ENTIÈREMENT CONSACRÉES À LA PROTECTION DE VOS DONNÉES PERSONNELLES. Dental Med Austria agit en tant que « Responsable du traitement » des données personnelles que les utilisateurs nous fournissent. Nous collectons, gérons et conservons vos données en pleine conformité avec le RGPD et la loi albanaise n° 9887 du 10.03.2008 « Sur la protection des données personnelles ».",
    },
    {
      kind: "p",
      text:
        "Le site web www.dentalmedaustria.al souhaite informer ses visiteurs que, sur ce site, il pourra leur être demandé de remplir différents formulaires de contact. Ces formulaires demandent aux utilisateurs de fournir des données personnelles telles que le nom, le numéro de téléphone, l'e-mail, le pays de résidence, etc.",
    },
    {
      kind: "p",
      text: "Dans la présente politique de confidentialité, vous serez pleinement informé des sujets suivants :",
    },
    {
      kind: "list",
      items: [
        "Toutes les catégories de données personnelles que collecte Dental Med Austria",
        "Ce que sont les cookies et comment Dental Med Austria les collecte",
        "Qui traite les données personnelles chez Dental Med Austria",
        "Sur quelle base juridique Dental Med Austria collecte les données des utilisateurs",
        "Quelles sont les finalités de la collecte de vos données personnelles",
        "Combien de temps Dental Med Austria conserve vos données personnelles",
        "Si Dental Med Austria transfère vos données à l'international",
        "Avec quels tiers Dental Med Austria partage les données",
        "Vos droits sur les données personnelles détenues par Dental Med Austria",
        "Comment vous serez informé lorsque Dental Med Austria modifie sa politique de confidentialité",
      ],
    },
  ],
  sections: [
    {
      heading:
        "1. Les catégories de données personnelles collectées, gérées et conservées par Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text: "Dental Med Austria collecte les données personnelles de ses utilisateurs via les canaux suivants :",
        },
        {
          kind: "p",
          text:
            "Site web. Le site web de Dental Med Austria, connu sous les noms « dentalmedaustria.al » et « www.dentalmedaustria.al », collecte les données personnelles de ses visiteurs des manières suivantes :",
        },
        {
          kind: "list",
          items: [
            "Cookies, de petits fichiers texte enregistrés sur votre ordinateur lorsque vous visitez notre site web.",
            "Les données personnelles que vous fournissez volontairement via le Formulaire de réservation (disponible sur la page Contact), via la discussion WhatsApp ainsi que via notre numéro de téléphone et notre e-mail officiels.",
            "Google Analytics, Dental Med Austria a installé et utilise Google Analytics afin d'obtenir des informations générales sur l'ensemble des visiteurs du site, telles que le pays de résidence, l'âge moyen, les centres d'intérêt, etc.",
          ],
        },
        {
          kind: "p",
          text:
            "Réseaux sociaux. Dental Med Austria utilise Facebook, Messenger, WhatsApp et Instagram (pages personnelles et professionnelles) pour communiquer directement avec les personnes qui manifestent de l'intérêt pour nos services et pour promouvoir ses produits et services.",
        },
        {
          kind: "p",
          text:
            "Les données personnelles que les personnes nous fournissent via ces canaux de communication en ligne sont collectées, conservées et protégées UNIQUEMENT par Dental Med Austria, de manière sécurisée, dans notre base de données privée, et pourront être utilisées à l'avenir à des fins de marketing (marketing par e-mail via des Newsletters (Mailchimp), marketing sur Facebook et marketing direct par e-mail via Gmail).",
        },
        {
          kind: "p",
          text:
            "Quel type de données personnelles collectons-nous auprès des utilisateurs ? Nous collectons votre prénom, votre nom, votre adresse e-mail, votre numéro de téléphone et votre adresse de résidence, dès lors que vous avez fourni volontairement ces données personnelles pour nous aider à vous offrir des services meilleurs et plus rapides.",
        },
      ],
    },
    {
      heading: "2. Ce que sont les cookies et comment Dental Med Austria les collecte",
      blocks: [
        {
          kind: "p",
          text:
            "Les cookies sont de petits fichiers texte enregistrés sur votre ordinateur lorsque vous visitez notre site web. Les cookies enregistrent vos actions sur notre site et mémorisent vos choix lorsque vous le visitez à nouveau à l'avenir.",
        },
        {
          kind: "p",
          text:
            "Par exemple, si vous visitez notre site et choisissez de lire la version en langue albanaise, cette action est enregistrée par votre navigateur (Google Chrome, Firefox, Edge, Safari ou autres). Votre navigateur mémorise cette action et, lorsque vous visiterez à nouveau notre site, vous serez dirigé directement vers la version en langue albanaise.",
        },
      ],
    },
    {
      heading: "3. Qui traite les données personnelles chez Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria collecte, gère et conserve vos données personnelles en pleine conformité avec la loi albanaise n° 9887 du 10.03.2008 « Sur la protection des données personnelles » et avec le RGPD.",
        },
        {
          kind: "p",
          text:
            "La seule entité responsable de la collecte des données personnelles que les utilisateurs fournissent dans le formulaire de réservation de « dentalmedaustria.al » est Dental Med Austria. Le formulaire de réservation a été créé de toutes pièces par notre webmaster, et toutes les informations fournies par son intermédiaire sont enregistrées directement dans notre base de données privée au sein de notre site.",
        },
        {
          kind: "p",
          text:
            "Nous pouvons également collecter vos données personnelles via des applications tierces telles que Google Analytics, Gmail et WhatsApp. Vous pouvez lire la Politique de confidentialité de Google sur https://policies.google.com/privacy et celle de WhatsApp sur https://www.whatsapp.com/legal/privacy-policy.",
        },
        {
          kind: "p",
          text:
            "Toutes les données personnelles collectées via notre site web sont traitées et utilisées uniquement par Dental Med Austria et par aucune de ses applications tierces.",
        },
      ],
    },
    {
      heading: "4. Sur quelle base juridique Dental Med Austria collecte les données des utilisateurs",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria collecte, gère et conserve vos données personnelles en pleine conformité avec la loi albanaise n° 9887 du 10.03.2008 « Sur la protection des données personnelles » et avec le RGPD.",
        },
      ],
    },
    {
      heading: "5. Quelles sont les finalités de la collecte de vos données personnelles",
      blocks: [
        { kind: "p", text: "Nous collectons vos données personnelles afin de :" },
        {
          kind: "list",
          items: [
            "vous offrir une meilleure expérience sur le site web ;",
            "vous enregistrer en tant que patient potentiel dans notre base de données ;",
            "vous ajouter à notre base de données e-mail afin de vous envoyer nos futures newsletters concernant nos offres, remises, nouveaux produits ou services, etc. ;",
            "vous contacter directement par e-mail ou par téléphone pendant que vous bénéficiez de services dans notre clinique.",
          ],
        },
      ],
    },
    {
      heading: "6. Combien de temps Dental Med Austria conserve vos données personnelles",
      blocks: [
        {
          kind: "p",
          text:
            "Nous pouvons conserver vos données personnelles pour une durée indéterminée et nous supprimerons immédiatement toutes vos données personnelles si vous ne souhaitez plus que Dental Med Austria les utilise.",
        },
      ],
    },
    {
      heading: "7. Dental Med Austria transfère-t-il vos données à l'international ?",
      blocks: [
        {
          kind: "p",
          text:
            "Jamais. L'utilisation, le transfert ou la modification des données personnelles des utilisateurs de « dentalmedaustria.al » ou de nos abonnés sur les réseaux sociaux à des fins autres que celles mentionnées au sujet numéro 5 (cinq) ci-dessus est strictement interdit.",
        },
        {
          kind: "p",
          text:
            "Veuillez lire le sujet 5 pour savoir pourquoi et quand Dental Med Austria utilise vos données personnelles (prénom, nom, e-mail, numéro de téléphone, etc.).",
        },
      ],
    },
    {
      heading: "8. Avec quels tiers Dental Med Austria partage les données",
      blocks: [
        {
          kind: "p",
          text:
            "Dental Med Austria ne partage les données personnelles des utilisateurs de son site web ou de ses abonnés sur les réseaux sociaux avec aucun tiers. Nous utilisons Google Analytics, Gmail et WhatsApp comme applications tierces qui s'engagent à garantir la confidentialité et la protection de vos données personnelles.",
        },
        {
          kind: "p",
          text:
            "Dental Med Austria n'est pas responsable des données personnelles que ces applications tierces pourraient collecter de manière licite ou illicite.",
        },
        {
          kind: "p",
          text:
            "Vous pouvez lire la Politique de confidentialité de Google sur https://policies.google.com/privacy et celle de WhatsApp sur https://www.whatsapp.com/legal/privacy-policy.",
        },
      ],
    },
    {
      heading: "9. Vos droits sur les données personnelles détenues par Dental Med Austria",
      blocks: [
        {
          kind: "p",
          text:
            "Les utilisateurs du site qui ont fourni des informations personnelles via l'un quelconque des canaux de contact présents sur « dentalmedaustria.al » ont le droit de demander la modification ou la suppression de leurs données personnelles de notre site et de nos bases de données.",
        },
      ],
    },
    {
      heading:
        "10. Comment vous serez informé lorsque Dental Med Austria modifie sa politique de confidentialité",
      blocks: [
        {
          kind: "p",
          text:
            "Si et lorsque Dental Med Austria modifie sa politique de confidentialité ou ses conditions de service, vous en serez informé par un avis en haut ou en bas du site web. Il vous sera demandé de lire attentivement notre nouvelle Politique de confidentialité et de l'accepter si vous la jugez raisonnable.",
        },
        {
          kind: "p",
          text:
            "Pour toute suggestion susceptible de nous aider à améliorer notre Politique de confidentialité, veuillez nous contacter à l'adresse info@dentalmedaustria.com.",
        },
      ],
    },
  ],
};

export const PRIVACY: Record<Locale, PrivacyContent> = { en: EN, sq: SQ, it: IT, de: DE, fr: FR };
