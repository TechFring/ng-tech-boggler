import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Publication } from 'src/app/models/publications';
import { PublicationsService } from 'src/app/services/publications.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { DialogsService } from 'src/app/services/dialogs.service';

@Component({
  selector: 'app-retrieve-publication',
  templateUrl: './retrieve-publication.component.html',
  styleUrls: ['./retrieve-publication.component.scss'],
})
export class RetrievePublicationComponent implements OnInit {
  public publication: Publication;
  public morePublications: Publication[];
  public userId: string;
  public savedId: string;
  public isSaved: boolean = false;
  public isAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private publicationsService: PublicationsService,
    public utilsService: UtilsService,
    public dialogsService: DialogsService
  ) {}

  ngOnInit(): void {
    this.userId = this.utilsService.getUserId();
    this.isAuthenticated = !!this.userId;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const publicationId = params.get('publicationId');
      this.setPublication(publicationId);
      this.setMore();
    });
  }

  setIsSaved(): void {
    if (!this.isAuthenticated) {
      this.isSaved = false;
      return;
    }

    const res = this.accountsService.getSavedById(
      this.userId,
      this.publication.id
    );

    res.subscribe(
      (saved) => {
        this.isSaved = true;
        this.savedId = saved.id;
      },
      (error) => {
        this.isSaved = false;
        console.clear();
      }
    );
  }

  setMore(): void {
    const res = this.publicationsService.getRandomPublications();
    res.subscribe((publications) => {
      this.morePublications = publications;
    });
  }

  setPublication(publicationId: string): void {
    const res = this.publicationsService.getPublicationById(publicationId);
    res.subscribe((publication) => {
      this.publication = publication;
      this.setIsSaved();
    });
  }

  deletePublication = (publicationId: string) => {
    const res = this.publicationsService.deletePublication(publicationId);
    res.subscribe(() => {
      window.location.href = '/publicacoes';
    });
  };

  onConfirm(publicationId: string): void {
    const text =
      'Tem certeza que deseja excluir essa publicação? Esta ação não poderá ser desfeita.';

    this.dialogsService.confirmDialog(
      text,
      publicationId,
      this.deletePublication
    );
  }

  onSaved(): void {
    this.isSaved = !this.isSaved;
    const isDelete = this.savedId && !this.isSaved;

    if (isDelete) {
      this.accountsService.deleteSaved(this.savedId).subscribe();
    } else {
      this.accountsService.postSaved(this.publication.id).subscribe((saved) => {
        this.savedId = saved.id;
      });
    }
  }
}
