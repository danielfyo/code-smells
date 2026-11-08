import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TodoListComponent } from './production';

// REFACTOR: test through the public surface, the way a user interacts: type in the labelled
// field, submit, tick the checkbox and read the status. Internals can change freely.
describe('TodoListComponent (refactored)', () => {
  it('adds a task and marks it as done', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(TodoListComponent);
    const host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();

    const titleInput = host.querySelector<HTMLInputElement>('input[name="title"]');
    if (!titleInput) throw new Error('title input not rendered');
    titleInput.value = 'Buy milk';
    host.querySelector('form')?.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(host.querySelector('[role="status"]')?.textContent).toBe('1 pending');

    const checkbox = [...host.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].find((box) =>
      box.parentElement?.textContent?.includes('Buy milk'),
    );
    checkbox?.click();
    await fixture.whenStable();
    expect(host.querySelector('[role="status"]')?.textContent).toBe('0 pending');
  });
});
