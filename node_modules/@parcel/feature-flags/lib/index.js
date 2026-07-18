"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_FEATURE_FLAGS = void 0;
exports.getFeatureFlag = getFeatureFlag;
exports.setFeatureFlags = setFeatureFlags;
// We need to do these gymnastics as we don't want flow-to-ts to touch DEFAULT_FEATURE_FLAGS,
// but we want to export FeatureFlags for Flow
const DEFAULT_FEATURE_FLAGS = exports.DEFAULT_FEATURE_FLAGS = {
  exampleFeature: false,
  useWatchmanWatcher: false
};
let featureFlagValues = {
  ...DEFAULT_FEATURE_FLAGS
};
function setFeatureFlags(flags) {
  featureFlagValues = flags;
}
function getFeatureFlag(flagName) {
  return featureFlagValues[flagName];
}