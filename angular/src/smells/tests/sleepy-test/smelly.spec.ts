import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DRAFT_SAVER, SaveDraftButtonComponent } from './production';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// SMELL: sleepy test. It waits a fixed amount of wall-clock time hoping the save has finished.
// On a busy CI agent the save takes longer and the test fails at random; on a fast machine the
// test still wastes the full sleep on every run.
describe('SaveDraftButtonComponent (smelly)', () => {
  it('shows the saved message', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: DRAFT_SAVER, useValue: () => sleep(50) }],
    });
    const fixture = TestBed.createComponent(SaveDraftButtonComponent);
    const host = fixture.nativeElement as HTMLElement;
    host.querySelector('button')?.click();
    await sleep(150); // SMELL: arbitrary "just in case" wait
    fixture.detectChanges();
    expect(host.querySelector('.saved')?.textContent).toBe('Draft saved');
  });
});
