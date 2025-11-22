import { Trip, FlightsFromDisk } from '@/types/flight';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ViewTripPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

// Load trips function
function loadTrips(): Trip[] {
  return FlightsFromDisk();
}

export default async function ViewTripPage({ params }: ViewTripPageProps) {
  const { tripId } = await params;
  const trips = loadTrips();

  // Find the specific trip
  const trip = trips.find(t => t.uuid === tripId);

  // If trip not found, show 404
  if (!trip) {
    notFound();
  }

  // Calculate trip totals
  const totalFlightTime = trip.flights.reduce((sum, f) => sum + (f.tachTime || 0), 0);
  const totalFuelUsed = trip.flights.reduce((sum, f) => sum + (f.fuelUsed || 0), 0);
  const totalFuelCost = trip.flights.reduce((sum, f) => sum + (f.fuelCost || 0), 0);
  const totalTakeoffsDay = trip.flights.reduce((sum, f) => sum + (f.takeoffsDay || 0), 0);
  const totalTakeoffsNight = trip.flights.reduce((sum, f) => sum + (f.takeoffsNight || 0), 0);
  const totalPIC = trip.flights.reduce((sum, f) => sum + (f.pilotInCommand || 0), 0);
  const totalDualReceived = trip.flights.reduce((sum, f) => sum + (f.dualReceived || 0), 0);
  const totalCrossCountry = trip.flights.reduce((sum, f) => sum + (f.dayCrossCountry || 0) + (f.nightCrossCountry || 0), 0);

  return (
    <div className="container mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/list"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Flight Log</span>
          </Link>
          <div className="border-l h-6 border-gray-300"></div>
          <h1 className="text-3xl font-bold">Trip {tripId}</h1>
        </div>
      </div>

      {/* Trip Summary Cards */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-500 text-sm">Total Flights</div>
          <div className="text-2xl font-bold text-gray-900">{trip.flights.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-500 text-sm">Total Flight Time</div>
          <div className="text-2xl font-bold text-gray-900">{totalFlightTime.toFixed(1)}h</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-500 text-sm">Total Fuel Used</div>
          <div className="text-2xl font-bold text-gray-900">{totalFuelUsed.toFixed(1)} gal</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-500 text-sm">Total Fuel Cost</div>
          <div className="text-2xl font-bold text-gray-900">${totalFuelCost.toFixed(2)}</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-blue-700 text-xs font-medium">Day Takeoffs</div>
          <div className="text-xl font-bold text-blue-900">{totalTakeoffsDay}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-blue-700 text-xs font-medium">Night Takeoffs</div>
          <div className="text-xl font-bold text-blue-900">{totalTakeoffsNight}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-green-700 text-xs font-medium">PIC Time</div>
          <div className="text-xl font-bold text-green-900">{totalPIC.toFixed(1)}h</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div className="text-purple-700 text-xs font-medium">Dual Received</div>
          <div className="text-xl font-bold text-purple-900">{totalDualReceived.toFixed(1)}h</div>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="text-amber-700 text-xs font-medium">Cross Country</div>
          <div className="text-xl font-bold text-amber-900">{totalCrossCountry.toFixed(1)}h</div>
        </div>
      </div>

      {/* Flights Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Flights</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Flight</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Category</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">From</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">To</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Time Off</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Time In</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Flight Time</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Day T/O</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Day Land</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Night T/O</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Night Land</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">PIC Time</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Dual Received</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Cross Country</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Fuel Used</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Fuel Cost</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Remarks</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trip.flights.map((flight, index) => (
                <tr key={flight.uuid || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{index + 1}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.date}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.category}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.from || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.to || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.timeOff || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.timeIn || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{flight.tachTime || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.takeoffsDay || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.landingDay || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.takeoffsNight || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.landingNight || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.pilotInCommand || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.dualReceived || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.dayCrossCountry || flight.nightCrossCountry || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.fuelUsed || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{flight.fuelCost ? `$${flight.fuelCost.toFixed(2)}` : '-'}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 max-w-xs truncate" title={flight.remarks}>{flight.remarks || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <Link
                      href={`/view/${tripId}/${flight.uuid}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
