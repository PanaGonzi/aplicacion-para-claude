# Añadir una aplicación al cajón

Cada aplicación es una carpeta dentro de `src/app/apps/`. Al crearla aparece sola en la Home y en el sidebar.

1. Crea la carpeta: `src/app/apps/mi-app/`.
2. Crea sus páginas como componentes normales, por ejemplo `mi-app/lista.component.ts`.
3. Crea `mi-app/app.meta.ts`:

```ts
import { AppMeta } from '../app.model';

export const appMeta: AppMeta = {
  name: 'Mi app',
  description: 'Qué hace, en una frase.',
  pages: [
    {
      path: 'lista',
      title: 'Lista',
      loadComponent: () => import('./lista.component').then((m) => m.ListaComponent),
    },
  ],
};
```

La URL de cada página es `/<carpeta>/<path>`, en el ejemplo `/mi-app/lista`.

## Cómo se registran

`scripts/generate-apps.mjs` busca las carpetas con `app.meta.ts` y escribe `apps.generated.ts`.
Se ejecuta con `npm start` (y vigila cambios) y con `npm run build`.
Si usas `ng serve` directamente, lanza antes `npm run apps`.
