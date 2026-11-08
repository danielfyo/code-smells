import { ChangeDetectionStrategy, Component, Directive, OnInit, computed, signal } from '@angular/core';

// SMELL: component inheritance hierarchy. Paging, loading and selection live in an abstract base
// "component" that subclasses must extend. Subclasses inherit everything whether they need it or
// not, are coupled to the base's lifecycle (forget super.ngOnInit() and nothing loads) and cannot
// combine two such behaviors because a class has only one parent.
@Directive()
export abstract class BaseListComponent<T> implements OnInit {
  readonly pageSize = 2;
  readonly items = signal<T[]>([]);
  readonly page = signal(1);
  readonly visible = computed(() => this.items().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize));
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.items().length / this.pageSize)));

  protected abstract load(): T[];

  ngOnInit(): void {
    this.items.set(this.load());
  }

  next(): void {
    this.page.update((page) => Math.min(page + 1, this.pageCount()));
  }
}

const LIST_TEMPLATE = `
  <ul>
    @for (name of visible(); track name) {
      <li>{{ name }}</li>
    }
  </ul>
  <button type="button" class="next" (click)="next()">Next</button>
  <span class="page">{{ page() }}/{{ pageCount() }}</span>
`;

@Component({
  selector: 'cs-component-inheritance-smelly-customers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: LIST_TEMPLATE,
})
export class SmellyCustomerListComponent extends BaseListComponent<string> {
  protected load(): string[] {
    return ['Ana', 'Leo', 'Eva'];
  }
}

@Component({
  selector: 'cs-component-inheritance-smelly-suppliers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: LIST_TEMPLATE,
})
export class SmellySupplierListComponent extends BaseListComponent<string> implements OnInit {
  readonly ready = signal(false);

  protected load(): string[] {
    return ['Acme', 'Globex', 'Initech'];
  }

  // SMELL: overriding a lifecycle hook and forgetting super.ngOnInit(): the list stays empty.
  override ngOnInit(): void {
    this.ready.set(true);
  }
}
