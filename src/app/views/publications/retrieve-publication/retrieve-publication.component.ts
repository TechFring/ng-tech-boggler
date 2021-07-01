import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Publication } from 'src/app/models/publications';
import { PublicationsService } from 'src/app/services/publications.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { DialogsService } from 'src/app/services/dialogs.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/auth';

@Component({
  selector: 'app-retrieve-publication',
  templateUrl: './retrieve-publication.component.html',
  styleUrls: ['./retrieve-publication.component.scss'],
})
export class RetrievePublicationComponent implements OnInit {
  public publication: Publication;
  public morePublications: Publication[];
  public user: User;
  public savedId: string;
  public authUserId: string;
  public isSaved: boolean = false;
  public isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private accountsService: AccountsService,
    private publicationsService: PublicationsService,
    public utilsService: UtilsService,
    private dialogsService: DialogsService
  ) {
    if (!this.authService.isTokenExpired()) {
      this.accountsService.authenticatedUser.subscribe((user) => {
        this.user = user;
        this.authUserId = user.id;
      });
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const publicationId = params.get('publicationId');
      this.setPublication(publicationId);
      this.setMore();
    });
  }

  setIsSaved(): void {
    if (!this.user) {
      this.isSaved = false;
      return;
    }

    const res = this.accountsService.getSavedById(
      this.user.id,
      this.publication.id
    );

    res.subscribe((saved) => {
      if (Object.keys(saved).length > 0) {
        this.isSaved = true;
        this.savedId = saved.id;
      } else {
        this.isSaved = false;
      }
    });
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
      this.isOwner = publication.user.id === this.authUserId;
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
    if (!this.user) {
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
