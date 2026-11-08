import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CUserManagerServiceClass } from './smelly';
import { User, UserDirectory } from './refactored';

describe('encodings-in-names', () => {
  const people: User[] = [
    { name: 'Ana', email: 'ana@shop.test', age: 34, active: true },
    { name: 'Leo', email: 'leo@shop.test', age: 16, active: true },
    { name: 'Eva', email: 'eva@shop.test', age: 51, active: false },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions report active names and adult count', () => {
    const smelly = TestBed.inject(CUserManagerServiceClass);
    const refactored = TestBed.inject(UserDirectory);
    for (const person of people) {
      smelly.fnAddUserObj({ strName: person.name, strEmail: person.email, nAge: person.age, bIsActive: person.active });
      refactored.add(person);
    }
    expect(smelly.fnGetActiveUserNamesArr()).toEqual(['Ana', 'Leo']);
    expect(refactored.activeNames()).toEqual(['Ana', 'Leo']);
    expect(smelly.fnGetAdultCountNum()).toBe(2);
    expect(refactored.adultCount()).toBe(2);
  });
});
