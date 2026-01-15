var $cMIoD$path = require("path");
var $cMIoD$stream = require("stream");
var $cMIoD$util = require("util");
var $cMIoD$buffer = require("buffer");
var $cMIoD$parcelcore = require("@parcel/core");
var $cMIoD$parcelutils = require("@parcel/utils");
var $cMIoD$parcelworkers = require("@parcel/workers");
var $cMIoD$events = require("events");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ncp", () => $e18f1454af2d5014$export$d3a8044e3fef7335);



var $566955ba7ab9a622$exports = {};

$parcel$export($566955ba7ab9a622$exports, "NodeFS", () => $566955ba7ab9a622$export$c4e0ef2ab73c21e7);
// $FlowFixMe[prop-missing] handled by the throwing constructor
class $566955ba7ab9a622$export$c4e0ef2ab73c21e7 {
    constructor(){
        throw new Error("NodeFS isn't available in the browser");
    }
}


var $10056bd3888f2e36$exports = {};

$parcel$export($10056bd3888f2e36$exports, "MemoryFS", () => $10056bd3888f2e36$export$3048eb7ec07c2c4e);
$parcel$export($10056bd3888f2e36$exports, "FSError", () => $10056bd3888f2e36$export$d414276624ebf134);
$parcel$export($10056bd3888f2e36$exports, "makeShared", () => $10056bd3888f2e36$export$df9eb3e75aa27a22);
$parcel$export($10056bd3888f2e36$exports, "File", () => $10056bd3888f2e36$export$b6afa8811b7e644e);




var $0f06d01047d305ef$exports = {};
$0f06d01047d305ef$exports = JSON.parse("{\"name\":\"@parcel/fs\",\"version\":\"2.13.3\",\"description\":\"Blazing fast, zero configuration web application bundler\",\"license\":\"MIT\",\"publishConfig\":{\"access\":\"public\"},\"funding\":{\"type\":\"opencollective\",\"url\":\"https://opencollective.com/parcel\"},\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/parcel-bundler/parcel.git\"},\"main\":\"lib/index.js\",\"source\":\"src/index.js\",\"types\":\"index.d.ts\",\"engines\":{\"node\":\">= 16.0.0\"},\"targets\":{\"types\":false,\"main\":{\"includeNodeModules\":{\"@parcel/core\":false,\"@parcel/feature-flags\":false,\"@parcel/rust\":false,\"@parcel/types-internal\":false,\"@parcel/utils\":false,\"@parcel/watcher\":false,\"@parcel/watcher-watchman-js\":false,\"@parcel/workers\":false}},\"browser\":{\"includeNodeModules\":{\"@parcel/core\":false,\"@parcel/feature-flags\":false,\"@parcel/rust\":false,\"@parcel/types-internal\":false,\"@parcel/utils\":false,\"@parcel/watcher\":false,\"@parcel/watcher-watchman-js\":false,\"@parcel/workers\":false}}},\"scripts\":{\"build-ts\":\"mkdir -p lib && flow-to-ts src/types.js > lib/types.d.ts\",\"check-ts\":\"tsc --noEmit index.d.ts\"},\"dependencies\":{\"@parcel/feature-flags\":\"2.13.3\",\"@parcel/rust\":\"2.13.3\",\"@parcel/types-internal\":\"2.13.3\",\"@parcel/utils\":\"2.13.3\",\"@parcel/watcher\":\"^2.0.7\",\"@parcel/workers\":\"2.13.3\"},\"devDependencies\":{\"@parcel/watcher-watchman-js\":\"2.13.3\",\"graceful-fs\":\"^4.2.4\",\"ncp\":\"^2.0.0\",\"nullthrows\":\"^1.1.1\",\"utility-types\":\"^3.10.0\"},\"peerDependencies\":{\"@parcel/core\":\"^2.13.3\"},\"browser\":{\"@parcel/fs\":\"./lib/browser.js\",\"./src/NodeFS.js\":\"./src/NodeFS.browser.js\"},\"gitHead\":\"d19b1f6bdb05eb5a3085f44daae15c0fe2709ab9\"}");



var $691ae7d5d88e1ccc$exports = {};
'use strict';
function $691ae7d5d88e1ccc$var$nullthrows(x, message) {
    if (x != null) return x;
    var error = new Error(message !== undefined ? message : 'Got unexpected ' + x);
    error.framesToPop = 1; // Skip nullthrows's own stack frame.
    throw error;
}
$691ae7d5d88e1ccc$exports = $691ae7d5d88e1ccc$var$nullthrows;
$691ae7d5d88e1ccc$exports.default = $691ae7d5d88e1ccc$var$nullthrows;
Object.defineProperty($691ae7d5d88e1ccc$exports, '__esModule', {
    value: true
});




function $b6d5b6d97d1d883c$export$4c6d088a7d7f9947(fs, moduleName, dir) {
    let { root: root } = (0, ($parcel$interopDefault($cMIoD$path))).parse(dir);
    while(dir !== root){
        // Skip node_modules directories
        if ((0, ($parcel$interopDefault($cMIoD$path))).basename(dir) === 'node_modules') dir = (0, ($parcel$interopDefault($cMIoD$path))).dirname(dir);
        try {
            let moduleDir = (0, ($parcel$interopDefault($cMIoD$path))).join(dir, 'node_modules', moduleName);
            let stats = fs.statSync(moduleDir);
            if (stats.isDirectory()) return moduleDir;
        } catch (err) {
        // ignore
        }
        // Move up a directory
        dir = (0, ($parcel$interopDefault($cMIoD$path))).dirname(dir);
    }
    return null;
}
function $b6d5b6d97d1d883c$export$d51a93c758976388(fs, fileNames, dir, root) {
    let { root: pathRoot } = (0, ($parcel$interopDefault($cMIoD$path))).parse(dir);
    // eslint-disable-next-line no-constant-condition
    while(true){
        if ((0, ($parcel$interopDefault($cMIoD$path))).basename(dir) === 'node_modules') return null;
        for (const fileName of fileNames){
            let filePath = (0, ($parcel$interopDefault($cMIoD$path))).join(dir, fileName);
            try {
                if (fs.statSync(filePath).isFile()) return filePath;
            } catch (err) {
            // ignore
            }
        }
        if (dir === root || dir === pathRoot) break;
        dir = (0, ($parcel$interopDefault($cMIoD$path))).dirname(dir);
    }
    return null;
}
function $b6d5b6d97d1d883c$export$64df6e3182fd5b2d(fs, filePaths) {
    for (let filePath of filePaths)try {
        if (fs.statSync(filePath).isFile()) return filePath;
    } catch (err) {
    // ignore
    }
}



