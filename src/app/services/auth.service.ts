import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { Account, Token } from 'src/app/models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${environment.api}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  login(account: Account): void {
    const url = `${this.baseUrl}/login/`;
    const res = this.http.post<Token>(url, account);

    res.subscribe(
      (token) => {
        this.setAccessToken(token);
        this.router.navigate(['publicacoes']);
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

  getAccessToken(): string {
    const token = window.localStorage.getItem('token');
    return token;
  }

  getUserId(): string {
    const userId = window.localStorage.getItem('userId');
    return userId;
  }

  setAccessToken(res: Token): void {
    window.localStorage.setItem('token', res.access);
    window.localStorage.setItem('userId', res.id);
  }

  getTokenExpirationDate(token: string): Date {
    const decoded: any = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return true;

    return !(date.valueOf() > new Date().valueOf());
  }

  isUserLoggedIn() {
    const token = this.getAccessToken();

    if (!token) return false;
    else if (this.isTokenExpired(token)) return false;
    return true;
  }
}
