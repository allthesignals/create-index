/* eslint-disable no-restricted-syntax */

import fs from 'fs';
import path from 'path';
import {
    expect
} from 'chai';
import writeIndex from '../src/utilities/writeIndex';
import codeExample from './codeExample';

const readFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

const removeFile = (filePath) => {
  fs.unlinkSync(filePath);
};

const appendToFile = (filePath, content) => {
  fs.appendFileSync(filePath, content, 'utf-8');
};

const fixturesPath = path.resolve(__dirname, 'fixtures/write-index');

describe('writeIndex()', () => {
  it('creates index in target directory', () => {
    const indexFilePath = path.resolve(fixturesPath, 'mixed/index.js');

    removeFile(indexFilePath);
    writeIndex([path.resolve(fixturesPath, 'mixed')], {noExtension: true});
    const indexCode = readFile(indexFilePath);

    expect(indexCode).to.equal(codeExample(`
// @create-index

import bar from './bar';
import foo from './foo';

export default {
  bar,
  foo,
};
    `));
  });

  it('creates index with config in target directory', () => {
    const indexFilePath = path.resolve(fixturesPath, 'with-config/index.js');
    // eslint-disable-next-line
    const ignoredExportLine = `export { default as bar } from './bar.js';`;

    appendToFile(indexFilePath, ignoredExportLine);
    expect(readFile(indexFilePath).includes(ignoredExportLine)).to.equal(true);

    writeIndex([path.resolve(fixturesPath, 'with-config')], {noExtension: true});
    const indexCode = readFile(indexFilePath);

    expect(indexCode).to.equal(codeExample(`
// @create-index {"ignore":["/bar.js$/"]}

import foo from './foo';

export default {
  foo,
};
    `));
  });

  it('creates dash-case index with config excluding extensions', () => {
    const indexFilePath = path.resolve(fixturesPath, 'with-config-nx/index.js');

    writeIndex([path.resolve(fixturesPath, 'with-config-nx')], {noExtension: true});
    const indexCode = readFile(indexFilePath);

    expect(indexCode).to.equal(codeExample(`
// @create-index

import bar from './bar';
import foo from './foo';
import fooBar from './foo-bar';

export default {
  bar,
  foo,
  fooBar,
};
    `));
  });
});
