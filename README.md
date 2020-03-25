# remark-hbs ![](https://github.com/josemarluedke/remark-hbs/workflows/CI/badge.svg)

[remark](https://github.com/remarkjs/remark) plugin to escape [Ember](https://emberjs.com/) handlebars templates.

## Install

```
yarn add remark-hbs
```

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
const fs = require('fs')
const unified = require('unified')
const markdown = require('remark-parse')
const hbs = require('remark-hbs')
const html = require('remark-html')

const template = unified()
  .use(markdown)
  .use(hbs)
  .use(html)
  .processSync(fs.readFileSync('example.md'))
  .toString()

console.log(template)
```

Now, running `node example.js` yields:

```hbs
<h1>Lorem ipsum</h1>
<MyComponent @myArg={{this.isTesting}}>
  This is my component

</MyComponent>
```

## License

This project is licensed under the [MIT License](LICENSE.md)
