"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpecifier = getSpecifier;
exports.isValidIdentifier = isValidIdentifier;
exports.makeValidIdentifier = makeValidIdentifier;
exports.replaceScriptDependencies = replaceScriptDependencies;
function _nullthrows() {
  const data = _interopRequireDefault(require("nullthrows"));
  _nullthrows = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// This replaces __parcel__require__ references left by the transformer with
// parcelRequire calls of the resolved asset id. This lets runtimes work within
// script bundles, which must be outside the bundle wrapper so their variables are global.
function replaceScriptDependencies(bundleGraph, bundle, code, map, parcelRequireName) {
  let entry = (0, _nullthrows().default)(bundle.getMainEntry());
  let dependencies = bundleGraph.getDependencies(entry);
  let lineCount = 0;
  let offset = 0;
  let columnStartIndex = 0;
  code = code.replace(/\n|__parcel__require__\(['"](.*?)['"]\)/g, (m, s, i) => {
    if (m === '\n') {
      columnStartIndex = i + offset + 1;
      lineCount++;
      return '\n';
    }
    let dep = (0, _nullthrows().default)(dependencies.find(d => getSpecifier(d) === s));
    let resolved = (0, _nullthrows().default)(bundleGraph.getResolvedAsset(dep, bundle));
    let publicId = bundleGraph.getAssetPublicId(resolved);
    let replacement = `${parcelRequireName}("${publicId}")`;
    if (map) {
      let lengthDifference = replacement.length - m.length;
      if (lengthDifference !== 0) {
        map.offsetColumns(lineCount + 1, i + offset - columnStartIndex + m.length, lengthDifference);
        offset += lengthDifference;
      }
    }
    return replacement;
  });
  return code;
}
function getSpecifier(dep) {
  if (typeof dep.meta.placeholder === 'string') {
    return dep.meta.placeholder;
  }
  return dep.specifier;
}

// https://262.ecma-international.org/6.0/#sec-names-and-keywords
const IDENTIFIER_RE = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/u;
const ID_START_RE = /^[$_\p{ID_Start}]/u;
const NON_ID_CONTINUE_RE = /[^$_\u200C\u200D\p{ID_Continue}]/gu;
function isValidIdentifier(id) {
  return IDENTIFIER_RE.test(id);
}
function makeValidIdentifier(name) {
  name = name.replace(NON_ID_CONTINUE_RE, '');
  if (!ID_START_RE.test(name)) {
    name = '_' + name;
  }
  return name;
}