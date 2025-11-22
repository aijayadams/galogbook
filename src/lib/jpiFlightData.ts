import fs from 'fs';
import path from 'path';
import type { DecodeJpiResult, JpiCsvRow } from 'decodejpi';
import { decodeJpi } from 'decodejpi';

export type FlightSample = {
  index: number;
  time: string;
  altitude?: number;
  lat?: number;
  lng?: number;
};

function parseJpiCoordToDecimal(coord?: string): number | undefined {
  if (!coord) return undefined;
  const dir = coord[0];
  const rest = coord.slice(1);
  const parts = rest.split('.');
  if (parts.length !== 3) return undefined;
  const [degStr, minStr, secStr] = parts;
  const deg = Number.parseInt(degStr, 10);
  const min = Number.parseInt(minStr, 10);
  const sec = Number.parseInt(secStr, 10);
  if (!Number.isFinite(deg) || !Number.isFinite(min) || !Number.isFinite(sec)) return undefined;
  const decimal = deg + min / 60 + sec / 3600;
  if (dir === 'S' || dir === 'W') return -decimal;
  return decimal;
}

export function loadJpiSamplesForFlight(tripId: string, jpiFlightNumber: number): FlightSample[] {
  const tripDir = path.join(process.cwd(), 'data', tripId);
  const files = fs.readdirSync(tripDir).filter((f) => f.toLowerCase().startsWith('jpi_') && f.toLowerCase().endsWith('.jpi'));
  if (files.length === 0) {
    return [];
  }
  const jpiPath = path.join(tripDir, files[0]);

  let result: DecodeJpiResult;
  try {
    result = decodeJpi(jpiPath, jpiFlightNumber);
  } catch {
    return [];
  }

  const rows: JpiCsvRow[] = result.rows;
  return rows.map((row, idx) => {
    const altRaw = (row.ALT ?? row.alt ?? '') as string;
    const altNum = altRaw ? Number.parseFloat(String(altRaw).trim()) : NaN;
    const altitude = Number.isFinite(altNum) ? altNum : undefined;
    const lat = parseJpiCoordToDecimal(row.LAT as string | undefined);
    const lng = parseJpiCoordToDecimal(row.LNG as string | undefined);
    return {
      index: idx,
      time: String(row.TIME ?? ''),
      altitude,
      lat,
      lng,
    };
  });
}

