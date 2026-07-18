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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = new (_plugin().Transformer)({
  async transform({
    asset
  }) {
    asset.bundleBehavior = 'isolated';
    let res = (0, _rust().transformSvg)({
      code: await asset.getBuffer(),
      filePath: asset.filePath,
      xml: true,
      env: (0, _rust().envToRust)(asset.env),
      hmr: false
    });
    if (res.errors.length) {
      throw new (_diagnostic().default)({
        diagnostic: res.errors
      });
    }
    asset.setBuffer(res.code);
    let assets = [asset];
    for (let dep of res.dependencies) {
      asset.addDependency((0, _rust().dependencyFromRust)(dep));
    }
    for (let a of res.assets) {
      assets.push((0, _rust().assetFromRust)(a));
    }
    return assets;
  }
});