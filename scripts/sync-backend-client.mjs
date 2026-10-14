import { copyFile } from 'node:fs/promises';

await copyFile(new URL('../js/backend-client.jsx', import.meta.url), new URL('../public/backend-client.js', import.meta.url));
