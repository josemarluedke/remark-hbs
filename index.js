const visit = require('unist-util-visit');
const parseHBS = (node) => {
  if (!node.value) {
    return;
  }
  if (
    /^({{|<[A-Z]|<\/[A-Z]|<[a-zA-Z]+\.[a-zA-Z])/g.test(node.value.trimStart())
  ) {
    node.type = 'html';
  }
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

module.exports = function (options = {}) {
  return (ast) => {
    visit(ast, 'text', parseHBS);
    visit(ast, 'paragraph', removeParagraphsWithHTML(ast));

    if (options.escapeCurliesCode !== false) {
      visit(ast, 'code', escapeCurlies);
    }

    if (options.escapeCurliesInlineCode !== false) {
      visit(ast, 'inlineCode', escapeCurlies);
    }
  };
};
