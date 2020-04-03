import path from 'path';
import sade from 'sade';
import shell from 'shelljs';

import bail from './bail';
import parseFile from './parseFile';

shell.config.fatal = true;
process.on('unhandledRejection', bail);
process.on('uncaughtException', bail);

async function sync(filePath: string, repoPath: string, opts: StrRecord) {
  filePath = path.resolve(filePath);
  repoPath = path.resolve(repoPath);
  const entries: Entry[] = await parseFile(filePath);

  // Backup
  if (!opts.nobackup) {
    shell.cd(repoPath);
    shell.cd('..');
    const backupPath = `${repoPath}bak`;
    shell.exec(`rm -rf backupPath`, { silent: true, fatal: false });
    shell.exec(`cp -a ${repoPath} ${backupPath}`);
  }
  shell.cd(repoPath);

  // Add each submodule
  entries.forEach(entry => {
    // Remove it if it already exists
    shell.exec(
      `
      submodule="${entry.path}"
      git rm "$submodule"
      rm -rf ".git/modules/$submodule"
      git config -f ".git/config" --remove-section "submodule.$submodule"
      rm -rf "$submodule"
      `,
      { silent: true, fatal: false }
    );
    // Add it
    shell.mkdir('-p', path.dirname(entry.path));
    const branch = entry.branch ? `-b ${entry.branch}` : '';
    const force = opts.force ? '--force' : '';
    const exec = `git submodule add ${force} ${branch} ${entry.url} ${entry.path}`;
    console.log(exec);
    shell.exec(exec);
    if (entry.ignore) {
      shell.exec(`echo "\tignore = ${entry.ignore}" >> .gitmodules`);
    }
  });
}

export async function main() {
  sade('ksync <filePath> <repoPath>', true)
    .version(require('../package.json').version)
    .describe('Install a .gitmodules to your repo')
    .example('.gitmodules .')
    .example('somefolder/.gitmodules anotherfolder')
    .option('--nobackup', 'Do not backup the repo')
    .option('--force', 'Reuse existing submodules')
    .action(sync)
    .parse(process.argv);
}
