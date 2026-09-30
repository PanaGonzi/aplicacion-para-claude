// Busca carpetas en src/app/apps/<nombre>/app.meta.ts y genera apps.generated.ts
// con todas las apps registradas. Uso: node scripts/generate-apps.mjs [--watch]
import { existsSync, readdirSync, watch, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'app', 'apps');
const outFile = join(appsDir, 'apps.generated.ts');

export function generate() {
  const slugs = readdirSync(appsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(appsDir, d.name, 'app.meta.ts')))
    .map((d) => d.name)
    .sort();

  const imports = slugs.map((s, i) => `import { appMeta as app${i} } from './${s}/app.meta';`);
  const entries = slugs.map((s, i) => `  { slug: '${s}', ...app${i} },`);

  const content = [
    '// Archivo generado por scripts/generate-apps.mjs. No editar a mano.',
    "import { RegisteredApp } from './app.model';",
    ...imports,
    '',
    'export const APPS: RegisteredApp[] = [',
    ...entries,
    '];',
    '',
  ].join('\n');

  if (!existsSync(outFile) || readFileSync(outFile, 'utf8') !== content) {
    writeFileSync(outFile, content);
    console.log(`[apps] registradas: ${slugs.length ? slugs.join(', ') : 'ninguna'}`);
  }
}

generate();

if (process.argv.includes('--watch')) {
  let timer;
  watch(appsDir, { recursive: true }, (_event, file) => {
    if (file && file.endsWith('apps.generated.ts')) return;
    clearTimeout(timer);
    timer = setTimeout(generate, 150);
  });
  console.log('[apps] vigilando src/app/apps');
}
