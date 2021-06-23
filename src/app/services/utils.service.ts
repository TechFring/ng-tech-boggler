import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  showMessage(message: string, error = false): void {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: error ? 'snackbar-error' : 'snackbar-success',
    });
  }

  handleRequestError(message: string, urlRedirect?: string): Observable<any> {
    this.showMessage(message, true);
    if (urlRedirect) this.router.navigate([urlRedirect]);
    return EMPTY;
  }

  getPhotoUrl(photo: string): string {
    let background = `url(${photo})`;
    if (photo == null) background = 'url(/assets/images/default-user.png)';
    return background;
  }

  getUserId(): string {
    const userId = window.localStorage.getItem('userId');
    return userId;
  }

  getProfileUrl(userId: string): string {
    let url = `/usuarios/${userId}`;
    const id = this.getUserId();
    if (userId === id) url = '/meu-perfil';
    return url;
  }
}
