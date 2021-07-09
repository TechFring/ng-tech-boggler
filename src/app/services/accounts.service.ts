import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Saved } from 'src/app/models/publications';
import { User } from 'src/app/models/auth';
import { environment } from 'src/environments/environment';
import { ResponseAPI } from 'src/app/models/api';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  readonly baseUrl = `${environment.api}/usuarios`;
  readonly authenticatedUser = new BehaviorSubject<Partial<User>>({});

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private authService: AuthService
  ) {
    this.setAuthenticatedUser();
  }

  private setAuthenticatedUser(): void {
    if (this.authService.isUserLoggedIn()) {
      const url = `${this.baseUrl}/`;

      this.http.get<User>(url).subscribe((user) => {
        this.authenticatedUser.next(user);
      });
    }
  }

  getUserPublications(
    offset: number,
    limit: number,
    userId: string
  ): Observable<ResponseAPI> {
    const url = `${this.baseUrl}/${userId}/publicacoes/?offset=${offset}&limit=${limit}`;
    return this.http.get<ResponseAPI>(url);
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

  patchUserInfo(user: Partial<User>): void {
    const url = `${this.baseUrl}/${user.id}/`;
    const res = this.http.patch<User>(url, user);
    res.subscribe(
      () => {
        this.utilsService.showMessage('Informações atualizadas com sucesso!');
      },
      () => {
        this.utilsService.showMessage(
          'Ocorreu um erro interno. Tente novamente mais tarde',
          true
        );
      }
    );
  }

  disableAccount(userId: string): void {
    const url = `${this.baseUrl}/${userId}/`;
    const user: Partial<User> = { is_active: false };
    const res = this.http.patch<User>(url, user);
    res.subscribe(
      () => {
        this.utilsService.showMessage('Conta desativada com sucesso!');
        this.authService.logout();
      },
      () => {
        this.utilsService.showMessage(
          'Ocorreu um erro interno. Tente novamente mais tarde',
          true
        );
      }
    );
  }

  getSaved(
    offset: number,
    limit: number,
    userId: string
  ): Observable<ResponseAPI> {
    const url = `${this.baseUrl}/${userId}/salvos/?offset=${offset}&limit=${limit}`;
    return this.http.get<ResponseAPI>(url).pipe(
      map((res) => res),
      catchError(() =>
        this.utilsService.handleRequestError('Usuário não encontrado', '')
      )
    );
  }

  getSavedById(userId: string, publicationId: string): Observable<Saved> {
    const url = `${this.baseUrl}/${userId}/salvos/?publication_id=${publicationId}`;
    return this.http.get<Saved>(url);
  }

  deleteSaved(savedId: string): Observable<void> {
    const url = `${environment.api}/salvos/${savedId}/`;
    return this.http.delete<void>(url).pipe(
      map((res) => res),
      catchError(() =>
        this.utilsService.handleRequestError(
          'Ocorreu um erro inesperado',
          'meu-perfil'
        )
      )
    );
  }

  postSaved(publicationId: string): Observable<Saved> {
    const url = `${environment.api}/salvos/`;
    const body = { publication: publicationId };
    return this.http.post<Saved>(url, body).pipe(
      map((res) => res),
      catchError(() =>
        this.utilsService.handleRequestError(
          'Ocorreu um erro inesperado',
          'meu-perfil'
        )
      )
    );
  }

  checkPasswords(form: FormGroup): object {
    if (form.value['password'] !== form.value['confirm_password']) {
      form.controls['confirm_password'].setErrors({ differentPasswords: true });
      return { differentPasswords: true };
    }

    form.controls['confirm_password'].setErrors(null);
  }
}
