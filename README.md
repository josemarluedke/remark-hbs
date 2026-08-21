# remark-hbs ![](https://github.com/josemarluedke/remark-hbs/workflows/CI/badge.svg)

[Remark](https://github.com/remarkjs/remark) plugin that allows writing markdown with [Ember](https://emberjs.com/) handlebars templates.

## Install

```
pnpm add remark-hbs
```

> **Note:** `remark-hbs` is an ESM-only package and requires Node.js
> `^20.19.0 || >=22.12.0`.

## Usage

Say we have the following markdown file, `example.md`:

```md
# Lorem ipsum

<MyComponent @myArg={{this.isTesting}}>
  This is my component
</MyComponent>
```

And our script, `example.js`, looks as follows:

```js
import fs from 'node:fs';
import { unified } from 'unified';
import markdown from 'remark-parse';
import hbs from 'remark-hbs';
import html from 'remark-html';

const template = unified()
  .use(markdown)
  .use(hbs)
  .use(html, { sanitize: false })
  .processSync(fs.readFileSync('example.md'))
  .toString();

console.log(template);
```

Now, running `node example.js` yields:

```hbs
<h1>Lorem ipsum</h1>
<MyComponent @myArg={{this.isTesting}}>
  This is my component

</MyComponent>
```

## Limitations

- Closing an element tag in a new line is not supported as it is
    parsed as blockquote in markdown. For example at line 3:
```hbs
<Something
  class="something"
>
</Something>
```

## License

This project is licensed under the [MIT License](LICENSE.md)
