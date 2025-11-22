// Lightweight wrapper around the external `decodejpi` library.
// Uses a dynamic import so the app can build even if the library is not installed.

function toUint8Array(ab: ArrayBuffer): Uint8Array {
  return new Uint8Array(ab);
}

function mmddyyyyToIso(dateStr: string): string {
  // Input: MM/DD/YYYY → Output: YYYY-MM-DD
  const [mm, dd, yyyy] = dateStr.split("/");
  if (!mm || !dd || !yyyy) return dateStr;
  const m = mm.padStart(2, "0");
  const d = dd.padStart(2, "0");
  return `${yyyy}-${m}-${d}`;
}

export type JpiFlightRecord = {
  id: number;
  size: number;
  start: number;
  date: string; // MM/DD/YYYY
  time: string; // HH:mm:ss
  interval: number; // seconds
};

type DecodeJpiModule = {
  Decomp: new () => {
    parseFile(buf: Uint8Array): void;
    listFlights(): JpiFlightRecord[];
    summarizeFlights(): JpiFlightSummary[];
  };
  decodeJpiBufferToCsv: (buf: Uint8Array, flightId: number) => { headers: string[]; rows: string[][] };
};

export async function listFlightsFromJpi(ab: ArrayBuffer): Promise<JpiFlightRecord[]> {
  try {
    const mod = (await import('decodejpi')) as unknown as DecodeJpiModule;
    const d = new mod.Decomp();
    d.parseFile(toUint8Array(ab));
    return d.listFlights();
  } catch {
    throw new Error(
      "JPI parser unavailable. Install and build it: npm i github:AiJayAdams/jpi && (cd node_modules/decodejpi && npm run build)"
    );
  }
}

export async function decodeFlightCsvFromJpi(ab: ArrayBuffer, flightId: number): Promise<{ headers: string[]; rows: string[][] }>{
  try {
    const mod = (await import('decodejpi')) as unknown as DecodeJpiModule;
    return mod.decodeJpiBufferToCsv(toUint8Array(ab), flightId);
  } catch {
    throw new Error(
      "JPI parser unavailable. Install and build it: npm i github:AiJayAdams/jpi && (cd node_modules/decodejpi && npm run build)"
    );
  }
}

export type JpiFlightSummary = {
  id: number;
  dateTime: string;
  timeOff?: string; // HH:mm:ss
  timeIn?: string;  // HH:mm:ss
  tachDuration?: number;
  hobbDuration?: number;
  startLat?: string;
  startLng?: string;
  endLat?: string;
  endLng?: string;
};

export async function summarizeFlightsFromJpi(ab: ArrayBuffer): Promise<JpiFlightSummary[]> {
  try {
    const mod = (await import('decodejpi')) as unknown as DecodeJpiModule;
    const d = new mod.Decomp();
    d.parseFile(toUint8Array(ab));
    return d.summarizeFlights();
  } catch {
    throw new Error(
      "JPI parser unavailable. Install and build it: npm i github:AiJayAdams/jpi && (cd node_modules/decodejpi && npm run build)"
    );
  }
}

export function mapJpiFlightsToAppFlights(jpi: JpiFlightRecord[]): { date: string; page: number }[] {
  // Minimal mapping to app Flight shape: only date and page for now.
  return jpi.map((rec, idx) => ({
    date: mmddyyyyToIso(rec.date),
    page: idx + 1,
  }));
}
