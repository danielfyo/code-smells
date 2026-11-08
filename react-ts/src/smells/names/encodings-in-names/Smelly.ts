// SMELL: encodings in names: Hungarian notation (strName, nAge, bActive, arrItems),
// m_ prefixes and the "I" on interfaces. TypeScript already knows the types: the prefix
// only adds noise and lies as soon as the type changes.
export interface ICustomer {
  strName: string;
  nAge: number;
  bActive: boolean;
}

export class CustomerDirectory {
  private m_arrCustomers: ICustomer[] = [];

  addCustomer(objCustomer: ICustomer): void {
    this.m_arrCustomers.push(objCustomer);
  }

  getActiveNames(): string[] {
    return this.m_arrCustomers.filter((objC) => objC.bActive).map((objC) => objC.strName);
  }

  getTotal(): string {
    const nTotal = this.m_arrCustomers.length; // SMELL: "n" for number...
    const strTotal = `${nTotal} customers`;
    return strTotal;
  }
}
