'use client';

import { useState, useRef, useEffect } from 'react';

interface Airport {
  icao: string;
  iata?: string;
  name: string;
  lat: number;
  lng: number;
}

interface AirportAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  airports: Airport[];
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export default function AirportAutocomplete({
  value,
  onChange,
  airports,
  placeholder = 'Airport',
  className = '',
  onBlur,
  autoFocus = false
}: AirportAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter airports based on input
  useEffect(() => {
    if (!inputValue || inputValue.length < 1) {
      setFilteredAirports([]);
      return;
    }

    const searchTerm = inputValue.toLowerCase().trim();
    const matches = airports.filter(airport => {
      const icao = airport.icao.toLowerCase();
      const iata = airport.iata?.toLowerCase() || '';
      const name = airport.name.toLowerCase();

      return (
        icao.includes(searchTerm) ||
        iata.includes(searchTerm) ||
        name.includes(searchTerm)
      );
    }).slice(0, 10); // Limit to 10 results

    setFilteredAirports(matches);
    setSelectedIndex(-1);
  }, [inputValue, airports]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelect = (airport: Airport) => {
    const code = airport.iata || airport.icao;
    setInputValue(code);
    onChange(code);
    setIsOpen(false);
    inputRef.current?.blur();
    onBlur?.();
  };

  const handleBlur = () => {
    // Delay blur to allow click selection to complete
    setTimeout(() => {
      setIsOpen(false);
      onBlur?.();
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredAirports.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredAirports.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredAirports.length) {
          handleSelect(filteredAirports[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (filteredAirports.length > 0) {
            setIsOpen(true);
          }
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className}
        autoFocus={autoFocus}
      />

      {isOpen && filteredAirports.length > 0 && (
        <div className="absolute z-50 w-80 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredAirports.map((airport, index) => (
            <button
              key={`${airport.icao}-${index}`}
              type="button"
              onClick={() => handleSelect(airport)}
              className={`w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b last:border-b-0 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {airport.iata || airport.icao}
                    </span>
                    {airport.iata && airport.icao !== airport.iata && (
                      <span className="text-xs text-gray-500">({airport.icao})</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 truncate">{airport.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
