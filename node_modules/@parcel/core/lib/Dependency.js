"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDependency = createDependency;
exports.mergeDependencies = mergeDependencies;
function _rust() {
  const data = require("@parcel/rust");
  _rust = function () {
    return data;
  };
  return data;
}
var _types = require("./types");
var _utils = require("./utils");
var _projectPath = require("./projectPath");
function createDependency(projectRoot, opts) {
  let id = opts.id || (0, _rust().hashString)((opts.sourceAssetId ?? '') + opts.specifier + opts.env.id + (opts.target ? JSON.stringify(opts.target) : '') + (opts.pipeline ?? '') + opts.specifierType + (opts.bundleBehavior ?? '') + (opts.priority ?? 'sync') + (opts.packageConditions ? JSON.stringify(opts.packageConditions) : ''));
  let dep = {
    id,
    specifier: opts.specifier,
    specifierType: _types.SpecifierType[opts.specifierType],
    priority: _types.Priority[opts.priority ?? 'sync'],
    needsStableName: opts.needsStableName ?? false,
    bundleBehavior: opts.bundleBehavior ? _types.BundleBehavior[opts.bundleBehavior] : null,
    isEntry: opts.isEntry ?? false,
    isOptional: opts.isOptional ?? false,
    loc: (0, _utils.toInternalSourceLocation)(projectRoot, opts.loc),
    env: opts.env,
    meta: opts.meta || {},
    target: opts.target,
    sourceAssetId: opts.sourceAssetId,
    sourcePath: (0, _projectPath.toProjectPath)(projectRoot, opts.sourcePath),
    resolveFrom: (0, _projectPath.toProjectPath)(projectRoot, opts.resolveFrom),
    range: opts.range,
    symbols: opts.symbols && new Map([...opts.symbols].map(([k, v]) => [k, {
      local: v.local,
      meta: v.meta,
      isWeak: v.isWeak,
      loc: (0, _utils.toInternalSourceLocation)(projectRoot, v.loc)
    }])),
    pipeline: opts.pipeline
  };
  if (opts.packageConditions) {
    convertConditions(opts.packageConditions, dep);
  }
  return dep;
}
function mergeDependencies(a, b) {
  let {
    meta,
    symbols,
    needsStableName,
    isEntry,
    isOptional,
    ...other
  } = b;
  Object.assign(a, other);
  Object.assign(a.meta, meta);
  if (a.symbols && symbols) {
    for (let [k, v] of symbols) {
      a.symbols.set(k, v);
    }
  }
  if (needsStableName) a.needsStableName = true;
  if (isEntry) a.isEntry = true;
  if (!isOptional) a.isOptional = false;
}
function convertConditions(conditions, dep) {
  // Store common package conditions as bit flags to reduce size.
  // Custom conditions are stored as strings.
  let packageConditions = 0;
  let customConditions = [];
  for (let condition of conditions) {
    if (_types.ExportsCondition[condition]) {
      packageConditions |= _types.ExportsCondition[condition];
    } else {
      customConditions.push(condition);
    }
  }
  if (packageConditions) {
    dep.packageConditions = packageConditions;
  }
  if (customConditions.length) {
    dep.customPackageConditions = customConditions;
  }
}