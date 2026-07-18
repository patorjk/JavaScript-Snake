"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canSkipPackageRequest = canSkipPackageRequest;
exports.createPackageRequest = createPackageRequest;
exports.getPackageRequestId = getPackageRequestId;
var _RequestTracker = require("../RequestTracker");
function _nullthrows() {
  const data = _interopRequireDefault(require("nullthrows"));
  _nullthrows = function () {
    return data;
  };
  return data;
}
var _ConfigRequest = require("./ConfigRequest");
var _DevDepRequest = require("./DevDepRequest");
var _ParcelConfigRequest = _interopRequireDefault(require("./ParcelConfigRequest"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function createPackageRequest(input) {
  return {
    type: _RequestTracker.requestTypes.package_request,
    id: getPackageRequestId(input.bundle),
    run,
    input
  };
}
function getPackageRequestId(bundle) {
  return 'package:' + bundle.id;
}
async function canSkipPackageRequest(api, request) {
  var _await$api$getRequest;
  return api.canSkipSubrequest(request.id) && ((_await$api$getRequest = await api.getRequestResult(request.id)) === null || _await$api$getRequest === void 0 ? void 0 : _await$api$getRequest.hash) === request.input.bundleGraph.getHash(request.input.bundle);
}
async function run({
  input,
  api,
  farm
}) {
  let {
    bundleGraphReference,
    optionsRef,
    bundle,
    useMainThread
  } = input;
  let runPackage = farm.createHandle('runPackage', useMainThread);
  let start = Date.now();
  let {
    devDeps,
    invalidDevDeps
  } = await (0, _DevDepRequest.getDevDepRequests)(api);
  let {
    cachePath
  } = (0, _nullthrows().default)(await api.runRequest((0, _ParcelConfigRequest.default)()));
  let {
    devDepRequests,
    configRequests,
    bundleInfo,
    invalidations
  } = await runPackage({
    bundle,
    bundleGraphReference,
    optionsRef,
    configCachePath: cachePath,
    previousDevDeps: devDeps,
    invalidDevDeps,
    previousInvalidations: api.getInvalidations()
  });
  for (let devDepRequest of devDepRequests) {
    await (0, _DevDepRequest.runDevDepRequest)(api, devDepRequest);
  }
  for (let configRequest of configRequests) {
    await (0, _ConfigRequest.runConfigRequest)(api, configRequest);
  }
  for (let invalidation of invalidations) {
    switch (invalidation.type) {
      case 'file':
        api.invalidateOnFileUpdate(invalidation.filePath);
        api.invalidateOnFileDelete(invalidation.filePath);
        break;
      case 'env':
        api.invalidateOnEnvChange(invalidation.key);
        break;
      case 'option':
        api.invalidateOnOptionChange(invalidation.key);
        break;
      default:
        throw new Error(`Unknown invalidation type: ${invalidation.type}`);
    }
  }
  for (let info of bundleInfo) {
    // $FlowFixMe[cannot-write] time is marked read-only, but this is the exception
    info.time = Date.now() - start;
  }
  let res = {
    hash: input.bundleGraph.getHash(input.bundle),
    info: bundleInfo
  };
  api.storeResult(res);
  return res;
}