import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import type { Employee } from './model';
import { EmployeeCardSmelly } from './smelly';
import { EmployeeCardRefactored, PayrollCsvExporter, netMonthlySalary } from './refactored';

function textOf(fixture: ComponentFixture<unknown>): string {
  const walker = document.createTreeWalker(fixture.nativeElement as HTMLElement, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.replace(/\s+/g, ' ').trim();
    if (text) parts.push(text);
  }
  return parts.join(' ');
}

async function renderText(component: Type<unknown>, inputs: Record<string, unknown> = {}): Promise<string> {
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  return textOf(fixture);
}

const employees: Employee[] = [
  { name: 'Nora Vidal', email: 'nora@company.test', grossYearly: 18_000 },
  { name: 'Pablo Sanz', email: 'pablo@gmail.test', grossYearly: 42_000 },
];

describe('Divergent Change', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each(employees)('both versions render the same card for $name', async (employee) => {
    const smelly = await renderText(EmployeeCardSmelly, { employee });
    const refactored = await renderText(EmployeeCardRefactored, { employee });
    expect(refactored).toBe(smelly);
  });

  it('each responsibility is testable on its own', () => {
    expect(netMonthlySalary(42_000)).toBeCloseTo(2700);
    expect(TestBed.inject(PayrollCsvExporter).line(employees[0]!)).toBe('NORA VIDAL;nora@company.test;1275.00');
  });
});
