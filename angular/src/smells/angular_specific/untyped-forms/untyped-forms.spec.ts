import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SignUpRequest, SmellySignUpFormComponent } from './smelly';
import { SignUpFormComponent } from './refactored';

type Form = typeof SmellySignUpFormComponent | typeof SignUpFormComponent;

async function fillAndSubmit(component: Form, email: string, password: string): Promise<SignUpRequest[]> {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent<SmellySignUpFormComponent | SignUpFormComponent>(component);
  const emitted: SignUpRequest[] = [];
  fixture.componentInstance.signedUp.subscribe((request) => emitted.push(request));
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  const type = (selector: string, value: string) => {
    const field = host.querySelector<HTMLInputElement>(selector);
    if (!field) throw new Error(`${selector} not rendered`);
    field.value = value;
    field.dispatchEvent(new Event('input'));
  };
  type('.email', email);
  type('.password', password);
  host.querySelector<HTMLInputElement>('.newsletter')?.click();
  host.querySelector('form')?.dispatchEvent(new Event('submit'));
  await fixture.whenStable();
  return emitted;
}

describe('untyped-forms', () => {
  it('both versions refuse to submit an invalid form', async () => {
    expect(await fillAndSubmit(SmellySignUpFormComponent, 'not-an-email', 'short')).toEqual([]);
    TestBed.resetTestingModule();
    expect(await fillAndSubmit(SignUpFormComponent, 'not-an-email', 'short')).toEqual([]);
  });

  it('smelly: typos in untyped value access compile and send undefined fields', async () => {
    expect(await fillAndSubmit(SmellySignUpFormComponent, 'ana@shop.test', 'long-enough')).toEqual([
      { email: undefined, password: 'long-enough', newsletter: undefined },
    ]);
  });

  it('refactored: the typed form emits the complete request', async () => {
    expect(await fillAndSubmit(SignUpFormComponent, 'ana@shop.test', 'long-enough')).toEqual([
      { email: 'ana@shop.test', password: 'long-enough', newsletter: true },
    ]);
  });
});
