import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, inject } from '@angular/core';

// SMELL: direct DOM manipulation. The component edits the DOM by hand through ElementRef and even
// through the global `document`. Angular's view no longer reflects the state, it bypasses
// sanitization and SSR, and `document.querySelector` grabs the FIRST badge on the page, so a
// second instance updates the wrong component.
@Component({
  selector: 'cs-direct-dom-manipulation-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="stock-badge"></span>
    <button type="button" class="hide" (click)="hide()">Hide</button>
  `,
})
export class SmellyStockBadgeComponent implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  @Input({ required: true }) units = 0;

  ngAfterViewInit(): void {
    const badge = document.querySelector<HTMLElement>('.stock-badge');
    if (!badge) return;
    badge.textContent = this.units > 0 ? `${this.units} in stock` : 'Sold out';
    badge.classList.add(this.units > 0 ? 'in-stock' : 'sold-out');
  }

  hide(): void {
    const badge = this.host.nativeElement.querySelector<HTMLElement>('.stock-badge');
    if (badge) badge.style.display = 'none';
  }
}
