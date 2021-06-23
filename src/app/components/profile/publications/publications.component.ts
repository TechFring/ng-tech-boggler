import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Publication } from 'src/app/models/publications';
import { Pagination } from 'src/app/models/api';
import { AccountsService } from 'src/app/services/accounts.service';
import { PublicationsService } from 'src/app/services/publications.service';
import { CardPublicationMode } from 'src/app/models/publications';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
})
export class PublicationsComponent implements OnInit {
  public publications: Publication[] = [];
  public pagination: Pagination;
  public mode: CardPublicationMode = '';

  @Input() userId: string;
  @Input() isMyProfile: boolean;

  constructor(
    private accountsService: AccountsService,
    private publicationsService: PublicationsService
  ) {}

  ngOnInit(): void {
    this.pagination = {
      pageIndex: 0,
      pageSize: 10,
    };

    if (this.isMyProfile) this.mode = 'myProfile';
    this.setPublications();
  }

  setPublications = (event?: PageEvent): void => {
    if (event) {
      this.pagination = event;
    }

    const res = this.accountsService.getUserPublications(
      this.pagination.pageIndex,
      this.pagination.pageSize,
      this.userId
    );

    res.subscribe(({ results, ...pagination }) => {
      this.publications = results;
      this.pagination.length = pagination.count;
    });
  };

  deletePublication = (publicationId: string): void => {
    const res = this.publicationsService.deletePublication(publicationId);
    res.subscribe(() => this.setPublications());
  };
}
