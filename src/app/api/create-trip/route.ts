import { NextRequest, NextResponse } from 'next/server';
import { FlightsFromDisk, FlightsToDisk, Trip, Flight } from '@/types/flight';
import { summarizeFlightsFromJpi } from '@/lib/jpi';
import fs from 'fs';
import path from 'path';

function generateTripId(flights: Flight[]): string {
  // Use the date of the first flight (sorted by date)
  const sortedFlights = flights.sort((a, b) => a.date.localeCompare(b.date));
  const firstFlightDate = sortedFlights[0]?.date || new Date().toISOString().split('T')[0];
  const dateStr = firstFlightDate; // Already in YYYY-MM-DD format
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Find existing directories with the same date
  const existingDirs = fs.readdirSync(dataDir)
    .filter(dir => dir.startsWith(dateStr))
    .map(dir => {
      const match = dir.match(/_(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    })
    .sort((a, b) => b - a); // Sort descending
  
  const nextSequence = existingDirs.length > 0 ? existingDirs[0] + 1 : 1;
  const sequenceStr = nextSequence.toString().padStart(2, '0');
  
  return `${dateStr}_${sequenceStr}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract data from form
    const flightsJson = formData.get('flights') as string | null;
    const jpiFile = formData.get('jpiFile') as File | null;
    const fuelFile = formData.get('fuelFile') as File | null;
    
    let flights: Flight[] = [];
    if (flightsJson) {
      flights = JSON.parse(flightsJson) as Flight[];
    } else if (jpiFile) {
      // Derive flights from JPI if no manual flights provided
      const jpiBuffer = await jpiFile.arrayBuffer();
      const summaries = await summarizeFlightsFromJpi(jpiBuffer);
      flights = summaries.map((s, i) => {
        // Convert "MM/DD/YYYY HH:mm:ss" to date/time parts
        const [mmddyyyy, dtTime] = s.dateTime.split(' ');
        const [mm, dd, yyyy] = (mmddyyyy || '').split('/');
        const date = (mm && dd && yyyy) ? `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}` : (new Date().toISOString().split('T')[0]);
        const start = s.timeOff || dtTime || '';
        const duration = s.hobbDuration ?? s.tachDuration;
        const end = (() => {
          if (s.timeIn) return s.timeIn;
          if (!start || duration === undefined) return undefined;
          const [h, m, sec] = start.split(':').map((n) => parseInt(n || '0', 10));
          if (!Number.isFinite(h) || !Number.isFinite(m)) return undefined;
          const base = new Date(`${date}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String((sec||0)).padStart(2,'0')}Z`);
          if (isNaN(base.getTime())) return undefined;
          const endMs = base.getTime() + Math.round(duration * 3600000);
          const d2 = new Date(endMs);
          const hh = String(d2.getUTCHours()).padStart(2,'0');
          const mm2 = String(d2.getUTCMinutes()).padStart(2,'0');
          const ss2 = String(d2.getUTCSeconds()).padStart(2,'0');
          return `${hh}:${mm2}:${ss2}`;
        })();

        const baseFlight: Flight = {
          uuid: String(s.id ?? i+1),
          date,
          page: i + 1,
          category: 'ASEL',
          timeOff: start || undefined,
          timeIn: end,
          tachTime: s.tachDuration ?? s.hobbDuration ?? undefined,
          wallTime: s.hobbDuration ?? undefined,
        };

        return {
          ...baseFlight,
          jpiFlightNumber: s.id ?? i + 1,
          jpiFilename: jpiFile.name,
        };
      });
    } else {
      return NextResponse.json({ error: 'No flights data provided' }, { status: 400 });
    }

    if (flights.length === 0) {
      return NextResponse.json({ error: 'No flights selected' }, { status: 400 });
    }
    
    // Generate trip ID and create directory
    const tripId = generateTripId(flights);
    const tripDir = path.join(process.cwd(), 'data', tripId);
    fs.mkdirSync(tripDir, { recursive: true });
    
    // Save uploaded files
    let jpiStoredFilename: string | undefined;
    if (jpiFile) {
      const jpiBuffer = Buffer.from(await jpiFile.arrayBuffer());
      const jpiPath = path.join(tripDir, `jpi_${jpiFile.name}`);
      fs.writeFileSync(jpiPath, jpiBuffer);
      jpiStoredFilename = path.basename(jpiPath);
    }
    
    let fuelStoredFilename: string | undefined;
    if (fuelFile) {
      const fuelBuffer = Buffer.from(await fuelFile.arrayBuffer());
      const fuelPath = path.join(tripDir, `fuel_${fuelFile.name}`);
      fs.writeFileSync(fuelPath, fuelBuffer);
      fuelStoredFilename = path.basename(fuelPath);
    }
    
    // Load existing trips and add new one
    const existingTrips = FlightsFromDisk();
    
    // If flights came from JPI selection, flight.uuid may be the JPI id string
    const jpiSelectedIds: number[] = jpiFile
      ? flights
          .map((f) => Number.parseInt(String(f.uuid), 10))
          .filter((n) => Number.isFinite(n))
      : [];

    const flightsWithFilenames: Flight[] = flights.map((f) => ({
      ...f,
      jpiFilename: jpiStoredFilename ?? f.jpiFilename,
      fuelInvoiceFilename: fuelStoredFilename ?? f.fuelInvoiceFilename,
    }));

    const newTrip: Trip = {
      uuid: tripId,
      flights: flightsWithFilenames,
      jplFlights: jpiSelectedIds.length > 0 ? jpiSelectedIds : (jpiFile ? flightsWithFilenames.map((_, idx) => idx + 1) : []),
      jpiFilename: jpiStoredFilename,
      fuelInvoiceFilename: fuelStoredFilename,
    };
    
    const updatedTrips = [...existingTrips, newTrip];
    
    // Save updated trips to disk
    FlightsToDisk(updatedTrips);
    
    return NextResponse.json({ 
      success: true, 
      tripId: tripId,
      flightCount: flights.length 
    });
    
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' }, 
      { status: 500 }
    );
  }
}
