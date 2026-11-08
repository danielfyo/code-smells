import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Person {
  name: string;
  email: string;
}

// REFACTOR: Hide Delegate. Each object answers the question for the next one in line, so the
// client only talks to its direct collaborator (Law of Demeter).
export class Department {
  constructor(
    readonly name: string,
    private readonly head: Person,
  ) {}

  contact(): string {
    return `${this.head.name} <${this.head.email}>`;
  }
}

export class Course {
  constructor(
    readonly title: string,
    private readonly department: Department,
  ) {}

  contact(): string {
    return this.department.contact();
  }
}

export class Enrollment {
  constructor(
    readonly student: Person,
    private readonly course: Course,
  ) {}

  get courseTitle(): string {
    return this.course.title;
  }

  contact(): string {
    return this.course.contact();
  }
}

@Component({
  selector: 'cs-message-chains-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>{{ enrollment().student.name }} - {{ enrollment().courseTitle }}</p>
    <p>Contact: {{ contact() }}</p>
  `,
})
export class EnrollmentCardRefactored {
  readonly enrollment = input.required<Enrollment>();
  protected readonly contact = computed(() => this.enrollment().contact());
}
