export interface Airport {
  icao: string;
  iata?: string;
  name: string;
  lat: number;
  lng: number;
}
import { haversineKm } from '@/lib/geo';
import fs from 'fs';
import path from 'path';
import embeddedAirports from './airports.json';

let AIRPORTS_CACHE: Airport[] | null = null;

function normalizeAirportRecord(r: unknown): Airport | null {
  const rec = r as Record<string, unknown>;
  if (!r) return null;
  const icao = String((rec.icao ?? rec.ICAO ?? '') as string).trim();
  const iataVal = (rec.iata ?? rec.IATA) as string | undefined;
  const iata = iataVal ? String(iataVal).trim() : undefined;
  const name = String((rec.name ?? rec.Name ?? '') as string).trim();
  const lat = Number((rec.lat ?? rec.latitude ?? rec.Latitude) as number);
  const lng = Number((rec.lng ?? rec.longitude ?? rec.Longitude ?? rec.lon) as number);
  if (!icao || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { icao, iata, name, lat, lng };
}

export function getAirports(): Airport[] {
  if (AIRPORTS_CACHE) return AIRPORTS_CACHE;

  const candidates = [
    process.env.AIRPORTS_JSON_PATH,
    path.join(process.cwd(), 'data', 'airports.json'),
    path.join(process.cwd(), 'public', 'airports', 'airports.json'),
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf8');
        const parsed = JSON.parse(raw);
        const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.airports) ? parsed.airports : [];
        const airports: Airport[] = arr.map(normalizeAirportRecord).filter(Boolean) as Airport[];
        if (airports.length > 0) {
          AIRPORTS_CACHE = airports;
          return AIRPORTS_CACHE;
        }
      }
    } catch {
      // ignore and fall through
    }
  }

  // Fallback to embedded dataset in the repo
  const embedded = (embeddedAirports as unknown as unknown[]).map(normalizeAirportRecord).filter(Boolean) as Airport[];
  AIRPORTS_CACHE = embedded;
  return AIRPORTS_CACHE;
}

export function nearestAirport(
  lat: number,
  lng: number,
  airports: Airport[] = getAirports(),
  maxKm?: number
): Airport | undefined {
  let best: { apt: Airport; km: number } | undefined;
  for (const a of airports) {
    const d = haversineKm(lat, lng, a.lat, a.lng);
    if (!best || d < best.km) best = { apt: a, km: d };
  }
  if (!best) return undefined;
  if (typeof maxKm === 'number' && best.km > maxKm) return undefined;
  return best.apt;
}
