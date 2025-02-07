import { Routes } from '@angular/router';
import { ArtworksComponent } from './pages/artworks/artworks.component';
import { ArtworkItemComponent } from './pages/artwork-item/artwork-item.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: ArtworksComponent },
      { path: ':id', component: ArtworkItemComponent },
      {path: '**', redirectTo: ''},
    ],
  },
];
