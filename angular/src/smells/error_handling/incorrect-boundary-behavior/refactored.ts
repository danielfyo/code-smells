import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface PageView<T> {
  page: number;
  totalPages: number;
  items: T[];
}

// REFACTOR: Encapsulate Boundary Conditions. One function owns every edge: empty list, partial
// last page, page numbers below 1 or past the end. The boundaries are tested explicitly.
export function paginate<T>(items: readonly T[], pageSize: number, requestedPage: number): PageView<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * pageSize;
  return { page, totalPages, items: items.slice(start, start + pageSize) };
}

@Component({
  selector: 'cs-incorrect-boundary-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let view = pageView();
    <p>Page {{ view.page }} of {{ view.totalPages }}</p>
    <p>{{ view.items.join(', ') }}</p>
  `,
})
export class GuestListPagerRefactored {
  readonly guests = input<readonly string[]>([]);
  readonly pageSize = input(3);
  readonly page = input(1);

  protected readonly pageView = computed(() => paginate(this.guests(), this.pageSize(), this.page()));
}
