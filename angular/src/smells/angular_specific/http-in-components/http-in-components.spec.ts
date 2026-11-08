import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SmellyProductReviewsComponent } from './smelly';
import { ProductReviewsComponent, ReviewsService } from './refactored';

const payload = [
  { review_id: 1, author_name: 'Ana', stars: 5 },
  { review_id: 2, author_name: 'Leo', stars: 3 },
];

describe('http-in-components', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it.each<Type<unknown>>([SmellyProductReviewsComponent, ProductReviewsComponent])('%o requests the same endpoint and renders reviews', async (component) => {
    const fixture = TestBed.createComponent(component);
    fixture.componentRef.setInput('productId', 7);
    await fixture.whenStable();
    http.expectOne((req) => req.urlWithParams === '/api/v1/products/7/reviews?sort=newest&limit=5').flush(payload);
    await fixture.whenStable();
    expect([...(fixture.nativeElement as HTMLElement).querySelectorAll('li')].map((li) => li.textContent)).toEqual(['Ana: 5/5', 'Leo: 3/5']);
  });

  it('refactored: the service can be reused and tested without any component', async () => {
    const reviews = firstValueFrom(TestBed.inject(ReviewsService).latestReviews(7, 2));
    http.expectOne('/api/v1/products/7/reviews?sort=newest&limit=2').flush(payload);
    expect(await reviews).toEqual([
      { id: 1, author: 'Ana', stars: 5 },
      { id: 2, author: 'Leo', stars: 3 },
    ]);
  });
});
