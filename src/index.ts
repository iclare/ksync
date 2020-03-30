import path from 'path';
import fs from 'fs-extra';
import sade from 'sade';

import bail from './bail';

process.on('unhandledRejection', bail);
process.on('uncaughtException', bail);

export async function main() {
  sade('ksync <filePath> <repoPath>', true)
    .version(require('../package.json').version)
    .describe('Install a .gitmodules to your repo')
    .example('.gitmodules .')
    .example('somefolder/.gitmodules anotherfolder')
    .action(async (filePath: string, repoPath: string) => {
      const options = { encoding: 'utf-8' };
      const fileContent = await fs.readFile(path.resolve(filePath), options);
      console.log(filePath);
      console.log(repoPath);
      console.log(fileContent.toString());
    })
    .parse(process.argv);
}
