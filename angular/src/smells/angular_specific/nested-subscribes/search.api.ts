import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/** Product search backend. Tests replace it with a fake whose responses they control. */
@Injectable({ providedIn: 'root' })
export class ProductSearchApi {
  search(term: string): Observable<string[]> {
    return of(['Desk lamp', 'Desk chair', 'Notebook'].filter((name) => name.toLowerCase().includes(term.toLowerCase())));
  }
}
