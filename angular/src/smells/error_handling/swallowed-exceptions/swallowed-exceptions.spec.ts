import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { PreferencesFormSmelly } from './smelly';
import { PreferencesFormRefactored } from './refactored';

function textOf(fixture: ComponentFixture<unknown>): string {
  const walker = document.createTreeWalker(fixture.nativeElement as HTMLElement, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.replace(/\s+/g, ' ').trim();
    if (text) parts.push(text);
  }
  return parts.join(' ');
}

async function renderText(component: Type<unknown>, inputs: Record<string, unknown> = {}): Promise<string> {
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  return textOf(fixture);
}

async function clickSaveAndRespond(component: Type<unknown>, fail: boolean): Promise<string> {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
  const request = TestBed.inject(HttpTestingController).expectOne('/api/preferences');
  if (fail) {
    request.flush('boom', { status: 500, statusText: 'Server Error' });
  } else {
    request.flush({});
  }
  await fixture.whenStable();
  return textOf(fixture);
}

describe('Swallowed Exceptions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('both versions report success the same way', async () => {
    expect(await clickSaveAndRespond(PreferencesFormRefactored, false)).toBe(
      await clickSaveAndRespond(PreferencesFormSmelly, false),
    );
  });

  it('the smelly version claims success when the server fails', async () => {
    expect(await clickSaveAndRespond(PreferencesFormSmelly, true)).toBe('Save Saved');
  });

  it('the refactored version surfaces the failure', async () => {
    expect(await clickSaveAndRespond(PreferencesFormRefactored, true)).toBe('Save Could not save (server answered 500)');
  });
});
