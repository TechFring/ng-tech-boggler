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
  publications: Publication[] = [];
  pagination: Pagination;
  tags: Tag[] = [];
  tagFilter: Tag;

  constructor(
    public route: ActivatedRoute,
    public publicationsService: PublicationsService
  ) {}

  ngOnInit(): void {
    this.pagination = {
      pageIndex: 0,
      pageSize: 10,
    };

    this.publicationsService.getTags().subscribe((res) => {
      this.tags = res.results;
    });

    this.route.queryParams.subscribe((obj) => {
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

    this.publicationsService
      .getPublications(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        this.tagFilter !== null ? this.tagFilter.id : null
      )
      .subscribe((res) => {
        this.publications = res.results;
        this.pagination.length = res.count;
      });
  };
}
