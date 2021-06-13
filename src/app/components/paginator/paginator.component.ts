import { Pagination } from 'src/app/models/api';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  public pageSizeOptions = [10, 20, 30, 40];

  @Input() callbackFunction: (args: any) => void;
  @Input() pagination: Pagination;

  constructor() {}

  ngOnInit(): void {}
}
