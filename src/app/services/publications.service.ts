import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ResponseAPI } from 'src/app/models/api';
import { Tag } from 'src/app/models/publications';
import { Publication } from 'src/app/models/publications';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class PublicationsService {
  public baseUrl = environment.api;

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilsService: UtilsService
  ) {}

  deletePublication(publicationId: string): Observable<void> {
    const url = `${this.baseUrl}/publicacoes/${publicationId}`;
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

  getPublicationById(publicationId: string): Observable<Publication> {
    const url = `${this.baseUrl}/publicacoes/${publicationId}/`;
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

  postPublication(publication: Publication, cover: File): void {
    const url = `${this.baseUrl}/publicacoes/`;

    const formData = new FormData();
    formData.append('title', publication.title);
    formData.append('subtitle', publication.subtitle);
    formData.append('content', publication.content);
    formData.append('cover', cover, cover.name);

    publication.tags.forEach((tag) => {
      formData.append('tags', tag);
    });

    const res = this.http.post<Publication>(url, formData);

    res.subscribe(
      () => {
        const message = 'Sua publicação foi enviada com sucesso!';
        this.utilsService.showMessage(message);
      },
      () => {
        const message = 'Ocorreu um erro inesperado. Tente novamente';
        this.utilsService.showMessage(message, true);
      },
      () => {
        this.router.navigate(['/publicacoes']);
      }
    );
  }

  patchPublication(publication: Publication): void {
    const url = `${this.baseUrl}/publicacoes/${publication.id}/`;

    const formData = new FormData();
    formData.append('title', publication.title);
    formData.append('subtitle', publication.subtitle);
    formData.append('content', publication.content);

    publication.tags.forEach((tag) => {
      formData.append('tags', tag);
    });

    const res = this.http.patch<Publication>(url, formData);

    res.subscribe(
      () => {
        const message = 'Sua publicação foi atualizada com sucesso!';
        this.utilsService.showMessage(message);
      },
      () => {
        const message = 'Ocorreu um erro inesperado. Tente novamente';
        this.utilsService.showMessage(message, true);
      },
      () => {
        this.router.navigate([`/publicacoes/${publication.id}/`]);
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
