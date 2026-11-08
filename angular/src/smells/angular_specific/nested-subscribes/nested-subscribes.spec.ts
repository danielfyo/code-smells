import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { SmellyProductSearchComponent } from './smelly';
import { ProductSearchComponent } from './refactored';
import { ProductSearchApi } from './search.api';

/** Fake backend: every search returns a Subject the test resolves whenever it wants. */
class ControlledSearchApi {
  readonly pending = new Map<string, Subject<string[]>>();
  search(term: string): Observable<string[]> {
    const response = new Subject<string[]>();
    this.pending.set(term, response);
    return response;
  }
  respond(term: string, names: string[]): void {
    this.pending.get(term)?.next(names);
    this.pending.get(term)?.complete();
  }
}

const tick = () => new Promise<void>((resolve) => setTimeout(resolve));

async function raceResults(component: typeof SmellyProductSearchComponent | typeof ProductSearchComponent): Promise<string[]> {
  const api = new ControlledSearchApi();
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), { provide: ProductSearchApi, useValue: api }],
  });
  const fixture = TestBed.createComponent<SmellyProductSearchComponent | ProductSearchComponent>(component);
  await fixture.whenStable();
  fixture.componentInstance.search('de');
  await tick();
  fixture.componentInstance.search('desk');
  await tick();
  api.respond('desk', ['Desk lamp', 'Desk chair']); // the fresh answer arrives first...
  api.respond('de', ['Desk lamp', 'Desk chair', 'Deodorant']); // ...then the stale, slow one
  await fixture.whenStable();
  return [...(fixture.nativeElement as HTMLElement).querySelectorAll('li')].map((li) => li.textContent ?? '');
}

describe('nested-subscribes', () => {
  it('smelly: the stale response overwrites the fresh one', async () => {
    expect(await raceResults(SmellyProductSearchComponent)).toEqual(['Desk lamp', 'Desk chair', 'Deodorant']);
  });

  it('refactored: switchMap drops the stale response', async () => {
    expect(await raceResults(ProductSearchComponent)).toEqual(['Desk lamp', 'Desk chair']);
  });

  it.each([SmellyProductSearchComponent, ProductSearchComponent])('%o shows results from the real API', async (component) => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent<SmellyProductSearchComponent | ProductSearchComponent>(component);
    await fixture.whenStable();
    fixture.componentInstance.search('desk');
    await tick();
    await fixture.whenStable();
    expect([...(fixture.nativeElement as HTMLElement).querySelectorAll('li')].map((li) => li.textContent)).toEqual(['Desk lamp', 'Desk chair']);
  });
});
