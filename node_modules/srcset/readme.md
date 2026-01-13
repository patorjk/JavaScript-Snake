# srcset

> Parse and stringify the HTML `<img>` [srcset](https://www.smashingmagazine.com/2013/08/webkit-implements-srcset-and-why-its-a-good-thing/) attribute.

Can be useful if you're creating a build-tool.

## Install

```sh
npm install srcset
```

## Usage

How an image with `srcset` might look like:

```html
<img
	alt="The Breakfast Combo"
	src="banner.jpg"
	srcset="banner-HD.jpg 2x, banner-phone.jpg 100w"
>
```

Then have some fun with it:

```js
import {parseSrcset, stringifySrcset} from 'srcset';

const parsed = parseSrcset('banner-HD.jpg 2x, banner-phone.jpg 100w');
console.log(parsed);
/*
[
	{
		url: 'banner-HD.jpg',
		density: 2
	},
	{
		url: 'banner-phone.jpg',
		width: 100
	}
]
*/

parsed.push({
	url: 'banner-super-HD.jpg',
	density: 3
});

const stringified = stringifySrcset(parsed);
console.log(stringified);
/*
banner-HD.jpg 2x, banner-phone.jpg 100w, banner-super-HD.jpg 3x
*/
```

## API

### parseSrcset(string, options?)

Parse the HTML `<img>` [srcset](http://mobile.smashingmagazine.com/2013/08/21/webkit-implements-srcset-and-why-its-a-good-thing/) attribute.

Accepts a “srcset” string and returns an array of objects with the possible properties: `url` (always), `width`, `height`, and `density`.

#### string

Type: `string`

A “srcset” string.

#### options

Type: `object`

##### strict

Type: `boolean`\
Default: `false`

When enabled, an invalid “srcset” string will cause an error to be thrown. When disabled, a best effort will be made to parse the string, potentially resulting in invalid or nonsensical output.

### stringifySrcset(SrcSetDefinitions, options?)

Stringify `SrcSetDefinition`s. Accepts an array of `SrcSetDefinition` objects and returns a “srcset” string.

#### srcsetDescriptors

Type: `array`

An array of `SrcSetDefinition` objects. Each object should have a `url` field and may have `width`, `height` or `density` fields. When the `strict` option is `true`, only `width` or `density` is accepted.

#### options

Type: `object`

##### strict

Type: `boolean`\
Default: `false`

Enable or disable validation of the `SrcSetDefinition`'s. When true, invalid input will cause an error to be thrown. When false, a best effort will be made to stringify invalid input, likely resulting in invalid srcset value.
