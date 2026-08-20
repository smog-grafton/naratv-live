const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const standaloneRoot = path.join(projectRoot, '.next', 'standalone');
const standaloneNextRoot = path.join(standaloneRoot, '.next');

if (!fs.existsSync(path.join(standaloneRoot, 'server.js'))) {
  console.error('Production output is missing. Run `npm run build` first.');
  process.exit(1);
}

fs.cpSync(path.join(projectRoot, '.next', 'static'), path.join(standaloneNextRoot, 'static'), { recursive: true });

const publicDirectory = path.join(projectRoot, 'public');
if (fs.existsSync(publicDirectory)) {
  fs.cpSync(publicDirectory, path.join(standaloneRoot, 'public'), { recursive: true });
}

const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
if (portIndex >= 0 && args[portIndex + 1]) {
  process.env.PORT = args[portIndex + 1];
}

const server = spawn(process.execPath, [path.join(standaloneRoot, 'server.js')], {
  cwd: standaloneRoot,
  env: process.env,
  stdio: 'inherit',
});

server.on('exit', (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});
