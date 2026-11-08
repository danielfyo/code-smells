import { provideZonelessChangeDetection, signal, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyCustomerListComponent, SmellySupplierListComponent } from './smelly';
import { createPagination, CustomerListComponent, SupplierListComponent } from './refactored';

async function pages(component: Type<unknown>): Promise<string[][]> {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  const read = () => [...host.querySelectorAll('li')].map((li) => li.textContent ?? '').concat(host.querySelector('.page')?.textContent ?? '');
  const first = read();
  host.querySelector<HTMLButtonElement>('.next')?.click();
  await fixture.whenStable();
  return [first, read()];
}

describe('component-inheritance', () => {
  it('customer lists page the same way in both versions', async () => {
    const expected = [['Ana', 'Leo', '1/2'], ['Eva', '2/2']];
    expect(await pages(SmellyCustomerListComponent)).toEqual(expected);
    TestBed.resetTestingModule();
    expect(await pages(CustomerListComponent)).toEqual(expected);
  });

  it('smelly: overriding ngOnInit without super silently breaks the inherited behavior', async () => {
    expect(await pages(SmellySupplierListComponent)).toEqual([['1/1'], ['1/1']]);
  });

  it('refactored: the supplier list composes paging and just works', async () => {
    expect(await pages(SupplierListComponent)).toEqual([['Acme', 'Globex', '1/2'], ['Initech', '2/2']]);
  });

  it('refactored: pagination is testable on its own', () => {
    const pagination = createPagination(signal([1, 2, 3, 4, 5]), 2);
    pagination.next();
    pagination.next();
    pagination.next();
    expect(pagination.visible()).toEqual([5]);
    expect(pagination.page()).toBe(3);
  });
});
