import { Component, Input } from '@angular/core';

// SMELL: Incorrect Behavior at the Boundaries. Three off-by-one errors: `Math.floor` drops the
// last partial page, `end - 1` drops the last item of every page, and nothing clamps a page
// number beyond the end. They hide until the list size is not a multiple of the page size.
@Component({
  selector: 'cs-incorrect-boundary-smelly',
  template: `
    <p>Page {{ page }} of {{ totalPages() }}</p>
    <p>{{ visible().join(', ') }}</p>
  `,
})
export class GuestListPagerSmelly {
  @Input() guests: string[] = [];
  @Input() pageSize = 3;
  @Input() page = 1;

  totalPages(): number {
    return Math.floor(this.guests.length / this.pageSize);
  }

  visible(): string[] {
    const start = (this.page - 1) * this.pageSize;
    return this.guests.slice(start, start + this.pageSize - 1);
  }
}
