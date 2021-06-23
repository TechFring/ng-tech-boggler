import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { Account } from 'src/app/models/auth';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: [
    '../../views/account/login/login.component.scss',
    './login-dialog.component.scss',
  ],
})
export class LoginDialogComponent implements OnInit {
  public formGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.onDismiss();
    });
  }

  onSubmit(): void {
    if (!this.formGroup.valid) return;

    const account: Account = this.formGroup.getRawValue();
    const redirect = this.router.url;
    this.authService.login(account, redirect);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
