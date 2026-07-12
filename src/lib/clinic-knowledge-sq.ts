// Albanian (sq) overlay for the clinic-knowledge safety entries.
// Mirrors the EN entries in clinic-knowledge.ts (title, body, optional bullets).
// Other locales (it/de/fr) fall back to the English source.
import type { Locale } from "./dictionaries";

export const SAFETY_SQ: Record<string, { title: string; body: string; bullets?: string[] }> = {
  "safety:overview": {
    "title": "Siguria, higjiena dhe kontrolli i infeksioneve në Dental Med Austria",
    "body": "Siguria e pacientit nuk lihet kurrë në dorë të rastësisë. Dental Med Austria punon sipas menaxhimit të cilësisë ISO 9001 dhe protokolleve evropiane të kontrollit të infeksioneve, me sterilizim rigoroz që plotëson standardet që pacientët presin nga klinikat kryesore në Zvicër, Gjermani dhe Britani. Prej më shumë se 30 vjetësh, ekipi ynë ka ofruar trajtim të sigurt e të parashikueshëm për mbi 24.000 pacientë, i mbështetur nga protokolle të dokumentuara, materiale premium me shenjën CE dhe një shkallë suksesi të implanteve prej 98%. Kontrolli i infeksionit të kryqëzuar - parimi sipas të cilit asgjë nuk kalon nga një pacient te tjetri - përshkon gjithçka më poshtë: çdo instrument, çdo sipërfaqe, çdo takim."
  },
  "safety:instrument-reprocessing": {
    "title": "Çdo instrument sterilizohet pas çdo pacienti",
    "body": "Çdo instrument i ripërdorshëm ndjek të njëjtin cikël të dokumentuar ripërpunimi përpara se të arrijë në dhomën tuaj të trajtimit. Asgjë nuk ripërdoret pa e përfunduar të gjithin, dhe çdo cikël regjistrohet, në mënyrë që instrumentet e përdorura në trajtimin tuaj të mund të gjurmohen deri te një seri e caktuar.",
    "bullets": [
      "Parapastrim për të parandaluar tharjen e mbetjeve",
      "Pastrim me ultratinguj i çdo sipërfaqeje",
      "Shpëlarje, tharje dhe inspektim vizual",
      "Mbyllje në një qese individuale sterilizimi",
      "Sterilizim në autoklavë me avull dhe vakum",
      "Regjistrim i serisë për gjurmueshmëri të plotë",
      "Ruajtje sterile derisa qesja hapet para syve tuaj"
    ]
  },
  "safety:surface-unit-disinfection": {
    "title": "Çdo dhomë trajtimi rregullohet plotësisht nga e para",
    "body": "Midis çdo takimi, dhoma dezinfektohet dhe rregullohet nga e para, kështu që asgjë që ka prekur pacientin e mëparshëm nuk kalon te ju. Instrumentet sterile dhe materialet e freskëta të njëpërdorimshme hapen vetëm pasi ju të jeni ulur.",
    "bullets": [
      "Karrigia dentare, llamba e ndriçimit dhe njësia e shpërndarjes",
      "Panelet e komandimit dhe sipërfaqet e punës",
      "Të gjitha pajisjet klinike të kontaktit",
      "Mbrojtje barriere për një përdorim në pikat e prekura shpesh"
    ]
  },
  "safety:single-use-disposables": {
    "title": "Njëpërdorimshme do të thotë vetëm një përdorim",
    "body": "Kudo që një artikull mund të përdoret një herë dhe të hidhet, ashtu bëhet - hapet i freskët për takimin tuaj dhe nuk ripërdoret kurrë midis pacientëve. Më pas, objektet e mprehta shkojnë drejtpërdrejt në kontejnerë të mbyllur dhe rezistentë ndaj shpimit, dhe mbetjet klinike ndahen nga mbetjet e përgjithshme për një hedhje të saktë.",
    "bullets": [
      "Gjilpëra dhe fishekë anestezie",
      "Maja thithjeje dhe gota",
      "Doreza, maska dhe syze mbrojtëse",
      "Mbrojtje barriere dhe materiale kirurgjike"
    ]
  },
  "safety:water-line-hygiene": {
    "title": "Ujë i pastër, ajër i pastër",
    "body": "Uji që ftoh instrumentet dhe shpëlan gojën tuaj mbahet i pastër sipas protokolleve evropiane të higjienës së linjave të ujit, të cilat kontrollojnë biofilmin. Ajri që shpërndahet te karrigia e trajtimit është i pastër, i thatë dhe pa vaj, dhe thithja mirëmbahet në të njëjtën mënyrë."
  },
  "safety:hand-hygiene-ppe": {
    "title": "Higjiena e duarve dhe pajisjet mbrojtëse",
    "body": "Ekipi ynë klinik ndjek një praktikë të rreptë të higjienës së duarve dhe të PPE-së gjatë çdo takimi: duart pastrohen para dhe pas trajtimit, dhe doreza të freskëta, maska e mbrojtje për sytë përdoren për çdo pacient dhe ndërrohen midis pacientëve. Higjiena e thjeshtë dhe e disiplinuar e duarve është ndër masat më efektive të kontrollit të infeksioneve në çdo klinikë."
  },
  "safety:sterile-implant-surgery": {
    "title": "Kirurgjia sterile e implanteve",
    "body": "Vendosja e implantit kryhet si një procedurë kirurgjikale sterile e dedikuar, e planifikuar në mënyrë dixhitale për saktësi. Çdo implant vjen me një Pasaportë Implanti që regjistron markën dhe numrat serialë të tij, kështu që komponenti i saktë i vendosur në nofullën tuaj është i dokumentuar dhe mund të verifikohet te prodhuesi - nga ju, ose nga çdo dentist, kudo në botë.",
    "bullets": [
      "Mbulesa dhe doreza kirurgjike sterile",
      "Instrumente kirurgjike të sterilizuara",
      "Materiale kirurgjike për një përdorim",
      "Pozicionim i planifikuar dixhitalisht nga një skanim CBCT me Vatech",
      "Kirurgji e udhëhequr me Navident, kur është e indikuar"
    ]
  },
  "safety:materials-provenance": {
    "title": "Materiale të verifikuara që mund t'i besoni",
    "body": "Implantet, qeramikat dhe biomaterialet e vendosura në gojën tuaj janë produkte premium me shenjën CE nga prodhues të besuar në të gjithë Evropën. Secili mund të verifikohet në mënyrë të pavarur përmes dokumentacionit tuaj të trajtimit dhe numrave serialë - materialet origjinale e të gjurmueshme janë po aq çështje sigurie sa edhe cilësie.",
    "bullets": ["Straumann", "Ivoclar", "Biodem"]
  },
  "safety:iso-9001": {
    "title": "Pse ka rëndësi ISO 9001",
    "body": "ISO 9001 nuk është thjesht një certifikatë. Ajo do të thotë se çdo proces klinik kritik - nga sterilizimi te kontrolli i infeksioneve - është i përcaktuar, i dokumentuar dhe i monitoruar, dhe kryhet në të njëjtën mënyrë çdo herë, në vend që t'i lihet kujtesës. Kjo qëndrueshmëri është ajo që i shndërron protokollet e kujdesshme në siguri të besueshme për pacientin."
  },
  "faq:safety:is-it-safe": {
    "title": "A është i sigurt trajtimi dentar në klinikën tuaj?",
    "body": "Po. Çdo instrument i ripërdorshëm pastrohet, inspektohet, futet në qese dhe sterilizohet në një autoklavë me vakum përpara përdorimit; sipërfaqet e trajtimit dezinfektohen midis çdo pacienti; dhe artikujt e njëpërdorimshëm përdoren një herë dhe hidhen. Ne punojmë sipas menaxhimit të cilësisë ISO 9001 dhe protokolleve evropiane të kontrollit të infeksioneve - të njëjtat standarde që përdoren nga klinikat kryesore në Evropën Perëndimore, të zbatuara për çdo takim."
  },
  "faq:safety:what-sterilisation": {
    "title": "Si i sterilizoni instrumentet?",
    "body": "Çdo instrument i ripërdorshëm pastrohet me ultratinguj, inspektohet, mbyllet në një qese individuale sterilizimi dhe përpunohet në një autoklavë me avull dhe vakum, e cila nxjerr ajrin nga instrumentet e zgavërta dhe të mbështjella në mënyrë që avulli të depërtojë plotësisht. Çdo cikël regjistrohet për gjurmueshmëri, dhe instrumentet qëndrojnë të mbyllura e sterile derisa të hapen te karrigia, para syve tuaj."
  },
  "faq:safety:albania-hygienic": {
    "title": "A është i sigurt trajtimi dentar në Shqipëri?",
    "body": "Siguria varet nga klinika, jo nga vendi. Dental Med Austria ndjek të njëjtat protokolle të njohura ndërkombëtarisht të kontrollit të infeksioneve dhe menaxhimin e cilësisë ISO 9001 që përdoren nga klinikat kryesore në të gjithë Evropën Perëndimore: instrumente sterile të mbyllura, dezinfektim midis pacientëve, materiale të njëpërdorimshme dhe procese të dokumentuara, të zbatuara për çdo takim - të mbështetura nga mbi 30 vjet përvojë dhe një shkallë suksesi të implanteve prej 98%."
  },
  "faq:safety:materials-genuine": {
    "title": "A janë origjinale materialet tuaja të implanteve?",
    "body": "Po. Çdo implant vjen me një Pasaportë Implanti që regjistron markën dhe numrat serialë të tij, kështu që komponenti i saktë i vendosur në nofullën tuaj është i dokumentuar dhe mund të verifikohet në mënyrë të pavarur te prodhuesi. Qeramikat dhe biomaterialet që përdorim janë produkte premium me shenjën CE, të gjurmueshme përmes dokumentacionit tuaj të trajtimit."
  }
};

export function locSafety(id: string, field: "title" | "body", fallback: string, locale: Locale): string {
  return locale === "sq" ? SAFETY_SQ[id]?.[field] ?? fallback : fallback;
}

/** Localised bullets for a safety entry, falling back to the English list. */
export function locSafetyBullets(id: string, fallback: string[] | undefined, locale: Locale): string[] | undefined {
  return locale === "sq" ? SAFETY_SQ[id]?.bullets ?? fallback : fallback;
}
