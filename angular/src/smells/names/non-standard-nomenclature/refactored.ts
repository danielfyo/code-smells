import { Pipe, PipeTransform } from '@angular/core';

// REFACTOR: Follow the conventions of the language and the framework. A `MoneyPipe` class with a
// camelCase pipe name `money`, camelCase parameters: anyone who knows Angular knows where to look.
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  private readonly formatters = new Map<string, Intl.NumberFormat>();

  transform(amount: number, currency = 'EUR'): string {
    return this.formatterFor(currency).format(amount);
  }

  private formatterFor(currency: string): Intl.NumberFormat {
    let formatter = this.formatters.get(currency);
    if (!formatter) {
      formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });
      this.formatters.set(currency, formatter);
    }
    return formatter;
  }
}
