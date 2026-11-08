import { Component, Input } from '@angular/core';

export interface Person {
  name: string;
  email: string;
}
export interface Department {
  name: string;
  head: Person;
}
export interface Course {
  title: string;
  department: Department;
}
export interface Enrollment {
  student: Person;
  course: Course;
}

// SMELL: Message Chains. The template navigates enrollment -> course -> department -> head ->
// email. The component now depends on the shape of four objects; restructuring departments
// breaks a screen that only wanted "who do I contact?".
@Component({
  selector: 'cs-message-chains-smelly',
  template: `
    <p>{{ enrollment.student.name }} - {{ enrollment.course.title }}</p>
    <p>Contact: {{ enrollment.course.department.head.name }} &lt;{{ enrollment.course.department.head.email }}&gt;</p>
  `,
})
export class EnrollmentCardSmelly {
  @Input({ required: true }) enrollment!: Enrollment;
}
