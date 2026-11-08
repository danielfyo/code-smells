import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// REFACTOR: Decompose the regex into named parts and compose them. Each piece documents one rule
// of the format "AAA-YYYYMMDD-NNNN[-VIP|-STD]", e.g. "MAD-20260315-0042-VIP".
const AIRPORT = '[A-Z]{3}';
const YEAR = '20\\d{2}';
const MONTH = '0[1-9]|1[0-2]';
const DAY = '0[1-9]|[12]\\d|3[01]';
const DATE = `${YEAR}(?:${MONTH})(?:${DAY})`;
const SEQUENCE = '\\d{4}';
const FARE_CLASS = 'VIP|STD';

export const BOOKING_CODE = new RegExp(`^${AIRPORT}-${DATE}-${SEQUENCE}(?:-(?:${FARE_CLASS}))?$`);

export const bookingCodeValidator: ValidatorFn = (control: AbstractControl<string>): ValidationErrors | null =>
  BOOKING_CODE.test(control.value) ? null : { bookingCode: true };
