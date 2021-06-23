import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PublicationsService } from 'src/app/services/publications.service';
import { Publication } from 'src/app/models/publications';
import { Tag } from 'src/app/models/publications';
import { Pagination } from 'src/app/models/api';

@Component({
  selector: 'app-list-publication',
  templateUrl: './list-publication.component.html',
  styleUrls: ['./list-publication.component.scss'],
})
export class ListPublicationComponent implements OnInit {
  public publications: Publication[] = [];
  public pagination: Pagination;
  public tags: Tag[] = [];
  public tagFilter: Tag;

  constructor(
    public route: ActivatedRoute,
    public publicationsService: PublicationsService
  ) {}

  ngOnInit(): void {
    this.pagination = {
      pageIndex: 0,
      pageSize: 10,
    };

    const res = this.publicationsService.getTags();
    res.subscribe(({ results }) => {
      this.tags = results;
    });

    const resParams = this.route.queryParams;
    resParams.subscribe((obj) => {
      let tagParam = obj.tag;

      if (tagParam) {
        this.publicationsService.getTagById(tagParam).subscribe((res) => {
          this.tagFilter = res;
          this.setPublications();
        });
      } else {
        this.tagFilter = null;
        this.setPublications();
      }
    });
  }

  setPublications = (event?: PageEvent): void => {
    if (event) {
      this.pagination = event;
    }

    const res = this.publicationsService.getPublications(
      this.pagination.pageIndex,
      this.pagination.pageSize,
      this.tagFilter !== null ? this.tagFilter.id : null
    );

    res.subscribe(({ results, ...pagination }) => {
      this.publications = results;
      this.pagination.length = pagination.count;
    });
  };
}
