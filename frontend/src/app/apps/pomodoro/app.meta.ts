import { AppMeta } from '../app.model';

export const appMeta: AppMeta = {
  name: 'Pomodoro',
  description: 'Temporizador de foco (25 min) y descanso (5 min) con contador de sesiones.',
  pages: [
    {
      path: 'temporizador',
      title: 'Temporizador',
      loadComponent: () => import('./temporizador.component').then((m) => m.TemporizadorComponent),
    },
  ],
};
