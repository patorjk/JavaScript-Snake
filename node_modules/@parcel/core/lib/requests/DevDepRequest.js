"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDevDependency = createDevDependency;
exports.getDevDepRequests = getDevDepRequests;
exports.getWorkerDevDepRequests = getWorkerDevDepRequests;
exports.invalidateDevDeps = invalidateDevDeps;
exports.resolveDevDepRequestRef = resolveDevDepRequestRef;
exports.runDevDepRequest = runDevDepRequest;
function _nullthrows() {
  const data = _interopRequireDefault(require("nullthrows"));
  _nullthrows = function () {
    return data;
  };
  return data;
}
var _assetUtils = require("../assetUtils");
var _buildCache = require("../buildCache");
var _utils = require("../utils");
var _projectPath = require("../projectPath");
var _RequestTracker = require("../RequestTracker");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// A cache of dev dep requests keyed by invalidations.
// If the package manager returns the same invalidation object, then
// we can reuse the dev dep request rather than recomputing the project
// paths and hashes.
const devDepRequestCache = new WeakMap();
async function createDevDependency(opts, requestDevDeps, options) {
  let {
    specifier,
    resolveFrom,
    additionalInvalidations
  } = opts;
  let key = `${specifier}:${(0, _projectPath.fromProjectPathRelative)(resolveFrom)}`;

  // If the request sent us a hash, we know the dev dep and all of its dependencies didn't change.
  // Reuse the same hash in the response. No need to send back invalidations as the request won't
  // be re-run anyway.
  let hash = requestDevDeps.get(key);
  if (hash != null) {
    return {
      type: 'ref',
      specifier,
      resolveFrom,
      hash
    };
  }
  let resolveFromAbsolute = (0, _projectPath.fromProjectPath)(options.projectRoot, resolveFrom);

  // Ensure that the package manager has an entry for this resolution.
  try {
    await options.packageManager.resolve(specifier, resolveFromAbsolute);
  } catch (err) {
    // ignore
  }
  let invalidations = options.packageManager.getInvalidations(specifier, resolveFromAbsolute);
  let cached = devDepRequestCache.get(invalidations);
  if (cached != null) {
    return cached;
  }
  let invalidateOnFileChangeProject = [...invalidations.invalidateOnFileChange].map(f => (0, _projectPath.toProjectPath)(options.projectRoot, f));

  // It is possible for a transformer to have multiple different hashes due to
  // different dependencies (e.g. conditional requires) so we must always
  // recompute the hash and compare rather than only sending a transformer
  // dev dependency once.
  hash = await (0, _assetUtils.getInvalidationHash)(invalidateOnFileChangeProject.map(f => ({
    type: 'file',
    filePath: f
  })), options);
  let devDepRequest = {
    specifier,
    resolveFrom,
    hash,
    invalidateOnFileCreate: invalidations.invalidateOnFileCreate.map(i => (0, _utils.invalidateOnFileCreateToInternal)(options.projectRoot, i)),
    invalidateOnFileChange: new Set(invalidateOnFileChangeProject),
    invalidateOnStartup: invalidations.invalidateOnStartup,
    additionalInvalidations
  };
  devDepRequestCache.set(invalidations, devDepRequest);
  return devDepRequest;
}
async function getDevDepRequests(api) {
  let previousDevDepRequests = new Map(await Promise.all(api.getSubRequests().filter(req => req.requestType === _RequestTracker.requestTypes.dev_dep_request).map(async req => [req.id, (0, _nullthrows().default)(await api.getRequestResult(req.id))])));
  return {
    devDeps: new Map([...previousDevDepRequests.entries()].filter(([id]) => api.canSkipSubrequest(id)).map(([, req]) => [`${req.specifier}:${(0, _projectPath.fromProjectPathRelative)(req.resolveFrom)}`, req.hash])),
    invalidDevDeps: await Promise.all([...previousDevDepRequests.entries()].filter(([id]) => !api.canSkipSubrequest(id)).flatMap(([, req]) => {
      return [{
        specifier: req.specifier,
        resolveFrom: req.resolveFrom
      }, ...(req.additionalInvalidations ?? []).map(i => ({
        specifier: i.specifier,
        resolveFrom: i.resolveFrom
      }))];
    }))
  };
}

// Tracks dev deps that have been invalidated during this build
// so we don't invalidate the require cache more than once.
const invalidatedDevDeps = (0, _buildCache.createBuildCache)();
function invalidateDevDeps(invalidDevDeps, options, config) {
  for (let {
    specifier,
    resolveFrom
  } of invalidDevDeps) {
    let key = `${specifier}:${(0, _projectPath.fromProjectPathRelative)(resolveFrom)}`;
    if (!invalidatedDevDeps.has(key)) {
      config.invalidatePlugin(specifier);
      options.packageManager.invalidate(specifier, (0, _projectPath.fromProjectPath)(options.projectRoot, resolveFrom));
      invalidatedDevDeps.set(key, true);
    }
  }
}
async function runDevDepRequest(api, devDepRequestRef) {
  await api.runRequest({
    id: 'dev_dep_request:' + devDepRequestRef.specifier + ':' + devDepRequestRef.hash,
    type: _RequestTracker.requestTypes.dev_dep_request,
    run: ({
      api
    }) => {
      let devDepRequest = resolveDevDepRequestRef(devDepRequestRef);
      for (let filePath of (0, _nullthrows().default)(devDepRequest.invalidateOnFileChange, 'DevDepRequest missing invalidateOnFileChange')) {
        api.invalidateOnFileUpdate(filePath);
        api.invalidateOnFileDelete(filePath);
      }
      for (let invalidation of (0, _nullthrows().default)(devDepRequest.invalidateOnFileCreate, 'DevDepRequest missing invalidateOnFileCreate')) {
        api.invalidateOnFileCreate(invalidation);
      }
      if (devDepRequest.invalidateOnStartup) {
        api.invalidateOnStartup();
      }
      api.storeResult({
        specifier: devDepRequest.specifier,
        resolveFrom: devDepRequest.resolveFrom,
        hash: devDepRequest.hash,
        additionalInvalidations: devDepRequest.additionalInvalidations
      });
    },
    input: null
  });
}
const devDepRequests = (0, _buildCache.createBuildCache)();
function resolveDevDepRequestRef(devDepRequestRef) {
  const devDepRequest = devDepRequestRef.type === 'ref' ? devDepRequests.get(devDepRequestRef.hash) : devDepRequestRef;
  if (devDepRequest == null) {
    throw new Error(`Worker send back a reference to a missing dev dep request.
This might happen due to internal in-memory build caches not being cleared
between builds or due a race condition.
This is a bug in Parcel.`);
  }
  if (devDepRequestRef.type !== 'ref') {
    devDepRequests.set(devDepRequest.hash, devDepRequest);
  }
  return devDepRequest;
}

// A cache of plugin dependency hashes that we've already sent to the main thread.
// Automatically cleared before each build.
const pluginCache = (0, _buildCache.createBuildCache)();
function getWorkerDevDepRequests(devDepRequests) {
  return devDepRequests.map(devDepRequest => {
    // If we've already sent a matching transformer + hash to the main thread during this build,
    // there's no need to repeat ourselves.
    let {
      specifier,
      resolveFrom,
      hash
    } = devDepRequest;
    if (hash === pluginCache.get(specifier)) {
      return {
        type: 'ref',
        specifier,
        resolveFrom,
        hash
      };
    } else {
      pluginCache.set(specifier, hash);
      return devDepRequest;
    }
  });
}