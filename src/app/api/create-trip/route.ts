import { NextRequest, NextResponse } from 'next/server';
import { FlightsFromDisk, FlightsToDisk, Trip, Flight } from '@/types/flight';
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
    const flightsJson = formData.get('flights') as string;
    const jpiFile = formData.get('jpiFile') as File | null;
    const fuelFile = formData.get('fuelFile') as File | null;
    
    if (!flightsJson) {
      return NextResponse.json({ error: 'No flights data provided' }, { status: 400 });
    }
    
    const flights: Flight[] = JSON.parse(flightsJson);
    
    if (flights.length === 0) {
      return NextResponse.json({ error: 'No flights selected' }, { status: 400 });
    }
    
    // Generate trip ID and create directory
    const tripId = generateTripId(flights);
    const tripDir = path.join(process.cwd(), 'data', tripId);
    fs.mkdirSync(tripDir, { recursive: true });
    
    // Save uploaded files
    if (jpiFile) {
      const jpiBuffer = Buffer.from(await jpiFile.arrayBuffer());
      const jpiPath = path.join(tripDir, `jpi_${jpiFile.name}`);
      fs.writeFileSync(jpiPath, jpiBuffer);
    }
    
    if (fuelFile) {
      const fuelBuffer = Buffer.from(await fuelFile.arrayBuffer());
      const fuelPath = path.join(tripDir, `fuel_${fuelFile.name}`);
      fs.writeFileSync(fuelPath, fuelBuffer);
    }
    
    // Load existing trips and add new one
    const existingTrips = FlightsFromDisk();
    
    const newTrip: Trip = {
      uuid: tripId,
      flights: flights,
      jplFlights: []
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
