import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyTaskBoardComponent } from './smelly';
import { TaskBoardComponent } from './refactored';

type Board = typeof SmellyTaskBoardComponent | typeof TaskBoardComponent;

/** Types a note next to "Write report", reverses the list and reports which task holds the note. */
async function noteOwnerAfterReverse(component: Board): Promise<{ titles: string[]; noteNextTo: string }> {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent<SmellyTaskBoardComponent | TaskBoardComponent>(component);
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  const firstNote = host.querySelector<HTMLInputElement>('li .note');
  if (!firstNote) throw new Error('no rows rendered');
  firstNote.value = 'Attach Q3 figures';

  host.querySelector<HTMLButtonElement>('.reverse')?.click();
  await fixture.whenStable();

  const rows = [...host.querySelectorAll('li')];
  const owner = rows.find((row) => row.querySelector<HTMLInputElement>('.note')?.value === 'Attach Q3 figures');
  return {
    titles: rows.map((row) => row.querySelector('.title')?.textContent ?? ''),
    noteNextTo: owner?.querySelector('.title')?.textContent ?? '',
  };
}

describe('index-as-track', () => {
  it('both versions reorder the titles', async () => {
    expect((await noteOwnerAfterReverse(SmellyTaskBoardComponent)).titles).toEqual(['Book flights', 'Call supplier', 'Write report']);
    TestBed.resetTestingModule();
    expect((await noteOwnerAfterReverse(TaskBoardComponent)).titles).toEqual(['Book flights', 'Call supplier', 'Write report']);
  });

  it('smelly: the typed note stays in row 0 and now belongs to another task', async () => {
    expect((await noteOwnerAfterReverse(SmellyTaskBoardComponent)).noteNextTo).toBe('Book flights');
  });

  it('refactored: the note moves together with its task', async () => {
    expect((await noteOwnerAfterReverse(TaskBoardComponent)).noteNextTo).toBe('Write report');
  });
});
