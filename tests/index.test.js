const { stripIndent } = require('common-tags');
const { assertTransform } = require('./utils');

test('can render text in a block component', () => {
  assertTransform({
    input: stripIndent`
      <Nested::Component>
        some text
      </Nested::Component>
    `,
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
  });
});

test('Nested component invocation within a named block with an empty body', () => {
  assertTransform({
    input: stripIndent`
      <Table>
        <:body as |Entry|>
          <Entry>
            Text
          </Entry>
        </:body>
      </Table>
    `,
  });
});

test('inline named blocks', () => {
  assertTransform({
    input: stripIndent`
      <Table::Nested>
        <:head>a</:head>
        <:body>b</:body>
        <:foot>
          foo
        </:foot>
      </Table::Nested>
    `,
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
  });
});

test('Yielded components with html block content', () => {
  assertTransform({
    input: stripIndent`
      <Styleguide::Columns as |c|>
        <c.error>long string of text text<br/>text</c.error>
        <c.error>text<br/>text</c.error>
      </Styleguide::Columns>
    `,
  });
})

test('Yielded components with empty line within block', () => {
  assertTransform({
    input: stripIndent`
      <Styleguide::Columns as |c|>
        <c.error>
          long string of text text

          text
        </c.error>
      </Styleguide::Columns>
    `,
  });
})
