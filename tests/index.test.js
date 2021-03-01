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

test('Nested components with nested components that yield', () => {
  assertTransform({
    ignoreIndentationChanges: true,
    ignoreLineBreakChanges: true,
    input: stripIndent`
      <Component::With::Nesting>
        <Further::Nested @arg="hi">
          yielded content
        </Further::Nested>
      </Component::With::Nesting>
    `,
  })
});

test('Nested components with nested components that yield with HTML comment', () => {
  assertTransform({
    ignoreIndentationChanges: true,
    ignoreLineBreakChanges: true,
    input: stripIndent`
      \`\`\`hbs preview-template
      # h1 title

      some body text

      <!-- with a comment -->
      <Component::With::Nesting>
        <Further::Nested @arg="hi">
          yielded content
        </Further::Nested>
      </Component::With::Nesting>
      \`\`\`
    `,
    expected: stripIndent`
      \`\`\`hbs preview-template
      <h1>h1 title</h1>

      <p>some body text</p>

      <!-- with a comment -->
      <Component::With::Nesting>
        <Further::Nested @arg="hi">
          yielded content
        </Further::Nested>
      </Component::With::Nesting>
      \`\`\`
    `,
  })
});
