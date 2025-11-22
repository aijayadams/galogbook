'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Flight } from '@/types/flight';
import AirportAutocomplete from './AirportAutocomplete';

interface Airport {
  icao: string;
  iata?: string;
  name: string;
  lat: number;
  lng: number;
}

interface FlightEditModalProps {
  flight: Flight;
  airports: Airport[];
  onSave: (flight: Flight) => void;
  onClose: () => void;
}

export default function FlightEditModal({ flight, airports, onSave, onClose }: FlightEditModalProps) {
  const [editedFlight, setEditedFlight] = useState<Flight>(flight);

  useEffect(() => {
    setEditedFlight(flight);
  }, [flight]);

  const handleSave = () => {
    onSave(editedFlight);
    onClose();
  };

  const updateField = <K extends keyof Flight>(field: K, value: Flight[K]) => {
    setEditedFlight(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionClass = "mb-6 pb-6 border-b border-gray-200 last:border-b-0";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Flight</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Info */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  value={editedFlight.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={editedFlight.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className={inputClass}
                >
                  <option value="ASEL">ASEL (Airplane Single Engine Land)</option>
                  <option value="AMEL">AMEL (Airplane Multi Engine Land)</option>
                  <option value="ASES">ASES (Airplane Single Engine Sea)</option>
                  <option value="AMES">AMES (Airplane Multi Engine Sea)</option>
                  <option value="glider">Glider</option>
                  <option value="balloon">Balloon</option>
                  <option value="AAED">AAED (Advanced Aviation Training Device)</option>
                  <option value="BATD">BATD (Basic Aviation Training Device)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>From</label>
                <AirportAutocomplete
                  value={editedFlight.from || ''}
                  onChange={(value) => updateField('from', value)}
                  airports={airports}
                  placeholder="From"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>To</label>
                <AirportAutocomplete
                  value={editedFlight.to || ''}
                  onChange={(value) => updateField('to', value)}
                  airports={airports}
                  placeholder="To"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Remarks</label>
              <textarea
                value={editedFlight.remarks || ''}
                onChange={(e) => updateField('remarks', e.target.value)}
                className={inputClass}
                rows={3}
                placeholder="Flight remarks..."
              />
            </div>
          </div>

          {/* Times */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Times</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Time Off</label>
                <input
                  type="time"
                  value={editedFlight.timeOff || ''}
                  onChange={(e) => updateField('timeOff', e.target.value)}
                  className={inputClass}
                  step="1"
                />
              </div>
              <div>
                <label className={labelClass}>Time In</label>
                <input
                  type="time"
                  value={editedFlight.timeIn || ''}
                  onChange={(e) => updateField('timeIn', e.target.value)}
                  className={inputClass}
                  step="1"
                />
              </div>
              <div>
                <label className={labelClass}>Tach Time (hrs)</label>
                <input
                  type="number"
                  value={editedFlight.tachTime || ''}
                  onChange={(e) => updateField('tachTime', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Hobbs Time (hrs)</label>
                <input
                  type="number"
                  value={editedFlight.wallTime || ''}
                  onChange={(e) => updateField('wallTime', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Tach Off</label>
                <input
                  type="number"
                  value={editedFlight.tachOff || ''}
                  onChange={(e) => updateField('tachOff', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Tach In</label>
                <input
                  type="number"
                  value={editedFlight.tachIn || ''}
                  onChange={(e) => updateField('tachIn', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Hobbs Off</label>
                <input
                  type="number"
                  value={editedFlight.hobbOff || ''}
                  onChange={(e) => updateField('hobbOff', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Hobbs In</label>
                <input
                  type="number"
                  value={editedFlight.hobbIn || ''}
                  onChange={(e) => updateField('hobbIn', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Takeoffs and Landings */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Takeoffs & Landings</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Day Takeoffs</label>
                <input
                  type="number"
                  value={editedFlight.takeoffsDay || ''}
                  onChange={(e) => updateField('takeoffsDay', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={inputClass}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>Day Landings</label>
                <input
                  type="number"
                  value={editedFlight.landingDay || ''}
                  onChange={(e) => updateField('landingDay', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={inputClass}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>Day Full Stop</label>
                <input
                  type="number"
                  value={editedFlight.landingDayFullStop || ''}
                  onChange={(e) => updateField('landingDayFullStop', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={inputClass}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>Night Takeoffs</label>
                <input
                  type="number"
                  value={editedFlight.takeoffsNight || ''}
                  onChange={(e) => updateField('takeoffsNight', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={inputClass}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>Night Landings</label>
                <input
                  type="number"
                  value={editedFlight.landingNight || ''}
                  onChange={(e) => updateField('landingNight', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={inputClass}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>Night Full Stop</label>
                <input
                  type="number"
                  value={editedFlight.landingNightFullStop || ''}
                  onChange={(e) => updateField('landingNightFullStop', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={inputClass}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Flight Conditions */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Conditions (hours)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Day VFR</label>
                <input
                  type="number"
                  value={editedFlight.dayVfr || ''}
                  onChange={(e) => updateField('dayVfr', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Night VFR</label>
                <input
                  type="number"
                  value={editedFlight.nightVfr || ''}
                  onChange={(e) => updateField('nightVfr', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Day Simulated IMC</label>
                <input
                  type="number"
                  value={editedFlight.daySimulatedImc || ''}
                  onChange={(e) => updateField('daySimulatedImc', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Night Simulated IMC</label>
                <input
                  type="number"
                  value={editedFlight.nightSimulatedImc || ''}
                  onChange={(e) => updateField('nightSimulatedImc', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Day Actual IMC</label>
                <input
                  type="number"
                  value={editedFlight.dayActualImc || ''}
                  onChange={(e) => updateField('dayActualImc', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Night Actual IMC</label>
                <input
                  type="number"
                  value={editedFlight.nightActualImc || ''}
                  onChange={(e) => updateField('nightActualImc', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Pilot Experience */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilot Experience (hours)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>PIC Time</label>
                <input
                  type="number"
                  value={editedFlight.pilotInCommand || ''}
                  onChange={(e) => updateField('pilotInCommand', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>PIC Cross Country</label>
                <input
                  type="number"
                  value={editedFlight.pilotInCommandCrossCountry || ''}
                  onChange={(e) => updateField('pilotInCommandCrossCountry', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Dual Received</label>
                <input
                  type="number"
                  value={editedFlight.dualReceived || ''}
                  onChange={(e) => updateField('dualReceived', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Dual Given</label>
                <input
                  type="number"
                  value={editedFlight.dualGiven || ''}
                  onChange={(e) => updateField('dualGiven', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Day Cross Country</label>
                <input
                  type="number"
                  value={editedFlight.dayCrossCountry || ''}
                  onChange={(e) => updateField('dayCrossCountry', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Night Cross Country</label>
                <input
                  type="number"
                  value={editedFlight.nightCrossCountry || ''}
                  onChange={(e) => updateField('nightCrossCountry', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Fuel */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Fuel Supplied (gal)</label>
                <input
                  type="number"
                  value={editedFlight.fuelSupplied || ''}
                  onChange={(e) => updateField('fuelSupplied', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Fuel Used (gal)</label>
                <input
                  type="number"
                  value={editedFlight.fuelUsed || ''}
                  onChange={(e) => updateField('fuelUsed', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className={labelClass}>Fuel Cost ($)</label>
                <input
                  type="number"
                  value={editedFlight.fuelCost || ''}
                  onChange={(e) => updateField('fuelCost', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={inputClass}
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
