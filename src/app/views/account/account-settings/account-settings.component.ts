import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/auth';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  public formUserInfo = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    first_name: new FormControl(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    last_name: new FormControl(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    username: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
    bio: new FormControl(null, [Validators.maxLength(255)]),
  });

  public formUserPassword = new FormGroup(
    {
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ]),
      confirm_password: new FormControl(null, []),
    },
    this.accountsService.checkPasswords
  );

  public user: User;
  public optionSelected = 'userInfo';

  constructor(
    private authService: AuthService,
    private accountsService: AccountsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    const res = this.accountsService.getAuthenticatedUser();

    res.subscribe((user) => {
      this.user = user;
      this.setValueFormUserInfo();
    });
  }

  setValueFormUserInfo(): void {
    this.formUserInfo.patchValue({
      id: this.user.id,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      username: this.user.username,
      email: this.user.email,
      bio: this.user.bio,
    });
  }

  onSubmitUserInfo(): void {
    if (this.formUserInfo.valid) {
      const user: User = this.formUserInfo.getRawValue();
      this.accountsService.patchUserInfo(user);
    }
  }

  onSubmitUserPassword(): void {
    if (this.formUserPassword.valid) {
      const password = this.formUserPassword.value['password'];
      const user: Partial<User> = { password, id: this.user.id };
      this.accountsService.patchUserInfo(user);
    }
  }

  onChange(value: string): void {
    this.optionSelected = value;
  }
}
