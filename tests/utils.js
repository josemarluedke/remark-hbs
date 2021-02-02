const { parse } = require('ember-template-recast');
const chalk = require('chalk');
const emphasize = require('emphasize');

const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const HBS = require('../index');


// Validate that the contents are parseable
// this will throw an exception if they are not
function verifyContents(code) {
  try {
    parse(code);
  } catch (e) {
    console.log(
      chalk.red(e.message) +
        '\n\n' +
        emphasize.highlight('handlebars', code).value +
        chalk.red(
          '\n' + `^ ----- contents after [ markdown -> HBS -> html ] ----- ^`
        )
    );
    throw e;
  }
};

const stack = unified().use(markdown).use(HBS).use(html);

function transform(code) {
  return stack.processSync(code).toString();
}

module.exports = {
  verifyContents,
  transform,
}