var $10056bd3888f2e36$require$Buffer = $cMIoD$buffer.Buffer;
const $10056bd3888f2e36$var$instances = new Map();
let $10056bd3888f2e36$var$id = 0;
class $10056bd3888f2e36$export$3048eb7ec07c2c4e {
    _numWorkerInstances = 0;
    _workerRegisterResolves = [];
    _emitter = new (0, ($parcel$interopDefault($cMIoD$events)))();
    constructor(workerFarm){
        this.farm = workerFarm;
        this._cwd = (0, ($parcel$interopDefault($cMIoD$path))).resolve((0, ($parcel$interopDefault($cMIoD$path))).sep);
        this.dirs = new Map([
            [
                this._cwd,
                new $10056bd3888f2e36$var$Directory()
            ]
        ]);
        this.files = new Map();
        this.symlinks = new Map();
        this.watchers = new Map();
        this.events = [];
        this.id = $10056bd3888f2e36$var$id++;
        this._workerHandles = [];
        this._eventQueue = [];
        $10056bd3888f2e36$var$instances.set(this.id, this);
        this._emitter.on('allWorkersRegistered', ()=>{
            for (let resolve of this._workerRegisterResolves)resolve();
            this._workerRegisterResolves = [];
        });
    }
    static deserialize(opts) {
        let existing = $10056bd3888f2e36$var$instances.get(opts.id);
        if (existing != null) {
            // Correct the count of worker instances since serialization assumes a new instance is created
            (0, ($parcel$interopDefault($cMIoD$parcelworkers))).getWorkerApi().runHandle(opts.handle, [
                'decrementWorkerInstance',
                []
            ]);
            return existing;
        }
        let fs = new $10056bd3888f2e36$var$WorkerFS(opts.id, (0, (/*@__PURE__*/$parcel$interopDefault($691ae7d5d88e1ccc$exports)))(opts.handle));
        fs.dirs = opts.dirs;
        fs.files = opts.files;
        fs.symlinks = opts.symlinks;
        return fs;
    }
    serialize() {
        if (!this.handle) this.handle = this.farm.createReverseHandle((fn, args)=>{
            // $FlowFixMe
            return this[fn](...args);
        });
        // If a worker instance already exists, it will decrement this number
        this._numWorkerInstances++;
        return {
            $$raw: false,
            id: this.id,
            handle: this.handle,
            dirs: this.dirs,
            files: this.files,
            symlinks: this.symlinks
        };
    }
    decrementWorkerInstance() {
        this._numWorkerInstances--;
        if (this._numWorkerInstances === this._workerHandles.length) this._emitter.emit('allWorkersRegistered');
    }
    cwd() {
        return this._cwd;
    }
    chdir(dir) {
        this._cwd = dir;
    }
    _normalizePath(filePath, realpath = true) {
        filePath = (0, ($parcel$interopDefault($cMIoD$path))).normalize(filePath);
        if (!filePath.startsWith(this.cwd())) filePath = (0, ($parcel$interopDefault($cMIoD$path))).resolve(this.cwd(), filePath);
        // get realpath by following symlinks
        let { root: root, dir: dir, base: base } = (0, ($parcel$interopDefault($cMIoD$path))).parse(filePath);
        let parts = dir.slice(root.length).split((0, ($parcel$interopDefault($cMIoD$path))).sep).concat(base);
        // If the realpath option is not true, don't follow the final link
        let last;
        if (!realpath) {
            last = parts[parts.length - 1];
            parts = parts.slice(0, -1);
        }
        let res = root;
        for (let part of parts){
            res = (0, ($parcel$interopDefault($cMIoD$path))).join(res, part);
            let symlink = this.symlinks.get(res);
            if (symlink) res = symlink;
        }
        if (last) res = (0, ($parcel$interopDefault($cMIoD$path))).join(res, last);
        return res;
    }
    async writeFile(filePath, contents, options) {
        filePath = this._normalizePath(filePath);
        if (this.dirs.has(filePath)) throw new $10056bd3888f2e36$export$d414276624ebf134('EISDIR', filePath, 'is a directory');
        let dir = (0, ($parcel$interopDefault($cMIoD$path))).dirname(filePath);
        if (!this.dirs.has(dir)) throw new $10056bd3888f2e36$export$d414276624ebf134('ENOENT', dir, 'does not exist');
        let buffer = $10056bd3888f2e36$export$df9eb3e75aa27a22(contents);
        let file = this.files.get(filePath);
        let mode = options && options.mode || 438;
        if (file) {
            file.write(buffer, mode);
            this.files.set(filePath, file);
        } else this.files.set(filePath, new $10056bd3888f2e36$export$b6afa8811b7e644e(buffer, mode));
        await this._sendWorkerEvent({
            type: 'writeFile',
            path: filePath,
            entry: this.files.get(filePath)
        });
        this._triggerEvent({
            type: file ? 'update' : 'create',
            path: filePath
        });
    }
    // eslint-disable-next-line require-await
    async readFile(filePath, encoding) {
        return this.readFileSync(filePath, encoding);
    }
    readFileSync(filePath, encoding) {
        filePath = this._normalizePath(filePath);
        let file = this.files.get(filePath);
        if (file == null) throw new $10056bd3888f2e36$export$d414276624ebf134('ENOENT', filePath, 'does not exist');
        let buffer = file.read();
        if (encoding) return buffer.toString(encoding);
        return buffer;
    }
    async copyFile(source, destination) {
        let contents = await this.readFile(source);
        await this.writeFile(destination, contents);
    }
    statSync(filePath) {
        filePath = this._normalizePath(filePath);
        let dir = this.dirs.get(filePath);
        if (dir) return dir.stat();
        let file = this.files.get(filePath);
        if (file == null) throw new $10056bd3888f2e36$export$d414276624ebf134('ENOENT', filePath, 'does not exist');
        return file.stat();
    }
    // eslint-disable-next-line require-await
    async stat(filePath) {
        return this.statSync(filePath);
    }
    lstatSync(filePath) {
        filePath = this._normalizePath(filePath, false);
        if (this.symlinks.has(filePath)) {
            let stat = new $10056bd3888f2e36$var$Stat();
            stat.mode = $10056bd3888f2e36$var$S_IFLNK;
            return stat;
        }
        let dir = this.dirs.get(filePath);
        if (dir) return dir.stat();
        let file = this.files.get(filePath);
        if (file == null) throw new $10056bd3888f2e36$export$d414276624ebf134('ENOENT', filePath, 'does not exist');
        return file.stat();
    }
    // eslint-disable-next-line require-await
    async lstat(filePath) {
        return this.lstatSync(filePath);
    }
    readdirSync(dir, opts) {
        dir = this._normalizePath(dir);
        if (!this.dirs.has(dir)) throw new $10056bd3888f2e36$export$d414276624ebf134('ENOENT', dir, 'does not exist');
        if (!dir.endsWith((0, ($parcel$interopDefault($cMIoD$path))).sep)) dir += (0, ($parcel$interopDefault($cMIoD$path))).sep;
        let res = [];
        for (let [filePath, entry] of this.dirs){
            if (filePath === dir) continue;
            if (filePath.startsWith(dir) && filePath.indexOf((0, ($parcel$interopDefault($cMIoD$path))).sep, dir.length) === -1) {
                let name = filePath.slice(dir.length);
                if (opts?.withFileTypes) res.push(new $10056bd3888f2e36$var$Dirent(name, entry));
                else res.push(name);
            }
        }
        for (let [filePath, entry] of this.files)if (filePath.startsWith(dir) && filePath.indexOf((0, ($parcel$interopDefault($cMIoD$path))).sep, dir.length) === -1) {
            let name = filePath.slice(dir.length);
            if (opts?.withFileTypes) res.push(new $10056bd3888f2e36$var$Dirent(name, entry));
            else res.push(name);
        }
        for (let [from] of this.symlinks)if (from.startsWith(dir) && from.indexOf((0, ($parcel$interopDefault($cMIoD$path))).sep, dir.length) === -1) {
            let name = from.slice(dir.length);
            if (opts?.withFileTypes) res.push(new $10056bd3888f2e36$var$Dirent(name, {
                mode: $10056bd3888f2e36$var$S_IFLNK
            }));
            else res.push(name);
        }
        return res;
    }
    // eslint-disable-next-line require-await
    async readdir(dir, opts) {
        return this.readdirSync(dir, opts);
    }
    async unlink(filePath) {
        filePath = this._normalizePath(filePath);
        if (!this.files.has(filePath) && !this.dirs.has(filePath)) throw new $10056bd3888f2e36$export$d414276624ebf134('ENOENT', filePath, 'does not exist');
        this.files.delete(filePath);
        this.dirs.delete(filePath);
        this.watchers.delete(filePath);
        await this._sendWorkerEvent({
            type: 'unlink',
            path: filePath
        });
        this._triggerEvent({
            type: 'delete',
            path: filePath
        });
        return Promise.resolve();
    }
    async mkdirp(dir) {
        dir = this._normalizePath(dir);
        if (this.dirs.has(dir)) return Promise.resolve();
        if (this.files.has(dir)) throw new $10056bd3888f2e36$export$d414276624ebf134('ENOENT', dir, 'is not a directory');
        let root = (0, ($parcel$interopDefault($cMIoD$path))).parse(dir).root;
        while(dir !== root){
            if (this.dirs.has(dir)) break;
            this.dirs.set(dir, new $10056bd3888f2e36$var$Directory());
            await this._sendWorkerEvent({
                type: 'mkdir',
                path: dir
            });
            this._triggerEvent({
                type: 'create',
                path: dir
            });
            dir = (0, ($parcel$interopDefault($cMIoD$path))).dirname(dir);
        }
        return Promise.resolve();
    }
    async rimraf(filePath) {
        filePath = this._normalizePath(filePath);
        if (this.dirs.has(filePath)) {
            let dir = filePath + (0, ($parcel$interopDefault($cMIoD$path))).sep;
            for (let filePath of this.files.keys())if (filePath.startsWith(dir)) {
                this.files.delete(filePath);
                await this._sendWorkerEvent({
                    type: 'unlink',
                    path: filePath
                });
                this._triggerEvent({
                    type: 'delete',
                    path: filePath
                });
            }
            for (let dirPath of this.dirs.keys())if (dirPath.startsWith(dir)) {
                this.dirs.delete(dirPath);
                this.watchers.delete(dirPath);
                await this._sendWorkerEvent({
                    type: 'unlink',
                    path: filePath
                });
                this._triggerEvent({
                    type: 'delete',
                    path: dirPath
                });
            }
            for (let filePath of this.symlinks.keys())if (filePath.startsWith(dir)) {
                this.symlinks.delete(filePath);
                await this._sendWorkerEvent({
                    type: 'unlink',
                    path: filePath
                });
            }
            this.dirs.delete(filePath);
            await this._sendWorkerEvent({
                type: 'unlink',
                path: filePath
            });
            this._triggerEvent({
                type: 'delete',
                path: filePath
            });
        } else if (this.files.has(filePath)) {
            this.files.delete(filePath);
            await this._sendWorkerEvent({
                type: 'unlink',
                path: filePath
            });
            this._triggerEvent({
                type: 'delete',
                path: filePath
            });
        }
        return Promise.resolve();
    }
    async ncp(source, destination) {
        source = this._normalizePath(source);
        if (this.dirs.has(source)) {
            if (!this.dirs.has(destination)) {
                this.dirs.set(destination, new $10056bd3888f2e36$var$Directory());
                await this._sendWorkerEvent({
                    type: 'mkdir',
                    path: destination
                });
                this._triggerEvent({
                    type: 'create',
                    path: destination
                });
            }
            let dir = source + (0, ($parcel$interopDefault($cMIoD$path))).sep;
            for (let dirPath of this.dirs.keys())if (dirPath.startsWith(dir)) {
                let destName = (0, ($parcel$interopDefault($cMIoD$path))).join(destination, dirPath.slice(dir.length));
                if (!this.dirs.has(destName)) {
                    this.dirs.set(destName, new $10056bd3888f2e36$var$Directory());
                    await this._sendWorkerEvent({
                        type: 'mkdir',
                        path: destination
                    });
                    this._triggerEvent({
                        type: 'create',
                        path: destName
                    });
                }
            }
            for (let [filePath, file] of this.files)if (filePath.startsWith(dir)) {
                let destName = (0, ($parcel$interopDefault($cMIoD$path))).join(destination, filePath.slice(dir.length));
                let exists = this.files.has(destName);
                this.files.set(destName, file);
                await this._sendWorkerEvent({
                    type: 'writeFile',
                    path: destName,
                    entry: file
                });
                this._triggerEvent({
                    type: exists ? 'update' : 'create',
                    path: destName
                });
            }
        } else await this.copyFile(source, destination);
    }
    createReadStream(filePath) {
        return new $10056bd3888f2e36$var$ReadStream(this, filePath);
    }
    createWriteStream(filePath, options) {
        return new $10056bd3888f2e36$var$WriteStream(this, filePath, options);
    }
    realpathSync(filePath) {
        return this._normalizePath(filePath);
    }
    // eslint-disable-next-line require-await
    async realpath(filePath) {
        return this.realpathSync(filePath);
    }
    readlinkSync(filePath) {
        let symlink = this.symlinks.get(filePath);
        if (!symlink) throw new $10056bd3888f2e36$export$d414276624ebf134('EINVAL', filePath, 'is not a symlink');
        return symlink;
    }
    // eslint-disable-next-line require-await
    async readlink(filePath) {
        return this.readlinkSync(filePath);
    }
    async symlink(target, path) {
        target = this._normalizePath(target);
        path = this._normalizePath(path);
        this.symlinks.set(path, target);
        await this._sendWorkerEvent({
            type: 'symlink',
            path: path,
            target: target
        });
    }
    existsSync(filePath) {
        filePath = this._normalizePath(filePath);
        return this.files.has(filePath) || this.dirs.has(filePath);
    }
    // eslint-disable-next-line require-await
    async exists(filePath) {
        return this.existsSync(filePath);
    }
    _triggerEvent(event) {
        this.events.push(event);
        if (this.watchers.size === 0) return;
        // Batch events
        this._eventQueue.push(event);
        clearTimeout(this._watcherTimer);
        this._watcherTimer = setTimeout(()=>{
            let events = this._eventQueue;
            this._eventQueue = [];
            for (let [dir, watchers] of this.watchers){
                if (!dir.endsWith((0, ($parcel$interopDefault($cMIoD$path))).sep)) dir += (0, ($parcel$interopDefault($cMIoD$path))).sep;
                if (event.path.startsWith(dir)) for (let watcher of watchers)watcher.trigger(events);
            }
        }, 50);
    }
    _registerWorker(handle) {
        this._workerHandles.push(handle);
        if (this._numWorkerInstances === this._workerHandles.length) this._emitter.emit('allWorkersRegistered');
    }
    async _sendWorkerEvent(event) {
        // Wait for worker instances to register their handles
        while(this._workerHandles.length < this._numWorkerInstances)await new Promise((resolve)=>this._workerRegisterResolves.push(resolve));
        await Promise.all(this._workerHandles.map((workerHandle)=>this.farm.workerApi.runHandle(workerHandle, [
                event
            ])));
    }
    watch(dir, fn, opts) {
        dir = this._normalizePath(dir);
        let watcher = new $10056bd3888f2e36$var$Watcher(fn, opts);
        let watchers = this.watchers.get(dir);
        if (!watchers) {
            watchers = new Set();
            this.watchers.set(dir, watchers);
        }
        watchers.add(watcher);
        return Promise.resolve({
            unsubscribe: ()=>{
                watchers = (0, (/*@__PURE__*/$parcel$interopDefault($691ae7d5d88e1ccc$exports)))(watchers);
                watchers.delete(watcher);
                if (watchers.size === 0) this.watchers.delete(dir);
                return Promise.resolve();
            }
        });
    }
    async getEventsSince(dir, snapshot, opts) {
        let contents = await this.readFile(snapshot, 'utf8');
        let len = Number(contents);
        let events = this.events.slice(len);
        let ignore = opts.ignore;
        if (ignore) events = events.filter((event)=>!ignore.some((i)=>event.path.startsWith(i + (0, ($parcel$interopDefault($cMIoD$path))).sep)));
        return events;
    }
    async writeSnapshot(dir, snapshot) {
        await this.writeFile(snapshot, '' + this.events.length);
    }
    findAncestorFile(fileNames, fromDir, root) {
        return (0, $b6d5b6d97d1d883c$export$d51a93c758976388)(this, fileNames, fromDir, root);
    }
    findNodeModule(moduleName, fromDir) {
        return (0, $b6d5b6d97d1d883c$export$4c6d088a7d7f9947)(this, moduleName, fromDir);
    }
    findFirstFile(filePaths) {
        return (0, $b6d5b6d97d1d883c$export$64df6e3182fd5b2d)(this, filePaths);
    }
}
class $10056bd3888f2e36$var$Watcher {
    constructor(fn, options){
        this.fn = fn;
        this.options = options;
    }
    trigger(events) {
        let ignore = this.options.ignore;
        if (ignore) events = events.filter((event)=>!ignore.some((i)=>event.path.startsWith(i + (0, ($parcel$interopDefault($cMIoD$path))).sep)));
        if (events.length > 0) this.fn(null, events);
    }
}
class $10056bd3888f2e36$export$d414276624ebf134 extends Error {
    constructor(code, path, message){
        super(`${code}: ${path} ${message}`);
        this.name = 'FSError';
        this.code = code;
        this.path = path;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class $10056bd3888f2e36$var$ReadStream extends (0, $cMIoD$stream.Readable) {
    constructor(fs, filePath){
        super();
        this.fs = fs;
        this.filePath = filePath;
        this.reading = false;
        this.bytesRead = 0;
    }
    _read() {
        if (this.reading) return;
        this.reading = true;
        this.fs.readFile(this.filePath).then((res)=>{
            this.bytesRead += res.byteLength;
            this.push(res);
            this.push(null);
        }, (err)=>{
            this.emit('error', err);
        });
    }
}
class $10056bd3888f2e36$var$WriteStream extends (0, $cMIoD$stream.Writable) {
    constructor(fs, filePath, options){
        super({
            emitClose: true,
            autoDestroy: true
        });
        this.fs = fs;
        this.filePath = filePath;
        this.options = options;
        this.buffer = $10056bd3888f2e36$require$Buffer.alloc(0);
    }
    _write(chunk, encoding, callback) {
        let c = typeof chunk === 'string' ? $10056bd3888f2e36$require$Buffer.from(chunk, encoding) : chunk;
        this.buffer = $10056bd3888f2e36$require$Buffer.concat([
            this.buffer,
            c
        ]);
        callback();
    }
    _final(callback) {
        this.fs.writeFile(this.filePath, this.buffer, this.options).then(callback).catch(callback);
    }
}
const $10056bd3888f2e36$var$S_IFREG = 32768;
const $10056bd3888f2e36$var$S_IFDIR = 16384;
const $10056bd3888f2e36$var$S_IFLNK = 40960;
const $10056bd3888f2e36$var$S_IFMT = 61440;
class $10056bd3888f2e36$var$Entry {
    constructor(mode){
        this.mode = mode;
        let now = Date.now();
        this.atime = now;
        this.mtime = now;
        this.ctime = now;
        this.birthtime = now;
    }
    access() {
        let now = Date.now();
        this.atime = now;
        this.ctime = now;
    }
    modify(mode) {
        let now = Date.now();
        this.mtime = now;
        this.ctime = now;
        this.mode = mode;
    }
    getSize() {
        return 0;
    }
    stat() {
        return $10056bd3888f2e36$var$Stat.fromEntry(this);
    }
}
class $10056bd3888f2e36$var$Stat {
    dev = 0;
    ino = 0;
    mode = 0;
    nlink = 0;
    uid = 0;
    gid = 0;
    rdev = 0;
    size = 0;
    blksize = 0;
    blocks = 0;
    atimeMs = 0;
    mtimeMs = 0;
    ctimeMs = 0;
    birthtimeMs = 0;
    atime = new Date();
    mtime = new Date();
    ctime = new Date();
    birthtime = new Date();
    static fromEntry(entry) {
        let stat = new $10056bd3888f2e36$var$Stat();
        stat.mode = entry.mode;
        stat.size = entry.getSize();
        stat.atimeMs = entry.atime;
        stat.mtimeMs = entry.mtime;
        stat.ctimeMs = entry.ctime;
        stat.birthtimeMs = entry.birthtime;
        stat.atime = new Date(entry.atime);
        stat.mtime = new Date(entry.mtime);
        stat.ctime = new Date(entry.ctime);
        stat.birthtime = new Date(entry.birthtime);
        return stat;
    }
    isFile() {
        return (this.mode & $10056bd3888f2e36$var$S_IFREG) === $10056bd3888f2e36$var$S_IFREG;
    }
    isDirectory() {
        return (this.mode & $10056bd3888f2e36$var$S_IFDIR) === $10056bd3888f2e36$var$S_IFDIR;
    }
    isBlockDevice() {
        return false;
    }
    isCharacterDevice() {
        return false;
    }
    isSymbolicLink() {
        return (this.mode & $10056bd3888f2e36$var$S_IFMT) === $10056bd3888f2e36$var$S_IFLNK;
    }
    isFIFO() {
        return false;
    }
    isSocket() {
        return false;
    }
}
class $10056bd3888f2e36$var$Dirent {
    #mode;
    constructor(name, entry){
        this.name = name;
        this.#mode = entry.mode;
    }
    isFile() {
        return (this.#mode & $10056bd3888f2e36$var$S_IFMT) === $10056bd3888f2e36$var$S_IFREG;
    }
    isDirectory() {
        return (this.#mode & $10056bd3888f2e36$var$S_IFMT) === $10056bd3888f2e36$var$S_IFDIR;
    }
    isBlockDevice() {
        return false;
    }
    isCharacterDevice() {
        return false;
    }
    isSymbolicLink() {
        return (this.#mode & $10056bd3888f2e36$var$S_IFMT) === $10056bd3888f2e36$var$S_IFLNK;
    }
    isFIFO() {
        return false;
    }
    isSocket() {
        return false;
    }
}
class $10056bd3888f2e36$export$b6afa8811b7e644e extends $10056bd3888f2e36$var$Entry {
    constructor(buffer, mode){
        super($10056bd3888f2e36$var$S_IFREG | mode);
        this.buffer = buffer;
    }
    read() {
        super.access();
        return $10056bd3888f2e36$require$Buffer.from(this.buffer);
    }
    write(buffer, mode) {
        super.modify($10056bd3888f2e36$var$S_IFREG | mode);
        this.buffer = buffer;
    }
    getSize() {
        return this.buffer.byteLength;
    }
}
class $10056bd3888f2e36$var$Directory extends $10056bd3888f2e36$var$Entry {
    constructor(){
        super($10056bd3888f2e36$var$S_IFDIR);
    }
}
function $10056bd3888f2e36$export$df9eb3e75aa27a22(contents) {
    if (typeof contents !== 'string' && contents.buffer instanceof (0, $cMIoD$parcelutils.SharedBuffer)) return contents;
    let contentsBuffer = contents;
    // For the polyfilled buffer module, it's faster to always convert once so that the subsequent
    // operations are fast (.byteLength and using .set instead of .write)
    contentsBuffer = contentsBuffer instanceof $10056bd3888f2e36$require$Buffer ? contentsBuffer : $10056bd3888f2e36$require$Buffer.from(contentsBuffer);
    let length = $10056bd3888f2e36$require$Buffer.byteLength(contentsBuffer);
    let shared = new (0, $cMIoD$parcelutils.SharedBuffer)(length);
    let buffer = $10056bd3888f2e36$require$Buffer.from(shared);
    if (length > 0) {
        if (typeof contentsBuffer === 'string') buffer.write(contentsBuffer);
        else buffer.set(contentsBuffer);
    }
    return buffer;
}
class $10056bd3888f2e36$var$WorkerFS extends $10056bd3888f2e36$export$3048eb7ec07c2c4e {
    constructor(id, handle){
        // TODO Make this not a subclass
        // $FlowFixMe
        super();
        this.id = id;
        this.handleFn = (methodName, args)=>(0, ($parcel$interopDefault($cMIoD$parcelworkers))).getWorkerApi().runHandle(handle, [
                methodName,
                args
            ]);
        this.handleFn('_registerWorker', [
            (0, ($parcel$interopDefault($cMIoD$parcelworkers))).getWorkerApi().createReverseHandle((event)=>{
                switch(event.type){
                    case 'writeFile':
                        this.files.set(event.path, event.entry);
                        break;
                    case 'unlink':
                        this.files.delete(event.path);
                        this.dirs.delete(event.path);
                        this.symlinks.delete(event.path);
                        break;
                    case 'mkdir':
                        this.dirs.set(event.path, new $10056bd3888f2e36$var$Directory());
                        break;
                    case 'symlink':
                        this.symlinks.set(event.path, event.target);
                        break;
                }
            })
        ]);
    }
    static deserialize(opts) {
        return (0, (/*@__PURE__*/$parcel$interopDefault($691ae7d5d88e1ccc$exports)))($10056bd3888f2e36$var$instances.get(opts.id));
    }
    serialize() {
        // $FlowFixMe
        return {
            id: this.id
        };
    }
    writeFile(filePath, contents, options) {
        super.writeFile(filePath, contents, options);
        let buffer = $10056bd3888f2e36$export$df9eb3e75aa27a22(contents);
        return this.handleFn('writeFile', [
            filePath,
            buffer,
            options
        ]);
    }
    unlink(filePath) {
        super.unlink(filePath);
        return this.handleFn('unlink', [
            filePath
        ]);
    }
    mkdirp(dir) {
        super.mkdirp(dir);
        return this.handleFn('mkdirp', [
            dir
        ]);
    }
    rimraf(filePath) {
        super.rimraf(filePath);
        return this.handleFn('rimraf', [
            filePath
        ]);
    }
    ncp(source, destination) {
        super.ncp(source, destination);
        return this.handleFn('ncp', [
            source,
            destination
        ]);
    }
    symlink(target, path) {
        super.symlink(target, path);
        return this.handleFn('symlink', [
            target,
            path
        ]);
    }
}
(0, $cMIoD$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($0f06d01047d305ef$exports))).version}:MemoryFS`, $10056bd3888f2e36$export$3048eb7ec07c2c4e);
(0, $cMIoD$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($0f06d01047d305ef$exports))).version}:WorkerFS`, $10056bd3888f2e36$var$WorkerFS);
(0, $cMIoD$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($0f06d01047d305ef$exports))).version}:Stat`, $10056bd3888f2e36$var$Stat);
(0, $cMIoD$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($0f06d01047d305ef$exports))).version}:File`, $10056bd3888f2e36$export$b6afa8811b7e644e);
(0, $cMIoD$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($0f06d01047d305ef$exports))).version}:Directory`, $10056bd3888f2e36$var$Directory);


var $8a88e5b8e7418190$exports = {};

$parcel$export($8a88e5b8e7418190$exports, "OverlayFS", () => $8a88e5b8e7418190$export$5963299e2424ca1c);







class $8a88e5b8e7418190$export$5963299e2424ca1c {
    deleted = new Set();
    constructor(workerFarmOrFS, readable){
        if (workerFarmOrFS instanceof (0, ($parcel$interopDefault($cMIoD$parcelworkers)))) this.writable = new (0, $10056bd3888f2e36$export$3048eb7ec07c2c4e)(workerFarmOrFS);
        else this.writable = workerFarmOrFS;
        this.readable = readable;
        this._cwd = readable.cwd();
    }
    static deserialize(opts) {
        let fs = new $8a88e5b8e7418190$export$5963299e2424ca1c(opts.writable, opts.readable);
        if (opts.deleted != null) fs.deleted = opts.deleted;
        return fs;
    }
    serialize() {
        return {
            $$raw: false,
            writable: this.writable,
            readable: this.readable,
            deleted: this.deleted
        };
    }
    _deletedThrows(filePath) {
        filePath = this._normalizePath(filePath);
        if (this.deleted.has(filePath)) throw new $8a88e5b8e7418190$var$FSError('ENOENT', filePath, 'does not exist');
        return filePath;
    }
    _checkExists(filePath) {
        filePath = this._deletedThrows(filePath);
        if (!this.existsSync(filePath)) throw new $8a88e5b8e7418190$var$FSError('ENOENT', filePath, 'does not exist');
        return filePath;
    }
    _isSymlink(filePath) {
        filePath = this._normalizePath(filePath);
        // Check the parts of the path to see if any are symlinks.
        let { root: root, dir: dir, base: base } = (0, ($parcel$interopDefault($cMIoD$path))).parse(filePath);
        let segments = dir.slice(root.length).split((0, ($parcel$interopDefault($cMIoD$path))).sep).concat(base);
        while(segments.length){
            filePath = (0, ($parcel$interopDefault($cMIoD$path))).join(root, ...segments);
            let name = segments.pop();
            if (this.deleted.has(filePath)) return false;
            else if (this.writable instanceof (0, $10056bd3888f2e36$export$3048eb7ec07c2c4e) && this.writable.symlinks.has(filePath)) return true;
            else {
                // HACK: Parcel fs does not provide `lstatSync`,
                // so we use `readdirSync` to check if the path is a symlink.
                let parent = (0, ($parcel$interopDefault($cMIoD$path))).resolve(filePath, '..');
                if (parent === filePath) return false;
                try {
                    for (let dirent of this.readdirSync(parent, {
                        withFileTypes: true
                    })){
                        if (typeof dirent === 'string') break; // {withFileTypes: true} not supported
                        else if (dirent.name === name) {
                            if (dirent.isSymbolicLink()) return true;
                        }
                    }
                } catch (e) {
                    if (e.code === 'ENOENT') return false;
                    throw e;
                }
            }
        }
        return false;
    }
    async _copyPathForWrite(filePath) {
        filePath = await this._normalizePath(filePath);
        let dirPath = (0, ($parcel$interopDefault($cMIoD$path))).dirname(filePath);
        if (this.existsSync(dirPath) && !this.writable.existsSync(dirPath)) await this.writable.mkdirp(dirPath);
        return filePath;
    }
    _normalizePath(filePath) {
        return (0, ($parcel$interopDefault($cMIoD$path))).resolve(this.cwd(), filePath);
    }
    // eslint-disable-next-line require-await
    async readFile(filePath, encoding) {
        return this.readFileSync(filePath, encoding);
    }
    async writeFile(filePath, contents, options) {
        filePath = await this._copyPathForWrite(filePath);
        await this.writable.writeFile(filePath, contents, options);
        this.deleted.delete(filePath);
    }
    async copyFile(source, destination) {
        source = this._normalizePath(source);
        destination = await this._copyPathForWrite(destination);
        if (await this.writable.exists(source)) await this.writable.writeFile(destination, await this.writable.readFile(source));
        else await this.writable.writeFile(destination, await this.readable.readFile(source));
        this.deleted.delete(destination);
    }
    // eslint-disable-next-line require-await
    async stat(filePath) {
        return this.statSync(filePath);
    }
    // eslint-disable-next-line require-await
    async lstat(filePath) {
        return this.lstatSync(filePath);
    }
    async symlink(target, filePath) {
        target = this._normalizePath(target);
        filePath = this._normalizePath(filePath);
        await this.writable.symlink(target, filePath);
        this.deleted.delete(filePath);
    }
    async unlink(filePath) {
        filePath = this._normalizePath(filePath);
        let toDelete = [
            filePath
        ];
        if (this.writable instanceof (0, $10056bd3888f2e36$export$3048eb7ec07c2c4e) && this._isSymlink(filePath)) this.writable.symlinks.delete(filePath);
        else if (this.statSync(filePath).isDirectory()) {
            let stack = [
                filePath
            ];
            // Recursively add every descendant path to deleted.
            while(stack.length){
                let root = (0, (/*@__PURE__*/$parcel$interopDefault($691ae7d5d88e1ccc$exports)))(stack.pop());
                for (let ent of this.readdirSync(root, {
                    withFileTypes: true
                }))if (typeof ent === 'string') {
                    let childPath = (0, ($parcel$interopDefault($cMIoD$path))).join(root, ent);
                    toDelete.push(childPath);
                    if (this.statSync(childPath).isDirectory()) stack.push(childPath);
                } else {
                    let childPath = (0, ($parcel$interopDefault($cMIoD$path))).join(root, ent.name);
                    toDelete.push(childPath);
                    if (ent.isDirectory()) stack.push(childPath);
                }
            }
        }
        try {
            await this.writable.unlink(filePath);
        } catch (e) {
            if (e.code === 'ENOENT' && !this.readable.existsSync(filePath)) throw e;
        }
        for (let pathToDelete of toDelete)this.deleted.add(pathToDelete);
    }
    async mkdirp(dir) {
        dir = this._normalizePath(dir);
        await this.writable.mkdirp(dir);
        if (this.deleted != null) {
            let root = (0, ($parcel$interopDefault($cMIoD$path))).parse(dir).root;
            while(dir !== root){
                this.deleted.delete(dir);
                dir = (0, ($parcel$interopDefault($cMIoD$path))).dirname(dir);
            }
        }
    }
    async rimraf(filePath) {
        try {
            await this.unlink(filePath);
        } catch (e) {
        // noop
        }
    }
    // eslint-disable-next-line require-await
    async ncp(source, destination) {
        // TODO: Implement this correctly.
        return this.writable.ncp(source, destination);
    }
    createReadStream(filePath, opts) {
        filePath = this._deletedThrows(filePath);
        if (this.writable.existsSync(filePath)) return this.writable.createReadStream(filePath, opts);
        return this.readable.createReadStream(filePath, opts);
    }
    createWriteStream(path, opts) {
        path = this._normalizePath(path);
        this.deleted.delete(path);
        return this.writable.createWriteStream(path, opts);
    }
    cwd() {
        return this._cwd;
    }
    chdir(path) {
        this._cwd = this._checkExists(path);
    }
    // eslint-disable-next-line require-await
    async realpath(filePath) {
        return this.realpathSync(filePath);
    }
    readFileSync(filePath, encoding) {
        filePath = this.realpathSync(filePath);
        try {
            // $FlowFixMe[incompatible-call]
            return this.writable.readFileSync(filePath, encoding);
        } catch (err) {
            // $FlowFixMe[incompatible-call]
            return this.readable.readFileSync(filePath, encoding);
        }
    }
    statSync(filePath) {
        filePath = this._normalizePath(filePath);
        try {
            return this.writable.statSync(filePath);
        } catch (e) {
            if (e.code === 'ENOENT' && this.existsSync(filePath)) return this.readable.statSync(filePath);
            throw e;
        }
    }
    lstatSync(filePath) {
        filePath = this._normalizePath(filePath);
        try {
            return this.writable.lstatSync(filePath);
        } catch (e) {
            if (e.code === 'ENOENT') return this.readable.lstatSync(filePath);
            throw e;
        }
    }
    realpathSync(filePath) {
        filePath = this._deletedThrows(filePath);
        filePath = this._deletedThrows(this.writable.realpathSync(filePath));
        if (!this.writable.existsSync(filePath)) return this.readable.realpathSync(filePath);
        return filePath;
    }
    readlinkSync(filePath) {
        filePath = this._deletedThrows(filePath);
        try {
            return this.writable.readlinkSync(filePath);
        } catch (err) {
            return this.readable.readlinkSync(filePath);
        }
    }
    // eslint-disable-next-line require-await
    async readlink(filePath) {
        return this.readlinkSync(filePath);
    }
    // eslint-disable-next-line require-await
    async exists(filePath) {
        return this.existsSync(filePath);
    }
    existsSync(filePath) {
        filePath = this._normalizePath(filePath);
        if (this.deleted.has(filePath)) return false;
        try {
            filePath = this.realpathSync(filePath);
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }
        if (this.deleted.has(filePath)) return false;
        return this.writable.existsSync(filePath) || this.readable.existsSync(filePath);
    }
    // eslint-disable-next-line require-await
    async readdir(path, opts) {
        return this.readdirSync(path, opts);
    }
    readdirSync(dir, opts) {
        dir = this.realpathSync(dir);
        // Read from both filesystems and merge the results
        let entries = new Map();
        try {
            for (let entry of this.writable.readdirSync(dir, opts)){
                let filePath = (0, ($parcel$interopDefault($cMIoD$path))).join(dir, entry.name ?? entry);
                if (this.deleted.has(filePath)) continue;
                entries.set(filePath, entry);
            }
        } catch  {
        // noop
        }
        try {
            for (let entry of this.readable.readdirSync(dir, opts)){
                let filePath = (0, ($parcel$interopDefault($cMIoD$path))).join(dir, entry.name ?? entry);
                if (this.deleted.has(filePath)) continue;
                if (entries.has(filePath)) continue;
                entries.set(filePath, entry);
            }
        } catch  {
        // noop
        }
        return Array.from(entries.values());
    }
    async watch(dir, fn, opts) {
        let writableSubscription = await this.writable.watch(dir, fn, opts);
        let readableSubscription = await this.readable.watch(dir, fn, opts);
        return {
            unsubscribe: async ()=>{
                await writableSubscription.unsubscribe();
                await readableSubscription.unsubscribe();
            }
        };
    }
    async getEventsSince(dir, snapshot, opts) {
        let writableEvents = await this.writable.getEventsSince(dir, snapshot, opts);
        let readableEvents = await this.readable.getEventsSince(dir, snapshot, opts);
        return [
            ...writableEvents,
            ...readableEvents
        ];
    }
    async writeSnapshot(dir, snapshot, opts) {
        await this.writable.writeSnapshot(dir, snapshot, opts);
    }
    findAncestorFile(fileNames, fromDir, root) {
        return (0, $b6d5b6d97d1d883c$export$d51a93c758976388)(this, fileNames, fromDir, root);
    }
    findNodeModule(moduleName, fromDir) {
        return (0, $b6d5b6d97d1d883c$export$4c6d088a7d7f9947)(this, moduleName, fromDir);
    }
    findFirstFile(filePaths) {
        return (0, $b6d5b6d97d1d883c$export$64df6e3182fd5b2d)(this, filePaths);
    }
}
class $8a88e5b8e7418190$var$FSError extends Error {
    constructor(code, path, message){
        super(`${code}: ${path} ${message}`);
        this.name = 'FSError';
        this.code = code;
        this.path = path;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
(0, $cMIoD$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($0f06d01047d305ef$exports))).version}:OverlayFS`, $8a88e5b8e7418190$export$5963299e2424ca1c);


