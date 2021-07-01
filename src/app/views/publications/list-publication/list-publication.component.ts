import { AccountsService } from 'src/app/services/accounts.service';
import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { PublicationsService } from 'src/app/services/publications.service';
import { Publication } from 'src/app/models/publications';
import { Tag } from 'src/app/models/publications';
import { Pagination } from 'src/app/models/api';
import { User } from 'src/app/models/auth';

@Component({
  selector: 'app-list-publication',
  templateUrl: './list-publication.component.html',
  styleUrls: ['./list-publication.component.scss'],
})
export class ListPublicationComponent implements OnInit {
  public publications: Publication[] = [];
  public pagination: Pagination;
  public tags: Tag[] = [];
  public tagFilter: Tag;
  public user: User;

  constructor(
    public route: ActivatedRoute,
    public publicationsService: PublicationsService,
    public accountsService: AccountsService,
    private authService: AuthService
  ) {
    if (!this.authService.isTokenExpired()) {
      this.accountsService.authenticatedUser.subscribe((user) => {
        this.user = user;
      });
    }
  }

  ngOnInit(): void {
    this.pagination = {
      pageIndex: 0,
      pageSize: 10,
    };

    const resTags = this.publicationsService.getTags();
    resTags.subscribe(({ results }) => {
      this.tags = results;
    });

    const resParams = this.route.queryParams;
    resParams.subscribe((obj) => {
      let tagParam = obj.tag;

      if (tagParam) {
        this.publicationsService.getTagById(tagParam).subscribe((res) => {
          this.tagFilter = res;
          this.setPublications();
        });
      } else {
        this.tagFilter = null;
        this.setPublications();
      }
    });
  }

  setPublications = (event?: PageEvent): void => {
    if (event) {
      this.pagination = event;
    }

    const res = this.publicationsService.getPublications(
      this.pagination.pageIndex,
      this.pagination.pageSize,
      this.tagFilter !== null ? this.tagFilter.id : null
    );

    res.subscribe(({ results, ...pagination }) => {
      this.publications = results;
      this.pagination.length = pagination.count;
    });
  };
}
