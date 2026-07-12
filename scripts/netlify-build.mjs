#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const packagePath = join(root, 'package.json');
const packageJson = existsSync(packagePath) ? JSON.parse(readFileSync(packagePath, 'utf8')) : {};

function fail(message) {
  console.error(`\nNudgley Netlify build failed: ${message}\n`);
  process.exit(1);
}

function run(bin, args) {
  const executable = join(root, 'node_modules', '.bin', process.platform === 'win32' ? `${bin}.cmd` : bin);
  if (!existsSync(executable)) {
    fail(`Missing ${bin}. Netlify must install dependencies from package.json before building.`);
  }
  const result = spawnSync(executable, args, { stdio: 'inherit', cwd: root, shell: false });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!existsSync(join(root, 'src', 'main.tsx'))) {
  fail('src/main.tsx was not found. The React app source is missing from this deploy.');
}

if (!existsSync(join(root, 'index.html'))) {
  fail('index.html was not found. The Vite entry point is missing from this deploy.');
}

if (!packageJson.dependencies?.vite || !packageJson.dependencies?.react || !packageJson.dependencies?.typescript) {
  fail('package.json must include vite, react and typescript dependencies. Re-resolve package.json conflicts using the PR/codex version.');
}

if (!packageJson.scripts?.build) {
  console.warn('package.json has no build script; continuing with direct tsc + vite build because netlify.toml uses scripts/netlify-build.mjs.');
}

run('tsc', ['-b']);
run('vite', ['build']);
