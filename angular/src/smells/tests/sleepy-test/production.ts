import { ChangeDetectionStrategy, Component, InjectionToken, PendingTasks, inject, signal } from '@angular/core';

// Production code: a button that saves a draft asynchronously.
export type DraftSaver = () => Promise<void>;
export const DRAFT_SAVER = new InjectionToken<DraftSaver>('DRAFT_SAVER');

@Component({
  selector: 'cs-sleepy-test-save-draft',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="save()" [disabled]="status() === 'saving'">Save draft</button>
    @if (status() === 'saving') {
      <p class="saving">Saving...</p>
    }
    @if (status() === 'saved') {
      <p class="saved" role="status">Draft saved</p>
    }
  `,
})
export class SaveDraftButtonComponent {
  private readonly saver = inject(DRAFT_SAVER);
  private readonly pendingTasks = inject(PendingTasks);
  readonly status = signal<'idle' | 'saving' | 'saved'>('idle');

  async save(): Promise<void> {
    this.status.set('saving');
    // Registered as a pending task so the app (and fixture.whenStable) knows work is in flight.
    await this.pendingTasks.run(() => this.saver());
    this.status.set('saved');
  }
}
