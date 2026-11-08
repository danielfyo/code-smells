import type { Product } from './model';
import { priceLabel } from './smelly';
import { adminPriceLabel, customerPriceLabel } from './refactored';

const kettle: Product = { name: 'Kettle', costCents: 1800, priceCents: 3000 };

describe('Flag Arguments', () => {
  it('the customer label matches priceLabel(product, false)', () => {
    expect(customerPriceLabel(kettle)).toBe(priceLabel(kettle, false));
    expect(customerPriceLabel(kettle)).toBe('Kettle: 36.30 € (VAT incl.)');
  });

  it('the admin label matches priceLabel(product, true)', () => {
    expect(adminPriceLabel(kettle)).toBe(priceLabel(kettle, true));
    expect(adminPriceLabel(kettle)).toBe('Kettle: cost 18.00, margin 40%');
  });
});
