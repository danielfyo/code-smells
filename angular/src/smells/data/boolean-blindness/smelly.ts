// SMELL: Boolean Blindness. At the call site `formatEventDate(iso, true, false)` says nothing:
// is `true` "show time" or "use 24h"? Swapping the two flags compiles and produces wrong text.
export function formatEventDate(iso: string, showTime: boolean, use24h: boolean): string {
  const date = new Date(iso);
  const day = `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
  if (!showTime) {
    return day;
  }
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  if (use24h) {
    return `${day} ${date.getUTCHours()}:${minutes}`;
  }
  const hours = date.getUTCHours() % 12 || 12;
  return `${day} ${hours}:${minutes} ${date.getUTCHours() < 12 ? 'AM' : 'PM'}`;
}

export const examples = {
  ticket: (iso: string) => formatEventDate(iso, true, false),
  calendar: (iso: string) => formatEventDate(iso, false, false),
  boardingPass: (iso: string) => formatEventDate(iso, true, true),
};
