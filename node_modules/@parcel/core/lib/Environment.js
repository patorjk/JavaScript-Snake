"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEnvironment = createEnvironment;
exports.mergeEnvironments = mergeEnvironments;
function _rust() {
  const data = require("@parcel/rust");
  _rust = function () {
    return data;
  };
  return data;
}
var _utils = require("./utils");
var _Environment = _interopRequireWildcard(require("./public/Environment"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DEFAULT_ENGINES = {
  browsers: ['> 0.25%'],
  node: '>= 18.0.0'
};
function createEnvironment({
  context,
  engines,
  includeNodeModules,
  outputFormat,
  sourceType = 'module',
  shouldOptimize = false,
  isLibrary = false,
  shouldScopeHoist = false,
  sourceMap,
  loc
} = {
  /*::...null*/
}) {
  if (context == null) {
    var _engines, _engines2;
    if ((_engines = engines) !== null && _engines !== void 0 && _engines.node) {
      context = 'node';
    } else if ((_engines2 = engines) !== null && _engines2 !== void 0 && _engines2.browsers) {
      context = 'browser';
    } else {
      context = 'browser';
    }
  }
  if (engines == null) {
    switch (context) {
      case 'node':
      case 'electron-main':
      case 'react-server':
        engines = {
          node: DEFAULT_ENGINES.node
        };
        break;
      case 'browser':
      case 'web-worker':
      case 'service-worker':
      case 'electron-renderer':
      case 'react-client':
        engines = {
          browsers: DEFAULT_ENGINES.browsers
        };
        break;
      default:
        engines = {};
    }
  }
  if (includeNodeModules == null) {
    switch (context) {
      case 'node':
      case 'electron-main':
      case 'electron-renderer':
        includeNodeModules = false;
        break;
      case 'browser':
      case 'web-worker':
      case 'service-worker':
      default:
        includeNodeModules = true;
        break;
    }
  }
  if (outputFormat == null) {
    switch (context) {
      case 'node':
      case 'electron-main':
      case 'electron-renderer':
      case 'react-server':
        outputFormat = 'commonjs';
        break;
      default:
        outputFormat = 'global';
        break;
    }
  }
  let res = {
    id: '',
    context,
    engines,
    includeNodeModules,
    outputFormat,
    sourceType,
    isLibrary,
    shouldOptimize,
    shouldScopeHoist,
    sourceMap,
    loc
  };
  res.id = getEnvironmentHash(res);
  return res;
}
function mergeEnvironments(projectRoot, a, b) {
  // If merging the same object, avoid copying.
  if (a === b || !b) {
    return a;
  }
  if (b instanceof _Environment.default) {
    return (0, _Environment.environmentToInternalEnvironment)(b);
  }
  return createEnvironment({
    context: b.context ?? a.context,
    engines: b.engines ?? a.engines,
    includeNodeModules: b.includeNodeModules ?? a.includeNodeModules,
    outputFormat: b.outputFormat ?? a.outputFormat,
    sourceType: b.sourceType ?? a.sourceType,
    isLibrary: b.isLibrary ?? a.isLibrary,
    shouldOptimize: b.shouldOptimize ?? a.shouldOptimize,
    shouldScopeHoist: b.shouldScopeHoist ?? a.shouldScopeHoist,
    sourceMap: b.sourceMap ?? a.sourceMap,
    loc: b.loc ? (0, _utils.toInternalSourceLocation)(projectRoot, b.loc) : a.loc
  });
}
function getEnvironmentHash(env) {
  return (0, _rust().hashString)(JSON.stringify([env.context, env.engines, env.includeNodeModules, env.outputFormat, env.sourceType, env.isLibrary, env.shouldOptimize, env.shouldScopeHoist, env.sourceMap]));
}