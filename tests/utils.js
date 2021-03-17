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
}

const stack = unified().use(markdown).use(HBS).use(html);

function transform(code) {
  return stack.processSync(code).toString();
}

function assertTransform({
  input,
  expected,
  ignoreIndentationChanges = true,
  ignoreLineBreakChanges = true
}) {
  const contents = transform(input);

  let _actual = contents.trim();
  let _expected = expected || input;

  if (ignoreIndentationChanges) {
    _actual = _actual
      .split('\n')
      .map((s) => s.trim())
      .join('\n');
    _expected = _expected
      .split('\n')
      .map((s) => s.trim())
      .join('\n');
  }

  if (ignoreLineBreakChanges) {
    _actual = _actual.split('\n').filter(Boolean).join('\n');
    _expected = _expected.split('\n').filter(Boolean).join('\n');
  }

  verifyContents(contents);
  expect(_actual).toEqual(_expected);
}

module.exports = {
  verifyContents,
  transform,
  assertTransform
};
