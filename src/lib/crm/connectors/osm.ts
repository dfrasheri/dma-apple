/**
 * OpenStreetMap competitor discovery (mock).
 *
 * REAL API SEAM: query the Overpass API for clinics/hospitals in a bbox, e.g.
 *   [out:json];node["healthcare"~"clinic|hospital"](around:5000,LAT,LNG);out;
 * then map each element → ClinicCandidate. OSM data is open (◆ sourced).
 */
export type ClinicCandidate = {
  name: string;
  city: string;
  country?: string;
  lat?: number;
  lng?: number;
  website?: string;
  osmId?: string;
};

const MOCK: Record<string, ClinicCandidate[]> = {
  Istanbul: [
    { name: "Bosphorus Smile Clinic", city: "Istanbul", country: "Türkiye", lat: 41.04, lng: 28.99, website: "https://bosphorussmile.com", osmId: "node/1001" },
    { name: "Estetik İstanbul", city: "Istanbul", country: "Türkiye", lat: 41.01, lng: 28.95, website: "https://estetikistanbul.com", osmId: "node/1002" }
  ],
  Milan: [
    { name: "Clinica Sorriso Milano", city: "Milan", country: "Italy", lat: 45.46, lng: 9.19, website: "https://clinicasorriso.it", osmId: "node/1003" }
  ]
};

export async function fetchClinics(city: string): Promise<ClinicCandidate[]> {
  // REAL API SEAM: replace with a live Overpass query.
  return MOCK[city] ?? [];
}
