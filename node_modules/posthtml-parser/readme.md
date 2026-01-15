<div align="center">
  <img width="150" height="150" alt="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>PostHTML Parser</h1>
  
  Parse HTML/XML to [PostHTML AST](https://github.com/posthtml/posthtml-parser#posthtml-ast-format)

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Coverage][coverage-shield]][coverage]
</div>

## Installation

```sh
npm install posthtml-parser
```

## Usage

Input HTML:

```html
<a class="animals" href="#">
  <span class="animals__cat" style="background: url(cat.png)">Cat</span>
</a>
```

Parse with `posthtml-parser`:

```js
import fs from 'fs'
import { parser } from 'posthtml-parser'

const html = fs.readFileSync('path/to/input.html', 'utf-8')

console.log(parser(html))
```

Resulting PostHTML AST:

```js
[
  {
    tag: 'a',
    attrs: {
      class: 'animals',
      href: '#'
    },
    content: [
      '\n    ',
      {
        tag: 'span',
        attrs: {
          class: 'animals__cat',
          style: 'background: url(cat.png)'
        },
        content: ['Cat']
      },
      '\n'
    ]
  }
]
```

## PostHTML AST Format

Any parser used with PostHTML should return a standard PostHTML [Abstract Syntax Tree](https://www.wikiwand.com/en/Abstract_syntax_tree) (AST). 

Fortunately, this is a very easy format to produce and understand. The AST is an array that can contain strings and objects. Strings represent plain text content, while objects represent HTML tags.

Tag objects generally look like this:

```js
{
  tag: 'div',
  attrs: {
    class: 'foo'
  },
  content: ['hello world!']
}
```

Tag objects can contain three keys:

- The `tag` key takes the name of the tag as the value. This can include custom tags. 
- The optional `attrs` key takes an object with key/value pairs representing the attributes of the html tag. A boolean attribute has an empty string as its value. 
- The optional `content` key takes an array as its value, which is a PostHTML AST. In this manner, the AST is a tree that should be walked recursively.

## Options

### `directives`

Type: `Array`\
Default: `[{name: '!doctype', start: '<', end: '>'}]`

Adds processing of custom directives.

The property ```name``` in custom directives can be of `String` or `RegExp` type.

### `xmlMode`

Type: `Boolean`\
Default: `false`

Indicates whether special tags (`<script>` and `<style>`) should get special treatment and if "empty" tags (eg. `<br>`) can have children. If false, the content of special tags will be text only. 

For feeds and other XML content (documents that don't consist of HTML), set this to `true`.

### `decodeEntities`

Type: `Boolean`\
Default: `false`

If set to `true`, entities within the document will be decoded.

### `lowerCaseTags`

Type: `Boolean`\
Default: `false`

If set to `true`, all tags will be lowercased. If `xmlMode` is disabled.

### `lowerCaseAttributeNames`

Type: `Boolean`\
Default: `false`

If set to `true`, all attribute names will be lowercased. 

**This has noticeable impact on speed.**

### `recognizeCDATA`

Type: `Boolean`\
Default: `false`

If set to `true`, CDATA sections will be recognized as text even if the `xmlMode` option is not enabled. 

If `xmlMode` is set to `true`, then CDATA sections will always be recognized as text.

### `recognizeSelfClosing`

Type: `Boolean`\
Default: `false`

If set to `true`, self-closing tags will trigger the `onclosetag` event even if `xmlMode` is not set to `true`. 

If `xmlMode` is set to `true`, then self-closing tags will always be recognized.

### `sourceLocations`

Type: `Boolean`\
Default: `false`

If set to `true`, AST nodes will have a `location` property containing the `start` and `end` line and column position of the node.

### `recognizeNoValueAttribute`

Type: `Boolean`\
Default: `false`

If set to `true`, AST nodes will recognize attribute with no value and mark as `true` which will be correctly rendered by `posthtml-render` package.


[npm]: https://www.npmjs.com/package/posthtml-parser
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-parser.svg
[github-ci]: https://github.com/posthtml/posthtml-parser/actions
[github-ci-shield]: https://github.com/posthtml/posthtml-parser/actions/workflows/nodejs.yml/badge.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-parser.svg
[coverage]: https://coveralls.io/r/posthtml/posthtml-parser?branch=master
[coverage-shield]: https://coveralls.io/repos/posthtml/posthtml-parser/badge.svg?branch=master
