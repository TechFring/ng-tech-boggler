import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ResponseAPI } from 'src/app/models/api';
import { Tag } from 'src/app/models/publications';
import { Publication } from 'src/app/models/publications';
import { UtilsService } from 'src/app/services/utils.service';
import { Method } from 'src/app/models/api';

@Injectable({
  providedIn: 'root',
})
export class PublicationsService {
  readonly baseUrl = environment.api;

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilsService: UtilsService
  ) {}

  deletePublication(publicationId: string): Observable<void> {
    const url = `${this.baseUrl}/publicacoes/${publicationId}/`;
    return this.http.delete<void>(url).pipe(
      map((res) => res),
      catchError(() =>
        this.utilsService.handleRequestError(
          'Ocorreu um erro inesperado',
          'publicacoes'
        )
      )
    );
  }

  getPublications(
    offset: number,
    limit: number,
    tagId?: string
  ): Observable<ResponseAPI> {
    let url = this.baseUrl;

    if (tagId) {
      url += `/tags/${tagId}/publicacoes/?offset=${offset}&limit=${limit}`;
    } else {
      url += `/publicacoes/?offset=${offset}&limit=${limit}`;
    }

    return this.http.get<ResponseAPI>(url);
  }

  getRandomPublications(): Observable<Publication[]> {
    const url = `${this.baseUrl}/publicacoes/?keyword=random`;
    return this.http.get<Publication[]>(url);
  }

  getPublicationById(publicationId: string, useKeyword?: boolean): Observable<Publication> {
    let url = `${this.baseUrl}/publicacoes/${publicationId}/`;
    if (useKeyword) url += '?keyword=owner';
    return this.http.get<Publication>(url).pipe(
      map((res) => res),
      catchError(() =>
        this.utilsService.handleRequestError(
          'Publicação não encontrada',
          'publicacoes'
        )
      )
    );
  }

  sendPublication(
    publication: Publication,
    method: Method,
    cover?: File
  ): void {
    let url = `${this.baseUrl}/publicacoes/`;
    let res;
    
    const formData = new FormData();
    formData.append('title', publication.title);
    formData.append('subtitle', publication.subtitle);
    formData.append('content', publication.content);

    if (cover) {
      formData.append('cover', cover, cover.name);
    }

    publication.tags.forEach((tag) => {
      formData.append('tags', tag);
    });

    switch (method) {
      case 'patch':
        url = `${this.baseUrl}/publicacoes/${publication.id}/`;
        res = this.http.patch<Publication>(url, formData);
        break;
      case 'put':
        url = `${this.baseUrl}/publicacoes/${publication.id}/`;
        res = this.http.put<Publication>(url, formData);
        break;
      case 'post':
        res = this.http.post<Publication>(url, formData);
        break;
    }

    res.subscribe(
      (res: Publication) => {
        const message = 'Publicação enviada com sucesso!';
        this.utilsService.showMessage(message);
        this.router.navigate([`/publicacoes/${res.id}`]);
      },
      () => {
        const message = 'Ocorreu um erro inesperado. Tente novamente';
        this.utilsService.showMessage(message, true);
      }
    );
  }

  getTags(): Observable<ResponseAPI> {
    const url = `${this.baseUrl}/tags/?limit=100&offset=0`;
    return this.http.get<ResponseAPI>(url);
  }

  getTagById(tagId: string): Observable<Tag> {
    const url = `${this.baseUrl}/tags/${tagId}/`;
    return this.http.get<Tag>(url).pipe(
      map((res) => res),
      catchError(() =>
        this.utilsService.handleRequestError(
          'Tag não encontrada',
          'publicacoes'
        )
      )
    );
  }
}
