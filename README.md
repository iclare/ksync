# ksync

[kitchen-_sync_](https://www.merriam-webster.com/dictionary/kitchen-sink)

Install a .gitmodules to your repo

```console
npx @iclare/ksync --h
npx: installed 31 in 3.119s

  Description
    Install a .gitmodules to your repo

  Usage
    $ ksync <filePath> <repoPath> [options]

  Options
    --nobackup       Do not backup the repo
    --force          Reuse existing submodules
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    $ ksync .gitmodules .
    $ ksync somefolder/.gitmodules anotherfolder

```
