import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';

interface ReviewDto {
  review_id: number;
  author_name: string;
  stars: number;
}

// SMELL: HttpClient in components. The component knows the endpoint, builds the URL and query
// string by hand, knows the backend's snake_case payload and maps it. Every other component that
// needs reviews repeats all of it, and testing the view requires faking HTTP.
@Component({
  selector: 'cs-http-in-components-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (review of reviews(); track review.id) {
        <li>{{ review.author }}: {{ review.stars }}/5</li>
      }
    </ul>
  `,
})
export class SmellyProductReviewsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly productId = input.required<number>();
  readonly reviews = signal<{ id: number; author: string; stars: number }[]>([]);

  ngOnInit(): void {
    const url = '/api/v1/products/' + this.productId() + '/reviews?sort=' + 'newest' + '&limit=' + 5;
    this.http.get<ReviewDto[]>(url).subscribe((dtos) =>
      this.reviews.set(dtos.map((dto) => ({ id: dto.review_id, author: dto.author_name, stars: dto.stars }))),
    );
  }
}
