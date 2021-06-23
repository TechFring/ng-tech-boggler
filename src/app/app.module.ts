// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

// Routing
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Components
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CardPublicationComponent } from './components/card-publication/card-publication.component';
import { SavedComponent } from './components/profile/saved/saved.component';
import { PublicationsComponent } from './components/profile/publications/publications.component';

// Interceptors
import { httpInterceptorProviders } from './http-interceptors';

// Layout
import { HomeComponent } from './layout/home/home.component';

// Views
import { LoginComponent } from './views/account/login/login.component';
import { CreateAccountComponent } from './views/account/create-account/create-account.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { ListPublicationComponent } from './views/publications/list-publication/list-publication.component';
import { FormPublicationComponent } from './views/publications/form-publication/form-publication.component';
import { FooterComponent } from './components/footer/footer.component';
import { RetrievePublicationComponent } from './views/publications/retrieve-publication/retrieve-publication.component';
import { ProfileComponent } from './views/account/profile/profile.component';

// Pipes
import { NoSanitizePipe } from './pipes/no-sanitize.pipe';

// Material
import { materialModules } from './material-modules';

// Kolkov
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ListPublicationComponent,
    CreateAccountComponent,
    PageNotFoundComponent,
    ToolbarComponent,
    PaginatorComponent,
    FormPublicationComponent,
    NoSanitizePipe,
    RetrievePublicationComponent,
    CardPublicationComponent,
    FooterComponent,
    ProfileComponent,
    ConfirmDialogComponent,
    SavedComponent,
    PublicationsComponent,
    LoginDialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ...materialModules,
    AngularEditorModule,
  ],
  providers: [httpInterceptorProviders],
  entryComponents: [ConfirmDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
