import { ChangeDetectionStrategy, Component, Pipe, PipeTransform, input } from '@angular/core';

// REFACTOR: dissolve the shared module into standalone building blocks. Each component imports
// exactly what its template uses, so dependencies are explicit, tree-shakable and nothing heavy
// is booted as a side effect of an unrelated import.
@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(fullName: string): string {
    return fullName.split(' ').map((part) => part.charAt(0).toUpperCase()).join('');
  }
}

@Component({
  selector: 'cs-shared-module-dumping-ground-refactored',
  imports: [InitialsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="avatar">{{ name() | initials }}</span>`,
})
export class AvatarComponent {
  readonly name = input.required<string>();
}
