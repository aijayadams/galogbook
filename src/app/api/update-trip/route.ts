import { NextRequest, NextResponse } from 'next/server';
import { FlightsFromDisk, FlightsToDisk, Trip } from '@/types/flight';

export async function POST(request: NextRequest) {
  try {
    const { tripId, trip }: { tripId: string; trip: Trip } = await request.json();

    if (!tripId || !trip) {
      return NextResponse.json({ error: 'Missing tripId or trip data' }, { status: 400 });
    }

    // Load existing trips
    const trips = FlightsFromDisk();

    // Find and update the trip
    const updatedTrips = trips.map(t => t.uuid === tripId ? trip : t);

    // Save back to disk
    FlightsToDisk(updatedTrips);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}
