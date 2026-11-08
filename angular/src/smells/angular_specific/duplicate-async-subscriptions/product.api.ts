import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductDetail {
  name: string;
  price: number;
  stock: number;
}

/** Returns a cold HTTP observable: every subscription sends a new request. */
@Injectable({ providedIn: 'root' })
export class ProductDetailApi {
  private readonly http = inject(HttpClient);

  byId(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`/api/products/${id}`);
  }
}
