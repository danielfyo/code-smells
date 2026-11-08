import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Book, SmellyBookSearchComponent } from './smelly';
import { BookSearchComponent } from './refactored';

const books: Book[] = [
  { title: 'Dune', author: 'Frank Herbert', price: 12 },
  { title: 'Emma', author: 'Jane Austen', price: 8 },
  { title: 'Persuasion', author: 'Jane Austen', price: 9 },
];

describe('short-names-long-scopes', () => {
  it.each<[Type<unknown>, string]>([
    [SmellyBookSearchComponent, 'b'],
    [BookSearchComponent, 'books'],
  ])('%o filters by title or author as the user types', async (component, inputName) => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(component);
    fixture.componentRef.setInput(inputName, books);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.summary')?.textContent).toBe('3 books, 29 EUR');

    const search = host.querySelector<HTMLInputElement>('.search');
    if (!search) throw new Error('search box not rendered');
    search.value = 'austen';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.querySelector('.summary')?.textContent).toBe('2 books, 17 EUR');
    expect([...host.querySelectorAll('li')].map((li) => li.textContent)).toEqual(['Emma', 'Persuasion']);
  });
});
