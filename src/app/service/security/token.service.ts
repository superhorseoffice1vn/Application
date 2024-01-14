import { Injectable } from '@angular/core';
import {User} from "../../model/user/user";
import {Account} from "../../model/user/account";

const TOKEN_KEY = 'Token_key';
const ROLE_KEY = 'Role_key';
const USER_KEY = 'User_key';
const ACCOUNT_KEY = 'Account_key';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  roles = [];

  constructor() {
  }

  public setTokenLocal(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public setTokenSession(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    if (localStorage.getItem(TOKEN_KEY) !== null) {
      return localStorage.getItem(TOKEN_KEY) as string;
    } else {
      return sessionStorage.getItem(TOKEN_KEY) as string;
    }
  }

  public setUserLocal(user: User): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public setUserSession(user: User): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): string {
    if (localStorage.getItem(USER_KEY) !== null) {
      return localStorage.getItem(USER_KEY) as string;
    } else {
      return sessionStorage.getItem(USER_KEY) as string;
    }
  }

  public setAccountLocal(account: Account): void {
    localStorage.removeItem(ACCOUNT_KEY);
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }

  public setAccountSession(account: Account): void {
    sessionStorage.removeItem(ACCOUNT_KEY);
    sessionStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }

  public getAccount(): string {
    if (localStorage.getItem(ACCOUNT_KEY) !== null) {
      return localStorage.getItem(ACCOUNT_KEY) as string;
    } else {
      return sessionStorage.getItem(ACCOUNT_KEY) as string;
    }
  }

  public setRoleLocal(roles: string[]): void {
    localStorage.removeItem(ROLE_KEY);
    localStorage.setItem(ROLE_KEY, JSON.stringify(roles));
  }

  public setRoleSession(roles: string[]): void {
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.setItem(ROLE_KEY, JSON.stringify(roles));
  }

  public getRole(): string[] {
    if (localStorage.getItem(ROLE_KEY) !== null) {
      // @ts-ignore
      JSON.parse(localStorage.getItem(ROLE_KEY) as string).forEach(role => {
        // @ts-ignore
        this.roles.push(role.authority);
      });
    } else {
      // @ts-ignore
      JSON.parse(sessionStorage.getItem(ROLE_KEY) as string).forEach(role => {
        // @ts-ignore
        this.roles.push(role.authority);
      });
    }

    return this.roles;
  }

  public logOut(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  public rememberMe(token: string, account: Account, roles: string[], user: User): void {
    this.logOut();
    this.setAccountLocal(account);
    this.setRoleLocal(roles);
    this.setUserLocal(user);
    this.setTokenLocal(token);
  }

  public isLogged(): boolean {
    return !(window.sessionStorage.getItem(TOKEN_KEY) == null && window.localStorage.getItem(TOKEN_KEY) == null);
  }
}
