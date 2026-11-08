import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyOrderDigestService } from './smelly';
import { OrderDigestService } from './refactored';
import { CALLBACK_CRM, CallbackCrm } from './crm';

function fakeCrm(failOn?: 'orders'): CallbackCrm & { sent: string[] } {
  const sent: string[] = [];
  return {
    sent,
    findCustomer: (_email, cb) => setTimeout(() => cb(null, { id: 1, name: 'Ana' })),
    listOrders: (_id, cb) =>
      setTimeout(() => (failOn === 'orders' ? cb(new Error('CRM timeout')) : cb(null, [{ id: 1, total: 30 }, { id: 2, total: 12 }]))),
    sendEmail: (_to, body, cb) => setTimeout(() => (sent.push(body), cb(null))),
  };
}

function setup(crm: CallbackCrm): void {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), { provide: CALLBACK_CRM, useValue: crm }] });
}

const smellyDigest = (email: string) =>
  new Promise<string>((resolve, reject) =>
    TestBed.inject(SmellyOrderDigestService).sendDigest(email, (error, body) => (error ? reject(error) : resolve(body ?? ''))),
  );

describe('callback-hell', () => {
  it('both versions send the same digest', async () => {
    const crm = fakeCrm();
    setup(crm);
    const expected = 'Hi Ana, you placed 2 orders for 42 EUR';
    expect(await smellyDigest('ana@shop.test')).toBe(expected);
    expect(await TestBed.inject(OrderDigestService).sendDigest('ana@shop.test')).toBe(expected);
    expect(crm.sent).toEqual([expected, expected]);
  });

  it('both versions report a failure in the middle of the flow', async () => {
    setup(fakeCrm('orders'));
    await expect(smellyDigest('ana@shop.test')).rejects.toThrowError('CRM timeout');
    await expect(TestBed.inject(OrderDigestService).sendDigest('ana@shop.test')).rejects.toThrowError('CRM timeout');
  });
});
