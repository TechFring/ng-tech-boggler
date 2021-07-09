import { PageEvent } from '@angular/material/paginator';
import { Component, Input, OnInit } from '@angular/core';

import { AccountsService } from 'src/app/services/accounts.service';
import { Pagination } from 'src/app/models/api';
import { Saved } from 'src/app/models/publications';
import { User } from 'src/app/models/auth';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss'],
})
export class SavedComponent implements OnInit {
  public saved: Saved[] = [];
  public pagination: Pagination;
  public authUserId: string;

  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    this.pagination = {
      pageIndex: 0,
      pageSize: 10,
    };

    this.accountsService.authenticatedUser.subscribe((user: User) => {
      this.authUserId = user.id;

      if (Object.keys(user).length !== 0) {
        this.setSaved();
      }
    });
  }
  setSaved = (event?: PageEvent): void => {
    if (event) {
      this.pagination = event;
    }

    const res = this.accountsService.getSaved(
      this.pagination.pageIndex,
      this.pagination.pageSize,
      this.authUserId
    );

    res.subscribe(({ results, ...pagination }) => {
      this.saved = results;
      this.pagination.length = pagination.count;
    });
  };

  deleteSaved = (savedId: string): void => {
    const res = this.accountsService.deleteSaved(savedId);
    res.subscribe(() => this.setSaved());
  };
}
