import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReportUploaderSmelly } from './smelly';
import { ReportUploader, UPLOAD_CONFIG } from './refactored';

describe('Hidden Temporal Coupling', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UPLOAD_CONFIG, useValue: { baseUrl: 'https://api.reports.test', token: 't0k3n' } },
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('both versions send the same request when the smelly one is called in the right order', () => {
    const http = TestBed.inject(HttpTestingController);
    const smelly = TestBed.inject(ReportUploaderSmelly);
    smelly.configure('https://api.reports.test');
    smelly.authenticate('t0k3n');
    smelly.upload({ title: 'Q1' }).subscribe();
    TestBed.inject(ReportUploader).upload({ title: 'Q1' }).subscribe();

    const requests = http.match('https://api.reports.test/reports');
    expect(requests.map((r) => r.request.headers.get('Authorization'))).toEqual(['Bearer t0k3n', 'Bearer t0k3n']);
    requests.forEach((r) => r.flush({}));
  });

  it('calling the smelly service out of order silently sends a broken request', () => {
    TestBed.inject(ReportUploaderSmelly).upload({ title: 'Q1' }).subscribe();
    const request = TestBed.inject(HttpTestingController).expectOne('undefined/reports');
    expect(request.request.headers.get('Authorization')).toBe('Bearer undefined');
    request.flush({});
  });
});
