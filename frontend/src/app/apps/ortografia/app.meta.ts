import { AppMeta } from '../app.model';

export const appMeta: AppMeta = {
  name: 'Revisor de ortografía',
  description: 'Sube un documento: si tiene faltas de ortografía te las muestra y no se guarda.',
  pages: [
    {
      path: 'revisar',
      title: 'Revisar documento',
      loadComponent: () => import('./revisar.component').then((m) => m.RevisarComponent),
    },
  ],
};
