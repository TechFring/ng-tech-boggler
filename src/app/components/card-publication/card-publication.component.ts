import { Component, Input, OnInit } from '@angular/core';

import {
  Publication,
  Saved,
  CardPublicationMode,
} from 'src/app/models/publications';
import { DialogsService } from 'src/app/services/dialogs.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-card-publication',
  templateUrl: './card-publication.component.html',
  styleUrls: ['./card-publication.component.scss'],
})
export class CardPublicationComponent implements OnInit {
  public text =
    'Tem certeza que deseja excluir essa publicação? Esta ação não poderá ser desfeita.';
  public registerId: string;

  @Input() publication: any;
  @Input() mode: CardPublicationMode = undefined;
  @Input() callbackDelete?: (publicationId: string) => void;
  @Input() authUserId?: string;

  constructor(
    private dialogsService: DialogsService,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    if (this.mode === 'saved') {
      const saved = this.publication as Saved;
      this.registerId = saved.id;
      this.publication = saved.publication;
    } else {
      this.publication = this.publication as Publication;
      this.registerId = this.publication.id;
    }
  }

  onConfirm(): void {
    this.dialogsService.confirmDialog(
      this.text,
      this.registerId,
      this.callbackDelete
    );
  }
}
