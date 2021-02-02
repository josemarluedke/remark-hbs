const { stripIndent } = require('common-tags');
const { assertTransform } = require('./utils');

test('can render text in a block component', () => {
  assertTransform({
    input: stripIndent`
      <Nested::Component>
        some text
      </Nested::Component>
    `,
    expected: stripIndent`
      <Nested::Component>

      some text
      </Nested::Component>
    `
  });
});
