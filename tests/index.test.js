const fs = require('fs');
const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const HBS = require('../index');

const stack = unified().use(markdown).use(HBS).use(html);

let files = [`/fixtures/example.md`, '/fixtures/nested-namespaced.md'];

for (let filePath of files) {
  test(`${filePath}: it should keep all the HBS and HTML`, () => {
    const file = stack.processSync(
      fs.readFileSync(__dirname + filePath)
    );
    expect(file.toString()).toMatchSnapshot();
  });
}
