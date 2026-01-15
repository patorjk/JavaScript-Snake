"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = summarizeRequest;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const NODE_MODULES = `${_path().default.sep}node_modules${_path().default.sep}`;
const BUFFER_LIMIT = 5000000; // 5mb

async function summarizeRequest(fs, req) {
  let {
    content,
    size
  } = await summarizeDiskRequest(fs, req);
  let isSource = isFilePathSource(fs, req.filePath);
  return {
    content,
    size,
    isSource
  };
}
function isFilePathSource(fs, filePath) {
  return !filePath.includes(NODE_MODULES);
}
async function summarizeDiskRequest(fs, req) {
  let code = req.code;
  let content;
  let size;
  if (code == null) {
    // Get the filesize. If greater than BUFFER_LIMIT, use a stream to
    // compute the hash. In the common case, it's faster to just read the entire
    // file first and do the hash all at once without the overhead of streams.
    size = (await fs.stat(req.filePath)).size;
    if (size > BUFFER_LIMIT) {
      content = fs.createReadStream(req.filePath);
    } else {
      content = await fs.readFile(req.filePath);
    }
  } else {
    content = code;
    size = Buffer.byteLength(code);
  }
  return {
    content,
    size
  };
}