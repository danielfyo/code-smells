import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// SMELL: complicated regex. A long, unnamed, uncommented pattern validates booking codes. What
// format does it accept? Is the date part a real date? Which group is the sequence number?
// Nobody can tell without decoding it character by character, so nobody dares to change it.
export const smellyBookingCodeValidator: ValidatorFn = (control: AbstractControl<string>): ValidationErrors | null =>
  /^(?:[A-Z]{3})-(?:20\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])-(?:\d{4})(?:-(?:VIP|STD))?$/.test(control.value)
    ? null
    : { bookingCode: true };
