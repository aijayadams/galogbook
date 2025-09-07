
import { Trip, FlightsFromDisk } from '@/types/flight';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Load trips function as requested
function loadTrips(): Trip[] {
  return FlightsFromDisk();
}

export default function List() {
  const trips = loadTrips();
  const totalFlights = trips.reduce((sum, trip) => sum + trip.flights.length, 0);

  // Flatten trips into rows with trip information
  const flightRows = trips.flatMap((trip, tripIndex) => 
    trip.flights.map((flight, flightIndex) => ({
      ...flight,
      tripId: trip.uuid,
      tripIndex: tripIndex + 1,
      isFirstFlightInTrip: flightIndex === 0,
      flightsInTrip: trip.flights.length,
      tripTotalTime: trip.flights.reduce((sum, f) => sum + (f.tachTime || 0), 0),
      tripTotalFuel: trip.flights.reduce((sum, f) => sum + (f.fuelUsed || 0), 0),
      tripTotalCost: trip.flights.reduce((sum, f) => sum + (f.fuelCost || 0), 0)
    }))
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Flight Log</h1>
        <Link 
          href="/new"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Flight</span>
        </Link>
      </div>
      
      {flightRows.length === 0 ? (
        <p className="text-gray-500">No flights found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-24">Trip</th>
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
              {flightRows.map((flight, index) => (
                <tr key={flight.uuid || index} className="hover:bg-gray-50">
                  {/* Trip column with rowspan for multi-flight trips */}
                  {flight.isFirstFlightInTrip && (
                    <td 
                      rowSpan={flight.flightsInTrip} 
                      className={`px-6 py-3 text-sm border-r-2 w-24 ${
                        flight.flightsInTrip > 1 
                          ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium' 
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div className="text-lg font-bold">#{flight.tripIndex}</div>
                        {flight.flightsInTrip > 1 && (
                          <>
                            <div className="text-xs text-center">
                              {flight.flightsInTrip} flights
                            </div>
                            <div className="text-xs text-center border-t pt-1">
                              <div>{flight.tripTotalTime.toFixed(1)}h</div>
                              <div>{flight.tripTotalFuel.toFixed(1)} gal</div>
                              <div>${flight.tripTotalCost.toFixed(0)}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                  
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
                  
                  {/* Actions column - only show for first flight in trip */}
                  {flight.isFirstFlightInTrip && (
                    <td rowSpan={flight.flightsInTrip} className="px-3 py-3 text-center border-l">
                      <button className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs">
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-500">Total Trips</div>
          <div className="text-2xl font-bold text-gray-900">{trips.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-500">Total Flights</div>
          <div className="text-2xl font-bold text-gray-900">{totalFlights}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-gray-500">Average Flights per Trip</div>
          <div className="text-2xl font-bold text-gray-900">
            {trips.length > 0 ? (totalFlights / trips.length).toFixed(1) : '0'}
          </div>
        </div>
      </div>
    </div>
  );
}