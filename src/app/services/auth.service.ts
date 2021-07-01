import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { Account, Token } from 'src/app/models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public baseUrl = `${environment.api}/auth`;
  readonly accessToken = window.localStorage.getItem('token');

  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  login(account: Account, redirect = 'publicacoes'): void {
    const url = `${this.baseUrl}/login/`;
    const res = this.http.post<Token>(url, account);

    res.subscribe(
      (token) => {
        this.setAccessToken(token.access);
        window.location.href = redirect;
      },
      () => {
        this.utilsService.handleRequestError('Credenciais inválidas');
      }
    );
  }

  logout(): void {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userId');
    window.location.href = '/login';
  }

  createAccount(account: Account): Observable<Account> {
    const url = `${this.baseUrl}/criar-conta/`;
    return this.http.post<Account>(url, account);
  }

  setAccessToken(token: string): void {
    window.localStorage.setItem('token', token);
  }

  getTokenExpirationDate(): Date {
    const decoded: any = jwt_decode(this.accessToken);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(): boolean {
    if (!this.accessToken) return true;

    const date = this.getTokenExpirationDate();
    if (date === undefined) return true;

    return !(date.valueOf() > new Date().valueOf());
  }

  isUserLoggedIn() {
    const token = this.accessToken;

    if (!token) return false;
    else if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }
}