const $e18f1454af2d5014$var$pipeline = (0, $cMIoD$util.promisify)((0, ($parcel$interopDefault($cMIoD$stream))).pipeline);
async function $e18f1454af2d5014$export$d3a8044e3fef7335(sourceFS, source, destinationFS, destination) {
    await destinationFS.mkdirp(destination);
    let files = await sourceFS.readdir(source);
    for (let file of files){
        let sourcePath = (0, ($parcel$interopDefault($cMIoD$path))).join(source, file);
        let destPath = (0, ($parcel$interopDefault($cMIoD$path))).join(destination, file);
        let stats = await sourceFS.stat(sourcePath);
        if (stats.isFile()) await $e18f1454af2d5014$var$pipeline(sourceFS.createReadStream(sourcePath), destinationFS.createWriteStream(destPath));
        else if (stats.isDirectory()) await $e18f1454af2d5014$export$d3a8044e3fef7335(sourceFS, sourcePath, destinationFS, destPath);
    }
}
$parcel$exportWildcard(module.exports, $566955ba7ab9a622$exports);
$parcel$exportWildcard(module.exports, $10056bd3888f2e36$exports);
$parcel$exportWildcard(module.exports, $8a88e5b8e7418190$exports);


//# sourceMappingURL=browser.js.map
