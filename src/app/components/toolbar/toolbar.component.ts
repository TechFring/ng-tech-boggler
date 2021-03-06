import { Component, OnInit, HostListener } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/http-interceptors/loader.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  public windowWidth: number;

  constructor(
    public authService: AuthService,
    public loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
  }

  @HostListener('window:resize')
  ngResize() {
    this.windowWidth = window.innerWidth;
  }
}
