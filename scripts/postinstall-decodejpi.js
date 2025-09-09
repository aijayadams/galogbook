// Build the decodejpi library after install if needed (ESM)
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const log = (msg) => console.log(`[postinstall] ${msg}`);

try {
  const modRoot = path.join(process.cwd(), 'node_modules', 'decodejpi');
  const pkgJson = path.join(modRoot, 'package.json');
  if (!fs.existsSync(pkgJson)) {
    log('decodejpi not installed (skipping build).');
    process.exit(0);
  }

  const distIdx = path.join(modRoot, 'dist', 'index.js');
  if (fs.existsSync(distIdx)) {
    log('decodejpi already built.');
    process.exit(0);
  }

  log('Building decodejpi...');
  const npmCmd = process.platform.startsWith('win') ? 'npm.cmd' : 'npm';
  const res = spawnSync(npmCmd, ['run', 'build'], { cwd: modRoot, stdio: 'inherit' });
  if (res.status !== 0) {
    console.warn('[postinstall] decodejpi build failed. You can try: (cd node_modules/decodejpi && npm run build)');
    process.exit(0); // do not fail install
  }
  log('decodejpi build complete.');
} catch (e) {
  console.warn('[postinstall] Unexpected error building decodejpi:', e && e.message ? e.message : e);
  process.exit(0);
}
