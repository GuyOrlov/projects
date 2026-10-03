import { cp, copyFile, mkdir, stat } from 'node:fs/promises';

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

await mkdir('out', { recursive: true });

for (const file of ['accessibility.html', 'privacy.html', 'affiliate-disclosure.html']) {
  if (await exists(file)) await copyFile(file, `out/${file}`);
}

if (await exists('admin')) await cp('admin', 'out/admin', { recursive: true });
if (await exists('assets/uploads')) {
  await mkdir('out/assets', { recursive: true });
  await cp('assets/uploads', 'out/assets/uploads', { recursive: true });
}
