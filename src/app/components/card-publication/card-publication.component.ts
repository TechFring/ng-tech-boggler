import { Component, Input, OnInit } from '@angular/core';

import { Publication, Saved } from 'src/app/models/publications';
import { DialogsService } from 'src/app/services/dialogs.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CardPublicationMode } from 'src/app/models/publications';

@Component({
  selector: 'app-card-publication',
  templateUrl: './card-publication.component.html',
  styleUrls: ['./card-publication.component.scss'],
})
export class CardPublicationComponent implements OnInit {
  public savedId: string;
  public text =
    'Tem certeza que deseja excluir essa publicação? Esta ação não poderá ser desfeita.';

  @Input() publication: any;
  @Input() mode?: CardPublicationMode;
  @Input() callbackDelete?: (publicationId: string) => void;

  constructor(
    private dialogsService: DialogsService,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    if (this.mode === 'saved') {
      const saved = this.publication as Saved;
      this.savedId = saved.id;
      this.publication = saved.publication;
    } else {
      this.publication = this.publication as Publication;
    }
  }

  onConfirm(id: string): void {
    this.dialogsService.confirmDialog(this.text, id, this.callbackDelete);
  }
}
