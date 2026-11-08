import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

// SMELL: Hidden Temporal Coupling. `configure()` and `authenticate()` must be called, in that
// order, before `upload()`. Nothing in the API says so: call `upload()` first and it happily
// posts to "undefined/reports" without credentials.
@Injectable({ providedIn: 'root' })
export class ReportUploaderSmelly {
  private readonly http = inject(HttpClient);
  private baseUrl?: string;
  private token?: string;

  configure(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  authenticate(token: string): void {
    this.token = token;
  }

  upload(report: { title: string }): Observable<unknown> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.post(`${this.baseUrl}/reports`, report, { headers });
  }
}
