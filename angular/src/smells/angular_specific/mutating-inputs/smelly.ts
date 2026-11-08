import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface OrderLine {
  product: string;
  quantity: number;
}

// SMELL: mutating inputs. The child changes the object it received from its parent. The parent's
// state changes behind its back: its signals do not notice (same reference), computed totals go
// stale, and an "undo" copy or a cached request that shares the object is silently corrupted.
@Component({
  selector: 'cs-mutating-inputs-smelly-line',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <span class="line">{{ line.product }} x{{ line.quantity }}</span>
    <button type="button" class="more" (click)="increment()">+</button>
  `,
})
export class SmellyOrderLineComponent {
  @Input({ required: true }) line!: OrderLine;

  increment(): void {
    this.line.quantity++;
  }
}
