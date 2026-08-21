import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

import { verifyContents, transform } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let files = [`/fixtures/example.md`, '/fixtures/nested-namespaced.md'];

for (let filePath of files) {
  test(`${filePath}: it should keep all the HBS and HTML`, () => {
    const contents = transform(fs.readFileSync(join(__dirname, filePath)));

    expect(contents).toMatchSnapshot();

    verifyContents(contents);
  });
}
