"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAssetRequest;
function _nullthrows() {
  const data = _interopRequireDefault(require("nullthrows"));
  _nullthrows = function () {
    return data;
  };
  return data;
}
function _diagnostic() {
  const data = _interopRequireDefault(require("@parcel/diagnostic"));
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
var _ParcelConfigRequest = _interopRequireDefault(require("./ParcelConfigRequest"));
var _DevDepRequest = require("./DevDepRequest");
var _ConfigRequest = require("./ConfigRequest");
var _projectPath = require("../projectPath");
var _ReporterRunner = require("../ReporterRunner");
var _RequestTracker = require("../RequestTracker");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function createAssetRequest(input) {
  return {
    type: _RequestTracker.requestTypes.asset_request,
    id: getId(input),
    run,
    input
  };
}
const type = 'asset_request';
function getId(input) {
  // eslint-disable-next-line no-unused-vars
  let {
    optionsRef,
    ...hashInput
  } = input;
  return (0, _rust().hashString)(type + (0, _projectPath.fromProjectPathRelative)(input.filePath) + input.env.id + String(input.isSource) + String(input.sideEffects) + (input.code ?? '') + ':' + (input.pipeline ?? '') + ':' + (input.query ?? ''));
}
async function run({
  input,
  api,
  farm,
  invalidateReason,
  options
}) {
  (0, _ReporterRunner.report)({
    type: 'buildProgress',
    phase: 'transforming',
    filePath: (0, _projectPath.fromProjectPath)(options.projectRoot, input.filePath)
  });
  api.invalidateOnFileUpdate(input.filePath);
  let start = Date.now();
  let {
    optionsRef,
    ...rest
  } = input;
  let {
    cachePath
  } = (0, _nullthrows().default)(await api.runRequest((0, _ParcelConfigRequest.default)()));
  let previousDevDepRequests = new Map(await Promise.all(api.getSubRequests().filter(req => req.requestType === _RequestTracker.requestTypes.dev_dep_request).map(async req => [req.id, (0, _nullthrows().default)(await api.getRequestResult(req.id))])));
  let request = {
    ...rest,
    invalidateReason,
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
  let {
    assets,
    configRequests,
    error,
    invalidations,
    devDepRequests
  } = await farm.createHandle('runTransform', input.isSingleChangeRebuild)({
    configCachePath: cachePath,
    optionsRef,
    request
  });
  let time = Date.now() - start;
  if (assets) {
    for (let asset of assets) {
      asset.stats.time = time;
    }
  }
  for (let filePath of invalidations.invalidateOnFileChange) {
    api.invalidateOnFileUpdate(filePath);
    api.invalidateOnFileDelete(filePath);
  }
  for (let invalidation of invalidations.invalidateOnFileCreate) {
    api.invalidateOnFileCreate(invalidation);
  }
  for (let env of invalidations.invalidateOnEnvChange) {
    api.invalidateOnEnvChange(env);
  }
  for (let option of invalidations.invalidateOnOptionChange) {
    api.invalidateOnOptionChange(option);
  }
  if (invalidations.invalidateOnStartup) {
    api.invalidateOnStartup();
  }
  if (invalidations.invalidateOnBuild) {
    api.invalidateOnBuild();
  }
  for (let devDepRequest of devDepRequests) {
    await (0, _DevDepRequest.runDevDepRequest)(api, devDepRequest);
  }
  for (let configRequest of configRequests) {
    await (0, _ConfigRequest.runConfigRequest)(api, configRequest);
  }
  if (error != null) {
    throw new (_diagnostic().default)({
      diagnostic: error
    });
  } else {
    return (0, _nullthrows().default)(assets);
  }
}