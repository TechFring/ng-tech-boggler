import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AccountsService } from 'src/app/services/accounts.service';
import { CardPublicationMode } from 'src/app/models/publications';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user: User;
  public modePublication: CardPublicationMode;
  public isMyProfile: boolean;
  public authUserId: string;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    const paramUserId = this.route.snapshot.paramMap.get('userId');

    this.isMyProfile = paramUserId === null;

    if (this.isMyProfile) {
      this.accountsService.authenticatedUser.subscribe((user) => {
        this.user = user;
        this.authUserId = user.id;
        this.modePublication = 'myPublication';
      });
    } else {
      this.accountsService.getUserById(paramUserId).subscribe((user) => {
        this.user = user;
      });
    }
  }
}
