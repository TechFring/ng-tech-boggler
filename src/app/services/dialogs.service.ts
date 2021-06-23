import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  constructor(private dialog: MatDialog) {}

  confirmDialog(text: string, id: string, callback: Function): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { text },
      maxWidth: '400px',
    });

    const res = dialogRef.afterClosed();

    res.subscribe((remove) => {
      if (remove) callback(id);
    });
  }

  loginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      maxWidth: '600px',
    });
  }
}
