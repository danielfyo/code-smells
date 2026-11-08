// REFACTOR: the regex is broken into named pieces that are composed together. Each part
// documents one rule of the format: OFFICE-YYYYMMDD-NNNN[-FARE].
const OFFICE = "[A-Z]{3}"; // office IATA code, e.g. MAD
const YEAR = "20\\d{2}";
const MONTH = "(?:0[1-9]|1[0-2])";
const DAY = "(?:0[1-9]|[12]\\d|3[01])";
const SEQUENCE = "\\d{4}"; // sequential number within the day
const FARE = "(?:VIP|STD)"; // optional fare

const BOOKING_CODE = new RegExp(`^${OFFICE}-${YEAR}${MONTH}${DAY}-${SEQUENCE}(?:-${FARE})?$`);

export function isValidBookingCode(code: string): boolean {
  return BOOKING_CODE.test(code);
}
