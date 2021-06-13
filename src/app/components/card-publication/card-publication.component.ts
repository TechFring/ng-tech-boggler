import { UtilsService } from './../../services/utils.service';
import { Component, Input, OnInit } from '@angular/core';

import { Publication } from 'src/app/models/publications';

@Component({
  selector: 'app-card-publication',
  templateUrl: './card-publication.component.html',
  styleUrls: ['./card-publication.component.scss'],
})
export class CardPublicationComponent implements OnInit {
  public text = 'Tem certeza que deseja excluir essa publicação? Esta ação não poderá ser desfeita.';

  @Input() publication: Publication;
  @Input() callbackDelete?: (publicationId: string) => void;
  @Input() isMyProfile?: boolean;

  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {}

  onConfirm(publicationId: string): void {
    this.utilsService.confirmDialog(
      this.text,
      publicationId,
      this.callbackDelete
    );
  }
}
