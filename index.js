const visit = require('unist-util-visit');
var u = require('unist-builder');

const TAG_SPLIT = /([^<]+)?(<[^>]+>)*/
const mightHaveTag = str => str ? str.indexOf('<') < str.indexOf('>') : false;

let recursion = 0;
const splitTags = (str) => {
  if (recursion > 4) return [str];
  if (!mightHaveTag(str)) return [str];

  let [_, ...result] = str.match(TAG_SPLIT)

  result = (result || []).filter(Boolean).reduce((acc, subStr, i) => {
    let previous = acc[i - 1];
    let previousExists = previous !== undefined;
    let previousIsComponent = previousExists && isComponentInvocationOrHandlebars(previous)

    if (i > 0 && !isComponentInvocationOrHandlebars(subStr) && !previousIsComponent) {
      acc[i - 1] = `${previous || ''}${subStr}`;
    } else {
      acc.push(subStr);
    }

    return acc;
  }, []);

  if (result.length === 1) {
    return [str];
  }

  if (result.length > 1) {
    result = result.map(subStr => splitTags(subStr));
  }

  return result.flat().filter(Boolean);
}

const parseHBS = (node, indexInParent, parent) => {
  recursion = 0
  if (!node.value) {
    return;
  }

  if (isComponentInvocationOrHandlebars(node.value)) {
    node.type = 'html';
    return;
  }

  // When text nodes also have html on them, such as "text</endingTag>",
  // split those up as well
  const lines = node.value.split('\n').map(splitTags).flat();

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

const COMPONENT_REGEX = /^(<\/?[A-Z][a-z0.9.-:]+|<\/?[a-zA-Z]+\.[a-zA-z]+)/;
const ANGLE_BRACKET_REGEX = /^<\/?/;
const BLOCK_REGEX = /^<\/?:[^>]+>/;
const HBS_REGEX = /^\{\{/
const TAG_REGEX = /^<[^>]+>/;

const isComponentInvocationOrHandlebars = (text) => {
  let str = text.trimStart();
  let isTag = new RegExp(TAG_REGEX, 'g').test(str);
  let isHbs = new RegExp(HBS_REGEX, 'g').test(str);
  let isAngleBracket = new RegExp(ANGLE_BRACKET_REGEX, 'g').test(str);
  let isComponentIdentifier = new RegExp(COMPONENT_REGEX, 'g').test(str);
  let isNamedBlock = new RegExp(BLOCK_REGEX, 'g').test(str);

  return isHbs || (isTag && isAngleBracket && (isComponentIdentifier || isNamedBlock));
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
