const { stripIndent } = require('common-tags');
const { verifyContents, transform } = require('./utils');

test('can render text in a block component', () => {
  const contents = transform(stripIndent`
    <Nested::Component>
      some text
    </Nested::Component>
  `);

  expect(contents.trim()).toEqual(stripIndent`
    <Nested::Component>

    some text
    </Nested::Component>
  `);

  verifyContents(contents);
});
