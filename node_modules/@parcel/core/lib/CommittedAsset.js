"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _stream() {
  const data = require("stream");
  _stream = function () {
    return data;
  };
  return data;
}
function _sourceMap() {
  const data = _interopRequireDefault(require("@parcel/source-map"));
  _sourceMap = function () {
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
var _assetUtils = require("./assetUtils");
var _serializer = require("./serializer");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CommittedAsset {
  constructor(value, options) {
    this.value = value;
    this.key = this.value.contentKey;
    this.options = options;
  }
  getContent() {
    if (this.content == null) {
      if (this.key != null) {
        if (this.value.isLargeBlob) {
          return this.options.cache.getStream(this.key);
        } else {
          return this.options.cache.getBlob(this.key);
        }
      } else if (this.value.astKey != null) {
        return (0, _utils().streamFromPromise)((0, _assetUtils.generateFromAST)(this).then(({
          content
        }) => {
          if (!(content instanceof _stream().Readable)) {
            this.content = Promise.resolve(content);
          }
          return content;
        }));
      } else {
        throw new Error('Asset has no content');
      }
    }
    return this.content;
  }
  async getCode() {
    let content;
    if (this.content == null && this.key != null) {
      this.content = this.options.cache.getBlob(this.key);
      content = await this.content;
    } else {
      content = await this.getContent();
    }
    if (typeof content === 'string' || content instanceof Buffer) {
      return content.toString();
    } else if (content != null) {
      this.content = (0, _utils().bufferStream)(content);
      return (await this.content).toString();
    }
    return '';
  }
  async getBuffer() {
    let content = await this.getContent();
    if (content == null) {
      return Buffer.alloc(0);
    } else if (typeof content === 'string' || content instanceof Buffer) {
      return Buffer.from(content);
    }
    this.content = (0, _utils().bufferStream)(content);
    return this.content;
  }
  getStream() {
    let content = this.getContent();
    return content instanceof Promise ? (0, _utils().streamFromPromise)(content) : (0, _utils().blobToStream)(content);
  }
  getMapBuffer() {
    let mapKey = this.value.mapKey;
    if (mapKey != null && this.mapBuffer == null) {
      this.mapBuffer = (async () => {
        try {
          return await this.options.cache.getBlob(mapKey);
        } catch (err) {
          if (err.code === 'ENOENT' && this.value.astKey != null) {
            var _await$generateFromAS;
            return (_await$generateFromAS = (await (0, _assetUtils.generateFromAST)(this)).map) === null || _await$generateFromAS === void 0 ? void 0 : _await$generateFromAS.toBuffer();
          } else {
            throw err;
          }
        }
      })();
    }
    return this.mapBuffer ?? Promise.resolve();
  }
  getMap() {
    if (this.map == null) {
      this.map = (async () => {
        let mapBuffer = await this.getMapBuffer();
        if (mapBuffer) {
          // Get sourcemap from flatbuffer
          return new (_sourceMap().default)(this.options.projectRoot, mapBuffer);
        }
      })();
    }
    return this.map;
  }
  getAST() {
    if (this.value.astKey == null) {
      return Promise.resolve(null);
    }
    if (this.ast == null) {
      this.ast = this.options.cache.getBlob(this.value.astKey).then(serializedAst => (0, _serializer.deserializeRaw)(serializedAst));
    }
    return this.ast;
  }
  getDependencies() {
    return Array.from(this.value.dependencies.values());
  }
}
exports.default = CommittedAsset;