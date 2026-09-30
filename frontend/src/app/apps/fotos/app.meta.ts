import { AppMeta } from '../app.model';

export const appMeta: AppMeta = {
  name: 'Fotos',
  description: 'Sube fotos y queda registrada en una tabla la hora a la que se subió cada una.',
  pages: [
    {
      path: 'subir',
      title: 'Subir fotos',
      loadComponent: () => import('./subir.component').then((m) => m.SubirComponent),
    },
  ],
};
