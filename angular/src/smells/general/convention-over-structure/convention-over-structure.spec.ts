import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyNotificationIconPipe, SmellyNotificationLabelPipe } from './smelly';
import { NOTIFICATION_KINDS, NotificationIconPipe, NotificationLabelPipe } from './refactored';

@Component({
  selector: 'cs-convention-over-structure-host',
  imports: [SmellyNotificationIconPipe, SmellyNotificationLabelPipe, NotificationIconPipe, NotificationLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (kind of kinds; track kind) {
      <p class="smelly">{{ kind | smellyNotificationIcon }} {{ kind | smellyNotificationLabel }}</p>
      <p class="refactored">{{ kind | notificationIcon }} {{ kind | notificationLabel }}</p>
    }
  `,
})
class ConventionOverStructureHost {
  readonly kinds = NOTIFICATION_KINDS;
}

describe('convention-over-structure', () => {
  async function texts(selector: string): Promise<string[]> {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(ConventionOverStructureHost);
    await fixture.whenStable();
    return [...(fixture.nativeElement as HTMLElement).querySelectorAll(selector)].map((p) => p.textContent ?? '');
  }

  it('smelly: the forgotten case falls through to a generic label at runtime', async () => {
    expect(await texts('.smelly')).toEqual(['[box] New order', '[card] Payment received', '[back] Notification']);
  });

  it('refactored: every kind has its icon and label, enforced by the compiler', async () => {
    expect(await texts('.refactored')).toEqual(['[box] New order', '[card] Payment received', '[back] Refund issued']);
  });
});
