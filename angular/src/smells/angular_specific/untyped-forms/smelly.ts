import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

export interface SignUpRequest {
  email: string;
  password: string;
  newsletter: boolean;
}

@Component({
  selector: 'cs-untyped-forms-smelly',
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
export class SmellySignUpFormComponent {
  readonly signedUp = output<SignUpRequest>();

  // SMELL: untyped forms. UntypedFormGroup makes `form.value` `any`: every property access
  // compiles, typos included, and nothing checks that the payload matches SignUpRequest.
  readonly form: UntypedFormGroup = inject(UntypedFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    newsletter: [false],
  });

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    // SMELL: "emial" and "newsleter" are typos; the compiler cannot notice them.
    this.signedUp.emit({ email: value.emial, password: value.password, newsletter: value.newsleter });
  }
}
