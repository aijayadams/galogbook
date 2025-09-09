'use client';

import { useState, useCallback, useMemo } from 'react';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Flight } from '@/types/flight';
import { useRouter } from 'next/navigation';

interface FileUploadState {
  jpiFile: File | null;
  fuelInvoiceFile: File | null;
  dragOver: 'jpi' | 'fuel' | null;
}

interface FuelData {
  fuelDollars: number;
  fuelGal: number;
}

// JPI parsing now handled via /api/list-jpi

export default function NewTripPage() {
  const router = useRouter();
  const [uploadState, setUploadState] = useState<FileUploadState>({
    jpiFile: null,
    fuelInvoiceFile: null,
    dragOver: null,
  });
  
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlights, setSelectedFlights] = useState<Set<string>>(new Set());
  const [fuelData, setFuelData] = useState<FuelData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  // Handle file uploads
  const handleDragOver = useCallback((e: React.DragEvent, type: 'jpi' | 'fuel') => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, dragOver: type }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, dragOver: null }));
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, type: 'jpi' | 'fuel') => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, dragOver: null }));
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setUploadState(prev => ({
        ...prev,
        [type === 'jpi' ? 'jpiFile' : 'fuelInvoiceFile']: file
      }));
      
      if (type === 'jpi') {
        try {
          setIsProcessing(true);
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/list-jpi', { method: 'POST', body: formData });
          if (!res.ok) throw new Error('Failed to parse JPI file');
          const data = await res.json() as { flights: { id: number; date: string; index: number; tachDuration?: number; hobbDuration?: number; timeOff?: string; timeIn?: string; from?: string; to?: string }[] };
          const mapped: Flight[] = (data.flights || []).map((f) => ({
            uuid: String(f.id),
            date: f.date,
            page: f.index,
            category: 'ASEL',
            tachTime: f.tachDuration ?? f.hobbDuration ?? 0,
            wallTime: f.hobbDuration ?? undefined,
            timeOff: f.timeOff,
            timeIn: f.timeIn,
            from: f.from,
            to: f.to,
          }));
          setFlights(mapped);
          setSelectedFlights(new Set());
        } catch (err) {
          console.error(err);
          alert('Could not read JPI file. See console for details.');
        } finally {
          setIsProcessing(false);
        }
      } else if (type === 'fuel') {
        // Process fuel invoice via API
        try {
          setIsProcessing(true);
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/process-fuel', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Failed to process fuel invoice');
          }
          
          const fuel = await response.json();
          setFuelData(fuel);
        } catch (error) {
          console.error('Error processing fuel invoice:', error);
          alert('Error processing fuel invoice. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      }
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: 'jpi' | 'fuel') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadState(prev => ({
        ...prev,
        [type === 'jpi' ? 'jpiFile' : 'fuelInvoiceFile']: file
      }));
      
      if (type === 'jpi') {
        try {
          setIsProcessing(true);
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/list-jpi', { method: 'POST', body: formData });
          if (!res.ok) throw new Error('Failed to parse JPI file');
          const data = await res.json() as { flights: { id: number; date: string; index: number; tachDuration?: number; hobbDuration?: number; timeOff?: string; timeIn?: string; from?: string; to?: string }[] };
          const mapped: Flight[] = (data.flights || []).map((f) => ({
            uuid: String(f.id),
            date: f.date,
            page: f.index,
            category: 'ASEL',
            tachTime: f.tachDuration ?? f.hobbDuration ?? 0,
            wallTime: f.hobbDuration ?? undefined,
            timeOff: f.timeOff,
            timeIn: f.timeIn,
            from: f.from,
            to: f.to,
          }));
          setFlights(mapped);
          setSelectedFlights(new Set());
        } catch (err) {
          console.error(err);
          alert('Could not read JPI file. See console for details.');
        } finally {
          setIsProcessing(false);
        }
      } else if (type === 'fuel') {
        // Process fuel invoice via API
        try {
          setIsProcessing(true);
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/process-fuel', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Failed to process fuel invoice');
          }
          
          const fuel = await response.json();
          setFuelData(fuel);
        } catch (error) {
          console.error('Error processing fuel invoice:', error);
          alert('Error processing fuel invoice. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      }
    }
  }, []);

  // Handle flight selection
  const toggleFlightSelection = useCallback((flightId: string) => {
    setSelectedFlights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(flightId)) {
        newSet.delete(flightId);
      } else {
        newSet.add(flightId);
      }
      return newSet;
    });
  }, []);

  const toggleAllFlights = useCallback(() => {
    if (selectedFlights.size === flights.length) {
      setSelectedFlights(new Set());
    } else {
      setSelectedFlights(new Set(flights.map(f => f.uuid)));
    }
  }, [flights, selectedFlights.size]);

  // Calculate fuel costs per flight
  const flightsWithFuelCosts = useMemo(() => {
    if (!fuelData || selectedFlights.size === 0) {
      return flights.map(f => ({ ...f, fuelUsed: 0, fuelCost: 0 }));
    }

    const selectedFlightsList = flights.filter(f => selectedFlights.has(f.uuid));
    const totalFlightTime = selectedFlightsList.reduce((sum, f) => sum + (f.tachTime || 0), 0);
    
    if (totalFlightTime === 0) {
      return flights.map(f => ({ ...f, fuelUsed: 0, fuelCost: 0 }));
    }

    return flights.map(flight => {
      if (!selectedFlights.has(flight.uuid)) {
        return { ...flight, fuelUsed: 0, fuelCost: 0 };
      }
      
      const flightTimeRatio = (flight.tachTime || 0) / totalFlightTime;
      const fuelUsed = fuelData.fuelGal * flightTimeRatio;
      const fuelCost = fuelData.fuelDollars * flightTimeRatio;
      
      return {
        ...flight,
        fuelUsed: Number(fuelUsed.toFixed(2)),
        fuelCost: Number(fuelCost.toFixed(2))
      };
    });
  }, [flights, selectedFlights, fuelData]);

  // Create trip function
  const createTrip = useCallback(async () => {
    if (selectedFlights.size === 0) {
      alert('Please select at least one flight');
      return;
    }

    try {
      setIsCreatingTrip(true);
      
      const selectedFlightsList = flightsWithFuelCosts.filter(f => selectedFlights.has(f.uuid));
      
      const formData = new FormData();
      formData.append('flights', JSON.stringify(selectedFlightsList));
      
      if (uploadState.jpiFile) {
        formData.append('jpiFile', uploadState.jpiFile);
      }
      
      if (uploadState.fuelInvoiceFile) {
        formData.append('fuelFile', uploadState.fuelInvoiceFile);
      }
      
      const response = await fetch('/api/create-trip', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to create trip');
      }
      
      await response.json();
      
      // Success! Navigate back to the list page
      router.push('/list');
      
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Error creating trip. Please try again.');
    } finally {
      setIsCreatingTrip(false);
    }
  }, [selectedFlights, flightsWithFuelCosts, uploadState.jpiFile, uploadState.fuelInvoiceFile, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create New Trip
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your JPI file to extract flights and fuel invoice to calculate costs.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* JPI File Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Step 1: Upload JPI File
            </h3>
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                ${uploadState.dragOver === 'jpi'
                  ? 'border-blue-400 bg-blue-50 scale-105'
                  : uploadState.jpiFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }
                ${!uploadState.jpiFile ? 'hover:bg-gray-50' : ''}
              `}
              onDragOver={(e) => handleDragOver(e, 'jpi')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'jpi')}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileSelect(e, 'jpi')}
                accept=".JPI,.jpi"
              />
              
              {uploadState.jpiFile ? (
                <div className="space-y-4">
                  <DocumentIcon className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {uploadState.jpiFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadState.jpiFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {flights.length > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ {flights.length} flights extracted
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload or drag JPI file here
                    </p>
                    <p className="text-xs text-gray-500">
                      JPI files only
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fuel Invoice Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Step 2: Upload Fuel Invoice
            </h3>
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                ${uploadState.dragOver === 'fuel'
                  ? 'border-blue-400 bg-blue-50 scale-105'
                  : uploadState.fuelInvoiceFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }
                ${!uploadState.fuelInvoiceFile ? 'hover:bg-gray-50' : ''}
              `}
              onDragOver={(e) => handleDragOver(e, 'fuel')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'fuel')}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileSelect(e, 'fuel')}
                accept=".pdf"
              />
              
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600">Processing fuel invoice...</p>
                </div>
              ) : uploadState.fuelInvoiceFile ? (
                <div className="space-y-4">
                  <DocumentIcon className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {uploadState.fuelInvoiceFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadState.fuelInvoiceFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {fuelData && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ {fuelData.fuelGal.toFixed(1)} gal, ${fuelData.fuelDollars.toFixed(2)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload or drag fuel invoice here
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF files only
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flights Table */}
        {flights.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Step 3: Select Flights for This Trip
              </h3>
              <button
                onClick={toggleAllFlights}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedFlights.size === flights.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedFlights.size === flights.length && flights.length > 0}
                        onChange={toggleAllFlights}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Off</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Used</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flightsWithFuelCosts.map((flight) => (
                    <tr 
                      key={flight.uuid} 
                      className={`hover:bg-gray-50 ${selectedFlights.has(flight.uuid) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFlights.has(flight.uuid)}
                          onChange={() => toggleFlightSelection(flight.uuid)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{flight.date}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{flight.from || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{flight.to || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{flight.timeOff || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{flight.timeIn || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{flight.tachTime || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flight.fuelUsed > 0 ? `${flight.fuelUsed} gal` : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flight.fuelCost > 0 ? `$${flight.fuelCost.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate" title={flight.remarks}>
                        {flight.remarks || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            {selectedFlights.size > 0 && fuelData && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Trip Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Selected Flights:</span>
                    <div className="font-medium">{selectedFlights.size}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Flight Time:</span>
                    <div className="font-medium">
                      {flightsWithFuelCosts
                        .filter(f => selectedFlights.has(f.uuid))
                        .reduce((sum, f) => sum + (f.tachTime || 0), 0)
                        .toFixed(1)}h
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Fuel:</span>
                    <div className="font-medium">{fuelData.fuelGal.toFixed(1)} gal</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Cost:</span>
                    <div className="font-medium">${fuelData.fuelDollars.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create Trip Button */}
        {flights.length > 0 && selectedFlights.size > 0 && (
          <div className="text-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={createTrip}
              disabled={isCreatingTrip}
            >
              {isCreatingTrip ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Trip...</span>
                </div>
              ) : (
                `Create Trip with ${selectedFlights.size} Flight${selectedFlights.size !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
