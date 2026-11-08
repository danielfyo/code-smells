import { Injectable } from '@angular/core';

// SMELL: encodings in names. Hungarian notation (strName, bIsActive, nAge), member prefixes (m_),
// type suffixes (Arr, Obj, Str) and an `I` prefix on an interface that has a single implementation.
// The type system already knows the types; the encodings only add noise and go stale (what if
// m_arrUsersList becomes a Map?).
export interface IUserInterface {
  strName: string;
  strEmail: string;
  nAge: number;
  bIsActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class CUserManagerServiceClass {
  private m_arrUsersList: IUserInterface[] = [];

  fnAddUserObj(objUser: IUserInterface): void {
    this.m_arrUsersList = [...this.m_arrUsersList, objUser];
  }

  fnGetActiveUserNamesArr(): string[] {
    return this.m_arrUsersList.filter((objU) => objU.bIsActive).map((objU) => objU.strName);
  }

  fnGetAdultCountNum(): number {
    return this.m_arrUsersList.filter((objU) => objU.nAge >= 18).length;
  }
}
