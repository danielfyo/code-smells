import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyPayrollService } from './smelly';
import { Employee, PayrollService } from './refactored';

describe('vertical-separation', () => {
  const staff: Employee[] = [
    { name: 'Ana', hourlyRate: 20, hours: 45 },
    { name: 'Leo', hourlyRate: 15, hours: 30 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions produce the same payroll summary', () => {
    const expected = ['Weekly payroll', 'Ana: 950.00 EUR', 'Leo: 450.00 EUR', 'Overtime hours: 5', 'Total: 1400.00 EUR'];
    expect(TestBed.inject(SmellyPayrollService).weeklySummary(staff)).toEqual(expected);
    expect(TestBed.inject(PayrollService).weeklySummary(staff)).toEqual(expected);
  });

  it('both versions detect overtime and count employees', () => {
    const smelly = TestBed.inject(SmellyPayrollService);
    const refactored = TestBed.inject(PayrollService);
    expect(staff.map((e) => smelly.hasOvertime(e))).toEqual([true, false]);
    expect(staff.map((e) => refactored.hasOvertime(e))).toEqual([true, false]);
    expect(smelly.employeeCount(staff)).toBe(refactored.employeeCount(staff));
  });
});
