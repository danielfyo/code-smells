import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// SMELL: bypassing the sanitizer on user content. bypassSecurityTrustHtml tells Angular "this HTML
// is safe", so whatever a user typed into a review (event handlers, javascript: links, scripts)
// is inserted into the page as-is: a stored XSS waiting to happen.
@Component({
  selector: 'cs-sanitizer-bypass-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="review" [innerHTML]="trustedHtml()"></div>`,
})
export class SmellyReviewComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly body = input.required<string>();
  readonly trustedHtml = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.body()));
}
