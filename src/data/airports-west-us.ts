// Airports in the Western United States (subset). Extend as needed.
export interface WestUsAirport {
  icao: string;
  iata?: string;
  name: string;
  lat: number;
  lng: number;
}

export const AIRPORTS_WEST_US: WestUsAirport[] = [
  // Bay Area / Northern CA
  { icao: 'KSFO', iata: 'SFO', name: 'San Francisco Intl', lat: 37.6213, lng: -122.379 },
  { icao: 'KOAK', iata: 'OAK', name: 'Oakland Intl', lat: 37.7213, lng: -122.221 },
  { icao: 'KSJC', iata: 'SJC', name: 'San Jose Intl', lat: 37.3639, lng: -121.929 },
  { icao: 'KHWD', iata: 'HWD', name: 'Hayward Executive', lat: 37.659, lng: -122.122 },
  { icao: 'KSQL', iata: 'SQL', name: 'San Carlos', lat: 37.5119, lng: -122.25 },
  { icao: 'KPAO', iata: 'PAO', name: 'Palo Alto', lat: 37.4611, lng: -122.115 },
  { icao: 'KLVK', iata: 'LVK', name: 'Livermore', lat: 37.6934, lng: -121.822 },
  { icao: 'KCCR', iata: 'CCR', name: 'Buchanan Field', lat: 37.9897, lng: -122.056 },
  { icao: 'KRHV', iata: 'RHV', name: 'Reid-Hillview', lat: 37.3343, lng: -121.82 },
  { icao: 'KNUQ', name: 'Moffett Federal', lat: 37.4161, lng: -122.049 },
  { icao: 'KSTS', iata: 'STS', name: 'Santa Rosa (Sonoma)', lat: 38.5089, lng: -122.812 },
  { icao: 'KSMF', iata: 'SMF', name: 'Sacramento Intl', lat: 38.6953, lng: -121.5908 },
  { icao: 'KRDD', iata: 'RDD', name: 'Redding', lat: 40.5089, lng: -122.293 },
  { icao: 'KMRY', iata: 'MRY', name: 'Monterey', lat: 36.587, lng: -121.843 },
  { icao: 'KSNS', iata: 'SNS', name: 'Salinas', lat: 36.6628, lng: -121.606 },
  { icao: 'KSBP', iata: 'SBP', name: 'San Luis Obispo', lat: 35.2371, lng: -120.642 },
  { icao: 'KPRB', iata: 'PRB', name: 'Paso Robles', lat: 35.6729, lng: -120.626 },

  // Southern CA
  { icao: 'KLAX', iata: 'LAX', name: 'Los Angeles Intl', lat: 33.9416, lng: -118.4085 },
  { icao: 'KBUR', iata: 'BUR', name: 'Hollywood Burbank', lat: 34.2007, lng: -118.3587 },
  { icao: 'KONT', iata: 'ONT', name: 'Ontario Intl', lat: 34.056, lng: -117.6012 },
  { icao: 'KLGB', iata: 'LGB', name: 'Long Beach', lat: 33.8178, lng: -118.1516 },
  { icao: 'KSNA', iata: 'SNA', name: 'John Wayne (Orange County)', lat: 33.6757, lng: -117.868 },
  { icao: 'KSMO', iata: 'SMO', name: 'Santa Monica', lat: 34.0158, lng: -118.45 },
  { icao: 'KVNY', iata: 'VNY', name: 'Van Nuys', lat: 34.2098, lng: -118.489 },
  { icao: 'KOXR', iata: 'OXR', name: 'Oxnard', lat: 34.2009, lng: -119.207 },
  { icao: 'KSBA', iata: 'SBA', name: 'Santa Barbara', lat: 34.4262, lng: -119.84 },
  { icao: 'KSAN', iata: 'SAN', name: 'San Diego Intl', lat: 32.7338, lng: -117.1933 },

  // Nevada
  { icao: 'KRNO', iata: 'RNO', name: 'Reno/Tahoe', lat: 39.4991, lng: -119.768 },
  { icao: 'KLAS', iata: 'LAS', name: 'Las Vegas (Harry Reid)', lat: 36.084, lng: -115.1537 },
  { icao: 'KHND', iata: 'HND', name: 'Henderson Exec', lat: 35.9728, lng: -115.134 },
  { icao: 'KVGT', iata: 'VGT', name: 'North Las Vegas', lat: 36.2107, lng: -115.194 },

  // Arizona
  { icao: 'KPHX', iata: 'PHX', name: 'Phoenix Sky Harbor', lat: 33.4343, lng: -112.0116 },
  { icao: 'KSDL', iata: 'SDL', name: 'Scottsdale', lat: 33.6229, lng: -111.911 },
  { icao: 'KDVT', iata: 'DVT', name: 'Phoenix Deer Valley', lat: 33.6883, lng: -112.083 },
  { icao: 'KTUS', iata: 'TUS', name: 'Tucson', lat: 32.1161, lng: -110.941 },
  { icao: 'KPRC', iata: 'PRC', name: 'Prescott', lat: 34.6545, lng: -112.419 },
  { icao: 'KYUM', iata: 'YUM', name: 'Yuma', lat: 32.6566, lng: -114.606 },

  // Oregon
  { icao: 'KPDX', iata: 'PDX', name: 'Portland Intl', lat: 45.5898, lng: -122.595 },
  { icao: 'KHIO', iata: 'HIO', name: 'Hillsboro', lat: 45.5404, lng: -122.949 },
  { icao: 'KSLE', iata: 'SLE', name: 'Salem', lat: 44.9095, lng: -123.003 },
  { icao: 'KEUG', iata: 'EUG', name: 'Eugene', lat: 44.1235, lng: -123.219 },
  { icao: 'KMFR', iata: 'MFR', name: 'Medford', lat: 42.3742, lng: -122.873 },
  { icao: 'KRDM', iata: 'RDM', name: 'Redmond', lat: 44.2541, lng: -121.149 },

  // Washington
  { icao: 'KSEA', iata: 'SEA', name: 'Seattle-Tacoma', lat: 47.4502, lng: -122.3088 },
  { icao: 'KBFI', iata: 'BFI', name: 'Boeing Field', lat: 47.53, lng: -122.302 },
  { icao: 'KRNT', iata: 'RNT', name: 'Renton', lat: 47.4931, lng: -122.216 },
  { icao: 'KPAE', iata: 'PAE', name: 'Paine Field', lat: 47.9063, lng: -122.281 },
  { icao: 'KGEG', iata: 'GEG', name: 'Spokane Intl', lat: 47.6199, lng: -117.535 },
  { icao: 'KPSC', iata: 'PSC', name: 'Tri-Cities (Pasco)', lat: 46.2647, lng: -119.119 },
  { icao: 'KYKM', iata: 'YKM', name: 'Yakima', lat: 46.5682, lng: -120.544 },

  // Idaho
  { icao: 'KBOI', iata: 'BOI', name: 'Boise', lat: 43.5644, lng: -116.223 },
  { icao: 'KIDA', iata: 'IDA', name: 'Idaho Falls', lat: 43.5146, lng: -112.07 },
  { icao: 'KSUN', iata: 'SUN', name: 'Friedman Memorial (Sun Valley)', lat: 43.5047, lng: -114.295 },

  // Utah
  { icao: 'KSLC', iata: 'SLC', name: 'Salt Lake City', lat: 40.7899, lng: -111.979 },
  { icao: 'KPVU', iata: 'PVU', name: 'Provo', lat: 40.2192, lng: -111.723 },
  { icao: 'KOGD', iata: 'OGD', name: 'Ogden', lat: 41.1959, lng: -112.012 },
  { icao: 'KSGU', iata: 'SGU', name: 'St. George', lat: 37.0364, lng: -113.51 },

  // Colorado
  { icao: 'KDEN', iata: 'DEN', name: 'Denver Intl', lat: 39.8561, lng: -104.673 },
  { icao: 'KAPA', iata: 'APA', name: 'Centennial', lat: 39.5701, lng: -104.849 },
  { icao: 'KCOS', iata: 'COS', name: 'Colorado Springs', lat: 38.8058, lng: -104.701 },
  { icao: 'KGJT', iata: 'GJT', name: 'Grand Junction', lat: 39.1224, lng: -108.53 },
  { icao: 'KASE', iata: 'ASE', name: 'Aspen', lat: 39.2232, lng: -106.869 },
  { icao: 'KEGE', iata: 'EGE', name: 'Eagle County (Vail)', lat: 39.6426, lng: -106.918 },
  { icao: 'KHDN', iata: 'HDN', name: 'Yampa Valley (Hayden)', lat: 40.4812, lng: -107.218 },
  { icao: 'KMTJ', iata: 'MTJ', name: 'Montrose', lat: 38.5098, lng: -107.894 },
  { icao: 'KDRO', iata: 'DRO', name: 'Durango', lat: 37.1599, lng: -107.753 },

  // New Mexico
  { icao: 'KABQ', iata: 'ABQ', name: 'Albuquerque', lat: 35.0402, lng: -106.609 },
  { icao: 'KSAF', iata: 'SAF', name: 'Santa Fe', lat: 35.6171, lng: -106.089 },

  // Montana
  { icao: 'KMSO', iata: 'MSO', name: 'Missoula', lat: 46.9163, lng: -114.091 },
  { icao: 'KBZN', iata: 'BZN', name: 'Bozeman', lat: 45.7772, lng: -111.153 },
  { icao: 'KBTM', iata: 'BTM', name: 'Butte', lat: 45.9548, lng: -112.497 },
  { icao: 'KFCA', iata: 'FCA', name: 'Glacier Park (Kalispell)', lat: 48.3114, lng: -114.255 },
  { icao: 'KHLN', iata: 'HLN', name: 'Helena', lat: 46.6068, lng: -111.983 },
  { icao: 'KGTF', iata: 'GTF', name: 'Great Falls', lat: 47.482, lng: -111.371 },
  { icao: 'KBIL', iata: 'BIL', name: 'Billings', lat: 45.8077, lng: -108.543 },

  // Wyoming
  { icao: 'KJAC', iata: 'JAC', name: 'Jackson Hole', lat: 43.6073, lng: -110.737 },
  { icao: 'KCOD', iata: 'COD', name: 'Cody', lat: 44.5202, lng: -109.024 },
  { icao: 'KCPR', iata: 'CPR', name: 'Casper', lat: 42.908, lng: -106.464 },
  { icao: 'KCYS', iata: 'CYS', name: 'Cheyenne', lat: 41.1557, lng: -104.812 },
  { icao: 'KRKS', iata: 'RKS', name: 'Rock Springs', lat: 41.5942, lng: -109.065 },
];

