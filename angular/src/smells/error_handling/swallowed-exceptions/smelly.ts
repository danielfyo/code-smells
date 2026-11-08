import { HttpClient } from '@angular/common/http';
import { Component, Injectable, inject, signal } from '@angular/core';
import { catchError, of, type Observable } from 'rxjs';

export interface Preferences {
  newsletter: boolean;
  language: string;
}

// SMELL: Swallowed Exceptions. `catchError(() => of(null))` turns every failure (500, offline,
// validation error) into a normal completion. The UI happily says "Saved" while nothing was
// stored, and nobody ever sees the error.
@Injectable({ providedIn: 'root' })
export class PreferencesApiSmelly {
  private readonly http = inject(HttpClient);

  save(prefs: Preferences): Observable<unknown> {
    return this.http.put('/api/preferences', prefs).pipe(catchError(() => of(null)));
  }
}

@Component({
  selector: 'cs-swallowed-exceptions-smelly',
  template: `
    <button type="button" (click)="save()">Save</button>
    <p>{{ status() }}</p>
  `,
})
export class PreferencesFormSmelly {
  private readonly api = inject(PreferencesApiSmelly);
  readonly status = signal('');

  save(): void {
    this.api.save({ newsletter: true, language: 'es' }).subscribe(() => this.status.set('Saved'));
  }
}
