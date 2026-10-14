import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const requiredFiles = [
  '.open-next/.build/open-next.config.mjs',
  '.open-next/worker.js',
];

if (requiredFiles.every((file) => existsSync(file))) {
  console.log('OpenNext build output is ready.');
} else {
  console.log('OpenNext build output is missing; building for Cloudflare now.');
  const result = spawnSync('npm', ['run', 'build:cloudflare'], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
