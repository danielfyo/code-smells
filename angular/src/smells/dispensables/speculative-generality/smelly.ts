import { Injectable } from '@angular/core';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

// SMELL: Speculative Generality. A generic repository with a pluggable storage strategy,
// lifecycle hooks and an options bag, all "for when we need it". There is exactly one entity,
// one storage and the hooks are never overridden.
export interface StorageStrategySmelly<T, K> {
  read(key: K): T | undefined;
  write(key: K, value: T): void;
  all(): T[];
}

export class InMemoryStrategySmelly<T, K> implements StorageStrategySmelly<T, K> {
  private readonly data = new Map<K, T>();
  read(key: K): T | undefined {
    return this.data.get(key);
  }
  write(key: K, value: T): void {
    this.data.set(key, value);
  }
  all(): T[] {
    return [...this.data.values()];
  }
}

export abstract class AbstractRepositorySmelly<T extends { id: K }, K, TMeta = unknown> {
  protected constructor(protected readonly strategy: StorageStrategySmelly<T, K>) {}

  protected beforeSave(entity: T): T {
    return entity;
  }
  protected afterSave(_entity: T, _meta?: TMeta): void {}

  save(entity: T, _options: { audit?: boolean; meta?: TMeta } = {}): void {
    const prepared = this.beforeSave(entity);
    this.strategy.write(prepared.id, prepared);
    this.afterSave(prepared);
  }

  findAll(): T[] {
    return this.strategy.all();
  }
  findById(id: K): T | undefined {
    return this.strategy.read(id);
  }
}

@Injectable({ providedIn: 'root' })
export class TodoRepositorySmelly extends AbstractRepositorySmelly<Todo, number> {
  private nextId = 1;

  constructor() {
    super(new InMemoryStrategySmelly<Todo, number>());
  }

  add(title: string): void {
    this.save({ id: this.nextId++, title, done: false });
  }

  toggle(id: number): void {
    const todo = this.findById(id);
    if (todo) this.save({ ...todo, done: !todo.done });
  }

  remaining(): number {
    return this.findAll().filter((t) => !t.done).length;
  }
}
