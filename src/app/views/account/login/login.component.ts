import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/auth';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  onSubmit(): void {
    if (!this.formGroup.valid) return;
    const account: Account = this.formGroup.getRawValue();
    this.authService.login(account);
  }
}
