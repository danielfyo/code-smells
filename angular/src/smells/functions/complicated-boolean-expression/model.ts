export interface Basket {
  totalCents: number;
  country: string;
  oversizedItems: number;
  customerTier: 'basic' | 'premium';
  couponCode?: string;
}
