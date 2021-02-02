const fs = require('fs');
const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const HBS = require('../index');
const { parse } = require('ember-template-recast');

const stack = unified().use(markdown).use(HBS).use(html);

let files = [`/fixtures/example.md`, '/fixtures/nested-namespaced.md'];

for (let filePath of files) {
  test(`${filePath}: it should keep all the HBS and HTML`, () => {
    const file = stack.processSync(fs.readFileSync(__dirname + filePath));

    const contents = file.toString();

    expect(contents).toMatchSnapshot();

    // Validate that the contents are parseable
    // this will throw an exception if they are not
    parse(contents);
  });
}
