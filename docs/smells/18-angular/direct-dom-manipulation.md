# Direct DOM Manipulation

> **ID:** CS183 · **Category:** Angular-specific · **Sources:** angular.dev: Renderer2 and template bindings

## Definition

Changing the rendered view by reaching into the DOM — `ElementRef.nativeElement.style`, `classList.add()`,
`innerHTML`, `document.querySelector()`, `document.getElementById()` — instead of expressing the state in the template
with bindings (`[class.x]`, `[style.x]`, `@if`, host bindings) and letting Angular update the DOM.

## Symptoms

- `inject(ElementRef).nativeElement` followed by property writes.
- `document.querySelector` / `getElementById` in components or services.
- State duplicated between a component field and a CSS class toggled by hand.
- Errors such as `document is not defined` during server-side rendering, or hydration mismatches.
- `[innerHTML]`-like effects achieved by assigning `nativeElement.innerHTML`.

## Common causes

- jQuery-era habits.
- Quick fixes for focus, scrolling or measurement that grew into general view logic.
- Not knowing about host bindings, `viewChild()` or `afterNextRender()`.

## Why it is a problem

- **Two sources of truth**: Angular renders from component state, the hand-written code edits the result; the next
  check can overwrite the change, or the two drift apart.
- **Breaks SSR and hydration**: there is no `document` on the server and the hydrated DOM no longer matches.
- **Security**: writing `innerHTML` directly skips Angular's sanitization.
- **Hard to test**: behaviour lives in DOM side effects instead of observable state.

## How it works under the hood

Angular owns the DOM nodes created from a template. During change detection it re-evaluates each binding and writes
to the DOM only when the bound value changed since the last check. It has no idea about mutations done behind its
back: a class added by hand stays until a binding on the same property changes and overwrites it, and nodes created
by `@if` / `@for` may be destroyed and recreated, losing the manual edits. `Renderer2` is an abstraction over the
DOM that works on the server and in tests, but it is still imperative; bindings are preferable whenever the change is
a function of state. For code that truly needs real DOM (focus, measuring, third-party widgets), `viewChild()` gives a
typed reference and `afterNextRender()` runs only in the browser after rendering.

## Example (smelly)

```ts
@Component({
  selector: 'app-booking-card',
  template: `<div class="card"><button (click)="toggle()">Select</button></div>`,
})
export class BookingCard {
  private readonly el = inject(ElementRef<HTMLElement>);
  selected = false;

  toggle(): void {
    this.selected = !this.selected;
    const card = this.el.nativeElement.querySelector('.card')!;
    card.classList.toggle('selected');                       // SMELL: state mirrored by hand
    card.style.borderColor = this.selected ? 'green' : '';   // SMELL: style set imperatively
    document.getElementById('summary')!.textContent = 'Selected'; // SMELL: global DOM access
  }
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-booking-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" [class.selected]="selected()" [style.border-color]="selected() ? 'green' : null">
      <button (click)="selected.update(s => !s)">Select</button>
    </div>
  `,
})
export class BookingCard {
  readonly selected = model(false); // REFACTOR: state in a signal, rendered by bindings;
                                    // the parent shows the summary from the same state
}
```

## Recommended refactorings

- **Replace DOM writes with template or host bindings** (`[class.x]`, `[style.x]`, `host: { '[class.active]': ... }`).
- Lift shared view state into a signal, an input/output or a service instead of editing other components' DOM.
- Use `viewChild()` plus `afterNextRender()` for focus, scrolling and measurement.
- Use `Renderer2` only for imperative cases bindings cannot express (e.g. integrating a non-Angular widget).

## When it may be acceptable

- Focus management, scroll positioning, measuring elements, canvas drawing.
- Wrapping third-party libraries that need a host element.
- Even then, access the DOM only through `viewChild()` / `ElementRef` of the component itself, in the browser.

## Related smells

- [Bypassing the Sanitizer](./sanitizer-bypass.md)
- [Manual Change Detection Hacks](./manual-change-detection.md)
- [Global Data](../05-couplers/global-data.md)
- [Inappropriate Intimacy](../05-couplers/inappropriate-intimacy.md)

## Automatic detection

- ESLint `no-restricted-globals` / `no-restricted-properties` to forbid `document` and `nativeElement` writes in
  application code.
- Server-side rendering builds fail on `document` access; hydration reports DOM mismatches in development.
- Code review: search for `nativeElement`, `querySelector` and `innerHTML`.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/direct-dom-manipulation/`](../../../angular/src/smells/angular_specific/direct-dom-manipulation/)

## References

- Angular — `Renderer2`: https://angular.dev/api/core/Renderer2
- Angular — `ElementRef`: https://angular.dev/api/core/ElementRef
- Angular — *Component host elements*: https://angular.dev/guide/components/host-elements
- Angular — *Security*: https://angular.dev/best-practices/security
