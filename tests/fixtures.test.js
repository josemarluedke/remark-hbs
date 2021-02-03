const fs = require('fs');
const { verifyContents, transform } = require('./utils');

let files = [`/fixtures/example.md`, '/fixtures/nested-namespaced.md'];

for (let filePath of files) {
  test(`${filePath}: it should keep all the HBS and HTML`, () => {
    const contents = transform(fs.readFileSync(__dirname + filePath));

    expect(contents).toMatchSnapshot();

    verifyContents(contents);
  });
}
