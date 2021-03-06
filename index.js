const visit = require('unist-util-visit');
var u = require('unist-builder');

const parseHBS = (node, indexInParent, parent) => {
  if (!node.value) {
    return;
  }

  if (isComponentInvocationOrHandlebars(node.value)) {
    node.type = 'html';
    return;
  }

  const lines = node.value.split('\n');
  const toInsert = [];
  lines.forEach((line) => {
    if (isComponentInvocationOrHandlebars(line)) {
      toInsert.push(u('html', `\n${line}`));
    } else {
      const lastNode = toInsert[toInsert.length - 1];
      if (lastNode && lastNode.type === 'text') {
        lastNode.value += `\n${line}`;
      } else {
        toInsert.push(u('text', line));
      }
    }
  });

  if (toInsert.length > 1) {
    parent.children.splice(indexInParent, 1, ...toInsert);
  }
};

const isComponentInvocationOrHandlebars = (text) => {
  return /^({{|<[A-Z]|<\/[A-Z]|<:[a-zA-Z]|<\/:[a-zA-Z]|<[a-zA-Z]+\.[a-zA-Z])/g.test(
    text.trimStart()
  );
};

const escapeCurlies = (node) => {
  if (node.value) {
    node.value = node.value.replace(/{{/g, '\\{{');
  }

  if (node.children) {
    node.children.forEach(escapeCurlies);
  }

  if (!node.data) {
    return;
  }
  if (!node.data.hChildren) {
    return;
  }
  node.data.hChildren.forEach(escapeCurlies);
};

const removeParagraphsWithHTML = (ast) => {
  return (node) => {
    if (!node.children) {
      return;
    }

    if (node.children[0].type === 'html') {
      let index = ast.children.findIndex((item) => item === node);
      ast.children.splice(index, 1, ...node.children);
    }
  };
};

// Workaround for Ember Components using nested namespaces.
// Commonmark idendifies <Cool::Component> as an autolink.
const fixAutoLink = (node) => {
  if (
    node.children &&
    node.children.length === 1 &&
    node.url === node.children[0].value
  ) {
    if (/^[A-Z].+(::)[A-Z]/g.test(node.url)) {
      node.type = 'html';
      node.value = `<${node.url}>`;
      delete node.url;
      delete node.title;
      delete node.children;
    }
  }
};

module.exports = function (options = {}) {
  return (ast) => {
    visit(ast, 'text', parseHBS);
    visit(ast, 'link', fixAutoLink);

    visit(ast, 'paragraph', removeParagraphsWithHTML(ast));

    if (options.escapeCurliesCode !== false) {
      visit(ast, 'code', escapeCurlies);
    }

    if (options.escapeCurliesInlineCode !== false) {
      visit(ast, 'inlineCode', escapeCurlies);
    }
  };
};
