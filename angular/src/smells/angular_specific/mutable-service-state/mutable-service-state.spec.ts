import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyAddToWishlistComponent, SmellyWishlistCounterComponent, SmellyWishlistService } from './smelly';
import { AddToWishlistComponent, WishlistCounterComponent, WishlistStore } from './refactored';

@Component({
  selector: 'cs-mutable-service-state-host',
  imports: [SmellyAddToWishlistComponent, SmellyWishlistCounterComponent, AddToWishlistComponent, WishlistCounterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="smelly"><cs-mutable-service-state-smelly-counter /></header>
    <main class="smelly"><cs-mutable-service-state-smelly-add /></main>
    <header class="refactored"><cs-mutable-service-state-refactored-counter /></header>
    <main class="refactored"><cs-mutable-service-state-refactored-add /></main>
  `,
})
class MutableServiceStateHost {}

describe('mutable-service-state', () => {
  async function render() {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(MutableServiceStateHost);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const click = async (version: string) => {
      host.querySelector<HTMLButtonElement>(`main.${version} .add`)?.click();
      await fixture.whenStable();
    };
    const counter = (version: string) => host.querySelector(`header.${version} .counter`)?.textContent;
    return { click, counter };
  }

  it('smelly: the counter never learns that another component mutated the array', async () => {
    const { click, counter } = await render();
    await click('smelly');
    expect(TestBed.inject(SmellyWishlistService).items).toHaveLength(1);
    expect(counter('smelly')).toBe('0 saved');
  });

  it('smelly: anyone can bypass the rules by mutating the array directly', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const service = TestBed.inject(SmellyWishlistService);
    service.items.push({ sku: 'LAMP-1', name: 'Desk lamp' }, { sku: 'LAMP-1', name: 'Desk lamp' });
    expect(service.items).toHaveLength(2);
  });

  it('refactored: every reader updates and duplicates are rejected', async () => {
    const { click, counter } = await render();
    await click('refactored');
    expect(counter('refactored')).toBe('1 saved');
    await click('refactored');
    expect(counter('refactored')).toBe('1 saved');
    expect(TestBed.inject(WishlistStore).items()).toEqual([{ sku: 'LAMP-1', name: 'Desk lamp' }]);
  });
});
