"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig = createConfig;
var _projectPath = require("./projectPath");
var _Environment = require("./Environment");
function _rust() {
  const data = require("@parcel/rust");
  _rust = function () {
    return data;
  };
  return data;
}
function createConfig({
  plugin,
  isSource,
  searchPath,
  env,
  result,
  invalidateOnFileChange,
  invalidateOnConfigKeyChange,
  invalidateOnFileCreate,
  invalidateOnEnvChange,
  invalidateOnOptionChange,
  devDeps,
  invalidateOnStartup,
  invalidateOnBuild
}) {
  let environment = env ?? (0, _Environment.createEnvironment)();
  return {
    id: (0, _rust().hashString)(plugin + (0, _projectPath.fromProjectPathRelative)(searchPath) + environment.id + String(isSource)),
    isSource: isSource ?? false,
    searchPath,
    env: environment,
    result: result ?? null,
    cacheKey: null,
    invalidateOnFileChange: invalidateOnFileChange ?? new Set(),
    invalidateOnConfigKeyChange: invalidateOnConfigKeyChange ?? [],
    invalidateOnFileCreate: invalidateOnFileCreate ?? [],
    invalidateOnEnvChange: invalidateOnEnvChange ?? new Set(),
    invalidateOnOptionChange: invalidateOnOptionChange ?? new Set(),
    devDeps: devDeps ?? [],
    invalidateOnStartup: invalidateOnStartup ?? false,
    invalidateOnBuild: invalidateOnBuild ?? false
  };
}