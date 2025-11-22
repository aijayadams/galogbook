import { FlightsFromDisk } from '@/types/flight';
import { notFound } from 'next/navigation';
import FlightView from './FlightView';

interface ViewFlightPageProps {
  params: Promise<{
    tripId: string;
    flightId: string;
  }>;
}

export default async function ViewFlightPage({ params }: ViewFlightPageProps) {
  const { tripId, flightId } = await params;
  const trips = FlightsFromDisk();

  // Find the specific trip
  const trip = trips.find(t => t.uuid === tripId);

  if (!trip) {
    notFound();
  }

  // Find the specific flight
  const flight = trip.flights.find(f => f.uuid === flightId);

  if (!flight) {
    notFound();
  }

  // Find flight index for navigation
  const flightIndex = trip.flights.findIndex(f => f.uuid === flightId);
  const prevFlightId = flightIndex > 0 ? trip.flights[flightIndex - 1].uuid : null;
  const nextFlightId = flightIndex < trip.flights.length - 1 ? trip.flights[flightIndex + 1].uuid : null;

  return (
    <FlightView
      tripId={tripId}
      flight={flight}
      prevFlightId={prevFlightId}
      nextFlightId={nextFlightId}
    />
  );
}
