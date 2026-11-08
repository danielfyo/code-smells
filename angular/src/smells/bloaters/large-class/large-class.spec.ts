import { ChangeDetectorRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { LibraryDeskSmelly } from './smelly';
import { LibraryDeskRefactored, LoanDesk, fineFor } from './refactored';

function textOf(host: HTMLElement): string {
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.replace(/\s+/g, ' ').trim();
    if (text) parts.push(text);
  }
  return parts.join(' ');
}

interface Desk {
  borrow(isbn: string, member: string, today: number): void;
  giveBack(isbn: string, today: number): void;
}

async function play(fixture: ComponentFixture<Desk>): Promise<string[]> {
  const snapshots: string[] = [];
  const steps: ((desk: Desk) => void)[] = [
    (d) => d.borrow('978-0', 'ana', 1),
    (d) => d.borrow('978-0', 'luis', 2),
    (d) => d.borrow('978-1', 'ana', 2),
    (d) => d.borrow('978-2', 'ana', 3),
    (d) => d.giveBack('978-0', 25),
    (d) => d.giveBack('978-1', 10),
  ];
  for (const step of steps) {
    step(fixture.componentInstance);
    // Components are OnPush by default: a programmatic call must mark the view for check.
    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    await fixture.whenStable();
    snapshots.push(textOf(fixture.nativeElement as HTMLElement));
  }
  return snapshots;
}

describe('Large Class', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions react identically to the same sequence of actions', async () => {
    const smelly = await play(TestBed.createComponent(LibraryDeskSmelly));
    const refactored = await play(TestBed.createComponent(LibraryDeskRefactored));
    expect(refactored).toEqual(smelly);
    expect(refactored.at(3)).toContain('ana reached the loan limit');
    expect(refactored.at(4)).toContain('ana owes 5.00');
  });

  it('the loan rules can be exercised without any UI', () => {
    const desk = TestBed.inject(LoanDesk);
    expect(desk.borrow('978-2', 'eva', 0)).toBe('eva borrowed Ulysses');
    expect(desk.giveBack('978-2', 40)).toBe('eva owes 10.00');
    expect(desk.totalFines()).toBe(10);
    expect(fineFor(-3)).toBe(0);
  });
});
