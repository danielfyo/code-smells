import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TodoListComponent } from './production';

interface TodoInternals {
  todos: () => { title: string; done: boolean }[];
  add(title: string): void;
  toggle(id: number): void;
  nextId: number;
}

// SMELL: fragile test. It reaches into protected members through a cast, depends on the private
// id counter and selects elements through the exact DOM nesting (div.wrapper > ul > li). Renaming
// a signal, changing how ids are generated or removing a wrapper div breaks the test although
// the user-visible behavior is unchanged.
describe('TodoListComponent (smelly)', () => {
  it('adds and completes a task', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(TodoListComponent);
    const internals = fixture.componentInstance as unknown as TodoInternals;
    internals.add('Buy milk');
    expect(internals.nextId).toBe(2);
    internals.toggle(1);
    expect(internals.todos()[0]?.done).toBe(true);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('div.wrapper > ul > li:nth-child(1) > label')?.textContent?.trim()).toBe('Buy milk');
    expect(host.querySelector('p')?.textContent).toBe('0 pending');
  });
});
