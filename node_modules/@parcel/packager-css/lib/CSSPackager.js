"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getSpecifier = getSpecifier;
function _lightningcss() {
  const data = _interopRequireWildcard(require("lightningcss"));
  _lightningcss = function () {
    return data;
  };
  return data;
}
function _assert() {
  const data = _interopRequireDefault(require("assert"));
  _assert = function () {
    return data;
  };
  return data;
}
function _nullthrows() {
  const data = _interopRequireDefault(require("nullthrows"));
  _nullthrows = function () {
    return data;
  };
  return data;
}
function _sourceMap() {
  const data = _interopRequireDefault(require("@parcel/source-map"));
  _sourceMap = function () {
    return data;
  };
  return data;
}
function _plugin() {
  const data = require("@parcel/plugin");
  _plugin = function () {
    return data;
  };
  return data;
}
function _diagnostic() {
  const data = require("@parcel/diagnostic");
  _diagnostic = function () {
    return data;
  };
  return data;
}
function _utils() {
  const data = require("@parcel/utils");
  _utils = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// $FlowFixMe - init for browser build.
var _default = exports.default = new (_plugin().Packager)({
  async package({
    bundle,
    bundleGraph,
    getInlineBundleContents,
    getSourceMapReference,
    logger,
    options
  }) {
    // Inline style attributes are parsed differently from full CSS files.
    if (bundle.bundleBehavior === 'inline') {
      let entry = bundle.getMainEntry();
      if ((entry === null || entry === void 0 ? void 0 : entry.meta.type) === 'attr') {
        return replaceReferences(bundle, bundleGraph, await entry.getCode(), await entry.getMap(), getInlineBundleContents);
      }
    }
    let queue = new (_utils().PromiseQueue)({
      maxConcurrent: 32
    });
    let hoistedImports = [];
    let assetsByPlaceholder = new Map();
    let entry = null;
    let entryContents = '';
    bundle.traverse({
      enter: (node, context) => {
        if (node.type === 'asset' && !context) {
          // If there is only one entry, we'll use it directly.
          // Otherwise, we'll create a fake bundle entry with @import rules for each root asset.
          if (entry == null) {
            entry = node.value.id;
          } else {
            entry = bundle.id;
          }
          assetsByPlaceholder.set(node.value.id, node.value);
          entryContents += `@import "${node.value.id}";\n`;
        }
        return true;
      },
      exit: node => {
        if (node.type === 'dependency') {
          let resolved = bundleGraph.getResolvedAsset(node.value, bundle);

          // Hoist unresolved external dependencies (i.e. http: imports)
          if (node.value.priority === 'sync' && !bundleGraph.isDependencySkipped(node.value) && !resolved) {
            hoistedImports.push(node.value.specifier);
          }
          if (resolved && bundle.hasAsset(resolved)) {
            assetsByPlaceholder.set(node.value.meta.placeholder ?? node.value.specifier, resolved);
          }
          return;
        }
        let asset = node.value;
        queue.add(() => {
          var _asset$astGenerator;
          if (!asset.symbols.isCleared && options.mode === 'production' && ((_asset$astGenerator = asset.astGenerator) === null || _asset$astGenerator === void 0 ? void 0 : _asset$astGenerator.type) === 'postcss') {
            // a CSS Modules asset
            return processCSSModule(options, logger, bundleGraph, bundle, asset);
          } else {
            return Promise.all([asset, asset.getCode().then(css => {
              // Replace CSS variable references with resolved symbols.
              if (asset.meta.hasReferences) {
                let replacements = new Map();
                for (let dep of asset.getDependencies()) {
                  for (let [exported, {
                    local
                  }] of dep.symbols) {
                    let resolved = bundleGraph.getResolvedAsset(dep, bundle);
                    if (resolved) {
                      let resolution = bundleGraph.getSymbolResolution(resolved, exported, bundle);
                      if (resolution.symbol) {
                        replacements.set(local, resolution.symbol);
                      }
                    }
                  }
                }
                if (replacements.size > 0) {
                  let regex = new RegExp([...replacements.keys()].join('|'), 'g');
                  css = css.replace(regex, m => escapeDashedIdent(replacements.get(m) || m));
                }
              }
              return css;
            }), bundle.env.sourceMap ? asset.getMap() : null]);
          }
        });
      }
    });
    let outputs = new Map((await queue.run()).map(([asset, code, map]) => [asset, [code, map]]));
    let map = new (_sourceMap().default)(options.projectRoot);

    // $FlowFixMe
    if (process.browser) {
      await (0, _lightningcss().default)();
    }
    let res = await (0, _lightningcss().bundleAsync)({
      filename: (0, _nullthrows().default)(entry),
      sourceMap: !!bundle.env.sourceMap,
      resolver: {
        resolve(specifier) {
          return specifier;
        },
        async read(file) {
          if (file === bundle.id) {
            return entryContents;
          }
          let asset = assetsByPlaceholder.get(file);
          if (!asset) {
            return '';
          }
          let [code, map] = (0, _nullthrows().default)(outputs.get(asset));
          if (map) {
            let sm = await map.stringify({
              format: 'inline'
            });
            (0, _assert().default)(typeof sm === 'string');
            code += `\n/*# sourceMappingURL=${sm} */`;
          }
          return code;
        }
      }
    });
    let contents = res.code.toString();
    if (res.map) {
      let vlqMap = JSON.parse(res.map.toString());
      map.addVLQMap(vlqMap);
      let reference = await getSourceMapReference(map);
      if (reference != null) {
        contents += '/*# sourceMappingURL=' + reference + ' */\n';
      }
    }

    // Prepend hoisted external imports.
    if (hoistedImports.length > 0) {
      let lineOffset = 0;
      let hoistedCode = '';
      for (let url of hoistedImports) {
        hoistedCode += `@import "${url}";\n`;
        lineOffset++;
      }
      if (bundle.env.sourceMap) {
        map.offsetLines(1, lineOffset);
      }
      contents = hoistedCode + contents;
    }
    return replaceReferences(bundle, bundleGraph, contents, map, getInlineBundleContents);
  }
});
function replaceReferences(bundle, bundleGraph, contents, map, getInlineBundleContents) {
  ({
    contents,
    map
  } = (0, _utils().replaceURLReferences)({
    bundle,
    bundleGraph,
    contents,
    map,
    getReplacement: escapeString
  }));
  return (0, _utils().replaceInlineReferences)({
    bundle,
    bundleGraph,
    contents,
    getInlineBundleContents,
    getInlineReplacement: (dep, inlineType, contents) => ({
      from: getSpecifier(dep),
      to: escapeString(contents)
    }),
    map
  });
}
function getSpecifier(dep) {
  if (typeof dep.meta.placeholder === 'string') {
    return dep.meta.placeholder;
  }
  return dep.id;
}
function escapeString(contents) {
  return contents.replace(/(["\\])/g, '\\$1');
}
async function processCSSModule(options, logger, bundleGraph, bundle, asset) {
  var _await$asset$getAST;
  let postcss = await options.packageManager.require('postcss', options.projectRoot + '/index', {
    range: '^8.4.5',
    saveDev: true,
    shouldAutoInstall: options.shouldAutoInstall
  });
  let ast = postcss.fromJSON((0, _nullthrows().default)((_await$asset$getAST = await asset.getAST()) === null || _await$asset$getAST === void 0 ? void 0 : _await$asset$getAST.program));
  let usedSymbols = bundleGraph.getUsedSymbols(asset);
  if (usedSymbols != null) {
    let localSymbols = new Set([...asset.symbols].map(([, {
      local
    }]) => `.${local}`));
    let defaultImport = null;
    if (usedSymbols.has('default')) {
      let incoming = bundleGraph.getIncomingDependencies(asset);
      defaultImport = incoming.find(d => d.symbols.hasExportSymbol('default'));
      if (defaultImport) {
        var _defaultImport$symbol;
        let loc = (_defaultImport$symbol = defaultImport.symbols.get('default')) === null || _defaultImport$symbol === void 0 ? void 0 : _defaultImport$symbol.loc;
        logger.warn({
          message: 'CSS modules cannot be tree shaken when imported with a default specifier',
          ...(loc && {
            codeFrames: [{
              filePath: (0, _nullthrows().default)((loc === null || loc === void 0 ? void 0 : loc.filePath) ?? defaultImport.sourcePath),
              codeHighlights: [(0, _diagnostic().convertSourceLocationToHighlight)(loc)]
            }]
          }),
          hints: [`Instead do: import * as style from "${defaultImport.specifier}";`],
          documentationURL: 'https://parceljs.org/languages/css/#tree-shaking'
        });
      }
    }
    if (!defaultImport && !usedSymbols.has('*')) {
      let usedLocalSymbols = new Set([...usedSymbols].map(exportSymbol => `.${(0, _nullthrows().default)(asset.symbols.get(exportSymbol)).local}`));
      ast.walkRules(rule => {
        if (localSymbols.has(rule.selector) && !usedLocalSymbols.has(rule.selector)) {
          rule.remove();
        }
      });
    }
  }
  let {
    content,
    map
  } = await postcss().process(ast, {
    from: undefined,
    to: options.projectRoot + '/index',
    map: {
      annotation: false,
      inline: false
    },
    // Pass postcss's own stringifier to it to silence its warning
    // as we don't want to perform any transformations -- only generate
    stringifier: postcss.stringify
  });
  let sourceMap;
  if (bundle.env.sourceMap && map != null) {
    sourceMap = new (_sourceMap().default)(options.projectRoot);
    sourceMap.addVLQMap(map.toJSON());
  }
  return [asset, content, sourceMap];
}
function escapeDashedIdent(name) {
  // https://drafts.csswg.org/cssom/#serialize-an-identifier
  let res = '';
  for (let c of name) {
    let code = c.codePointAt(0);
    if (code === 0) {
      res += '\ufffd';
    } else if (code >= 0x1 && code <= 0x1f || code === 0x7f) {
      res += '\\' + code.toString(16) + ' ';
    } else if (code >= 48 /* '0' */ && code <= 57 /* '9' */ || code >= 65 /* 'A' */ && code <= 90 /* 'Z' */ || code >= 97 /* 'a' */ && code <= 122 /* 'z' */ || code === 95 /* '_' */ || code === 45 /* '-' */ || code & 128 // non-ascii
    ) {
      res += c;
    } else {
      res += '\\' + c;
    }
  }
  return res;
}