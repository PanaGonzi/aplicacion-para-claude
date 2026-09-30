import { Routes } from '@angular/router';
import { APPS } from './apps/apps.generated';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, title: 'Home · Cajón desastre' },
  ...APPS.flatMap((app) => [
    ...(app.pages.length
      ? [{ path: app.slug, pathMatch: 'full' as const, redirectTo: `${app.slug}/${app.pages[0].path}` }]
      : []),
    ...app.pages.map((page) => ({
      path: `${app.slug}/${page.path}`,
      loadComponent: page.loadComponent,
      title: `${page.title} · ${app.name}`,
    })),
  ]),
  { path: '**', redirectTo: '' },
];
