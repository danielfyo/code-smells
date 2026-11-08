import { ChangeDetectionStrategy, Component, computed, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OrderLine as MutableLine, SmellyOrderLineComponent } from './smelly';
import { OrderLine, OrderLineComponent } from './refactored';

@Component({
  selector: 'cs-mutating-inputs-host',
  imports: [SmellyOrderLineComponent, OrderLineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="smelly">
      <cs-mutating-inputs-smelly-line [line]="smellyLine()" />
      <p class="units">{{ smellyUnits() }} units</p>
    </section>
    <section class="refactored">
      <cs-mutating-inputs-refactored-line [line]="line()" (quantityChange)="setQuantity($event)" />
      <p class="units">{{ units() }} units</p>
    </section>
  `,
})
class MutatingInputsHost {
  readonly original: MutableLine = { product: 'Coffee beans', quantity: 1 };
  readonly smellyLine = signal<MutableLine>(this.original);
  readonly smellyUnits = computed(() => this.smellyLine().quantity);

  readonly initial: OrderLine = { product: 'Coffee beans', quantity: 1 };
  readonly line = signal<OrderLine>(this.initial);
  readonly units = computed(() => this.line().quantity);

  setQuantity(quantity: number): void {
    this.line.update((line) => ({ ...line, quantity }));
  }
}

describe('mutating-inputs', () => {
  async function clickTwice(section: string) {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(MutatingInputsHost);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    for (let i = 0; i < 2; i++) {
      host.querySelector<HTMLButtonElement>(`.${section} .more`)?.click();
      await fixture.whenStable();
    }
    return {
      host: fixture.componentInstance,
      line: host.querySelector(`.${section} .line`)?.textContent,
      units: host.querySelector(`.${section} .units`)?.textContent,
    };
  }

  it("smelly: the child mutates the parent's object and the parent's derived state goes stale", async () => {
    const { host, line, units } = await clickTwice('smelly');
    expect(host.original.quantity).toBe(3); // the parent's object was changed behind its back
    expect(line).toBe('Coffee beans x3');
    expect(units).toBe('1 units'); // computed did not notice: same reference
  });

  it('refactored: the parent owns the change, its original object stays untouched', async () => {
    const { host, line, units } = await clickTwice('refactored');
    expect(host.initial.quantity).toBe(1);
    expect(line).toBe('Coffee beans x3');
    expect(units).toBe('3 units');
  });
});
