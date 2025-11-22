'use client';

import { Flight } from '@/types/flight';
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

interface FlightViewProps {
  tripId: string;
  flight: Flight;
  prevFlightId: string | null;
  nextFlightId: string | null;
}

export default function FlightView({ tripId, flight, prevFlightId, nextFlightId }: FlightViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="container mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Link
            href={`/view/${tripId}`}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Trip</span>
          </Link>
          <div className="border-l h-6 border-gray-300"></div>
          <h1 className="text-2xl font-bold">{flight.date} - {flight.from || '?'} → {flight.to || '?'}</h1>
        </div>

        {/* Navigation between flights */}
        <div className="flex items-center space-x-2">
          {prevFlightId && (
            <Link
              href={`/view/${tripId}/${prevFlightId}`}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              ← Prev
            </Link>
          )}
          {nextFlightId && (
            <Link
              href={`/view/${tripId}/${nextFlightId}`}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Next →
            </Link>
          )}
        </div>
      </div>

      {/* Compact Flight Data Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
        <div
          className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between cursor-pointer hover:bg-gray-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-4 text-sm">
            <span className="font-medium text-gray-700">
              {flight.from || '?'} → {flight.to || '?'}
            </span>
            <span className="text-gray-600">
              {flight.tachTime ? `${flight.tachTime}h` : '-'}
            </span>
            <span className="text-gray-600">
              {flight.fuelUsed ? `${flight.fuelUsed} gal` : ''}
            </span>
            {flight.remarks && (
              <span className="text-gray-500 italic truncate max-w-md">
                {flight.remarks}
              </span>
            )}
          </div>
          <button className="p-1 hover:bg-gray-200 rounded">
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {isExpanded && (
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50 w-1/6">Date</td>
                <td className="px-4 py-2">{flight.date}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50 w-1/6">Category</td>
                <td className="px-4 py-2">{flight.category}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50 w-1/6">Flight Time</td>
                <td className="px-4 py-2 font-semibold">{flight.tachTime || '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Time Off</td>
                <td className="px-4 py-2">{flight.timeOff || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Time In</td>
                <td className="px-4 py-2">{flight.timeIn || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Wall Time</td>
                <td className="px-4 py-2">{flight.wallTime || '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Tach Off</td>
                <td className="px-4 py-2">{flight.tachOff || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Tach In</td>
                <td className="px-4 py-2">{flight.tachIn || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Hobbs Off → In</td>
                <td className="px-4 py-2">{flight.hobbOff || '-'} → {flight.hobbIn || '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Day T/O</td>
                <td className="px-4 py-2">{flight.takeoffsDay || 0}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Day Ldg (FS)</td>
                <td className="px-4 py-2">{flight.landingDay || 0} ({flight.landingDayFullStop || 0})</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Night T/O</td>
                <td className="px-4 py-2">{flight.takeoffsNight || 0}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Night Ldg (FS)</td>
                <td className="px-4 py-2">{flight.landingNight || 0} ({flight.landingNightFullStop || 0})</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Day VFR</td>
                <td className="px-4 py-2">{flight.dayVfr || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Night VFR</td>
                <td className="px-4 py-2">{flight.nightVfr || '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Day Sim IMC</td>
                <td className="px-4 py-2">{flight.daySimulatedImc || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Night Sim IMC</td>
                <td className="px-4 py-2">{flight.nightSimulatedImc || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Day Actual IMC</td>
                <td className="px-4 py-2">{flight.dayActualImc || '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Night Actual IMC</td>
                <td className="px-4 py-2">{flight.nightActualImc || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">PIC</td>
                <td className="px-4 py-2">{flight.pilotInCommand || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">PIC XC</td>
                <td className="px-4 py-2">{flight.pilotInCommandCrossCountry || '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Dual Received</td>
                <td className="px-4 py-2">{flight.dualReceived || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Dual Given</td>
                <td className="px-4 py-2">{flight.dualGiven || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Day XC</td>
                <td className="px-4 py-2">{flight.dayCrossCountry || '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Night XC</td>
                <td className="px-4 py-2">{flight.nightCrossCountry || '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Fuel Supplied</td>
                <td className="px-4 py-2">{flight.fuelSupplied ? `${flight.fuelSupplied} gal` : '-'}</td>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Fuel Used</td>
                <td className="px-4 py-2">{flight.fuelUsed ? `${flight.fuelUsed} gal` : '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Fuel Cost</td>
                <td className="px-4 py-2">{flight.fuelCost ? `$${flight.fuelCost.toFixed(2)}` : '-'}</td>
                {(flight.route && flight.route.length > 0) ? (
                  <>
                    <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Route</td>
                    <td className="px-4 py-2" colSpan={3}>
                      {flight.route.join(' → ')}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Route</td>
                    <td className="px-4 py-2" colSpan={3}>-</td>
                  </>
                )}
              </tr>
              {(flight.approach && flight.approach.length > 0) && (
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Approaches</td>
                  <td className="px-4 py-2" colSpan={5}>
                    {flight.approach.map((appr, idx) => (
                      <span key={idx} className="mr-3">
                        {appr.airport} {appr.aproachType} RWY {appr.runway}
                        {appr.remarks && ` (${appr.remarks})`}
                        {idx < flight.approach!.length - 1 && ' •'}
                      </span>
                    ))}
                  </td>
                </tr>
              )}
              {flight.remarks && (
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-500 bg-gray-50">Remarks</td>
                  <td className="px-4 py-2" colSpan={5}>{flight.remarks}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Space for graphs and visualizations */}
      <div className="text-gray-400 text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <p>Space reserved for graphs and visualizations</p>
      </div>
    </div>
  );
}
