import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "flights.json");

export interface Trip {
  uuid: string;
  flights: Flight[];  
  // A JPL file
  jplFlights: number[];
  // Optional filenames associated with this trip
  jpiFilename?: string;
  fuelInvoiceFilename?: string;
}

export interface Flight {
  uuid: string;

  date: string; // e.g. "2021-06-10"
  page: number;

  // Flight times
  category: string; // e.g. "ASEL, AMEL, ASES, AMES, glider, balloon, AAED, BATD"
  // Take off and Landing
  takeoffsDay?: number;
  takeoffsNight?: number;
  landingDay?: number;
  landingDayFullStop?: number;
  landingNight?: number;
  landingNightFullStop?: number;

  // Condition of flight
  dayVfr?: number;
  nightVfr?: number;
  daySimulatedImc?: number;
  nightSimulatedImc?: number;
  dayActualImc?: number;
  nightActualImc?: number;
  dayCrossCountry?: number;
  nightCrossCountry?: number;
  dualReceived?: number;
  dualGiven?: number;
  pilotInCommand?: number;
  pilotInCommandCrossCountry?: number;

  // Times
  tachTime?: number;
  wallTime?: number;
  timeOff?: string; // e.g. "14:30"
  timeIn?: string; // e.g. "15:45"
  tachOff?: number;
  tachIn?: number;
  hobbOff?: number;
  hobbIn?: number;

  // Fuel
  fuelSupplied?: number;
  fuelUsed?: number;
  fuelCost?: number;

  // JPI / fuel invoice metadata
  jpiFlightNumber?: number;
  jpiFilename?: string;
  fuelInvoiceFilename?: string;

  // Route of flight
  from?: string;
  to?: string;
  route?: string[]; // e.g. "KJFK", "KLAX"
  approach?: Approach[]; // e.g. "ILS, VOR, GPS"
  remarks?: string;
}
export interface Approach {
  airport: string;
  aproachType: string;
  runway: string;
  remarks?: string;
}

export function FlightsFromDisk(): Trip[] {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  const raw = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(raw) as Trip[];
}

export function FlightsToDisk(trips: Trip[]): void {
  const json = JSON.stringify(trips, null, 2);
  fs.writeFileSync(dataFile, json, "utf-8");
}
