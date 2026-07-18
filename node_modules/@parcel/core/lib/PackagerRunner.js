"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _assert() {
  const data = _interopRequireDefault(require("assert"));
  _assert = function () {
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
function _logger() {
  const data = require("@parcel/logger");
  _logger = function () {
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
function _stream() {
  const data = require("stream");
  _stream = function () {
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
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
function _url() {
  const data = _interopRequireDefault(require("url"));
  _url = function () {
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
var _Bundle = require("./public/Bundle");
var _BundleGraph = _interopRequireWildcard(require("./public/BundleGraph"));
var _PluginOptions = _interopRequireDefault(require("./public/PluginOptions"));
var _Config = _interopRequireDefault(require("./public/Config"));
var _constants = require("./constants");
var _projectPath = require("./projectPath");
var _InternalConfig = require("./InternalConfig");
var _ConfigRequest = require("./requests/ConfigRequest");
var _DevDepRequest = require("./requests/DevDepRequest");
var _buildCache = require("./buildCache");
var _assetUtils = require("./assetUtils");
var _utils2 = require("./utils");
function _profiler() {
  const data = require("@parcel/profiler");
  _profiler = function () {
    return data;
  };
  return data;
}
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const BOUNDARY_LENGTH = _constants.HASH_REF_PREFIX.length + 32 - 1;

// Packager/optimizer configs are not bundle-specific, so we only need to
// load them once per build.
const pluginConfigs = (0, _buildCache.createBuildCache)();
class PackagerRunner {
  constructor({
    config,
    options,
    report,
    previousDevDeps,
    previousInvalidations
  }) {
    this.config = config;
    this.options = options;
    this.report = report;
    this.previousDevDeps = previousDevDeps;
    this.devDepRequests = new Map();
    this.previousInvalidations = previousInvalidations;
    this.invalidations = new Map();
    this.pluginOptions = new _PluginOptions.default((0, _utils2.optionsProxy)(this.options, option => {
      let invalidation = {
        type: 'option',
        key: option
      };
      this.invalidations.set((0, _assetUtils.getInvalidationId)(invalidation), invalidation);
    }));
  }
  async run(bundleGraph, bundle, invalidDevDeps) {
    (0, _DevDepRequest.invalidateDevDeps)(invalidDevDeps, this.options, this.config);
    let {
      configs,
      bundleConfigs
    } = await this.loadConfigs(bundleGraph, bundle);
    let bundleInfo = await this.getBundleInfoFromCache(bundleGraph, bundle, configs, bundleConfigs);
    if (bundleInfo.length === 0) {
      bundleInfo = await this.getBundleInfo(bundle, bundleGraph, configs, bundleConfigs);
    }
    let configRequests = (0, _ConfigRequest.getConfigRequests)([...configs.values(), ...bundleConfigs.values()]);
    let devDepRequests = (0, _DevDepRequest.getWorkerDevDepRequests)([...this.devDepRequests.values()]);
    return {
      bundleInfo,
      configRequests,
      devDepRequests,
      invalidations: [...this.invalidations.values()]
    };
  }
  async loadConfigs(bundleGraph, bundle) {
    let configs = new Map();
    let bundleConfigs = new Map();
    await this.loadConfig(bundleGraph, bundle, configs, bundleConfigs);
    for (let inlineBundle of bundleGraph.getInlineBundles(bundle)) {
      await this.loadConfig(bundleGraph, inlineBundle, configs, bundleConfigs);
    }
    return {
      configs,
      bundleConfigs
    };
  }
  async loadConfig(bundleGraph, bundle, configs, bundleConfigs) {
    let name = (0, _nullthrows().default)(bundle.name);
    let plugin = await this.config.getPackager(name, bundle.pipeline);
    await this.loadPluginConfig(bundleGraph, bundle, plugin, configs, bundleConfigs);
    let optimizers = await this.config.getOptimizers(name, bundle.pipeline);
    for (let optimizer of optimizers) {
      await this.loadPluginConfig(bundleGraph, bundle, optimizer, configs, bundleConfigs);
    }
  }
  async loadPluginConfig(bundleGraph, bundle, plugin, configs, bundleConfigs) {
    if (!configs.has(plugin.name)) {
      // Only load config for a plugin once per build.
      let existing = pluginConfigs.get(plugin.name);
      if (existing != null) {
        configs.set(plugin.name, existing);
      } else {
        if (plugin.plugin.loadConfig != null) {
          let config = (0, _InternalConfig.createConfig)({
            plugin: plugin.name,
            searchPath: (0, _projectPath.toProjectPathUnsafe)('index')
          });
          await (0, _ConfigRequest.loadPluginConfig)(plugin, config, this.options);
          for (let devDep of config.devDeps) {
            let devDepRequest = await (0, _DevDepRequest.createDevDependency)(devDep, this.previousDevDeps, this.options);
            let key = `${devDep.specifier}:${(0, _projectPath.fromProjectPath)(this.options.projectRoot, devDep.resolveFrom)}`;
            this.devDepRequests.set(key, devDepRequest);
          }
          pluginConfigs.set(plugin.name, config);
          configs.set(plugin.name, config);
        }
      }
    }
    let loadBundleConfig = plugin.plugin.loadBundleConfig;
    if (!bundleConfigs.has(plugin.name) && loadBundleConfig != null) {
      let config = (0, _InternalConfig.createConfig)({
        plugin: plugin.name,
        searchPath: (0, _projectPath.joinProjectPath)(bundle.target.distDir, bundle.name ?? bundle.id)
      });
      config.result = await loadBundleConfig({
        bundle: _Bundle.NamedBundle.get(bundle, bundleGraph, this.options),
        bundleGraph: new _BundleGraph.default(bundleGraph, _Bundle.NamedBundle.get.bind(_Bundle.NamedBundle), this.options),
        config: new _Config.default(config, this.options),
        options: new _PluginOptions.default(this.options),
        logger: new (_logger().PluginLogger)({
          origin: plugin.name
        }),
        tracer: new (_profiler().PluginTracer)({
          origin: plugin.name,
          category: 'loadConfig'
        })
      });
      bundleConfigs.set(plugin.name, config);
    }
  }
  async getBundleInfoFromCache(bundleGraph, bundle, configs, bundleConfigs) {
    if (this.options.shouldDisableCache) {
      return [];
    }
    let cacheKey = await this.getCacheKey(bundle, bundleGraph, configs, bundleConfigs, this.previousInvalidations);
    let infoKey = PackagerRunner.getInfoKey(cacheKey);
    let res = await this.options.cache.get(infoKey);
    return res ?? [];
  }
  async getBundleInfo(bundle, bundleGraph, configs, bundleConfigs) {
    let results = await this.getBundleResult(bundle, bundleGraph, configs, bundleConfigs);

    // Recompute cache keys as they may have changed due to dev dependencies.
    let cacheKey = await this.getCacheKey(bundle, bundleGraph, configs, bundleConfigs, [...this.invalidations.values()]);
    return this.writeToCache(cacheKey, results);
  }
  async getInlineBundleContents(bundle, bundleGraph, configs, bundleConfigs) {
    let bundleInfo = await this.getBundleInfoFromCache(bundleGraph, bundle, configs, bundleConfigs);
    if (bundleInfo.length > 0) {
      return this.options.cache.getBlob(bundleInfo[0].cacheKeys.content);
    }
    let results = await this.getBundleResult(bundle, bundleGraph, configs, bundleConfigs);

    // Writing to the cache consumes the stream, but we need to also return it to the calling packager.
    // Buffer the stream into memory first.
    if (results[0].contents instanceof _stream().Readable) {
      results[0].contents = await (0, _utils().bufferStream)(results[0].contents);
    }

    // Recompute cache keys as they may have changed due to dev dependencies.
    let cacheKey = await this.getCacheKey(bundle, bundleGraph, configs, bundleConfigs, [...this.invalidations.values()]);
    await this.writeToCache(cacheKey, results);
    return results[0].contents;
  }
  async getBundleResult(bundle, bundleGraph, configs, bundleConfigs) {
    let packagedResults = await this.package(bundle, bundleGraph, configs, bundleConfigs);
    return Promise.all(packagedResults.map(async packaged => {
      let type = packaged.type ?? bundle.type;
      let res = await this.optimize(bundle, bundleGraph, type, packaged.contents, packaged.map, configs, bundleConfigs);
      let map = res.map != null ? await this.generateSourceMap(bundle, res.map) : null;
      return {
        type: res.type ?? type,
        contents: res.contents,
        map
      };
    }));
  }
  getSourceMapReference(bundle, map) {
    if (map && bundle.env.sourceMap && bundle.bundleBehavior !== 'inline') {
      if (bundle.env.sourceMap && bundle.env.sourceMap.inline) {
        return this.generateSourceMap((0, _Bundle.bundleToInternalBundle)(bundle), map);
      } else {
        return _path().default.basename(bundle.name) + '.map';
      }
    } else {
      return null;
    }
  }
  async package(internalBundle, bundleGraph, configs, bundleConfigs) {
    let bundle = _Bundle.NamedBundle.get(internalBundle, bundleGraph, this.options);
    this.report({
      type: 'buildProgress',
      phase: 'packaging',
      bundle
    });
    let packager = await this.config.getPackager(bundle.name, internalBundle.pipeline);
    let {
      name,
      resolveFrom,
      plugin
    } = packager;
    let measurement;
    try {
      var _configs$get, _bundleConfigs$get;
      measurement = _profiler().tracer.createMeasurement(name, 'packaging', bundle.name, {
        type: bundle.type
      });
      let res = await plugin.package({
        config: (_configs$get = configs.get(name)) === null || _configs$get === void 0 ? void 0 : _configs$get.result,
        bundleConfig: (_bundleConfigs$get = bundleConfigs.get(name)) === null || _bundleConfigs$get === void 0 ? void 0 : _bundleConfigs$get.result,
        bundle,
        bundleGraph: new _BundleGraph.default(bundleGraph, _Bundle.NamedBundle.get.bind(_Bundle.NamedBundle), this.options),
        getSourceMapReference: map => {
          return this.getSourceMapReference(bundle, map);
        },
        options: this.pluginOptions,
        logger: new (_logger().PluginLogger)({
          origin: name
        }),
        tracer: new (_profiler().PluginTracer)({
          origin: name,
          category: 'package'
        }),
        getInlineBundleContents: async (bundle, bundleGraph) => {
          if (bundle.bundleBehavior !== 'inline') {
            throw new Error('Bundle is not inline and unable to retrieve contents');
          }
          let contents = await this.getInlineBundleContents((0, _Bundle.bundleToInternalBundle)(bundle),
          // $FlowFixMe
          (0, _BundleGraph.bundleGraphToInternalBundleGraph)(bundleGraph), configs, bundleConfigs);
          return {
            contents
          };
        }
      });
      if (Array.isArray(res)) {
        return res;
      }
      return [res];
    } catch (e) {
      throw new (_diagnostic().default)({
        diagnostic: (0, _diagnostic().errorToDiagnostic)(e, {
          origin: name,
          filePath: _path().default.join(bundle.target.distDir, bundle.name)
        })
      });
    } finally {
      measurement && measurement.end();
      // Add dev dependency for the packager. This must be done AFTER running it due to
      // the potential for lazy require() that aren't executed until the request runs.
      let devDepRequest = await (0, _DevDepRequest.createDevDependency)({
        specifier: name,
        resolveFrom
      }, this.previousDevDeps, this.options);
      this.devDepRequests.set(`${name}:${(0, _projectPath.fromProjectPathRelative)(resolveFrom)}`, devDepRequest);
    }
  }
  async optimize(internalBundle, internalBundleGraph, type, contents, map, configs, bundleConfigs) {
    let bundle = _Bundle.NamedBundle.get(internalBundle, internalBundleGraph, this.options);
    let bundleGraph = new _BundleGraph.default(internalBundleGraph, _Bundle.NamedBundle.get.bind(_Bundle.NamedBundle), this.options);
    let name = bundle.name;
    if (type !== bundle.type) {
      name = name.slice(0, -_path().default.extname(name).length) + '.' + type;
    }
    let optimizers = await this.config.getOptimizers(name, internalBundle.pipeline);
    if (!optimizers.length) {
      return {
        type,
        contents,
        map
      };
    }
    this.report({
      type: 'buildProgress',
      phase: 'optimizing',
      bundle
    });
    let optimized = {
      type,
      contents,
      map
    };
    for (let optimizer of optimizers) {
      let measurement;
      try {
        var _configs$get2, _bundleConfigs$get2;
        measurement = _profiler().tracer.createMeasurement(optimizer.name, 'optimize', bundle.name);
        let next = await optimizer.plugin.optimize({
          config: (_configs$get2 = configs.get(optimizer.name)) === null || _configs$get2 === void 0 ? void 0 : _configs$get2.result,
          bundleConfig: (_bundleConfigs$get2 = bundleConfigs.get(optimizer.name)) === null || _bundleConfigs$get2 === void 0 ? void 0 : _bundleConfigs$get2.result,
          bundle,
          bundleGraph,
          contents: optimized.contents,
          map: optimized.map,
          getSourceMapReference: map => {
            return this.getSourceMapReference(bundle, map);
          },
          options: this.pluginOptions,
          logger: new (_logger().PluginLogger)({
            origin: optimizer.name
          }),
          tracer: new (_profiler().PluginTracer)({
            origin: optimizer.name,
            category: 'optimize'
          })
        });
        optimized.type = next.type ?? optimized.type;
        optimized.contents = next.contents;
        optimized.map = next.map;
      } catch (e) {
        throw new (_diagnostic().default)({
          diagnostic: (0, _diagnostic().errorToDiagnostic)(e, {
            origin: optimizer.name,
            filePath: _path().default.join(bundle.target.distDir, bundle.name)
          })
        });
      } finally {
        measurement && measurement.end();
        // Add dev dependency for the optimizer. This must be done AFTER running it due to
        // the potential for lazy require() that aren't executed until the request runs.
        let devDepRequest = await (0, _DevDepRequest.createDevDependency)({
          specifier: optimizer.name,
          resolveFrom: optimizer.resolveFrom
        }, this.previousDevDeps, this.options);
        this.devDepRequests.set(`${optimizer.name}:${(0, _projectPath.fromProjectPathRelative)(optimizer.resolveFrom)}`, devDepRequest);
      }
    }
    return optimized;
  }
  async generateSourceMap(bundle, map) {
    // sourceRoot should be a relative path between outDir and rootDir for node.js targets
    let filePath = (0, _projectPath.joinProjectPath)(bundle.target.distDir, (0, _nullthrows().default)(bundle.name));
    let fullPath = (0, _projectPath.fromProjectPath)(this.options.projectRoot, filePath);
    let sourceRoot = _path().default.relative(_path().default.dirname(fullPath), this.options.projectRoot);
    let inlineSources = false;
    if (bundle.target) {
      if (bundle.env.sourceMap && bundle.env.sourceMap.sourceRoot !== undefined) {
        sourceRoot = bundle.env.sourceMap.sourceRoot;
      } else if (this.options.serveOptions && bundle.target.env.context === 'browser') {
        sourceRoot = '/__parcel_source_root';
      }
      if (bundle.env.sourceMap && bundle.env.sourceMap.inlineSources !== undefined) {
        inlineSources = bundle.env.sourceMap.inlineSources;
      } else if (bundle.target.env.context !== 'node') {
        // inlining should only happen in production for browser targets by default
        inlineSources = this.options.mode === 'production';
      }
    }
    let isInlineMap = bundle.env.sourceMap && bundle.env.sourceMap.inline;
    let stringified = await map.stringify({
      file: _path().default.basename(fullPath + '.map'),
      // $FlowFixMe
      fs: this.options.inputFS,
      rootDir: this.options.projectRoot,
      sourceRoot: !inlineSources ? _url().default.format(_url().default.parse(sourceRoot + '/')) : undefined,
      inlineSources,
      format: isInlineMap ? 'inline' : 'string'
    });
    (0, _assert().default)(typeof stringified === 'string');
    return stringified;
  }
  async getCacheKey(bundle, bundleGraph, configs, bundleConfigs, invalidations) {
    let configResults = {};
    for (let [pluginName, config] of configs) {
      if (config) {
        configResults[pluginName] = await (0, _ConfigRequest.getConfigHash)(config, pluginName, this.options);
      }
    }
    let globalInfoResults = {};
    for (let [pluginName, config] of bundleConfigs) {
      if (config) {
        globalInfoResults[pluginName] = await (0, _ConfigRequest.getConfigHash)(config, pluginName, this.options);
      }
    }
    let devDepHashes = await this.getDevDepHashes(bundle);
    for (let inlineBundle of bundleGraph.getInlineBundles(bundle)) {
      devDepHashes += await this.getDevDepHashes(inlineBundle);
    }
    let invalidationHash = await (0, _assetUtils.getInvalidationHash)(invalidations, this.options);
    return (0, _rust().hashString)(_constants.PARCEL_VERSION + devDepHashes + invalidationHash + bundle.target.publicUrl + bundleGraph.getHash(bundle) + JSON.stringify(configResults) + JSON.stringify(globalInfoResults) + this.options.mode + (this.options.shouldBuildLazily ? 'lazy' : 'eager'));
  }
  async getDevDepHashes(bundle) {
    var _this$devDepRequests$;
    let name = (0, _nullthrows().default)(bundle.name);
    let packager = await this.config.getPackager(name, bundle.pipeline);
    let optimizers = await this.config.getOptimizers(name, bundle.pipeline);
    let key = `${packager.name}:${(0, _projectPath.fromProjectPathRelative)(packager.resolveFrom)}`;
    let devDepHashes = ((_this$devDepRequests$ = this.devDepRequests.get(key)) === null || _this$devDepRequests$ === void 0 ? void 0 : _this$devDepRequests$.hash) ?? this.previousDevDeps.get(key) ?? '';
    for (let {
      name,
      resolveFrom
    } of optimizers) {
      var _this$devDepRequests$2;
      let key = `${name}:${(0, _projectPath.fromProjectPathRelative)(resolveFrom)}`;
      devDepHashes += ((_this$devDepRequests$2 = this.devDepRequests.get(key)) === null || _this$devDepRequests$2 === void 0 ? void 0 : _this$devDepRequests$2.hash) ?? this.previousDevDeps.get(key) ?? '';
    }
    return devDepHashes;
  }
  async writeToCache(cacheKey, results) {
    let info = await Promise.all(results.map(async ({
      contents,
      map,
      type
    }, index) => {
      let size = 0;
      let hash;
      let hashReferences = [];
      let isLargeBlob = false;
      let cacheKeys = {
        content: PackagerRunner.getContentKey(cacheKey, index),
        map: PackagerRunner.getMapKey(cacheKey, index)
      };

      // TODO: don't replace hash references in binary files??
      if (contents instanceof _stream().Readable) {
        isLargeBlob = true;
        let boundaryStr = '';
        let h = new (_rust().Hash)();
        await this.options.cache.setStream(cacheKeys.content, (0, _utils().blobToStream)(contents).pipe(new (_utils().TapStream)(buf => {
          let str = boundaryStr + buf.toString();
          hashReferences = hashReferences.concat(str.match(_constants.HASH_REF_REGEX) ?? []);
          size += buf.length;
          h.writeBuffer(buf);
          boundaryStr = str.slice(str.length - BOUNDARY_LENGTH);
        })));
        hash = h.finish();
      } else if (typeof contents === 'string') {
        let buffer = Buffer.from(contents);
        size = buffer.byteLength;
        hash = (0, _rust().hashBuffer)(buffer);
        hashReferences = contents.match(_constants.HASH_REF_REGEX) ?? [];
        await this.options.cache.setBlob(cacheKeys.content, buffer);
      } else {
        size = contents.length;
        hash = (0, _rust().hashBuffer)(contents);
        hashReferences = contents.toString().match(_constants.HASH_REF_REGEX) ?? [];
        await this.options.cache.setBlob(cacheKeys.content, contents);
      }
      if (map != null) {
        await this.options.cache.setBlob(cacheKeys.map, map);
      }
      let info = {
        type,
        size,
        hash,
        hashReferences,
        cacheKeys,
        isLargeBlob
      };
      return info;
    }));
    await this.options.cache.set(PackagerRunner.getInfoKey(cacheKey), info);
    return info;
  }
  static getContentKey(cacheKey, index) {
    return (0, _rust().hashString)(`${cacheKey}:${index}:content`);
  }
  static getMapKey(cacheKey, index) {
    return (0, _rust().hashString)(`${cacheKey}:${index}:map`);
  }
  static getInfoKey(cacheKey) {
    return (0, _rust().hashString)(`${cacheKey}:info`);
  }
}
exports.default = PackagerRunner;