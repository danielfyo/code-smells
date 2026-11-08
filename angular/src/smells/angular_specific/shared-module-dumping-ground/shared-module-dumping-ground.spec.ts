import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { analyticsBoots, SmellyAvatarComponent } from './smelly';
import { AvatarComponent } from './refactored';

async function renderAvatar(component: Type<unknown>): Promise<string> {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent(component);
  fixture.componentRef.setInput('name', 'ana maria ruiz');
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('.avatar')?.textContent ?? '';
}

describe('shared-module-dumping-ground', () => {
  beforeEach(() => {
    analyticsBoots.count = 0;
  });

  it('both avatars render the same initials', async () => {
    expect(await renderAvatar(SmellyAvatarComponent)).toBe('AMR');
    TestBed.resetTestingModule();
    expect(await renderAvatar(AvatarComponent)).toBe('AMR');
  });

  it('smelly: importing SharedModule for one pipe boots the unrelated analytics SDK', async () => {
    await renderAvatar(SmellyAvatarComponent);
    expect(analyticsBoots.count).toBe(1);
  });

  it('refactored: the avatar pulls in only its pipe', async () => {
    await renderAvatar(AvatarComponent);
    expect(analyticsBoots.count).toBe(0);
  });
});
