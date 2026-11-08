import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Customer {
  id: string;
  name: string;
}

/** Customer backend. Records the ids it was asked for so the tests can inspect them. */
@Injectable({ providedIn: 'root' })
export class CustomerApi {
  readonly requestedIds: (string | undefined)[] = [];

  load(id: string | undefined): Observable<Customer> {
    this.requestedIds.push(id);
    return of({ id: String(id), name: id === '42' ? 'Ana Ruiz' : 'Unknown customer' });
  }
}
