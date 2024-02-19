import { writeFile, writeFileSync } from 'fs';
import path from 'path';
import { simpleGit } from 'simple-git';
import { $ } from 'zx';

export const getCurrentBranch = async () => {
  const git = await simpleGit('.', {});
  const { current } = await git.branch({});
  return current;
};

/** 根据当前的分支 获取之前的版本分支 如果是 main 就返回 null, 没找到的话返回 null */
export const getPrevVerBranch = async () => {
  const git = await simpleGit('.', {});
  const { current, branches } = await git.branch({});
  if (current === 'main') {
    return null;
  }

  const versions = Object.keys(branches)
    .reduce((vs, branchname) => {
      const regex = /^remotes\/origin\/(v.*)$/;
      const [, remotebn] = regex.exec(branchname) || [];
      if (remotebn) {
        vs.push(remotebn);
      }
      return vs;
    }, [] as string[])
    .sort()
    .reverse();

  const currentIndex = versions.findIndex((_) => _ == current);
  const prevVersion = versions[currentIndex + 1];
  if (prevVersion) {
    return `remotes/origin/${prevVersion}`;
  }
  return null;
};

export const genDiffFile = async (branchA: string, branchB: string) => {
  const git = await simpleGit('.', {});
  const diff =
    await $`git diff --name-only ${branchA}..${branchB} | while read -r file; do lines=$(git diff --shortstat ${branchA}..${branchB} -- "$file" | grep -o '[0-9]*' | tail -1); if [ $lines -gt 3 ]; then echo "$file"; fi; done`;

  writeFileSync(
    path.resolve(__dirname, './diff.ts'),
    `
  export const diff = \`${diff.stdout}\`;`
  );
};
