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

test('Nested components with nested components', () => {
  assertTransform({
    input: stripIndent`
      <Component::With::Nesting>
        <Nested::Component @foo="foo" @bar="bar" />
        <Nested::Component @foo="foo" @bar="bar" />
      </Component::With::Nesting>
    `,
    expected: stripIndent`
      <Component::With::Nesting>

      <Nested::Component @foo="foo" @bar="bar" />
      <Nested::Component @foo="foo" @bar="bar" />
      </Component::With::Nesting>
    `
  });
});
