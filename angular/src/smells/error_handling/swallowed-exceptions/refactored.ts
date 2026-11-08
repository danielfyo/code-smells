import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injectable, inject, signal } from '@angular/core';
import type { Observable } from 'rxjs';

export interface Preferences {
  newsletter: boolean;
  language: string;
}

// REFACTOR: Let errors propagate. The service does not pretend to know how to recover, so it
// does not catch at all.
@Injectable({ providedIn: 'root' })
export class PreferencesApi {
  private readonly http = inject(HttpClient);

  save(prefs: Preferences): Observable<unknown> {
    return this.http.put('/api/preferences', prefs);
  }
}

// REFACTOR: Handle the error where something meaningful can be done: the component shows it to
// the user and keeps the state honest.
@Component({
  selector: 'cs-swallowed-exceptions-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="save()">Save</button>
    <p>{{ status() }}</p>
  `,
})
export class PreferencesFormRefactored {
  private readonly api = inject(PreferencesApi);
  protected readonly status = signal('');

  save(): void {
    this.api.save({ newsletter: true, language: 'es' }).subscribe({
      next: () => this.status.set('Saved'),
      error: (error: unknown) => {
        const reason = error instanceof HttpErrorResponse ? `server answered ${error.status}` : 'unknown error';
        this.status.set(`Could not save (${reason})`);
      },
    });
  }
}
