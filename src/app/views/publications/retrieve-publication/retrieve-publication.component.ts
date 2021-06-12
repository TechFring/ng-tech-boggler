import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Publication } from 'src/app/models/publications';
import { PublicationsService } from 'src/app/services/publications.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-retrieve-publication',
  templateUrl: './retrieve-publication.component.html',
  styleUrls: ['./retrieve-publication.component.scss'],
})
export class RetrievePublicationComponent implements OnInit {
  publication: Publication;
  morePublications: Publication[];
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private utilsService: UtilsService,
    private publicationsService: PublicationsService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const publicationId = params.get('publicationId');

      const resRetrieve =
        this.publicationsService.getPublicationById(publicationId);
      resRetrieve.subscribe((publication) => {
        this.publication = publication;
      });

      const resMore = this.publicationsService.getRandomPublications();
      resMore.subscribe((publications) => {
        this.morePublications = publications;
      });
    });
  }

  onConfirm(publicationId: string): void {
    const text =
      'Tem certeza que deseja excluir essa publicação? Esta ação não poderá ser desfeita.';

    this.utilsService.confirmDialog(
      text,
      publicationId,
      this.deletePublication
    );
  }

  deletePublication = (publicationId: string) => {
    const res = this.publicationsService.deletePublication(publicationId);
    res.subscribe(() => {
      window.location.href = '/publicacoes';
    });
  };
}
