import { EngineerSmelly, ManagerSmelly, StaffMemberSmelly, payslipFor as smellyPayslip } from './smelly';
import { Engineer, Manager, StaffMember, payslipFor } from './refactored';

describe('Parallel Inheritance Hierarchies', () => {
  it('both versions produce the same payslips', () => {
    expect(payslipFor(new Engineer('Lia', 3000, 2))).toBe(smellyPayslip(new EngineerSmelly('Lia', 3000, 2)));
    expect(payslipFor(new Manager('Omar', 4000, 5))).toBe(smellyPayslip(new ManagerSmelly('Omar', 4000, 5)));
  });

  it('a new smelly role fails until its twin formatter exists', () => {
    class ContractorSmelly extends StaffMemberSmelly {}
    expect(() => smellyPayslip(new ContractorSmelly('Kai', 2500))).toThrow('No payslip formatter for Kai');
  });

  it('a new refactored role is a single class', () => {
    class Contractor extends StaffMember {
      readonly role = 'Contractor';
      bonus(): number {
        return 0;
      }
    }
    expect(payslipFor(new Contractor('Kai', 2500))).toBe('Kai (Contractor): 2500');
  });
});
