import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Publication } from 'src/app/models/publications';
import { PublicationsService } from 'src/app/services/publications.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { DialogsService } from 'src/app/services/dialogs.service';
import { User } from 'src/app/models/auth';

@Component({
  selector: 'app-retrieve-publication',
  templateUrl: './retrieve-publication.component.html',
  styleUrls: ['./retrieve-publication.component.scss'],
})
export class RetrievePublicationComponent implements OnInit {
  public publication: Publication;
  public morePublications: Publication[];
  public savedId: string;
  public authenticatedUser: User;
  public isSaved: boolean = false;
  public isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private publicationsService: PublicationsService,
    public utilsService: UtilsService,
    private dialogsService: DialogsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const publicationId = params.get('publicationId');
      this.setPublication(publicationId);
      this.setMore();
    });
  }

  setAuthenticatedUser(): void {
    const res = this.accountsService.getAuthenticatedUser();
    res.subscribe((user) => {
      this.authenticatedUser = user;
    });
  }

  setIsSaved(): void {
    if (!this.authenticatedUser) {
      this.isSaved = false;
      return;
    }

    const res = this.accountsService.getSavedById(
      this.authenticatedUser.id,
      this.publication.id
    );

    res.subscribe(
      (saved) => {
        this.isSaved = true;
        this.savedId = saved.id;
      },
      (error) => {
        this.isSaved = false;
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
    const resPublication = this.publicationsService
      .getPublicationById(publicationId)
      .pipe(catchError(() => of(undefined)));

    const resAccount = this.accountsService
      .getAuthenticatedUser()
      .pipe(catchError(() => of(undefined)));

    combineLatest(resPublication, resAccount).subscribe(
      ([publication, authenticatedUser]) => {
        if (authenticatedUser) {
          this.isOwner = publication.user.id === authenticatedUser.id;
        }

        this.authenticatedUser = authenticatedUser;
        this.publication = publication;
        this.setIsSaved();
      }
    );
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
    if (!this.authenticatedUser) {
      this.dialogsService.loginDialog();
      return;
    }

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
