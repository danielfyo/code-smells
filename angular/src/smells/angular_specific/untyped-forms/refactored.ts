import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface SignUpRequest {
  email: string;
  password: string;
  newsletter: boolean;
}

// REFACTOR: typed reactive forms. NonNullableFormBuilder infers FormGroup<{ email: FormControl<string>,
// ... }>, so getRawValue() is typed as { email: string; password: string; newsletter: boolean }.
// A typo in a control name is now a compile error, and the payload is checked against SignUpRequest.
@Component({
  selector: 'cs-untyped-forms-refactored',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input class="email" formControlName="email" />
      <input class="password" type="password" formControlName="password" />
      <input class="newsletter" type="checkbox" formControlName="newsletter" />
      <button type="submit">Sign up</button>
    </form>
  `,
})
export class SignUpFormComponent {
  readonly signedUp = output<SignUpRequest>();

  readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    newsletter: [false],
  });

  submit(): void {
    if (this.form.invalid) return;
    const request: SignUpRequest = this.form.getRawValue();
    this.signedUp.emit(request);
  }
}
