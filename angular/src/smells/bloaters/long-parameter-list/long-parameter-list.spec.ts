import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClinicSchedulerSmelly } from './smelly';
import { ClinicSchedulerRefactored, describeSlot } from './refactored';

describe('Long Parameter List', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions produce the same confirmation', () => {
    const smelly = TestBed.inject(ClinicSchedulerSmelly).book('Marta Gil', '600111222', 'Dr. Ruiz', '2026-03-02', 9, 45, 'B12', true);
    const refactored = TestBed.inject(ClinicSchedulerRefactored).book({
      patient: { name: 'Marta Gil', phone: '600111222' },
      doctor: 'Dr. Ruiz',
      slot: { day: '2026-03-02', startHour: 9, durationMinutes: 45 },
      room: 'B12',
      kind: 'follow-up',
    });
    expect(refactored).toBe(smelly);
    expect(refactored).toBe('Follow-up for Marta Gil (600111222) with Dr. Ruiz on 2026-03-02 9:00-9:45 in B12');
  });

  it('the smelly signature silently accepts swapped arguments', () => {
    // Hour and duration swapped: it compiles and produces nonsense.
    const wrong = TestBed.inject(ClinicSchedulerSmelly).book('Marta Gil', '600111222', 'Dr. Ruiz', 'Mon', 45, 9, 'B12', false);
    expect(wrong).toContain('45:00-45:09');
  });

  it('the parameter object can be described on its own', () => {
    expect(describeSlot({ day: 'Tue', startHour: 16, durationMinutes: 90 })).toBe('Tue 16:00-17:30');
  });
});
