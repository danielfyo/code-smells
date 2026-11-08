import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyAccountPageComponent } from './smelly';
import { AccountPageComponent } from './refactored';

describe('input-drilling', () => {
  it.each<Type<unknown>>([SmellyAccountPageComponent, AccountPageComponent])('%o shows the user and logs out from the badge', async (page) => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(page);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.layout aside .user')?.textContent).toBe('Ana (admin)');

    host.querySelector<HTMLButtonElement>('.logout')?.click();
    await fixture.whenStable();
    expect(host.querySelector('.user')).toBeNull();
    expect(host.querySelector('.signed-out')?.textContent).toBe('Signed out');
  });
});
