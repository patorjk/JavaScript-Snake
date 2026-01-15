export interface SrcSetDefinition {
	readonly url: string;
	readonly width?: number;
	readonly density?: number;
}

export interface Options {
	/**
	When strict mode is enabled, errors will be thrown on invalid input.

	When disabled, a best effort will be made to handle invalid input and no errors will be thrown. The output may be invalid.

	@default false
	*/
	readonly strict?: boolean;
}

/**
Parse the HTML `<img>` [srcset](http://mobile.smashingmagazine.com/2013/08/21/webkit-implements-srcset-and-why-its-a-good-thing/) attribute.

Accepts a “srcset” string and returns an array of objects with the possible properties: `url` (always), `width`, `density`, and `height`.

@param srcset - A “srcset” string.

@example
```
import {parseSrcset} from 'srcset';

console.log(parseSrcset('banner-HD.jpg 2x, banner-phone.jpg 100w'));
// [
// 	{
// 		url: 'banner-HD.jpg',
// 		density: 2
// 	},
// 	{
// 		url: 'banner-phone.jpg',
// 		width: 100
// 	}
// ]
```
*/
export function parseSrcset(srcset: string, options?: Options): SrcSetDefinition[];

/**
Stringify `SrcSetDefinition`s.

@param SrcSetDefinitions - Each object should have a `url` field and may have either `width` or `density`. When the `strict` option is `true`, only `width` or `density` is accepted.

@returns A “srcset” string.

@example
```
import {stringifySrcset} from 'srcset';

const stringified = stringifySrcset([
	{
		url: 'banner-HD.jpg',
		density: 2
	},
	{
		url: 'banner-phone.jpg',
		width: 100
	}
]);

console.log(stringified);
// banner-HD.jpg 2x, banner-phone.jpg 100w
```
*/
export function stringifySrcset(srcSetDefinitions: readonly SrcSetDefinition[], options?: Options): string;
