"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ResolverBase", {
  enumerable: true,
  get: function () {
    return _rust().Resolver;
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _Wrapper.default;
  }
});
Object.defineProperty(exports, "init", {
  enumerable: true,
  get: function () {
    return _rust().init;
  }
});
var _Wrapper = _interopRequireDefault(require("./Wrapper"));
function _rust() {
  const data = require("@parcel/rust");
  _rust = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }