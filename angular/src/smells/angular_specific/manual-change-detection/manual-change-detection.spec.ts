import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NotificationsApi } from './notifications.api';
import { SmellyNotificationBellComponent } from './smelly';
import { NotificationBellComponent } from './refactored';

type Bell = typeof SmellyNotificationBellComponent | typeof NotificationBellComponent;

describe('manual-change-detection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  async function render(component: Bell) {
    const loaded = Promise.resolve(['Order shipped', 'New message', 'Invoice ready']);
    vi.spyOn(TestBed.inject(NotificationsApi), 'load').mockReturnValue(loaded);
    const fixture = TestBed.createComponent<SmellyNotificationBellComponent | NotificationBellComponent>(component);
    await fixture.whenStable();
    await loaded;
    await fixture.whenStable();
    return fixture;
  }

  it.each<Bell>([SmellyNotificationBellComponent, NotificationBellComponent])('%o shows the unread count and dismisses', async (component) => {
    const fixture = await render(component);
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.count')?.textContent).toBe('3 unread');
    host.querySelector<HTMLButtonElement>('.dismiss')?.click();
    await fixture.whenStable();
    expect(host.querySelector('.count')?.textContent).toBe('0 unread');
  });

  it('smelly: any update that forgets to poke change detection leaves the view stale', async () => {
    const fixture = await render(SmellyNotificationBellComponent);
    (fixture.componentInstance as SmellyNotificationBellComponent).items = ['Late notification'];
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.count')?.textContent).toBe('3 unread');
  });
});
