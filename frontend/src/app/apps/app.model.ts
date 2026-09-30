import { Type } from '@angular/core';

export interface AppPage {
  /** Ruta dentro de la app, sin barra inicial. Ej: 'lista' */
  path: string;
  title: string;
  loadComponent: () => Promise<Type<unknown>>;
}

export interface AppMeta {
  name: string;
  description: string;
  pages: AppPage[];
}

export interface RegisteredApp extends AppMeta {
  /** Nombre de la carpeta; es el prefijo de la URL. */
  slug: string;
}
