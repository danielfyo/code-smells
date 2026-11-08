import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { money_formatter_Helper_Util } from './smelly';
import { MoneyPipe } from './refactored';

@Component({
  selector: 'cs-non-standard-nomenclature-host',
  imports: [money_formatter_Helper_Util, MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="smelly">{{ 1234.5 | Money_Fmt }} / {{ 9.99 | Money_Fmt: 'USD' }}</span>
    <span class="refactored">{{ 1234.5 | money }} / {{ 9.99 | money: 'USD' }}</span>
  `,
})
class NonStandardNomenclatureHost {}

describe('non-standard-nomenclature', () => {
  it('both pipes format money identically', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(NonStandardNomenclatureHost);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.smelly')?.textContent).toBe('€1,234.50 / $9.99');
    expect(host.querySelector('.refactored')?.textContent).toBe('€1,234.50 / $9.99');
  });
});
