import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TodoRepositorySmelly } from './smelly';
import { TodoStore } from './refactored';

describe('Speculative Generality', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('the simple store behaves exactly like the generic repository', () => {
    const repo = TestBed.inject(TodoRepositorySmelly);
    const store = TestBed.inject(TodoStore);
    for (const title of ['Buy milk', 'Call plumber', 'Pay rent']) {
      repo.add(title);
      store.add(title);
    }
    repo.toggle(2);
    store.toggle(2);

    expect(store.todos()).toEqual(repo.findAll());
    expect(store.remaining()).toBe(repo.remaining());
    expect(store.remaining()).toBe(2);
  });
});
