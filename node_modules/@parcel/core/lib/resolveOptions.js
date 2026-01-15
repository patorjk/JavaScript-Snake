"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveOptions;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
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
function _fs() {
  const data = require("@parcel/fs");
  _fs = function () {
    return data;
  };
  return data;
}
function _cache() {
  const data = require("@parcel/cache");
  _cache = function () {
    return data;
  };
  return data;
}
function _packageManager() {
  const data = require("@parcel/package-manager");
  _packageManager = function () {
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
var _loadDotEnv = _interopRequireDefault(require("./loadDotEnv"));
var _projectPath = require("./projectPath");
var _ParcelConfigRequest = require("./requests/ParcelConfigRequest");
function _featureFlags() {
  const data = require("@parcel/feature-flags");
  _featureFlags = function () {
    return data;
  };
  return data;
}
var _constants = require("./constants");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Default cache directory name
const DEFAULT_CACHE_DIRNAME = '.parcel-cache';
const LOCK_FILE_NAMES = ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml'];

// Generate a unique instanceId, will change on every run of parcel
function generateInstanceId(entries) {
  return (0, _rust().hashString)(`${entries.join(',')}-${Date.now()}-${Math.round(Math.random() * 100)}`);
}

// Compiles an array of globs to regex - used for lazy include/excludes
function compileGlobs(globs) {
  return globs.map(glob => (0, _utils().globToRegex)(glob));
}
async function resolveOptions(initialOptions) {
  var _initialOptions$defau, _initialOptions$defau2, _initialOptions$defau3, _initialOptions$defau4, _initialOptions$addit, _initialOptions$defau5, _initialOptions$defau6, _initialOptions$defau7, _initialOptions$defau8, _initialOptions$defau9;
  let inputFS = initialOptions.inputFS || new (_fs().NodeFS)();
  let outputFS = initialOptions.outputFS || new (_fs().NodeFS)();
  let inputCwd = inputFS.cwd();
  let outputCwd = outputFS.cwd();
  let entries;
  if (initialOptions.entries == null || initialOptions.entries === '') {
    entries = [];
  } else if (Array.isArray(initialOptions.entries)) {
    entries = initialOptions.entries.map(entry => _path().default.resolve(inputCwd, entry));
  } else {
    entries = [_path().default.resolve(inputCwd, initialOptions.entries)];
  }
  let shouldMakeEntryReferFolder = false;
  if (entries.length === 1 && !(0, _utils().isGlob)(entries[0])) {
    let [entry] = entries;
    try {
      shouldMakeEntryReferFolder = (await inputFS.stat(entry)).isDirectory();
    } catch {
      // ignore failing stat call
    }
  }

  // getRootDir treats the input as files, so getRootDir(["/home/user/myproject"]) returns "/home/user".
  // Instead we need to make the the entry refer to some file inside the specified folders if entries refers to the directory.
  let entryRoot = (0, _utils().getRootDir)(shouldMakeEntryReferFolder ? [_path().default.join(entries[0], 'index')] : entries);
  let projectRootFile = (await (0, _utils().resolveConfig)(inputFS, _path().default.join(entryRoot, 'index'), [...LOCK_FILE_NAMES, '.git', '.hg'], _path().default.parse(entryRoot).root)) || _path().default.join(inputCwd, 'index'); // ? Should this just be rootDir

  let projectRoot = _path().default.dirname(projectRootFile);
  let packageManager = initialOptions.packageManager || new (_packageManager().NodePackageManager)(inputFS, projectRoot);
  let cacheDir =
  // If a cacheDir is provided, resolve it relative to cwd. Otherwise,
  // use a default directory resolved relative to the project root.
  initialOptions.cacheDir != null ? _path().default.resolve(outputCwd, initialOptions.cacheDir) : _path().default.resolve(projectRoot, DEFAULT_CACHE_DIRNAME);

  // Make the root watch directory configurable. This is useful in some cases
  // where symlinked dependencies outside the project root need to trigger HMR
  // updates. Default to the project root if not provided.
  let watchDir = initialOptions.watchDir != null ? _path().default.resolve(initialOptions.watchDir) : projectRoot;
  let cache = initialOptions.cache ?? (outputFS instanceof _fs().NodeFS ? new (_cache().LMDBCache)(cacheDir) : new (_cache().FSCache)(outputFS, cacheDir));
  let mode = initialOptions.mode ?? 'development';
  let shouldOptimize = (initialOptions === null || initialOptions === void 0 || (_initialOptions$defau = initialOptions.defaultTargetOptions) === null || _initialOptions$defau === void 0 ? void 0 : _initialOptions$defau.shouldOptimize) ?? mode === 'production';
  let publicUrl = (initialOptions === null || initialOptions === void 0 || (_initialOptions$defau2 = initialOptions.defaultTargetOptions) === null || _initialOptions$defau2 === void 0 ? void 0 : _initialOptions$defau2.publicUrl) ?? '/';
  let distDir = (initialOptions === null || initialOptions === void 0 || (_initialOptions$defau3 = initialOptions.defaultTargetOptions) === null || _initialOptions$defau3 === void 0 ? void 0 : _initialOptions$defau3.distDir) != null ? _path().default.resolve(inputCwd, initialOptions === null || initialOptions === void 0 || (_initialOptions$defau4 = initialOptions.defaultTargetOptions) === null || _initialOptions$defau4 === void 0 ? void 0 : _initialOptions$defau4.distDir) : undefined;
  let shouldBuildLazily = initialOptions.shouldBuildLazily ?? false;
  let lazyIncludes = compileGlobs(initialOptions.lazyIncludes ?? []);
  if (lazyIncludes.length > 0 && !shouldBuildLazily) {
    throw new Error('Lazy includes can only be provided when lazy building is enabled');
  }
  let lazyExcludes = compileGlobs(initialOptions.lazyExcludes ?? []);
  if (lazyExcludes.length > 0 && !shouldBuildLazily) {
    throw new Error('Lazy excludes can only be provided when lazy building is enabled');
  }
  let shouldContentHash = initialOptions.shouldContentHash ?? initialOptions.mode === 'production';
  if (shouldBuildLazily && shouldContentHash) {
    throw new Error('Lazy bundling does not work with content hashing');
  }
  let env = {
    ...(await (0, _loadDotEnv.default)(initialOptions.env ?? {}, inputFS, _path().default.join(projectRoot, 'index'), projectRoot)),
    ...process.env,
    ...initialOptions.env
  };
  let port = determinePort(initialOptions.serveOptions, env.PORT);
  return {
    config: getRelativeConfigSpecifier(inputFS, projectRoot, initialOptions.config),
    defaultConfig: getRelativeConfigSpecifier(inputFS, projectRoot, initialOptions.defaultConfig),
    shouldPatchConsole: initialOptions.shouldPatchConsole ?? false,
    env,
    mode,
    shouldAutoInstall: initialOptions.shouldAutoInstall ?? false,
    hmrOptions: initialOptions.hmrOptions ?? null,
    shouldBuildLazily,
    lazyIncludes,
    lazyExcludes,
    unstableFileInvalidations: initialOptions.unstableFileInvalidations,
    shouldBundleIncrementally: initialOptions.shouldBundleIncrementally ?? true,
    shouldContentHash,
    serveOptions: initialOptions.serveOptions ? {
      ...initialOptions.serveOptions,
      distDir: distDir ?? _path().default.join(outputCwd, 'dist'),
      port
    } : false,
    shouldDisableCache: initialOptions.shouldDisableCache ?? false,
    shouldProfile: initialOptions.shouldProfile ?? false,
    shouldTrace: initialOptions.shouldTrace ?? false,
    cacheDir,
    watchDir,
    watchBackend: initialOptions.watchBackend,
    watchIgnore: initialOptions.watchIgnore,
    entries: entries.map(e => (0, _projectPath.toProjectPath)(projectRoot, e)),
    targets: initialOptions.targets,
    logLevel: initialOptions.logLevel ?? 'info',
    projectRoot,
    inputFS,
    outputFS,
    cache,
    packageManager,
    additionalReporters: ((_initialOptions$addit = initialOptions.additionalReporters) === null || _initialOptions$addit === void 0 ? void 0 : _initialOptions$addit.map(({
      packageName,
      resolveFrom
    }) => ({
      packageName,
      resolveFrom: (0, _projectPath.toProjectPath)(projectRoot, resolveFrom)
    }))) ?? [],
    instanceId: generateInstanceId(entries),
    detailedReport: initialOptions.detailedReport,
    defaultTargetOptions: {
      shouldOptimize,
      shouldScopeHoist: initialOptions === null || initialOptions === void 0 || (_initialOptions$defau5 = initialOptions.defaultTargetOptions) === null || _initialOptions$defau5 === void 0 ? void 0 : _initialOptions$defau5.shouldScopeHoist,
      sourceMaps: (initialOptions === null || initialOptions === void 0 || (_initialOptions$defau6 = initialOptions.defaultTargetOptions) === null || _initialOptions$defau6 === void 0 ? void 0 : _initialOptions$defau6.sourceMaps) ?? true,
      publicUrl,
      ...(distDir != null ? {
        distDir: (0, _projectPath.toProjectPath)(projectRoot, distDir)
      } : {
        /*::...null*/
      }),
      engines: initialOptions === null || initialOptions === void 0 || (_initialOptions$defau7 = initialOptions.defaultTargetOptions) === null || _initialOptions$defau7 === void 0 ? void 0 : _initialOptions$defau7.engines,
      outputFormat: initialOptions === null || initialOptions === void 0 || (_initialOptions$defau8 = initialOptions.defaultTargetOptions) === null || _initialOptions$defau8 === void 0 ? void 0 : _initialOptions$defau8.outputFormat,
      isLibrary: initialOptions === null || initialOptions === void 0 || (_initialOptions$defau9 = initialOptions.defaultTargetOptions) === null || _initialOptions$defau9 === void 0 ? void 0 : _initialOptions$defau9.isLibrary
    },
    featureFlags: {
      ..._featureFlags().DEFAULT_FEATURE_FLAGS,
      ...(initialOptions === null || initialOptions === void 0 ? void 0 : initialOptions.featureFlags)
    },
    parcelVersion: _constants.PARCEL_VERSION
  };
}
function getRelativeConfigSpecifier(fs, projectRoot, specifier) {
  if (specifier == null) {
    return undefined;
  } else if (_path().default.isAbsolute(specifier)) {
    let resolveFrom = (0, _ParcelConfigRequest.getResolveFrom)(fs, projectRoot);
    let relative = (0, _utils().relativePath)(_path().default.dirname(resolveFrom), specifier);
    // If the config is outside the project root, use an absolute path so that if the project root
    // moves the path still works. Otherwise, use a relative path so that the cache is portable.
    return relative.startsWith('..') ? specifier : relative;
  } else {
    return specifier;
  }
}
function determinePort(initialServerOptions, portInEnv, defaultPort = 1234) {
  function parsePort(port) {
    let parsedPort = Number(port);

    // return undefined if port number defined in .env is not valid integer
    if (!Number.isInteger(parsedPort)) {
      return undefined;
    }
    return parsedPort;
  }
  if (!initialServerOptions) {
    return typeof portInEnv !== 'undefined' ? parsePort(portInEnv) ?? defaultPort : defaultPort;
  }

  // if initialServerOptions.port is equal to defaultPort, then this means that port number is provided via PORT=~~~~ on cli. In this case, we should ignore port number defined in .env.
  if (initialServerOptions.port !== defaultPort) {
    return initialServerOptions.port;
  }
  return typeof portInEnv !== 'undefined' ? parsePort(portInEnv) ?? defaultPort : defaultPort;
}