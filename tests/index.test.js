const { stripIndent } = require('common-tags');
const { assertTransform } = require('./utils');

test('HTML Entities remain as HTML Entities', () => {
  assertTransform({
    input: stripIndent`
      text
      some text &#x0003C;example&gt;
    `,
    expected: stripIndent`
      <p>text
      some text &#x3C;example></p>
    `
  });
});

test('can render text in a block component', () => {
  assertTransform({
    input: stripIndent`
      <Nested::Component>
        some text
      </Nested::Component>
    `
  });
});

test('can render multi-line arguments', () => {
  assertTransform({
    input: stripIndent`
      <MyComponent
        @one={{1}}
        @two={{2}}
      >
        some text
      </MyComponent>
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
    `
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
    `
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
    `
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
    expected: stripIndent`
      <Styleguide::Columns as |c|>
        <c.error>long string of text text
          <br/>
          text
        </c.error>
        <c.error>text
          <br/>
          text
        </c.error>
      </Styleguide::Columns>
    `
  });
});

// TODO: "text" is interpreted as code
//       need to somehow dedent the block?
//       for every nesting of html / components, the required indentation
//       for a markdown codeblock should also increase
test.skip('Yielded components with empty line within block', () => {
  assertTransform({
    input: stripIndent`
      <Styleguide::Columns as |c|>
        <c.error>
          long string of text text

          text
        </c.error>
      </Styleguide::Columns>
    `
  });
});

test('Yielded component blocks can contain markdown', () => {
  assertTransform({
    // indentation level of the list item is significant
    // further indentation converts to text
    input: stripIndent`
      <Styleguide::Columns as |c|>
        <c.column>

        - Item A
        - Item B

        </c.column>
      </Styleguide::Columns>
    `,
    expected: stripIndent`
      <Styleguide::Columns as |c|>
        <c.column>
          <ul>
            <li>Item A</li>
            <li>Item B</li>
          </ul>
        </c.column>
      </Styleguide::Columns>
    `
  });
});

test('Yielded component blocks can have blank lines', () => {
  assertTransform({
    input: stripIndent`
      <Styleguide::Columns as |c|>
        <c.column>

        </c.column>
      </Styleguide::Columns>
    `
  });
});

test('Yielded component blocks can have html', () => {
  assertTransform({
    input: stripIndent`
      <Styleguide::Columns as |c|>
        <c.column>
          <ul></ul>
        </c.column>
      </Styleguide::Columns>
    `,
    expected: stripIndent`
      <Styleguide::Columns as |c|>
        <c.column>
          <ul>
          </ul>
        </c.column>
      </Styleguide::Columns>
    `
  });
});
