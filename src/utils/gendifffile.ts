import { writeFile, writeFileSync } from 'fs';
import path from 'path';
import { simpleGit } from 'simple-git';
import { execa } from 'execa';
import { PassThrough } from 'stream';

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
  // 执行 git diff 命令并获取文件列表
  const { stdout: fileNames } = await execa('git', [
    'diff',
    '--name-only',
    `${branchA}..${branchB}`,
  ]);

  // 将文件列表拆分成数组
  const files = fileNames.split('\n').filter(Boolean);

  let diff = '';
  // 遍历文件列表
  for (const file of files) {
    // 执行 git diff 命令获取文件改动行数
    const { stdout: diffOutput } = await execa('git', [
      'diff',
      '--shortstat',
      `${branchA}..${branchB}`,
      '--',
      file,
    ]);
    if (!diffOutput) {
      continue;
    }
    // 使用流处理 diff 输出
    const input = new PassThrough();
    input.write(diffOutput);
    input.end();

    // 使用 grep 过滤出改动行数
    const { stdout: lines } = await execa('grep', ['-o', '[0-9]*'], { input });

    // 获取最后一行的改动行数
    const lineCount = lines.trim().split('\n').pop();

    // 检查改动行数是否大于 3
    if (lineCount && parseInt(lineCount) > 3) {
      diff += `${file}\n`;
    }
  }
  writeFileSync(
    path.resolve(__dirname, './diff.ts'),
    `
export const currendBranch = '${branchA}';
export const diff = \`${diff}\`;`
  );
};
