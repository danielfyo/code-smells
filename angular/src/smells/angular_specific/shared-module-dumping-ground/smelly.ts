import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injectable, NgModule, Pipe, PipeTransform, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

/** Counts how many times the legacy analytics SDK was booted (it is heavy and phones home). */
export const analyticsBoots = { count: 0 };

@Injectable()
export class LegacyAnalyticsService {
  constructor() {
    analyticsBoots.count++;
  }
}

@Pipe({ name: 'smellyInitials' })
export class SmellyInitialsPipe implements PipeTransform {
  transform(fullName: string): string {
    return fullName.split(' ').map((part) => part.charAt(0).toUpperCase()).join('');
  }
}

@Pipe({ name: 'smellyShout' })
export class SmellyShoutPipe implements PipeTransform {
  transform(text: string): string {
    return text.toUpperCase() + '!';
  }
}

// SMELL: shared module dumping ground. Everything "shared" is thrown in here and re-exported:
// CommonModule, forms, unrelated pipes and even an eagerly booted analytics SDK. Every component
// that imports SharedModule to get one pipe pays for all of it, and its real dependencies are
// hidden behind a single opaque import.
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SmellyInitialsPipe, SmellyShoutPipe],
  exports: [CommonModule, ReactiveFormsModule, SmellyInitialsPipe, SmellyShoutPipe, CurrencyPipe, DatePipe, DecimalPipe],
  providers: [LegacyAnalyticsService],
})
export class SharedModule {
  private readonly analytics = inject(LegacyAnalyticsService);
}

@Component({
  selector: 'cs-shared-module-dumping-ground-smelly',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="avatar">{{ name() | smellyInitials }}</span>`,
})
export class SmellyAvatarComponent {
  readonly name = input.required<string>();
}
