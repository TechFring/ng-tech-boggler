import { User } from './../../../models/auth';
import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Publication, CardPublicationMode } from 'src/app/models/publications';
import { Pagination } from 'src/app/models/api';
import { AccountsService } from 'src/app/services/accounts.service';
import { PublicationsService } from 'src/app/services/publications.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
})
export class PublicationsComponent implements OnInit {
  public publications: Publication[] = [];
  public pagination: Pagination;
  public authUserId: string;

  @Input() userId: string;
  @Input() mode: CardPublicationMode;

  constructor(
    private accountsService: AccountsService,
    private publicationsService: PublicationsService
  ) {}

  ngOnInit(): void {
    this.pagination = {
      pageIndex: 0,
      pageSize: 10,
    };

    if (this.userId) {
      this.setPublications();
    }

    this.accountsService.authenticatedUser.subscribe((user: User) => {
      if (this.userId === undefined) {
        this.userId = user.id;
      } 
      
      const isEmpty = Object.keys(user).length === 0;

      if (!isEmpty) {
        this.authUserId = user.id;
        this.setPublications();
      }
    });
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
    res.subscribe(() => window.location.reload());
  };
}
