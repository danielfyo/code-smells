import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Booking, SmellyBookingPriceComponent } from './smelly';
import { BookingPriceComponent } from './refactored';

async function renderPrice(component: Type<unknown>, booking: Booking): Promise<string> {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent(component);
  fixture.componentRef.setInput('booking', booking);
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('.price')?.textContent ?? '';
}

describe('obsolete-comment', () => {
  it('the smelly code contradicts its own comment (1 EUR per night, no decimals)', async () => {
    // The comment promises 3 * 100 + 3 * 1 = "303 EUR"; the code charges per guest and shows cents.
    expect(await renderPrice(SmellyBookingPriceComponent, { nights: 3, nightlyRate: 100, guests: 2 })).toBe('315.00 EUR');
  });

  it.each([
    { booking: { nights: 3, nightlyRate: 100, guests: 2 }, expected: '315.00 EUR' },
    { booking: { nights: 7, nightlyRate: 100, guests: 1 }, expected: '647.50 EUR' },
  ])('both versions render $expected', async ({ booking, expected }) => {
    expect(await renderPrice(SmellyBookingPriceComponent, booking)).toBe(expected);
    TestBed.resetTestingModule();
    expect(await renderPrice(BookingPriceComponent, booking)).toBe(expected);
  });
});
