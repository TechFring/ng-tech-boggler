import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { AccountsService } from 'src/app/services/accounts.service';
import { Publication } from 'src/app/models/publications';
import { Pagination } from 'src/app/models/api';
import { PublicationsService } from 'src/app/services/publications.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  publications: Publication[];
  pagination: Pagination;
  user: User;
  isOwner: boolean;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private authService: AuthService,
    private publicationsService: PublicationsService
  ) {}

  ngOnInit(): void {
    this.pagination = {
      pageIndex: 0,
      pageSize: 10,
    };

    const paramUserId = this.route.snapshot.paramMap.get('userId');
    this.isOwner = paramUserId === null;

    if (this.isOwner) {
      const userId = this.authService.getUserId();
      const res = this.accountsService.getOwner(userId);
      res.subscribe((owner) => {
        this.user = owner;
        this.setPublications();
      });
    } else {
      const res = this.accountsService.getUserById(paramUserId);
      res.subscribe((user) => {
        this.user = user;
        this.setPublications();
      });
    }
  }

  setPublications = (event?: PageEvent): void => {
    if (event) {
      this.pagination = event;
    }

    this.accountsService
      .getUserPublications(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        this.user.id
      )
      .subscribe((res) => {
        this.publications = res.results;
        this.pagination.length = res.count;
      });
  };

  deletePublication = (publicationId: string) => {
    const res = this.publicationsService.deletePublication(publicationId);
    res.subscribe(() => {
      window.location.reload();
    });
  };
}
