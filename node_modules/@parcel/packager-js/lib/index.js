"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _plugin() {
  const data = require("@parcel/plugin");
  _plugin = function () {
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
function _diagnostic() {
  const data = require("@parcel/diagnostic");
  _diagnostic = function () {
    return data;
  };
  return data;
}
function _rust() {
  const data = require("@parcel/rust");
  _rust = function () {
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
var _DevPackager = require("./DevPackager");
var _ScopeHoistingPackager = require("./ScopeHoistingPackager");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    unstable_asyncBundleRuntime: {
      type: 'boolean'
    }
  },
  additionalProperties: false
};
var _default = exports.default = new (_plugin().Packager)({
  async loadConfig({
    config,
    options
  }) {
    var _packageName$contents, _conf$contents;
    let packageKey = '@parcel/packager-js';
    let conf = await config.getConfigFrom(options.projectRoot + '/index', [], {
      packageKey
    });
    if (conf !== null && conf !== void 0 && conf.contents) {
      _utils().validateSchema.diagnostic(CONFIG_SCHEMA, {
        data: conf === null || conf === void 0 ? void 0 : conf.contents,
        source: await options.inputFS.readFile(conf.filePath, 'utf8'),
        filePath: conf.filePath,
        prependKey: `/${(0, _diagnostic().encodeJSONKeyComponent)(packageKey)}`
      }, packageKey, `Invalid config for ${packageKey}`);
    }

    // Generate a name for the global parcelRequire function that is unique to this project.
    // This allows multiple parcel builds to coexist on the same page.
    let packageName = await config.getConfigFrom(options.projectRoot + '/index', [], {
      packageKey: 'name'
    });
    let name = (packageName === null || packageName === void 0 || (_packageName$contents = packageName.contents) === null || _packageName$contents === void 0 ? void 0 : _packageName$contents.name) ?? '';
    return {
      parcelRequireName: 'parcelRequire' + (0, _rust().hashString)(name).slice(-4),
      unstable_asyncBundleRuntime: Boolean(conf === null || conf === void 0 || (_conf$contents = conf.contents) === null || _conf$contents === void 0 ? void 0 : _conf$contents.unstable_asyncBundleRuntime)
    };
  },
  async package({
    bundle,
    bundleGraph,
    getInlineBundleContents,
    getSourceMapReference,
    config,
    options
  }) {
    // If this is a non-module script, and there is only one asset with no dependencies,
    // then we don't need to package at all and can pass through the original code un-wrapped.
    let contents, map;
    if (bundle.env.sourceType === 'script') {
      let entries = bundle.getEntryAssets();
      if (entries.length === 1 && bundleGraph.getDependencies(entries[0]).length === 0) {
        contents = await entries[0].getCode();
        map = await entries[0].getMap();
      }
    }
    if (contents == null) {
      let packager = bundle.env.shouldScopeHoist ? new _ScopeHoistingPackager.ScopeHoistingPackager(options, bundleGraph, bundle, (0, _nullthrows().default)(config).parcelRequireName, (0, _nullthrows().default)(config).unstable_asyncBundleRuntime) : new _DevPackager.DevPackager(options, bundleGraph, bundle, (0, _nullthrows().default)(config).parcelRequireName);
      ({
        contents,
        map
      } = await packager.package());
    }
    contents += '\n' + (await getSourceMapSuffix(getSourceMapReference, map));

    // For library builds, we need to replace URL references with their final resolved paths.
    // For non-library builds, this is handled in the JS runtime.
    if (bundle.env.isLibrary) {
      ({
        contents,
        map
      } = (0, _utils().replaceURLReferences)({
        bundle,
        bundleGraph,
        contents,
        map,
        getReplacement: s => JSON.stringify(s).slice(1, -1)
      }));
    }
    return (0, _utils().replaceInlineReferences)({
      bundle,
      bundleGraph,
      contents,
      getInlineReplacement: (dependency, inlineType, content) => ({
        from: `"${dependency.id}"`,
        to: inlineType === 'string' ? JSON.stringify(content) : content
      }),
      getInlineBundleContents,
      map
    });
  }
});
async function getSourceMapSuffix(getSourceMapReference, map) {
  let sourcemapReference = await getSourceMapReference(map);
  if (sourcemapReference != null) {
    return '//# sourceMappingURL=' + sourcemapReference + '\n';
  } else {
    return '';
  }
}