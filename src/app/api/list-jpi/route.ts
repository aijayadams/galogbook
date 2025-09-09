import { NextRequest, NextResponse } from 'next/server';
import { summarizeFlightsFromJpi } from '@/lib/jpi';

function mmddyyyyToIso(dateTime: string): { date: string; time: string } {
  const [date, time] = dateTime.split(' ');
  const [mm, dd, yyyy] = (date || '').split('/');
  if (!mm || !dd || !yyyy) return { date: dateTime, time: time || '' };
  const iso = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  return { date: iso, time: time || '' };
}

function computeTimeIn(dateIso: string, startTime: string, hours?: number): string | undefined {
  if (!startTime || hours === undefined) return undefined;
  const [h, m, s] = startTime.split(':').map((n) => parseInt(n || '0', 10));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return undefined;
  const base = new Date(`${dateIso}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String((s||0)).padStart(2,'0')}Z`);
  if (isNaN(base.getTime())) return undefined;
  const endMs = base.getTime() + Math.round(hours * 3600000);
  const end = new Date(endMs);
  const hh = String(end.getUTCHours()).padStart(2,'0');
  const mm = String(end.getUTCMinutes()).padStart(2,'0');
  const ss = String(end.getUTCSeconds()).padStart(2,'0');
  return `${hh}:${mm}:${ss}`;
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = (form.get('file') || form.get('jpiFile')) as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const ab = await file.arrayBuffer();
    const summaries = await summarizeFlightsFromJpi(ab);

    // Map to a minimal shape the UI can turn into Flight[]
    const flights = summaries.map((s, idx) => {
      const { date, time } = mmddyyyyToIso(s.dateTime);
      const start = s.timeOff || time;
      const duration = s.hobbDuration ?? s.tachDuration;
      const computedEnd = computeTimeIn(date, start, duration);
      return {
        id: s.id,
        date,
        time,
        index: idx + 1,
        tachDuration: s.tachDuration,
        hobbDuration: s.hobbDuration,
        timeOff: start,
        timeIn: s.timeIn || computedEnd,
      };
    });

    return NextResponse.json({ flights });
  } catch (err) {
    console.error('Error listing JPI flights:', err);
    return NextResponse.json({ error: 'Failed to list JPI flights' }, { status: 500 });
  }
}
