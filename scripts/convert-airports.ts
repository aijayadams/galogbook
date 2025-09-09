#!/usr/bin/env ts-node

/**
 * Convert an airports CSV/JSON into the normalized JSON used by the app.
 * Usage:
 *   npm run airports:convert -- <input.csv|input.json> [dest.json]
 * Defaults dest to src/lib/airports.json
 */

import fs from 'fs';
import path from 'path';

type In = Record<string, unknown>;
type Out = { icao: string; iata?: string; name: string; lat: number; lng: number };

function normalize(rec: In): Out | null {
  const icao = String((rec.ident ?? rec.icao ?? rec.ICAO ?? rec.gps_code ?? '') as string).trim();
  const iata = (rec.iata_code ?? rec.iata ?? rec.IATA) as string | undefined;
  const name = String((rec.name ?? rec.Name ?? '') as string).trim();
  const lat = Number((rec.latitude_deg ?? rec.lat ?? rec.latitude ?? rec.Latitude) as number);
  const lng = Number((rec.longitude_deg ?? rec.lon ?? rec.lng ?? rec.longitude ?? rec.Longitude) as number);
  if (!icao || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const out: Out = { icao, name, lat, lng };
  if (iata) out.iata = String(iata).trim();
  return out;
}

function parseCsv(text: string): In[] {
  // Minimal CSV parser that handles quotes and commas.
  const lines = text.replace(/\r\n?/g, '\n').split('\n').filter(l => l.length > 0);
  if (lines.length === 0) return [];
  const header = splitCsvLine(lines[0]);
  const rows: In[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const rec: In = {};
    header.forEach((h, idx) => {
      rec[h] = cols[idx];
    });
    rows.push(rec);
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === ',') {
        result.push(cur);
        cur = '';
      } else if (ch === '"') {
        inQuotes = true;
      } else {
        cur += ch;
      }
    }
  }
  result.push(cur);
  return result;
}

async function main() {
  const [, , inputArg, destArg] = process.argv;
  if (!inputArg) {
    console.error('Usage: airports:convert <input.csv|input.json> [dest.json]');
    process.exit(1);
  }
  const inputPath = path.resolve(process.cwd(), inputArg);
  const destPath = path.resolve(process.cwd(), destArg || 'src/lib/airports.json');

  const raw = fs.readFileSync(inputPath, 'utf8');
  let recs: In[] = [];
  if (inputPath.endsWith('.json')) {
    const parsed = JSON.parse(raw);
    recs = Array.isArray(parsed) ? parsed : parsed?.airports || [];
  } else {
    recs = parseCsv(raw);
  }

  const out = recs.map(normalize).filter(Boolean) as Out[];
  out.sort((a, b) => (a.icao < b.icao ? -1 : a.icao > b.icao ? 1 : 0));
  fs.writeFileSync(destPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} airports to ${destPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

