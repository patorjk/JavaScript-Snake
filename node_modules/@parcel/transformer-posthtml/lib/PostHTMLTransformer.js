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
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
var _loadPlugins = _interopRequireDefault(require("./loadPlugins"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = new (_plugin().Transformer)({
  async loadConfig({
    config,
    options,
    logger
  }) {
    if (!config.isSource) {
      return;
    }
    let configFile = await config.getConfig(['.posthtmlrc', '.posthtmlrc.js', '.posthtmlrc.cjs', '.posthtmlrc.mjs', 'posthtml.config.js', 'posthtml.config.cjs', 'posthtml.config.mjs'], {
      packageKey: 'posthtml'
    });
    if (configFile) {
      let isJavascript = _path().default.extname(configFile.filePath).endsWith('js');
      if (isJavascript) {
        // We have to invalidate on startup in case the config is non-deterministic,
        // e.g. using unknown environment variables, reading from the filesystem, etc.
        logger.warn({
          message: 'WARNING: Using a JavaScript PostHTML config file means losing out on caching features of Parcel. Use a .posthtmlrc (JSON) file whenever possible.'
        });
      }

      // Load plugins. This must be done before adding dev dependencies so we auto install.
      let plugins = await (0, _loadPlugins.default)(configFile.contents.plugins, config.searchPath, options);

      // Now add dev dependencies so we invalidate when they change.
      let pluginArray = Array.isArray(configFile.contents.plugins) ? configFile.contents.plugins : Object.keys(configFile.contents.plugins);
      for (let p of pluginArray) {
        if (typeof p === 'string') {
          config.addDevDependency({
            specifier: p,
            resolveFrom: configFile.filePath
          });
        }
      }
      configFile.contents.plugins = plugins;
      delete configFile.contents.render;
      return configFile.contents;
    }
  },
  async transform({
    asset,
    config,
    options
  }) {
    if (!config) {
      return [asset];
    }
    let posthtml = await options.packageManager.require('posthtml', asset.filePath, {
      range: '^0.16.5'
    });
    let code = await asset.getCode();
    let res = await posthtml(config.plugins).process(code, {
      ...config,
      plugins: config.plugins,
      xmlMode: asset.type === 'xhtml',
      closingSingleTag: asset.type === 'xhtml' ? 'slash' : undefined
    });
    if (res.messages) {
      for (let {
        type,
        file: filePath
      } of res.messages) {
        if (type === 'dependency') {
          asset.invalidateOnFileChange(filePath);
        }
      }
    }
    asset.setCode(res.html);
    return [asset];
  }
});