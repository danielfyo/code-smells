import { Pipe, PipeTransform } from '@angular/core';

// SMELL: non-standard nomenclature. Angular convention says pipes are `XxxPipe` classes with a
// camelCase name; TypeScript says classes are PascalCase and methods camelCase. This one ignores
// both: a snake_case "Helper_Util" class, a PascalCase pipe name and Hungarian-ish method names.
// Readers cannot guess what it is or find it by convention.
@Pipe({ name: 'Money_Fmt' })
export class money_formatter_Helper_Util implements PipeTransform {
  transform(Amount_Value: number, Currency_Code = 'EUR'): string {
    return this.Do_Format(Amount_Value, Currency_Code);
  }

  Do_Format(AMOUNT: number, CUR: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: CUR }).format(AMOUNT);
  }
}
