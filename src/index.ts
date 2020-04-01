import sade from 'sade';

import bail from './bail';
import parseFile from './parseFile';

process.on('unhandledRejection', bail);
process.on('uncaughtException', bail);

async function sync(filePath: string, repoPath: string) {
  const entries: Entry[] = await parseFile(filePath);
  console.log(entries);
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
