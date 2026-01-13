import { ParserOptions } from 'htmlparser2';
import { SourceLocation } from './location-tracker.js';

type Directive = {
    name: string | RegExp;
    start: string;
    end: string;
};
type Options = {
    directives?: Directive[];
    sourceLocations?: boolean;
    recognizeNoValueAttribute?: boolean;
} & ParserOptions;
type Tag = string | boolean;
type Attributes = Record<string, string | number | boolean>;
type Content = NodeText | Array<Node | Node[]>;
type NodeText = string | number;
type NodeTag = {
    tag?: Tag;
    attrs?: Attributes;
    content?: Content;
    location?: SourceLocation;
};
type Node = NodeText | NodeTag;
declare const parser: (html: string, options?: Options) => Node[];

export { Attributes, Content, Directive, Node, NodeTag, NodeText, Options, Tag, parser };
