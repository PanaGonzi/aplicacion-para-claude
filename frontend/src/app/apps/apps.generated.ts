// Archivo generado por scripts/generate-apps.mjs. No editar a mano.
import { RegisteredApp } from './app.model';
import { appMeta as app0 } from './fotos/app.meta';
import { appMeta as app1 } from './hola/app.meta';
import { appMeta as app2 } from './ortografia/app.meta';
import { appMeta as app3 } from './pomodoro/app.meta';

export const APPS: RegisteredApp[] = [
  { slug: 'fotos', ...app0 },
  { slug: 'hola', ...app1 },
  { slug: 'ortografia', ...app2 },
  { slug: 'pomodoro', ...app3 },
];
