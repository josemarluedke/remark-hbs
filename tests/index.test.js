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

test('Nested component invocation within a named block with an empty body', () => {
  assertTransform({
    input: stripIndent`
      <Table>
        <:body as |Entry|>
          <Entry>

          </Entry>
        </:body>
      </Table>
    `,
    expected: stripIndent`
      <Table>
        <:body as |Entry|>
          <Entry>

          </Entry>
        </:body>
      </Table>
    `
  });
});

test('Nested component invocation with a named block / slot', () => {
  assertTransform({
    input: stripIndent`
      <Styleguide::DefinitionsTable>
        <:body as |Entry|>
          <Entry>
            text
          </Entry>
        </:body>
      </Styleguide::DefinitionsTable>

    `,
    expected: stripIndent`
      <Styleguide::DefinitionsTable>
        <:body as |Entry|>
          <Entry>
            text
          </Entry>
        </:body>
      </Styleguide::DefinitionsTable>
    `
  });
});
