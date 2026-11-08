import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyOrdersApi, SmellyOrdersPagerComponent } from './smelly';
import { OrdersApi, OrdersPagerComponent } from './refactored';

async function pagerText(component: typeof SmellyOrdersPagerComponent | typeof OrdersPagerComponent): Promise<string> {
  const fixture = TestBed.createComponent<SmellyOrdersPagerComponent | OrdersPagerComponent>(component);
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('.pager')?.textContent ?? '';
}

describe('hidden-logical-dependency', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both pagers agree while the API uses 20 orders per page', async () => {
    expect(await pagerText(SmellyOrdersPagerComponent)).toBe('Page 1 of 5 (20 orders)');
    expect(await pagerText(OrdersPagerComponent)).toBe('Page 1 of 5 (20 orders)');
  });

  it('smelly: when the API changes its page size, the page count silently lies', async () => {
    TestBed.inject(SmellyOrdersApi).pageSize = 50;
    expect(await pagerText(SmellyOrdersPagerComponent)).toBe('Page 1 of 5 (50 orders)');
  });

  it('refactored: the pager follows the page size the API reports', async () => {
    TestBed.inject(OrdersApi).pageSize = 50;
    expect(await pagerText(OrdersPagerComponent)).toBe('Page 1 of 2 (50 orders)');
  });
});
