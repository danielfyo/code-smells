import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyStockBadgeComponent } from './smelly';
import { StockBadgeComponent } from './refactored';

@Component({
  selector: 'cs-direct-dom-manipulation-host',
  imports: [SmellyStockBadgeComponent, StockBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="smelly">
      <cs-direct-dom-manipulation-smelly [units]="3" />
      <cs-direct-dom-manipulation-smelly [units]="0" />
    </section>
    <section class="refactored">
      <cs-direct-dom-manipulation-refactored [units]="3" />
      <cs-direct-dom-manipulation-refactored [units]="0" />
    </section>
  `,
})
class DirectDomManipulationHost {}

describe('direct-dom-manipulation', () => {

  async function render() {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(DirectDomManipulationHost);
    // TestBed attaches the fixture to the document, so document.querySelector can see it.
    await fixture.whenStable();
    return fixture;
  }

  const badges = (host: HTMLElement, section: string) =>
    [...host.querySelectorAll<HTMLElement>(`.${section} .stock-badge`)].map((badge) => badge.textContent);

  it('smelly: document.querySelector makes both instances write into the first badge', async () => {
    const host = (await render()).nativeElement as HTMLElement;
    expect(badges(host, 'smelly')).toEqual(['Sold out', '']);
  });

  it('refactored: each instance renders its own state', async () => {
    const host = (await render()).nativeElement as HTMLElement;
    expect(badges(host, 'refactored')).toEqual(['3 in stock', 'Sold out']);
    expect(host.querySelector('.refactored .sold-out')?.textContent).toBe('Sold out');
  });

  it('refactored: hiding removes the badge from the view through state', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    host.querySelector<HTMLButtonElement>('.refactored .hide')?.click();
    await fixture.whenStable();
    expect(badges(host, 'refactored')).toEqual(['Sold out']);
  });
});
