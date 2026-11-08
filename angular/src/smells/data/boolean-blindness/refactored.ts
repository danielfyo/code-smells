// REFACTOR: Replace Boolean Parameters with a meaningful type. Three impossible-to-confuse
// options instead of four combinations of two anonymous flags (one of which made no sense).
export type TimeDisplay = 'date-only' | 'clock-12h' | 'clock-24h';

function dayPart(date: Date): string {
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
}

function clockPart(date: Date, display: Exclude<TimeDisplay, 'date-only'>): string {
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  if (display === 'clock-24h') {
    return `${date.getUTCHours()}:${minutes}`;
  }
  const hours = date.getUTCHours() % 12 || 12;
  return `${hours}:${minutes} ${date.getUTCHours() < 12 ? 'AM' : 'PM'}`;
}

export function formatEventDate(iso: string, display: TimeDisplay): string {
  const date = new Date(iso);
  return display === 'date-only' ? dayPart(date) : `${dayPart(date)} ${clockPart(date, display)}`;
}

export const examples = {
  ticket: (iso: string) => formatEventDate(iso, 'clock-12h'),
  calendar: (iso: string) => formatEventDate(iso, 'date-only'),
  boardingPass: (iso: string) => formatEventDate(iso, 'clock-24h'),
};
