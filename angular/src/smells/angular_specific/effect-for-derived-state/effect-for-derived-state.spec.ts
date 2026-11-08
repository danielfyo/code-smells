import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyStayQuoteComponent } from './smelly';
import { StayQuoteComponent } from './refactored';

describe('effect-for-derived-state', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each([SmellyStayQuoteComponent, StayQuoteComponent])('%o renders the same quote', async (component) => {
    const fixture = TestBed.createComponent<SmellyStayQuoteComponent | StayQuoteComponent>(component);
    await fixture.whenStable();
    fixture.componentInstance.nights.set(3);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.quote')?.textContent).toBe('3 nights: 270 EUR');
  });

  it('smelly: the derived value is stale until the effect gets to run', async () => {
    const fixture = TestBed.createComponent(SmellyStayQuoteComponent);
    await fixture.whenStable();
    fixture.componentInstance.nights.set(5);
    expect(fixture.componentInstance.total()).toBe(180); // still the old 2-night total
    await fixture.whenStable();
    expect(fixture.componentInstance.total()).toBe(450);
  });

  it('smelly: the derived value can be overwritten into an inconsistent state', async () => {
    const fixture = TestBed.createComponent(SmellyStayQuoteComponent);
    await fixture.whenStable();
    fixture.componentInstance.total.set(1);
    expect(fixture.componentInstance.total()).not.toBe(fixture.componentInstance.nights() * 90);
  });

  it('refactored: computed is consistent the moment it is read', () => {
    const fixture = TestBed.createComponent(StayQuoteComponent);
    fixture.componentInstance.nights.set(5);
    expect(fixture.componentInstance.total()).toBe(450);
    expect('set' in fixture.componentInstance.total).toBe(false);
  });
});
