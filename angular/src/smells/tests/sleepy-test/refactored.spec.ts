import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DRAFT_SAVER, SaveDraftButtonComponent } from './production';

// REFACTOR: control the asynchrony instead of sleeping. The test owns the promise, resolves it
// when it wants and awaits `fixture.whenStable()`, which settles exactly when the pending save
// (tracked with PendingTasks) has finished and the view is rendered.
describe('SaveDraftButtonComponent (refactored)', () => {
  it('shows "Saving..." while saving and then the saved message', async () => {
    let finishSave: () => void = () => undefined;
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: DRAFT_SAVER, useValue: () => new Promise<void>((resolve) => (finishSave = resolve)) },
      ],
    });
    const fixture = TestBed.createComponent(SaveDraftButtonComponent);
    const host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();

    host.querySelector('button')?.click();
    fixture.detectChanges(); // render the intermediate state while the save is still pending
    expect(host.querySelector('.saving')?.textContent).toBe('Saving...');
    expect(host.querySelector('button')?.disabled).toBe(true);

    finishSave();
    await fixture.whenStable();
    expect(host.querySelector('.saved')?.textContent).toBe('Draft saved');
  });
});
