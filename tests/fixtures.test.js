import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { verifyContents, transform } from './utils';

let __dirname = dirname(fileURLToPath(import.meta.url));
let files = [`/fixtures/example.md`, '/fixtures/nested-namespaced.md'];

for (let filePath of files) {
  test(`${filePath}: it should keep all the HBS and HTML`, () => {
    const contents = transform(fs.readFileSync(__dirname + filePath));

    expect(contents).toMatchSnapshot();

    verifyContents(contents);
  });
}
