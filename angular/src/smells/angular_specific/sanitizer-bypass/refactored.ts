import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// REFACTOR: let Angular sanitize. Binding the raw string to [innerHTML] keeps harmless formatting
// (<b>, <i>, <p>) and strips scripts, event handlers and javascript: URLs. Plain text should use
// interpolation instead; bypassSecurityTrust* is only for content the application itself authored.
@Component({
  selector: 'cs-sanitizer-bypass-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="review" [innerHTML]="body()"></div>`,
})
export class ReviewComponent {
  readonly body = input.required<string>();
}
