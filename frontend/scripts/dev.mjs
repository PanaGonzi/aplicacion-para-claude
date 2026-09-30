// Arranca el registro automático de apps en modo vigilancia junto con ng serve.
import { spawn } from 'node:child_process';

const watcher = spawn(process.execPath, ['scripts/generate-apps.mjs', '--watch'], { stdio: 'inherit' });
const serve = spawn('ng', ['serve', ...process.argv.slice(2)], { stdio: 'inherit', shell: true });

const stop = () => watcher.kill();
serve.on('exit', (code) => {
  stop();
  process.exit(code ?? 0);
});
process.on('SIGINT', () => {
  stop();
  serve.kill();
});
