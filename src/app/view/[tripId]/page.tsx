'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import { Trip, Flight } from '@/types/flight';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EditableCell from '@/components/EditableCell';
import AirportAutocomplete from '@/components/AirportAutocomplete';
import airportsData from '@/lib/airports.json';

interface ViewTripPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export default function ViewTripPage({ params }: ViewTripPageProps) {
  const { tripId } = use(params);
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<{ flightIndex: number; field: 'from' | 'to' } | null>(null);

  // Normalize airports data for autocomplete
  const airports = useMemo(() => {
    return (airportsData as unknown[]).map((a: unknown) => {
      const rec = a as Record<string, unknown>;
      return {
        icao: String(rec.icao || ''),
        iata: rec.iata ? String(rec.iata) : undefined,
        name: String(rec.name || ''),
        lat: Number(rec.lat || 0),
        lng: Number(rec.lng || 0)
      };
    }).filter(a => a.icao && a.name);
  }, []);

  // Load trip data
  useEffect(() => {
    const loadTrip = async () => {
      try {
        const response = await fetch(`/api/get-trip?tripId=${tripId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/list');
            return;
          }
          throw new Error('Failed to load trip');
        }
        const data = await response.json();
        setTrip(data.trip);
      } catch (error) {
        console.error('Error loading trip:', error);
        alert('Failed to load trip');
      } finally {
        setLoading(false);
      }
    };
    loadTrip();
  }, [tripId, router]);

  // Auto-save trip when it changes
  useEffect(() => {
    if (!trip || loading) return;

    const saveTrip = async () => {
      setSaving(true);
      try {
        const response = await fetch('/api/update-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tripId, trip })
        });
        if (!response.ok) throw new Error('Failed to save trip');
      } catch (error) {
        console.error('Error saving trip:', error);
        alert('Failed to save changes');
      } finally {
        setSaving(false);
      }
    };

    const debounceTimer = setTimeout(saveTrip, 1000);
    return () => clearTimeout(debounceTimer);
  }, [trip, tripId, loading]);

  // Update flight field
  const updateFlightField = <K extends keyof Flight>(
    flightIndex: number,
    field: K,
    value: Flight[K]
  ) => {
    if (!trip) return;
    const updatedFlights = trip.flights.map((f, i) =>
      i === flightIndex ? { ...f, [field]: value } : f
    );
    setTrip({ ...trip, flights: updatedFlights });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Trip not found</div>
      </div>
    );
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
        {saving && (
          <div className="text-sm text-gray-500">
            Saving...
          </div>
        )}
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
          <h2 className="text-xl font-semibold text-gray-900">Flights (Click any field to edit)</h2>
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
                <React.Fragment key={flight.uuid || index}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{index + 1}</td>
<<<<<<< HEAD
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.date}
                      onSave={(value) => updateFlightField(index, 'date', value as string)}
                      type="date"
                      className="w-32"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.category}
                      onSave={(value) => updateFlightField(index, 'category', value as string)}
                      className="w-20"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingField?.flightIndex === index && editingField?.field === 'from' ? (
                      <AirportAutocomplete
                        value={flight.from || ''}
                        onChange={(value) => updateFlightField(index, 'from', value)}
                        airports={airports}
                        placeholder="From"
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onBlur={() => setEditingField(null)}
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditingField({ flightIndex: index, field: 'from' })}
                        className="w-20 px-2 py-1 text-left hover:bg-gray-100 rounded transition-colors"
                      >
                        {flight.from || '-'}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingField?.flightIndex === index && editingField?.field === 'to' ? (
                      <AirportAutocomplete
                        value={flight.to || ''}
                        onChange={(value) => updateFlightField(index, 'to', value)}
                        airports={airports}
                        placeholder="To"
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onBlur={() => setEditingField(null)}
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditingField({ flightIndex: index, field: 'to' })}
                        className="w-20 px-2 py-1 text-left hover:bg-gray-100 rounded transition-colors"
                      >
                        {flight.to || '-'}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.timeOff}
                      onSave={(value) => updateFlightField(index, 'timeOff', value as string)}
                      type="time"
                      className="w-24"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.timeIn}
                      onSave={(value) => updateFlightField(index, 'timeIn', value as string)}
                      type="time"
                      className="w-24"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                    <EditableCell
                      value={flight.tachTime}
                      onSave={(value) => updateFlightField(index, 'tachTime', value as number)}
                      type="number"
                      step="0.1"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.takeoffsDay}
                      onSave={(value) => updateFlightField(index, 'takeoffsDay', value as number)}
                      type="number"
                      min="0"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.landingDay}
                      onSave={(value) => updateFlightField(index, 'landingDay', value as number)}
                      type="number"
                      min="0"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.takeoffsNight}
                      onSave={(value) => updateFlightField(index, 'takeoffsNight', value as number)}
                      type="number"
                      min="0"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.landingNight}
                      onSave={(value) => updateFlightField(index, 'landingNight', value as number)}
                      type="number"
                      min="0"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.pilotInCommand}
                      onSave={(value) => updateFlightField(index, 'pilotInCommand', value as number)}
                      type="number"
                      step="0.1"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.dualReceived}
                      onSave={(value) => updateFlightField(index, 'dualReceived', value as number)}
                      type="number"
                      step="0.1"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.dayCrossCountry || flight.nightCrossCountry}
                      onSave={(value) => updateFlightField(index, 'dayCrossCountry', value as number)}
                      type="number"
                      step="0.1"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.fuelUsed}
                      onSave={(value) => updateFlightField(index, 'fuelUsed', value as number)}
                      type="number"
                      step="0.1"
                      className="w-16"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    <EditableCell
                      value={flight.fuelCost}
                      onSave={(value) => updateFlightField(index, 'fuelCost', value as number)}
                      type="number"
                      step="0.01"
                      className="w-20"
                    />
                  </td>
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
                <tr className="bg-gray-50 hover:bg-gray-100">
                  <td colSpan={19} className="px-4 py-2 text-sm text-gray-900">
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-500 font-medium whitespace-nowrap">Remarks:</span>
                      <div className="flex-1">
                        <EditableCell
                          value={flight.remarks}
                          onSave={(value) => updateFlightField(index, 'remarks', value as string)}
                          className="w-full"
                          placeholder="No remarks"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
