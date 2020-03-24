const fs = require('fs');
const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const HBS = require('../index');

const stack = unified().use(markdown).use(HBS).use(html);

test('it should keep all the HBS and HTML', () => {
  const file = stack.processSync(
    fs.readFileSync(__dirname + '/fixtures/example.md')
  );
  expect(file.toString()).toMatchSnapshot();
});
