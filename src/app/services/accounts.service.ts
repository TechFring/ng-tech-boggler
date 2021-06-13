import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from '../models/auth';
import { environment } from 'src/environments/environment';
import { ResponseAPI } from 'src/app/models/api';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  public baseUrl = `${environment.api}/usuarios`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  getUserPublications(
    offset: number,
    limit: number,
    userId: string
  ): Observable<ResponseAPI> {
    const url = `${this.baseUrl}/${userId}/publicacoes/?offset=${offset}&limit=${limit}`;
    return this.http.get<ResponseAPI>(url);
  }

  getOwner(userId: string): Observable<User> {
    const url = `${this.baseUrl}/${userId}/?keyword=owner`;
    return this.http.get<User>(url).pipe(
      map((res) => res),
      catchError(() => {
        this.authService.logout();
        return this.utilsService.handleRequestError(
          'Ocorreu um erro inesperado',
          ''
        );
      })
    );
  }

  getUserById(userId: string): Observable<User> {
    const url = `${this.baseUrl}/${userId}/`;
    return this.http.get<User>(url).pipe(
      map((res) => res),
      catchError(() =>
        this.utilsService.handleRequestError('Usuário não encontrado', '')
      )
    );
  }
}
