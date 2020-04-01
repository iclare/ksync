import { parseFileContent } from '../src/parseFile';

describe('parseFileContent', () => {
  it('works', () => {
    const fileParse = parseFileContent(`
      [submodule "vim-pathogen"]
        path = .vim/pack/bundle/opt/vim-pathogen
        url = https://github.com/tpope/vim-pathogen.git
      [submodule "LanguageClient-neovim"]
        ignore = dirty
        path = .vim/pack/bundle/opt/LanguageClient-neovim
        url = https://github.com/autozimu/LanguageClient-neovim.git
        branch = next
    `);

    expect(fileParse).toContainEqual({
      submodule: 'vim-pathogen',
      path: '.vim/pack/bundle/opt/vim-pathogen',
      url: 'https://github.com/tpope/vim-pathogen.git',
    });
  });
});
