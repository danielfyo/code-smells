import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyReviewComponent } from './smelly';
import { ReviewComponent } from './refactored';

const maliciousReview =
  '<b>Great kettle!</b><img src="x" onerror="window.stolen = document.cookie">' +
  '<a href="javascript:alert(1)">details</a><script>window.pwned = true</script>';

async function renderReview(component: Type<unknown>): Promise<HTMLElement> {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent(component);
  fixture.componentRef.setInput('body', maliciousReview);
  await fixture.whenStable();
  const review = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.review');
  if (!review) throw new Error('review not rendered');
  return review;
}

describe('sanitizer-bypass', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined); // Angular warns when it strips content
  });

  it('smelly: event handlers, javascript: links and scripts reach the DOM untouched', async () => {
    const review = await renderReview(SmellyReviewComponent);
    expect(review.querySelector('img')?.getAttribute('onerror')).toContain('document.cookie');
    expect(review.querySelector('a')?.getAttribute('href')).toBe('javascript:alert(1)');
    expect(review.querySelector('script')).not.toBeNull();
  });

  it('refactored: the sanitizer keeps the formatting and strips the dangerous parts', async () => {
    const review = await renderReview(ReviewComponent);
    expect(review.querySelector('b')?.textContent).toBe('Great kettle!');
    expect(review.querySelector('img')?.hasAttribute('onerror')).toBe(false);
    expect(review.querySelector('a')?.getAttribute('href')).toMatch(/^unsafe:/);
    expect(review.querySelector('script')).toBeNull();
  });
});
