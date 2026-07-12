/**
 * UI copy for the native chat widget (ChatWidget.tsx), in every site locale.
 * These are the WIDGET strings (chrome, forms, errors); the assistant's own
 * conversational lines live in src/lib/chat-i18n.ts and the AI system prompt.
 */
import type { Locale } from "@/lib/dictionaries";

export type ChatUiStrings = {
  openChat: string;
  closeChat: string;
  status: string;
  /** Delivery receipts under the visitor's latest message. */
  sent: string;
  seen: string;
  welcome: string;
  suggestions: string[];
  placeholder: string;
  send: string;
  attach: string;
  attachReady: string;
  attachTypeError: string;
  attachReadError: string;
  imageAlt: string;
  removePhoto: string;
  proactive: string;
  planCta: string;
  planCtaFooter: string;
  coordinatorNote: string;
  leadTitle: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  leadErrorFill: string;
  leadErrorSend: string;
  sending: string;
  sendRequest: string;
  cancel: string;
  leadThanks: (name: string) => string;
  leadReceived: string;
  errorServer: string;
  errorNetwork: string;
};

export const CHAT_UI: Record<Locale, ChatUiStrings> = {
  en: {
    openChat: "Chat with us",
    closeChat: "Close chat",
    status: "Online · replies within a few minutes",
    sent: "Sent",
    seen: "Seen",
    welcome:
      "Hi! I'm the Dental Med Austria assistant. Ask me about treatments, technology and aftercare, or planning your visit. You can even send a panoramic X-ray and we'll take it from there.",
    suggestions: [
      "Is treatment safe?",
      "Get my free treatment plan",
      "Tell me about implants",
      "I'm coming from abroad",
    ],
    placeholder: "Ask about treatments, your visit…",
    send: "Send",
    attach: "Attach an X-ray or photo",
    attachReady: "Photo ready to send",
    attachTypeError: "Please choose an image (JPG, PNG or similar).",
    attachReadError: "That image couldn't be read. Please try another photo.",
    imageAlt: "Attached photo",
    removePhoto: "Remove photo",
    proactive:
      "It sounds like we can really help you. Leave your name and phone number and a coordinator will send you a free, personalised treatment plan within 24–48 hours, with no obligation.",
    planCta: "Get my free treatment plan",
    planCtaFooter: "Get a free treatment plan",
    coordinatorNote: "A coordinator will follow up to help you personally.",
    leadTitle: "Free treatment plan: a coordinator replies within 24–48h",
    firstName: "First name",
    lastName: "Surname",
    phone: "Phone (incl. country code, e.g. +41…)",
    email: "Email (optional)",
    leadErrorFill: "Please add your name and a phone number.",
    leadErrorSend: "Sorry, that didn't go through. Please email info@dentalmedaustria.com.",
    sending: "Sending…",
    sendRequest: "Send my request",
    cancel: "Cancel",
    leadThanks: (name) =>
      `Thank you, ${name}! Your request is in. A coordinator will send you a free, written treatment plan within 24–48 hours. ✨`,
    leadReceived: "Request received. We'll be in touch soon.",
    errorServer: "Sorry, something went wrong. Please email info@dentalmedaustria.com.",
    errorNetwork:
      "I couldn't reach the server. Please email info@dentalmedaustria.com and our team will help.",
  },
  sq: {
    openChat: "Bisedoni me ne",
    closeChat: "Mbyll bisedën",
    status: "Online · përgjigjemi brenda pak minutash",
    sent: "U dërgua",
    seen: "U pa",
    welcome:
      "Përshëndetje! Jam asistentja e Dental Med Austria. Më pyesni për trajtimet, teknologjinë dhe kujdesin pas trajtimit, ose për planifikimin e vizitës suaj. Mund të na dërgoni edhe një radiografi panoramike dhe ne kujdesemi për pjesën tjetër.",
    suggestions: [
      "A është trajtimi i sigurt?",
      "Merrni planin tim të trajtimit falas",
      "Më tregoni për implantet",
      "Dua të vij nga jashtë vendit",
    ],
    placeholder: "Pyesni për trajtimet, vizitën tuaj…",
    send: "Dërgo",
    attach: "Bashkëngjitni një radiografi ose foto",
    attachReady: "Fotoja gati për t'u dërguar",
    attachTypeError: "Ju lutemi zgjidhni një imazh (JPG, PNG ose të ngjashme).",
    attachReadError: "Imazhi nuk mund të lexohej. Provoni një foto tjetër.",
    imageAlt: "Foto e bashkëngjitur",
    removePhoto: "Hiqe foton",
    proactive:
      "Duket se mund t'ju ndihmojmë vërtet. Na lini emrin dhe numrin e telefonit dhe një koordinator do t'ju dërgojë falas një plan trajtimi të personalizuar brenda 24–48 orëve, pa asnjë detyrim.",
    planCta: "Merrni planin tim të trajtimit falas",
    planCtaFooter: "Merrni një plan trajtimi falas",
    coordinatorNote: "Një koordinator do t'ju kontaktojë për t'ju ndihmuar personalisht.",
    leadTitle: "Plan trajtimi falas: një koordinator ju përgjigjet brenda 24–48 orëve",
    firstName: "Emri",
    lastName: "Mbiemri",
    phone: "Telefoni (me prefiks shteti, p.sh. +355…)",
    email: "Email (opsional)",
    leadErrorFill: "Ju lutemi shkruani emrin dhe numrin e telefonit.",
    leadErrorSend: "Na vjen keq, kërkesa nuk u dërgua. Na shkruani në info@dentalmedaustria.com.",
    sending: "Duke dërguar…",
    sendRequest: "Dërgo kërkesën",
    cancel: "Anulo",
    leadThanks: (name) =>
      `Faleminderit, ${name}! Kërkesa juaj u regjistrua. Një koordinator do t'ju dërgojë falas një plan trajtimi me shkrim brenda 24–48 orëve. ✨`,
    leadReceived: "Kërkesa u pranua. Do t'ju kontaktojmë së shpejti.",
    errorServer: "Na vjen keq, diçka shkoi keq. Na shkruani në info@dentalmedaustria.com.",
    errorNetwork:
      "Nuk u lidha dot me serverin. Na shkruani në info@dentalmedaustria.com dhe ekipi ynë do t'ju ndihmojë.",
  },
  it: {
    openChat: "Chatta con noi",
    closeChat: "Chiudi la chat",
    status: "Online · rispondiamo in pochi minuti",
    sent: "Inviato",
    seen: "Visto",
    welcome:
      "Ciao! Sono l'assistente di Dental Med Austria. Chiedimi dei trattamenti, della tecnologia e dell'assistenza post-trattamento, o della pianificazione della tua visita. Puoi anche inviarci una radiografia panoramica e pensiamo a tutto noi.",
    suggestions: [
      "Il trattamento è sicuro?",
      "Richiedi il mio piano gratuito",
      "Parlami degli impianti",
      "Vorrei venire dall'estero",
    ],
    placeholder: "Chiedi di trattamenti, la tua visita…",
    send: "Invia",
    attach: "Allega una radiografia o una foto",
    attachReady: "Foto pronta per l'invio",
    attachTypeError: "Scegli un'immagine (JPG, PNG o simili).",
    attachReadError: "Impossibile leggere l'immagine. Prova con un'altra foto.",
    imageAlt: "Foto allegata",
    removePhoto: "Rimuovi foto",
    proactive:
      "Sembra proprio che possiamo aiutarti. Lasciaci nome e numero di telefono e un coordinatore ti invierà gratuitamente un piano di trattamento personalizzato entro 24–48 ore, senza impegno.",
    planCta: "Richiedi il mio piano gratuito",
    planCtaFooter: "Richiedi un piano di trattamento gratuito",
    coordinatorNote: "Un coordinatore ti contatterà per aiutarti personalmente.",
    leadTitle: "Piano di trattamento gratuito: un coordinatore risponde entro 24–48 ore",
    firstName: "Nome",
    lastName: "Cognome",
    phone: "Telefono (con prefisso, es. +39…)",
    email: "Email (facoltativa)",
    leadErrorFill: "Inserisci il tuo nome e un numero di telefono.",
    leadErrorSend: "Spiacenti, l'invio non è riuscito. Scrivici a info@dentalmedaustria.com.",
    sending: "Invio…",
    sendRequest: "Invia la richiesta",
    cancel: "Annulla",
    leadThanks: (name) =>
      `Grazie, ${name}! La tua richiesta è stata registrata. Un coordinatore ti invierà gratuitamente un piano di trattamento scritto entro 24–48 ore. ✨`,
    leadReceived: "Richiesta ricevuta. Ti contatteremo presto.",
    errorServer: "Spiacenti, qualcosa è andato storto. Scrivici a info@dentalmedaustria.com.",
    errorNetwork:
      "Non riesco a raggiungere il server. Scrivici a info@dentalmedaustria.com e il nostro team ti aiuterà.",
  },
  de: {
    openChat: "Chatten Sie mit uns",
    closeChat: "Chat schließen",
    status: "Online · Antwort in wenigen Minuten",
    sent: "Gesendet",
    seen: "Gesehen",
    welcome:
      "Hallo! Ich bin die Assistentin von Dental Med Austria. Fragen Sie mich zu Behandlungen, Technik und Nachsorge oder zur Planung Ihres Besuchs. Sie können uns auch ein Panorama-Röntgenbild senden, wir kümmern uns um den Rest.",
    suggestions: [
      "Ist die Behandlung sicher?",
      "Kostenlosen Behandlungsplan anfordern",
      "Erzählen Sie mir von Implantaten",
      "Ich reise aus dem Ausland an",
    ],
    placeholder: "Fragen zu Behandlungen, Ihrem Besuch…",
    send: "Senden",
    attach: "Röntgenbild oder Foto anhängen",
    attachReady: "Foto bereit zum Senden",
    attachTypeError: "Bitte wählen Sie ein Bild (JPG, PNG o. Ä.).",
    attachReadError: "Das Bild konnte nicht gelesen werden. Bitte versuchen Sie ein anderes Foto.",
    imageAlt: "Angehängtes Foto",
    removePhoto: "Foto entfernen",
    proactive:
      "Es klingt, als könnten wir Ihnen wirklich helfen. Hinterlassen Sie Ihren Namen und Ihre Telefonnummer, und ein Koordinator sendet Ihnen innerhalb von 24–48 Stunden kostenlos einen persönlichen Behandlungsplan, ganz unverbindlich.",
    planCta: "Meinen kostenlosen Behandlungsplan anfordern",
    planCtaFooter: "Kostenlosen Behandlungsplan anfordern",
    coordinatorNote: "Ein Koordinator meldet sich, um Ihnen persönlich zu helfen.",
    leadTitle: "Kostenloser Behandlungsplan: ein Koordinator antwortet innerhalb von 24–48 Std.",
    firstName: "Vorname",
    lastName: "Nachname",
    phone: "Telefon (mit Ländervorwahl, z. B. +41…)",
    email: "E-Mail (optional)",
    leadErrorFill: "Bitte geben Sie Ihren Namen und eine Telefonnummer an.",
    leadErrorSend: "Das hat leider nicht geklappt. Schreiben Sie uns an info@dentalmedaustria.com.",
    sending: "Wird gesendet…",
    sendRequest: "Anfrage senden",
    cancel: "Abbrechen",
    leadThanks: (name) =>
      `Vielen Dank, ${name}! Ihre Anfrage ist eingegangen. Ein Koordinator sendet Ihnen innerhalb von 24–48 Stunden kostenlos einen schriftlichen Behandlungsplan. ✨`,
    leadReceived: "Anfrage erhalten. Wir melden uns in Kürze.",
    errorServer: "Entschuldigung, etwas ist schiefgelaufen. Schreiben Sie uns an info@dentalmedaustria.com.",
    errorNetwork:
      "Ich konnte den Server nicht erreichen. Schreiben Sie uns an info@dentalmedaustria.com, unser Team hilft Ihnen gerne.",
  },
  fr: {
    openChat: "Discutez avec nous",
    closeChat: "Fermer le chat",
    status: "En ligne · réponse en quelques minutes",
    sent: "Envoyé",
    seen: "Vu",
    welcome:
      "Bonjour ! Je suis l'assistante de Dental Med Austria. Posez-moi vos questions sur les traitements, la technologie et le suivi post-traitement, ou sur l'organisation de votre visite. Vous pouvez aussi nous envoyer une radiographie panoramique, nous nous occupons du reste.",
    suggestions: [
      "Le traitement est-il sûr ?",
      "Obtenir mon plan de traitement gratuit",
      "Parlez-moi des implants",
      "Je viens de l'étranger",
    ],
    placeholder: "Traitements, votre visite…",
    send: "Envoyer",
    attach: "Joindre une radio ou une photo",
    attachReady: "Photo prête à envoyer",
    attachTypeError: "Veuillez choisir une image (JPG, PNG ou similaire).",
    attachReadError: "Impossible de lire l'image. Essayez une autre photo.",
    imageAlt: "Photo jointe",
    removePhoto: "Retirer la photo",
    proactive:
      "Il semble que nous puissions vraiment vous aider. Laissez votre nom et votre numéro de téléphone, et un coordinateur vous enverra gratuitement un plan de traitement personnalisé sous 24–48 h, sans engagement.",
    planCta: "Obtenir mon plan de traitement gratuit",
    planCtaFooter: "Obtenir un plan de traitement gratuit",
    coordinatorNote: "Un coordinateur vous recontactera pour vous aider personnellement.",
    leadTitle: "Plan de traitement gratuit : un coordinateur répond sous 24–48 h",
    firstName: "Prénom",
    lastName: "Nom",
    phone: "Téléphone (avec indicatif, ex. +33…)",
    email: "E-mail (facultatif)",
    leadErrorFill: "Veuillez indiquer votre nom et un numéro de téléphone.",
    leadErrorSend: "Désolée, l'envoi a échoué. Écrivez-nous à info@dentalmedaustria.com.",
    sending: "Envoi…",
    sendRequest: "Envoyer ma demande",
    cancel: "Annuler",
    leadThanks: (name) =>
      `Merci, ${name} ! Votre demande est enregistrée. Un coordinateur vous enverra gratuitement un plan de traitement écrit sous 24–48 heures. ✨`,
    leadReceived: "Demande reçue. Nous vous contactons très vite.",
    errorServer: "Désolée, une erreur s'est produite. Écrivez-nous à info@dentalmedaustria.com.",
    errorNetwork:
      "Je n'arrive pas à joindre le serveur. Écrivez-nous à info@dentalmedaustria.com et notre équipe vous aidera.",
  },
};
