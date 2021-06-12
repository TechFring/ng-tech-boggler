import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guard
import { AuthGuard } from './guard/auth.guard';

// Views
import { LoginComponent } from './views/account/login/login.component';
import { ProfileComponent } from './views/account/profile/profile.component';
import { ListPublicationComponent } from './views/publications/list-publication/list-publication.component';
import { FormPublicationComponent } from './views/publications/form-publication/form-publication.component';
import { RetrievePublicationComponent } from './views/publications/retrieve-publication/retrieve-publication.component';
import { CreateAccountComponent } from './views/account/create-account/create-account.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';

// Layouts
import { HomeComponent } from './layout/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      // { path: '', redirectTo: 'publicacoes', pathMatch: 'full' },
      { path: 'publicacoes/novo', component: FormPublicationComponent },
      { path: 'publicacoes/editar/:publicationId', component: FormPublicationComponent },
      { path: 'meu-perfil', component: ProfileComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'criar-conta', component: CreateAccountComponent },
      { path: 'usuarios/:userId', component: ProfileComponent },
      { path: 'publicacoes', component: ListPublicationComponent },
      { path: 'publicacoes/:publicationId', component: RetrievePublicationComponent },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
