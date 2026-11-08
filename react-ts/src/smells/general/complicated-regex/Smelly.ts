// SMELL: complicated regex. A long, cryptic, unnamed regex validates a booking code.
// Which format does it accept? Nobody knows without decoding it character by character.
export function isValidBookingCode(code: string): boolean {
  return /^(?:[A-Z]{3})-(?:20\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])-(?:\d{4})(?:-(?:VIP|STD))?$/.test(code);
}
