import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { EnrollmentCardSmelly } from './smelly';
import { Course, Department, Enrollment, EnrollmentCardRefactored } from './refactored';

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

describe('Message Chains', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions show the same contact', async () => {
    const student = { name: 'Hugo', email: 'hugo@uni.test' };
    const head = { name: 'Dr. Prado', email: 'prado@uni.test' };
    const smelly = await renderText(EnrollmentCardSmelly, {
      enrollment: { student, course: { title: 'Algebra', department: { name: 'Maths', head } } },
    });
    const refactored = await renderText(EnrollmentCardRefactored, {
      enrollment: new Enrollment(student, new Course('Algebra', new Department('Maths', head))),
    });
    expect(refactored).toBe(smelly);
    expect(refactored).toBe('Hugo - Algebra Contact: Dr. Prado <prado@uni.test>');
  });
});
