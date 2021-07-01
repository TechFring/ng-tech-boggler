import { UtilsService } from 'src/app/services/utils.service';
import { Account } from './../../../models/auth';
import { AccountsService } from 'src/app/services/accounts.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  public formGroup = new FormGroup(
    {
      first_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ]),
      confirm_password: new FormControl(null, []),
    },
    this.accountsService.checkPasswords
  );

  constructor(
    private router: Router,
    public utilsService: UtilsService,
    public authService: AuthService,
    public accountsService: AccountsService
  ) {}

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  onSubmit(): void {
    if (!this.formGroup.valid) return;

    const account: Account = this.formGroup.getRawValue();
    const res = this.authService.createAccount(account);
    res.subscribe(
      () => {
        this.utilsService.showMessage('Conta criada com sucesso!');
        this.router.navigate(['login']);
      },
      (err: HttpErrorResponse) => {
        let message = '';
        
        if (err.error.username?.length) {
          message = err.error.username[0];
          this.formGroup.controls['username'].setErrors({ invalid: true });
        } else if (err.error?.email.length) {
          message = err.error.email[0];
          this.formGroup.controls['email'].setErrors({ invalid: true });
        }

        this.utilsService.showMessage(message, true);
      }
    );
  }
}
