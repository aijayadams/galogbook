import { NextRequest, NextResponse } from 'next/server';
import { FlightsFromDisk } from '@/types/flight';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json({ error: 'Missing tripId parameter' }, { status: 400 });
    }

    // Load all trips
    const trips = FlightsFromDisk();

    // Find the specific trip
    const trip = trips.find(t => t.uuid === tripId);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ trip });
  } catch (error) {
    console.error('Error loading trip:', error);
    return NextResponse.json({ error: 'Failed to load trip' }, { status: 500 });
  }
}
