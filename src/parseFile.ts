import path from 'path';
import fs from 'fs-extra';

const sift = (string: string, using: RegExp): Record<string, string> => {
  const sifted = string.match(using)?.join('') ?? '';
  const left = string.replace(using, '');
  return { sifted, left };
};

const toRecord = (components: string[]): Entry => {
  return components.reduce((record: StrRecord, x: string) => {
    const [key, val] = x.split('=');
    record[key] = val;
    return record;
  }, {});
};

function parseFileContent(fileContent: string): Entry[] {
  return fileContent
    .trim()
    .replace(/\s+|#.*/g, ' ')
    .replace(/\s+=\s+/g, '=')
    .split(/(?=\[)/g)
    .map(x => {
      const { sifted, left } = sift(x, /\[.*\]/g);
      const submodule = sifted.replace(/'|"|\[|\]/g, '').replace(/\s+/g, '=');
      const kwargs = left.trim().split(/\s+/g);
      return toRecord([submodule, ...kwargs]);
    });
}

async function parseFile(filePath: string): Promise<Entry[]> {
  const options = { encoding: 'utf-8' };
  const fileContent = await fs.readFile(path.resolve(filePath), options);
  return parseFileContent(fileContent);
}

export { parseFileContent };
export default parseFile;
