import { AppMeta } from '../app.model';

export const appMeta: AppMeta = {
  name: 'Hola',
  description: 'Un saludo sencillo.',
  pages: [
    {
      path: 'saludo',
      title: 'Saludo',
      loadComponent: () => import('./saludo.component').then((m) => m.SaludoComponent),
    },
  ],
};
