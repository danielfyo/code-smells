import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injectable, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, map, switchMap } from 'rxjs';

export interface Review {
  id: number;
  author: string;
  stars: number;
}

interface ReviewDto {
  review_id: number;
  author_name: string;
  stars: number;
}

// REFACTOR: Extract a data service. URL building, query params and DTO mapping live in one
// injectable that returns domain objects. The component only declares what it shows.
@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly http = inject(HttpClient);

  latestReviews(productId: number, limit = 5): Observable<Review[]> {
    return this.http
      .get<ReviewDto[]>(`/api/v1/products/${productId}/reviews`, { params: { sort: 'newest', limit } })
      .pipe(map((dtos) => dtos.map((dto) => ({ id: dto.review_id, author: dto.author_name, stars: dto.stars }))));
  }
}

@Component({
  selector: 'cs-http-in-components-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (review of reviews(); track review.id) {
        <li>{{ review.author }}: {{ review.stars }}/5</li>
      }
    </ul>
  `,
})
export class ProductReviewsComponent {
  private readonly reviewsService = inject(ReviewsService);
  readonly productId = input.required<number>();
  readonly reviews = toSignal(toObservable(this.productId).pipe(switchMap((id) => this.reviewsService.latestReviews(id))), {
    initialValue: [],
  });
}
