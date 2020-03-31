import path from 'path';
import fs from 'fs-extra';
import sade from 'sade';
// import execa from 'execa';

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

      const sift = (string: string, using: RegExp) => {
        const sifted = string.match(using!)?.join('') ?? '';
        const left = string.replace(using, '');
        return { sifted, left };
      };

      const fileParse = fileContent
        .replace(/\s+|#.*/g, ' ')
        .replace(/\s+=\s+/g, '=')
        .split(/(?=\[)/g)
        .map(x => {
          const { sifted, left } = sift(x, /\[.*\]/g);
          const submodule = sifted.replace(/'|"/g, '').replace(/\s+/g, '=');
          const kwargs = left.trim().split(/\s+/g);
          return [submodule, ...kwargs];
        });
      console.log(fileParse);
    })
    .parse(process.argv);
}

// .map((x, i) => (i === 0 ? x.replace(/\"|\'/g, '').replace(/\s+/g, '=') : x));
