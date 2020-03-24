const visit = require('unist-util-visit');
const escapeHBS = (node) => {
  if (!node.value) {
    return;
  }
  if (
    /^({{|<[A-Z]|<\/[A-Z]|<[a-zA-Z]+\.[a-zA-Z])/g.test(node.value.trimStart())
  ) {
    node.type = 'html';
  }
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

module.exports = function () {
  return (ast) => {
    visit(ast, 'text', escapeHBS);
    visit(ast, 'paragraph', removeParagraphsWithHTML(ast));
  };
};
