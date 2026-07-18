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
function _diagnostic() {
  const data = _interopRequireWildcard(require("@parcel/diagnostic"));
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
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var _default = exports.default = new (_plugin().Optimizer)({
  async loadConfig({
    config,
    logger,
    options
  }) {
    let configFile = await config.getConfig(['svgo.config.js', 'svgo.config.cjs', 'svgo.config.mjs', 'svgo.config.json']);

    // See if svgo is already installed.
    let resolved;
    try {
      resolved = await options.packageManager.resolve('svgo', _path().default.join(options.projectRoot, 'index'), {
        shouldAutoInstall: false
      });
    } catch (err) {
      // ignore.
    }

    // If so, use the existing installed version.
    let version = 3;
    if (resolved) {
      var _resolved$pkg;
      if ((_resolved$pkg = resolved.pkg) !== null && _resolved$pkg !== void 0 && _resolved$pkg.version) {
        version = parseInt(resolved.pkg.version);
      }
    } else {
      // Otherwise try to detect the version based on the config file.
      let v = (0, _utils().detectSVGOVersion)(configFile === null || configFile === void 0 ? void 0 : configFile.contents);
      if (configFile != null && v.version === 2) {
        logger.warn({
          message: (0, _diagnostic().md)`Detected deprecated SVGO v2 options in ${_path().default.relative(process.cwd(), configFile.filePath)}`,
          codeFrames: [{
            filePath: configFile.filePath,
            codeHighlights: _path().default.extname(configFile.filePath) === '.json' ? (0, _diagnostic().generateJSONCodeHighlights)(await options.inputFS.readFile(configFile.filePath, 'utf8'), [{
              key: v.path
            }]) : []
          }]
        });
      }
      version = v.version;
    }
    return {
      contents: configFile === null || configFile === void 0 ? void 0 : configFile.contents,
      version
    };
  },
  async optimize({
    bundle,
    contents,
    config,
    options
  }) {
    if (!bundle.env.shouldOptimize) {
      return {
        contents
      };
    }
    const svgo = await options.packageManager.require('svgo', _path().default.join(options.projectRoot, 'index'), {
      range: `^${config.version}`,
      saveDev: true,
      shouldAutoInstall: options.shouldAutoInstall
    });
    let code = await (0, _utils().blobToString)(contents);
    let cleanupIds = config.version === 2 ? 'cleanupIDs' : 'cleanupIds';
    let result;
    try {
      result = svgo.optimize(code, {
        plugins: [{
          name: 'preset-default',
          params: {
            overrides: {
              // Removing ids could break SVG sprites.
              [cleanupIds]: false,
              // <style> elements and attributes are already minified before they
              // are re-inserted by the packager.
              minifyStyles: false
            }
          }
        }],
        ...config.contents
      });
    } catch (err) {
      throw (0, _diagnostic().errorToDiagnostic)(err);
    }

    // For svgo v2.
    if (result.error != null) {
      throw new (_diagnostic().default)({
        diagnostic: {
          message: result.error
        }
      });
    }
    return {
      contents: result.data
    };
  }
});