import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyCustomerRepository } from './smelly';
import { CustomerRepository } from './refactored';

describe('inconsistent-names', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both repositories answer the same questions with the same data', () => {
    const smelly = TestBed.inject(SmellyCustomerRepository);
    const refactored = TestBed.inject(CustomerRepository);
    expect(smelly.fetchAllCustomers()).toEqual(refactored.listCustomers());
    expect(smelly.getClient(2)).toEqual(refactored.findCustomerById(2));
    expect(smelly.retrieveUserByMail('ana@shop.test')).toEqual(refactored.findCustomerByEmail('ana@shop.test'));
    expect(smelly.retrieveUserByMail('nobody@shop.test')).toBeUndefined();
    expect(refactored.findCustomerByEmail('nobody@shop.test')).toBeUndefined();
    expect(smelly.loadBuyerCount()).toBe(refactored.countCustomers());
  });
});
