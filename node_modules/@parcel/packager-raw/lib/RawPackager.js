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
function _plugin() {
  const data = require("@parcel/plugin");
  _plugin = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = new (_plugin().Packager)({
  package({
    bundle
  }) {
    let assets = [];
    bundle.traverseAssets(asset => {
      assets.push(asset);
    });
    _assert().default.equal(assets.length, 1, 'Raw bundles must only contain one asset');
    return {
      contents: assets[0].getStream()
    };
  }
});