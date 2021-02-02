const fs = require('fs');
const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const HBS = require('../index');
const { parse } = require('ember-template-recast');
const chalk = require('chalk');

const emphasize = require('emphasize')

const stack = unified().use(markdown).use(HBS).use(html);

let files = [`/fixtures/example.md`, '/fixtures/nested-namespaced.md'];

for (let filePath of files) {
  test(`${filePath}: it should keep all the HBS and HTML`, () => {
    const file = stack.processSync(fs.readFileSync(__dirname + filePath));

    const contents = file.toString();

    expect(contents).toMatchSnapshot();

    // Validate that the contents are parseable
    // this will throw an exception if they are not
    try {
      parse(contents);
    } catch (e) {
      console.log(
        chalk.red(e.message) +
          '\n\n' +
        emphasize.highlight('handlebars', contents).value +
          chalk.red(
            '\n' +
            `^ ----- contents of ${filePath} after [ markdown -> HBS -> html ] ----- ^`
          )
      );
      throw e;
    }
  });
}
