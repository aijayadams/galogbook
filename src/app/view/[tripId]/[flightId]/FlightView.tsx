'use client';

import { Flight } from '@/types/flight';
import type { FlightSample } from '@/lib/jpiFlightData';
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Map, { Layer, Source } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'mapbox-gl/dist/mapbox-gl.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface FlightViewProps {
  tripId: string;
  flight: Flight;
  prevFlightId: string | null;
  nextFlightId: string | null;
  samples: FlightSample[];
}

export default function FlightView({ tripId, flight, prevFlightId, nextFlightId, samples }: FlightViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const coords = useMemo(
    () => samples.filter((s) => s.lat !== undefined && s.lng !== undefined),
    [samples]
  );

  const mapCenter = useMemo(() => {
    if (coords.length === 0) return null;
    const latAvg = coords.reduce((sum, s) => sum + (s.lat ?? 0), 0) / coords.length;
    const lngAvg = coords.reduce((sum, s) => sum + (s.lng ?? 0), 0) / coords.length;
    return { latitude: latAvg, longitude: lngAvg };
  }, [coords]);

  const lineGeoJson = useMemo(() => {
    if (coords.length < 2) return null;
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: coords.map((s) => [s.lng!, s.lat!]),
      },
      properties: {},
    };
  }, [coords]);

  const lineLayer: LayerProps = {
    id: 'flight-path',
    type: 'line',
    paint: {
      'line-color': '#2563eb',
      'line-width': 3,
    },
  };

  const altitudeSamples = useMemo(
    () => samples.filter((s) => typeof s.altitude === 'number'),
    [samples]
  );

  const altitudeData = useMemo(() => {
    if (altitudeSamples.length === 0) return null;
    const labels = altitudeSamples.map((s) => s.time || String(s.index));
    const data = altitudeSamples.map((s) => s.altitude ?? 0);
    return {
      labels,
      datasets: [
        {
          label: 'Altitude',
          data,
          borderColor: 'rgb(37, 99, 235)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.2,
          pointRadius: 0,
        },
      ],
    };
  }, [altitudeSamples]);

  const altitudeOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
        },
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 6,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Altitude',
          },
        },
      },
    }),
    []
  );

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

      {/* Graphs and visualizations */}
      <div className="grid grid-cols-1 gap-6 mt-8">
        {/* Mapbox flight path */}
        <div className="h-80 bg-gray-100 border rounded-lg overflow-hidden">
          {process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN && mapCenter && lineGeoJson ? (
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              initialViewState={{
                longitude: mapCenter.longitude,
                latitude: mapCenter.latitude,
                zoom: 8,
              }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              style={{ width: '100%', height: '100%' }}
            >
              <Source id="flight-path-source" type="geojson" data={lineGeoJson}>
                <Layer {...lineLayer} />
              </Source>
            </Map>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm px-4 text-center">
              {coords.length === 0
                ? 'No GPS points available from JPI for this flight.'
                : 'Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to see the Mapbox route.'}
            </div>
          )}
        </div>

        {/* Altitude chart */}
        <div className="bg-white border rounded-lg p-4 h-64">
          <h2 className="text-lg font-semibold mb-2">Altitude Profile</h2>
          {altitudeData ? (
            <Line data={altitudeData} options={altitudeOptions} />
          ) : (
            <p className="text-sm text-gray-500">No altitude data available from JPI for this flight.</p>
          )}
        </div>
      </div>
    </div>
  );
}
