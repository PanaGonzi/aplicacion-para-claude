import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { APPS } from '../apps/apps.generated';

export type BackendState = 'checking' | 'ok' | 'down';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private router = inject(Router);

  readonly backend = input<BackendState>('checking');
  readonly apps = APPS;
  readonly open = signal<ReadonlySet<string>>(new Set());

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((e) => {
        const slug = (e as NavigationEnd).urlAfterRedirects.split('/')[1];
        if (this.apps.some((a) => a.slug === slug)) this.expand(slug);
      });
  }

  toggle(slug: string) {
    this.open.update((set) => {
      const next = new Set(set);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  private expand(slug: string) {
    this.open.update((set) => new Set(set).add(slug));
  }
}
