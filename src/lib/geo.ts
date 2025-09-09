export function parseJpiCoord(coord: string): number | undefined {
  // Examples: "N37.38.45" or "W122.05.88"
  if (!coord || coord.length < 2) return undefined;
  const dir = coord[0];
  const rest = coord.slice(1);
  const parts = rest.split('.');
  const deg = parseInt(parts[0] || '0', 10);
  if (!Number.isFinite(deg)) return undefined;

  let minutes = 0;
  if (parts.length >= 3) {
    // minutes.hundredths: e.g., 38 + 45/100 => 38.45'
    const minWhole = parseInt(parts[1] || '0', 10);
    const minHund = parseInt(parts[2] || '0', 10);
    if (!Number.isFinite(minWhole) || !Number.isFinite(minHund)) return undefined;
    minutes = minWhole + (minHund / 100);
  } else if (parts.length === 2) {
    const minDec = parseFloat(parts[1] || '0');
    if (!Number.isFinite(minDec)) return undefined;
    minutes = minDec;
  } else {
    minutes = 0;
  }

  const decimal = deg + minutes / 60;
  const sign = (dir === 'S' || dir === 'W') ? -1 : 1;
  return sign * decimal;
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

