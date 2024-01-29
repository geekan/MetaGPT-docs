import { simpleGit } from 'simple-git';
import { resolve, dirname } from 'path';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { fileURLToPath } from 'url';
import 'zx/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceCodeDir = resolve(__dirname, '../sourceCode');

if (!existsSync(sourceCodeDir)) {
  mkdirSync(sourceCodeDir);
}

const MGUrl = 'https://github.com/geekan/MetaGPT.git';
const SGit = simpleGit();

const branchInfo = await simpleGit('.', {}).pull().branch({});
const { current, branches } = branchInfo;

const MGdir = resolve(sourceCodeDir, 'MetaGPT');

if (existsSync(MGdir)) {
  rmSync(MGdir, { recursive: true });
  rmSync(resolve(__dirname, '../src/reference'), { recursive: true });
}

await SGit.clone(MGUrl, resolve(sourceCodeDir, 'MetaGPT'), {
  '--depth': '1',
  '--branch': current,
});

await $`pydoc-markdown`;
