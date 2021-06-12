import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['']);
    }
  }
}
