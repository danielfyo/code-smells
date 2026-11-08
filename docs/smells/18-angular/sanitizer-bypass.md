# Bypassing the Sanitizer

> **ID:** CS195 · **Category:** Angular-specific · **Sources:** angular.dev: security

## Definition

Calling `DomSanitizer.bypassSecurityTrustHtml()` (or `...Style`, `...Url`, `...ResourceUrl`, `...Script`) on content
that comes from users or external systems, usually to make `[innerHTML]` stop stripping markup. The value is marked as
trusted and rendered as-is, opening the door to cross-site scripting (XSS).

## Symptoms

- `this.sanitizer.bypassSecurityTrustHtml(comment.body)` where `body` comes from an API or a form.
- A "safeHtml" pipe applied to any string, used everywhere.
- Warnings like "sanitizing HTML stripped some content" silenced by bypassing instead of fixing.
- `iframe [src]` or `href` bound to URLs built from user input with `bypassSecurityTrustResourceUrl`.

## Common causes

- Rich text (comments, product descriptions, CMS content) that loses styles or attributes when sanitized.
- Copying a Stack Overflow "fix" for the sanitizer warning.
- Assuming the backend already cleaned the content.

## Why it is a problem

- **XSS**: an attacker can inject `<img src=x onerror=...>` or `javascript:` URLs that run in other users' sessions,
  stealing tokens or acting on their behalf.
- **Trust is invisible downstream**: once wrapped in a `SafeHtml`, the value looks safe wherever it travels.
- **Compliance and incident cost**: XSS is among the most common and most damaging web vulnerabilities.

## How it works under the hood

Angular treats every bound value as untrusted. When a value reaches a security-sensitive context — HTML
(`[innerHTML]`), style, URL (`href`, `src`) or resource URL (`iframe src`, script URLs) — Angular sanitizes it for
that context: HTML sanitization removes `<script>`, event-handler attributes and dangerous URLs while keeping safe
markup; resource URLs cannot be sanitized and are rejected unless trusted. The `bypassSecurityTrust*` methods return
`SafeValue` wrappers that tell the renderer to skip this step. They are meant for values the application itself
produced and verified. With Trusted Types enforced via CSP, Angular uses the `angular` policy for sanitized values and
`angular#unsafe-bypass` for bypassed ones, so a strict policy can forbid bypasses entirely.

## Example (smelly)

```ts
@Pipe({ name: 'trustHtml' })
export class TrustHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);
  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html); // SMELL: trusts anything
  }
}

@Component({
  selector: 'app-review',
  imports: [TrustHtmlPipe],
  template: `<div [innerHTML]="review().body | trustHtml"></div>`, // user-written review
})
export class Review { readonly review = input.required<ProductReview>(); }
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-review',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // REFACTOR: plain [innerHTML] is sanitized by Angular for the HTML context
  template: `<div [innerHTML]="review().body"></div>`,
})
export class Review { readonly review = input.required<ProductReview>(); }

// REFACTOR: for plain text, interpolation escapes everything:
// <p>{{ review().body }}</p>
// For richer allow-lists, sanitize with a dedicated library before rendering,
// then let Angular's sanitizer run anyway.
```

## Recommended refactorings

- **Remove the bypass** and let Angular sanitize; render plain text with interpolation.
- **Sanitize on the server** with an allow-list and keep Angular's client-side sanitization as defense in depth.
- If a bypass is unavoidable, confine it to a single, reviewed function that only receives content the app
  generated (e.g. a compile-time constant or a trusted Markdown renderer's output).
- Enable a Content Security Policy with Trusted Types to make bypasses visible and controllable.

## When it may be acceptable

- Static HTML, SVG or URLs produced by the application itself, never influenced by users.
- Embedding a known, allow-listed resource URL (e.g. a video player from a fixed domain with a validated id).

## Related smells

- [Direct DOM Manipulation](./direct-dom-manipulation.md)
- [$any() and any in Templates](./any-in-templates.md)
- [Overridden Safeties](../08-error-handling/overridden-safeties.md)

## Automatic detection

- Static analysis such as CodeQL and Semgrep ship rules for Angular sanitizer bypasses.
- ESLint `no-restricted-syntax` / `no-restricted-properties` to flag `bypassSecurityTrust*` calls.
- CSP with `require-trusted-types-for 'script'` and a `trusted-types` list that omits `angular#unsafe-bypass` makes
  bypasses fail at runtime.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/sanitizer-bypass/`](../../../angular/src/smells/angular_specific/sanitizer-bypass/)

## References

- Angular — *Security*: https://angular.dev/best-practices/security
- Angular — `DomSanitizer`: https://angular.dev/api/platform-browser/DomSanitizer
- OWASP — *Cross Site Scripting Prevention Cheat Sheet*: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
