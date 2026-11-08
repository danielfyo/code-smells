import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import type { Observable } from 'rxjs';

export interface UploadConfig {
  baseUrl: string;
  token: string;
}

// REFACTOR: Make the dependency explicit. Everything `upload()` needs is supplied when the
// service is created (through DI), so there is no order to remember and no half-configured
// state. If the token is missing, the application fails at startup, not at the first upload.
export const UPLOAD_CONFIG = new InjectionToken<UploadConfig>('UPLOAD_CONFIG');

@Injectable({ providedIn: 'root' })
export class ReportUploader {
  private readonly http = inject(HttpClient);
  private readonly config = inject(UPLOAD_CONFIG);

  upload(report: { title: string }): Observable<unknown> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.config.token}` });
    return this.http.post(`${this.config.baseUrl}/reports`, report, { headers });
  }
}
