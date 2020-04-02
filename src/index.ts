import path from 'path';
import sade from 'sade';
import shell from 'shelljs';

import bail from './bail';
import parseFile from './parseFile';

process.on('unhandledRejection', bail);
process.on('uncaughtException', bail);

async function sync(filePath: string, repoPath: string) {
  filePath = path.resolve(filePath);
  repoPath = path.resolve(repoPath);
  const entries: Entry[] = await parseFile(filePath);
  shell.cd(repoPath);
  entries.forEach(entry => {
    shell.mkdir('-p', path.dirname(entry.path));
    const branch = entry.branch ? `-b ${entry.branch}` : '';
    shell.exec(`git submodule add ${branch} ${entry.url} ${entry.path}`);
  });
}

export async function main() {
  sade('ksync <filePath> <repoPath>', true)
    .version(require('../package.json').version)
    .describe('Install a .gitmodules to your repo')
    .example('.gitmodules .')
    .example('somefolder/.gitmodules anotherfolder')
    .action(sync)
    .parse(process.argv);
}
