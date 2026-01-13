var $5X5qb$path = require("path");
var $5X5qb$stream = require("stream");
var $5X5qb$util = require("util");
var $5X5qb$fs = require("fs");
var $5X5qb$os = require("os");
var $5X5qb$parcelcore = require("@parcel/core");
var $5X5qb$parcelutils = require("@parcel/utils");
var $5X5qb$parcelfeatureflags = require("@parcel/feature-flags");
var $5X5qb$parcelwatcher = require("@parcel/watcher");
var $5X5qb$parcelrust = require("@parcel/rust");
var $5X5qb$assert = require("assert");
var $5X5qb$constants = require("constants");
var $5X5qb$parcelworkers = require("@parcel/workers");
var $5X5qb$events = require("events");


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

      var $parcel$global = globalThis;
    
$parcel$export(module.exports, "ncp", () => $089d94f02de2cc72$export$d3a8044e3fef7335);



var $2a386c23470d420c$exports = {};

$parcel$export($2a386c23470d420c$exports, "NodeFS", () => $2a386c23470d420c$export$c4e0ef2ab73c21e7);
var $07c33d31980d7367$exports = {};

var $39abe98d4a7f815f$exports = {};

var $39abe98d4a7f815f$var$origCwd = process.cwd;
var $39abe98d4a7f815f$var$cwd = null;
var $39abe98d4a7f815f$var$platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
    if (!$39abe98d4a7f815f$var$cwd) $39abe98d4a7f815f$var$cwd = $39abe98d4a7f815f$var$origCwd.call(process);
    return $39abe98d4a7f815f$var$cwd;
};
try {
    process.cwd();
} catch (er) {}
// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
    var $39abe98d4a7f815f$var$chdir = process.chdir;
    process.chdir = function(d) {
        $39abe98d4a7f815f$var$cwd = null;
        $39abe98d4a7f815f$var$chdir.call(process, d);
    };
    if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, $39abe98d4a7f815f$var$chdir);
}
$39abe98d4a7f815f$exports = $39abe98d4a7f815f$var$patch;
function $39abe98d4a7f815f$var$patch(fs) {
    // (re-)implement some things that are known busted or missing.
    // lchmod, broken prior to 0.6.2
    // back-port the fix here.
    if ($5X5qb$constants.hasOwnProperty('O_SYMLINK') && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) patchLchmod(fs);
    // lutimes implementation, or no-op
    if (!fs.lutimes) patchLutimes(fs);
    // https://github.com/isaacs/node-graceful-fs/issues/4
    // Chown should not fail on einval or eperm if non-root.
    // It should not fail on enosys ever, as this just indicates
    // that a fs doesn't support the intended operation.
    fs.chown = chownFix(fs.chown);
    fs.fchown = chownFix(fs.fchown);
    fs.lchown = chownFix(fs.lchown);
    fs.chmod = chmodFix(fs.chmod);
    fs.fchmod = chmodFix(fs.fchmod);
    fs.lchmod = chmodFix(fs.lchmod);
    fs.chownSync = chownFixSync(fs.chownSync);
    fs.fchownSync = chownFixSync(fs.fchownSync);
    fs.lchownSync = chownFixSync(fs.lchownSync);
    fs.chmodSync = chmodFixSync(fs.chmodSync);
    fs.fchmodSync = chmodFixSync(fs.fchmodSync);
    fs.lchmodSync = chmodFixSync(fs.lchmodSync);
    fs.stat = statFix(fs.stat);
    fs.fstat = statFix(fs.fstat);
    fs.lstat = statFix(fs.lstat);
    fs.statSync = statFixSync(fs.statSync);
    fs.fstatSync = statFixSync(fs.fstatSync);
    fs.lstatSync = statFixSync(fs.lstatSync);
    // if lchmod/lchown do not exist, then make them no-ops
    if (fs.chmod && !fs.lchmod) {
        fs.lchmod = function(path, mode, cb) {
            if (cb) process.nextTick(cb);
        };
        fs.lchmodSync = function() {};
    }
    if (fs.chown && !fs.lchown) {
        fs.lchown = function(path, uid, gid, cb) {
            if (cb) process.nextTick(cb);
        };
        fs.lchownSync = function() {};
    }
    // on Windows, A/V software can lock the directory, causing this
    // to fail with an EACCES or EPERM if the directory contains newly
    // created files.  Try again on failure, for up to 60 seconds.
    // Set the timeout this long because some Windows Anti-Virus, such as Parity
    // bit9, may lock files for up to a minute, causing npm package install
    // failures. Also, take care to yield the scheduler. Windows scheduling gives
    // CPU to a busy looping process, which can cause the program causing the lock
    // contention to be starved of CPU by node, so the contention doesn't resolve.
    if ($39abe98d4a7f815f$var$platform === "win32") fs.rename = typeof fs.rename !== 'function' ? fs.rename : function(fs$rename) {
        function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
                if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 60000) {
                    setTimeout(function() {
                        fs.stat(to, function(stater, st) {
                            if (stater && stater.code === "ENOENT") fs$rename(from, to, CB);
                            else cb(er);
                        });
                    }, backoff);
                    if (backoff < 100) backoff += 10;
                    return;
                }
                if (cb) cb(er);
            });
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
        return rename;
    }(fs.rename);
    // if read() returns EAGAIN, then just try it again.
    fs.read = typeof fs.read !== 'function' ? fs.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
            var callback;
            if (callback_ && typeof callback_ === 'function') {
                var eagCounter = 0;
                callback = function(er, _, __) {
                    if (er && er.code === 'EAGAIN' && eagCounter < 10) {
                        eagCounter++;
                        return fs$read.call(fs, fd, buffer, offset, length, position, callback);
                    }
                    callback_.apply(this, arguments);
                };
            }
            return fs$read.call(fs, fd, buffer, offset, length, position, callback);
        }
        // This ensures `util.promisify` works as it does for native `fs.read`.
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
    }(fs.read);
    fs.readSync = typeof fs.readSync !== 'function' ? fs.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
            var eagCounter = 0;
            while(true)try {
                return fs$readSync.call(fs, fd, buffer, offset, length, position);
            } catch (er) {
                if (er.code === 'EAGAIN' && eagCounter < 10) {
                    eagCounter++;
                    continue;
                }
                throw er;
            }
        };
    }(fs.readSync);
    function patchLchmod(fs) {
        fs.lchmod = function(path, mode, callback) {
            fs.open(path, $5X5qb$constants.O_WRONLY | $5X5qb$constants.O_SYMLINK, mode, function(err, fd) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                // prefer to return the chmod error, if one occurs,
                // but still try to close, and report closing errors if they occur.
                fs.fchmod(fd, mode, function(err) {
                    fs.close(fd, function(err2) {
                        if (callback) callback(err || err2);
                    });
                });
            });
        };
        fs.lchmodSync = function(path, mode) {
            var fd = fs.openSync(path, $5X5qb$constants.O_WRONLY | $5X5qb$constants.O_SYMLINK, mode);
            // prefer to return the chmod error, if one occurs,
            // but still try to close, and report closing errors if they occur.
            var threw = true;
            var ret;
            try {
                ret = fs.fchmodSync(fd, mode);
                threw = false;
            } finally{
                if (threw) try {
                    fs.closeSync(fd);
                } catch (er) {}
                else fs.closeSync(fd);
            }
            return ret;
        };
    }
    function patchLutimes(fs) {
        if ($5X5qb$constants.hasOwnProperty("O_SYMLINK") && fs.futimes) {
            fs.lutimes = function(path, at, mt, cb) {
                fs.open(path, $5X5qb$constants.O_SYMLINK, function(er, fd) {
                    if (er) {
                        if (cb) cb(er);
                        return;
                    }
                    fs.futimes(fd, at, mt, function(er) {
                        fs.close(fd, function(er2) {
                            if (cb) cb(er || er2);
                        });
                    });
                });
            };
            fs.lutimesSync = function(path, at, mt) {
                var fd = fs.openSync(path, $5X5qb$constants.O_SYMLINK);
                var ret;
                var threw = true;
                try {
                    ret = fs.futimesSync(fd, at, mt);
                    threw = false;
                } finally{
                    if (threw) try {
                        fs.closeSync(fd);
                    } catch (er) {}
                    else fs.closeSync(fd);
                }
                return ret;
            };
        } else if (fs.futimes) {
            fs.lutimes = function(_a, _b, _c, cb) {
                if (cb) process.nextTick(cb);
            };
            fs.lutimesSync = function() {};
        }
    }
    function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
            return orig.call(fs, target, mode, function(er) {
                if (chownErOk(er)) er = null;
                if (cb) cb.apply(this, arguments);
            });
        };
    }
    function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
            try {
                return orig.call(fs, target, mode);
            } catch (er) {
                if (!chownErOk(er)) throw er;
            }
        };
    }
    function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
            return orig.call(fs, target, uid, gid, function(er) {
                if (chownErOk(er)) er = null;
                if (cb) cb.apply(this, arguments);
            });
        };
    }
    function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
            try {
                return orig.call(fs, target, uid, gid);
            } catch (er) {
                if (!chownErOk(er)) throw er;
            }
        };
    }
    function statFix(orig) {
        if (!orig) return orig;
        // Older versions of Node erroneously returned signed integers for
        // uid + gid.
        return function(target, options, cb) {
            if (typeof options === 'function') {
                cb = options;
                options = null;
            }
            function callback(er, stats) {
                if (stats) {
                    if (stats.uid < 0) stats.uid += 0x100000000;
                    if (stats.gid < 0) stats.gid += 0x100000000;
                }
                if (cb) cb.apply(this, arguments);
            }
            return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
        };
    }
    function statFixSync(orig) {
        if (!orig) return orig;
        // Older versions of Node erroneously returned signed integers for
        // uid + gid.
        return function(target, options) {
            var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
            if (stats) {
                if (stats.uid < 0) stats.uid += 0x100000000;
                if (stats.gid < 0) stats.gid += 0x100000000;
            }
            return stats;
        };
    }
    // ENOSYS means that the fs doesn't support the op. Just ignore
    // that, because it doesn't matter.
    //
    // if there's no getuid, or if getuid() is something other
    // than 0, and the error is EINVAL or EPERM, then just ignore
    // it.
    //
    // This specific case is a silent failure in cp, install, tar,
    // and most other unix tools that manage permissions.
    //
    // When running as root, or if other types of errors are
    // encountered, then it's strict.
    function chownErOk(er) {
        if (!er) return true;
        if (er.code === "ENOSYS") return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
            if (er.code === "EINVAL" || er.code === "EPERM") return true;
        }
        return false;
    }
}


var $6be079bb76bbc734$exports = {};

var $6be079bb76bbc734$require$Stream = $5X5qb$stream.Stream;
$6be079bb76bbc734$exports = $6be079bb76bbc734$var$legacy;
function $6be079bb76bbc734$var$legacy(fs) {
    return {
        ReadStream: ReadStream,
        WriteStream: WriteStream
    };
    function ReadStream(path, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path, options);
        $6be079bb76bbc734$require$Stream.call(this);
        var self = this;
        this.path = path;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = 'r';
        this.mode = 438; /*=0666*/ 
        this.bufferSize = 65536;
        options = options || {};
        // Mixin options into this
        var keys = Object.keys(options);
        for(var index = 0, length = keys.length; index < length; index++){
            var key = keys[index];
            this[key] = options[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== undefined) {
            if ('number' !== typeof this.start) throw TypeError('start must be a Number');
            if (this.end === undefined) this.end = Infinity;
            else if ('number' !== typeof this.end) throw TypeError('end must be a Number');
            if (this.start > this.end) throw new Error('start must be <= end');
            this.pos = this.start;
        }
        if (this.fd !== null) {
            process.nextTick(function() {
                self._read();
            });
            return;
        }
        fs.open(this.path, this.flags, this.mode, function(err, fd) {
            if (err) {
                self.emit('error', err);
                self.readable = false;
                return;
            }
            self.fd = fd;
            self.emit('open', fd);
            self._read();
        });
    }
    function WriteStream(path, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path, options);
        $6be079bb76bbc734$require$Stream.call(this);
        this.path = path;
        this.fd = null;
        this.writable = true;
        this.flags = 'w';
        this.encoding = 'binary';
        this.mode = 438; /*=0666*/ 
        this.bytesWritten = 0;
        options = options || {};
        // Mixin options into this
        var keys = Object.keys(options);
        for(var index = 0, length = keys.length; index < length; index++){
            var key = keys[index];
            this[key] = options[key];
        }
        if (this.start !== undefined) {
            if ('number' !== typeof this.start) throw TypeError('start must be a Number');
            if (this.start < 0) throw new Error('start must be >= zero');
            this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
            this._open = fs.open;
            this._queue.push([
                this._open,
                this.path,
                this.flags,
                this.mode,
                undefined
            ]);
            this.flush();
        }
    }
}


var $dc1065d572b4b5ca$exports = {};
'use strict';
$dc1065d572b4b5ca$exports = $dc1065d572b4b5ca$var$clone;
var $dc1065d572b4b5ca$var$getPrototypeOf = Object.getPrototypeOf || function(obj) {
    return obj.__proto__;
};
function $dc1065d572b4b5ca$var$clone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Object) var copy = {
        __proto__: $dc1065d572b4b5ca$var$getPrototypeOf(obj)
    };
    else var copy = Object.create(null);
    Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
    });
    return copy;
}



/* istanbul ignore next - node 0.x polyfill */ var $07c33d31980d7367$var$gracefulQueue;
var $07c33d31980d7367$var$previousSymbol;
/* istanbul ignore else - node 0.x polyfill */ if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
    $07c33d31980d7367$var$gracefulQueue = Symbol.for('graceful-fs.queue');
    // This is used in testing by future versions
    $07c33d31980d7367$var$previousSymbol = Symbol.for('graceful-fs.previous');
} else {
    $07c33d31980d7367$var$gracefulQueue = '___graceful-fs.queue';
    $07c33d31980d7367$var$previousSymbol = '___graceful-fs.previous';
}
function $07c33d31980d7367$var$noop() {}
function $07c33d31980d7367$var$publishQueue(context, queue) {
    Object.defineProperty(context, $07c33d31980d7367$var$gracefulQueue, {
        get: function() {
            return queue;
        }
    });
}
var $07c33d31980d7367$var$debug = $07c33d31980d7367$var$noop;
if ($5X5qb$util.debuglog) $07c33d31980d7367$var$debug = $5X5qb$util.debuglog('gfs4');
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) $07c33d31980d7367$var$debug = function() {
    var m = $5X5qb$util.format.apply($5X5qb$util, arguments);
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ');
    console.error(m);
};

// Once time initialization
if (!$5X5qb$fs[$07c33d31980d7367$var$gracefulQueue]) {
    // This queue can be shared by multiple loaded instances
    var $07c33d31980d7367$var$queue = $parcel$global[$07c33d31980d7367$var$gracefulQueue] || [];
    $07c33d31980d7367$var$publishQueue($5X5qb$fs, $07c33d31980d7367$var$queue);
    // Patch fs.close/closeSync to shared queue version, because we need
    // to retry() whenever a close happens *anywhere* in the program.
    // This is essential when multiple graceful-fs instances are
    // in play at the same time.
    $5X5qb$fs.close = function(fs$close) {
        function close(fd, cb) {
            return fs$close.call($5X5qb$fs, fd, function(err) {
                // This function uses the graceful-fs shared queue
                if (!err) $07c33d31980d7367$var$resetQueue();
                if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
        Object.defineProperty(close, $07c33d31980d7367$var$previousSymbol, {
            value: fs$close
        });
        return close;
    }($5X5qb$fs.close);
    $5X5qb$fs.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
            // This function uses the graceful-fs shared queue
            fs$closeSync.apply($5X5qb$fs, arguments);
            $07c33d31980d7367$var$resetQueue();
        }
        Object.defineProperty(closeSync, $07c33d31980d7367$var$previousSymbol, {
            value: fs$closeSync
        });
        return closeSync;
    }($5X5qb$fs.closeSync);
    if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) process.on('exit', function() {
        $07c33d31980d7367$var$debug($5X5qb$fs[$07c33d31980d7367$var$gracefulQueue]);
        $5X5qb$assert.equal($5X5qb$fs[$07c33d31980d7367$var$gracefulQueue].length, 0);
    });
}
if (!$parcel$global[$07c33d31980d7367$var$gracefulQueue]) $07c33d31980d7367$var$publishQueue($parcel$global, $5X5qb$fs[$07c33d31980d7367$var$gracefulQueue]);
$07c33d31980d7367$exports = $07c33d31980d7367$var$patch($dc1065d572b4b5ca$exports($5X5qb$fs));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !$5X5qb$fs.__patched) {
    $07c33d31980d7367$exports = $07c33d31980d7367$var$patch($5X5qb$fs);
    $5X5qb$fs.__patched = true;
}
function $07c33d31980d7367$var$patch(fs) {
    // Everything that references the open() function needs to be in here
    $39abe98d4a7f815f$exports(fs);
    fs.gracefulify = $07c33d31980d7367$var$patch;
    fs.createReadStream = createReadStream;
    fs.createWriteStream = createWriteStream;
    var fs$readFile = fs.readFile;
    fs.readFile = readFile;
    function readFile(path, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$readFile(path, options, cb);
        function go$readFile(path, options, cb, startTime) {
            return fs$readFile(path, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $07c33d31980d7367$var$enqueue([
                    go$readFile,
                    [
                        path,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
    }
    var fs$writeFile = fs.writeFile;
    fs.writeFile = writeFile;
    function writeFile(path, data, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$writeFile(path, data, options, cb);
        function go$writeFile(path, data, options, cb, startTime) {
            return fs$writeFile(path, data, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $07c33d31980d7367$var$enqueue([
                    go$writeFile,
                    [
                        path,
                        data,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
    }
    var fs$appendFile = fs.appendFile;
    if (fs$appendFile) fs.appendFile = appendFile;
    function appendFile(path, data, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$appendFile(path, data, options, cb);
        function go$appendFile(path, data, options, cb, startTime) {
            return fs$appendFile(path, data, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $07c33d31980d7367$var$enqueue([
                    go$appendFile,
                    [
                        path,
                        data,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
    }
    var fs$copyFile = fs.copyFile;
    if (fs$copyFile) fs.copyFile = copyFile;
    function copyFile(src, dest, flags, cb) {
        if (typeof flags === 'function') {
            cb = flags;
            flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src, dest, flags, cb, startTime) {
            return fs$copyFile(src, dest, flags, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $07c33d31980d7367$var$enqueue([
                    go$copyFile,
                    [
                        src,
                        dest,
                        flags,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
    }
    var fs$readdir = fs.readdir;
    fs.readdir = readdir;
    var noReaddirOptionVersions = /^v[0-5]\./;
    function readdir(path, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir(path, options, cb, startTime) {
            return fs$readdir(path, fs$readdirCallback(path, options, cb, startTime));
        } : function go$readdir(path, options, cb, startTime) {
            return fs$readdir(path, options, fs$readdirCallback(path, options, cb, startTime));
        };
        return go$readdir(path, options, cb);
        function fs$readdirCallback(path, options, cb, startTime) {
            return function(err, files) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $07c33d31980d7367$var$enqueue([
                    go$readdir,
                    [
                        path,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (files && files.sort) files.sort();
                    if (typeof cb === 'function') cb.call(this, err, files);
                }
            };
        }
    }
    if (process.version.substr(0, 4) === 'v0.8') {
        var legStreams = $6be079bb76bbc734$exports(fs);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
    }
    var fs$ReadStream = fs.ReadStream;
    if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
    }
    var fs$WriteStream = fs.WriteStream;
    if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
    }
    Object.defineProperty(fs, 'ReadStream', {
        get: function() {
            return ReadStream;
        },
        set: function(val) {
            ReadStream = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fs, 'WriteStream', {
        get: function() {
            return WriteStream;
        },
        set: function(val) {
            WriteStream = val;
        },
        enumerable: true,
        configurable: true
    });
    // legacy names
    var FileReadStream = ReadStream;
    Object.defineProperty(fs, 'FileReadStream', {
        get: function() {
            return FileReadStream;
        },
        set: function(val) {
            FileReadStream = val;
        },
        enumerable: true,
        configurable: true
    });
    var FileWriteStream = WriteStream;
    Object.defineProperty(fs, 'FileWriteStream', {
        get: function() {
            return FileWriteStream;
        },
        set: function(val) {
            FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
    });
    function ReadStream(path, options) {
        if (this instanceof ReadStream) return fs$ReadStream.apply(this, arguments), this;
        else return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
    }
    function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
            if (err) {
                if (that.autoClose) that.destroy();
                that.emit('error', err);
            } else {
                that.fd = fd;
                that.emit('open', fd);
                that.read();
            }
        });
    }
    function WriteStream(path, options) {
        if (this instanceof WriteStream) return fs$WriteStream.apply(this, arguments), this;
        else return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
    }
    function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
            if (err) {
                that.destroy();
                that.emit('error', err);
            } else {
                that.fd = fd;
                that.emit('open', fd);
            }
        });
    }
    function createReadStream(path, options) {
        return new fs.ReadStream(path, options);
    }
    function createWriteStream(path, options) {
        return new fs.WriteStream(path, options);
    }
    var fs$open = fs.open;
    fs.open = open;
    function open(path, flags, mode, cb) {
        if (typeof mode === 'function') cb = mode, mode = null;
        return go$open(path, flags, mode, cb);
        function go$open(path, flags, mode, cb, startTime) {
            return fs$open(path, flags, mode, function(err, fd) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $07c33d31980d7367$var$enqueue([
                    go$open,
                    [
                        path,
                        flags,
                        mode,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
    }
    return fs;
}
function $07c33d31980d7367$var$enqueue(elem) {
    $07c33d31980d7367$var$debug('ENQUEUE', elem[0].name, elem[1]);
    $5X5qb$fs[$07c33d31980d7367$var$gracefulQueue].push(elem);
    $07c33d31980d7367$var$retry();
}
// keep track of the timeout between retry() calls
var $07c33d31980d7367$var$retryTimer;
// reset the startTime and lastTime to now
// this resets the start of the 60 second overall timeout as well as the
// delay between attempts so that we'll retry these jobs sooner
function $07c33d31980d7367$var$resetQueue() {
    var now = Date.now();
    for(var i = 0; i < $5X5qb$fs[$07c33d31980d7367$var$gracefulQueue].length; ++i)// entries that are only a length of 2 are from an older version, don't
    // bother modifying those since they'll be retried anyway.
    if ($5X5qb$fs[$07c33d31980d7367$var$gracefulQueue][i].length > 2) {
        $5X5qb$fs[$07c33d31980d7367$var$gracefulQueue][i][3] = now // startTime
        ;
        $5X5qb$fs[$07c33d31980d7367$var$gracefulQueue][i][4] = now // lastTime
        ;
    }
    // call retry to make sure we're actively processing the queue
    $07c33d31980d7367$var$retry();
}
function $07c33d31980d7367$var$retry() {
    // clear the timer and remove it to help prevent unintended concurrency
    clearTimeout($07c33d31980d7367$var$retryTimer);
    $07c33d31980d7367$var$retryTimer = undefined;
    if ($5X5qb$fs[$07c33d31980d7367$var$gracefulQueue].length === 0) return;
    var elem = $5X5qb$fs[$07c33d31980d7367$var$gracefulQueue].shift();
    var fn = elem[0];
    var args = elem[1];
    // these items may be unset if they were added by an older graceful-fs
    var err = elem[2];
    var startTime = elem[3];
    var lastTime = elem[4];
    // if we don't have a startTime we have no way of knowing if we've waited
    // long enough, so go ahead and retry this item now
    if (startTime === undefined) {
        $07c33d31980d7367$var$debug('RETRY', fn.name, args);
        fn.apply(null, args);
    } else if (Date.now() - startTime >= 60000) {
        // it's been more than 60 seconds total, bail now
        $07c33d31980d7367$var$debug('TIMEOUT', fn.name, args);
        var cb = args.pop();
        if (typeof cb === 'function') cb.call(null, err);
    } else {
        // the amount of time between the last attempt and right now
        var sinceAttempt = Date.now() - lastTime;
        // the amount of time between when we first tried, and when we last tried
        // rounded up to at least 1
        var sinceStart = Math.max(lastTime - startTime, 1);
        // backoff. wait longer than the total time we've been retrying, but only
        // up to a maximum of 100ms
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        // it's been long enough since the last retry, do it again
        if (sinceAttempt >= desiredDelay) {
            $07c33d31980d7367$var$debug('RETRY', fn.name, args);
            fn.apply(null, args.concat([
                startTime
            ]));
        } else // if we can't do this job yet, push it to the end of the queue
        // and let the next iteration check again
        $5X5qb$fs[$07c33d31980d7367$var$gracefulQueue].push(elem);
    }
    // schedule our next run if one isn't already scheduled
    if ($07c33d31980d7367$var$retryTimer === undefined) $07c33d31980d7367$var$retryTimer = setTimeout($07c33d31980d7367$var$retry, 0);
}



var $1041b1cd4648cf09$exports = {};


$1041b1cd4648cf09$exports = $1041b1cd4648cf09$var$ncp;
$1041b1cd4648cf09$var$ncp.ncp = $1041b1cd4648cf09$var$ncp;
function $1041b1cd4648cf09$var$ncp(source, dest, options, callback) {
    var cback = callback;
    if (!callback) {
        cback = options;
        options = {};
    }
    var basePath = process.cwd(), currentPath = $5X5qb$path.resolve(basePath, source), targetPath = $5X5qb$path.resolve(basePath, dest), filter = options.filter, rename = options.rename, transform = options.transform, clobber = options.clobber !== false, modified = options.modified, dereference = options.dereference, errs = null, started = 0, finished = 0, running = 0, limit = options.limit || $1041b1cd4648cf09$var$ncp.limit || 16;
    limit = limit < 1 ? 1 : limit > 512 ? 512 : limit;
    startCopy(currentPath);
    function startCopy(source) {
        started++;
        if (filter) {
            if (filter instanceof RegExp) {
                if (!filter.test(source)) return cb(true);
            } else if (typeof filter === 'function') {
                if (!filter(source)) return cb(true);
            }
        }
        return getStats(source);
    }
    function getStats(source) {
        var stat = dereference ? $5X5qb$fs.stat : $5X5qb$fs.lstat;
        if (running >= limit) return setImmediate(function() {
            getStats(source);
        });
        running++;
        stat(source, function(err, stats) {
            var item = {};
            if (err) return onError(err);
            // We need to get the mode from the stats object and preserve it.
            item.name = source;
            item.mode = stats.mode;
            item.mtime = stats.mtime; //modified time
            item.atime = stats.atime; //access time
            if (stats.isDirectory()) return onDir(item);
            else if (stats.isFile()) return onFile(item);
            else if (stats.isSymbolicLink()) // Symlinks don't really need to know about the mode.
            return onLink(source);
        });
    }
    function onFile(file) {
        var target = file.name.replace(currentPath, targetPath);
        if (rename) target = rename(target);
        isWritable(target, function(writable) {
            if (writable) return copyFile(file, target);
            if (clobber) rmFile(target, function() {
                copyFile(file, target);
            });
            if (modified) {
                var stat = dereference ? $5X5qb$fs.stat : $5X5qb$fs.lstat;
                stat(target, function(err, stats) {
                    //if souce modified time greater to target modified time copy file
                    if (file.mtime.getTime() > stats.mtime.getTime()) copyFile(file, target);
                    else return cb();
                });
            } else return cb();
        });
    }
    function copyFile(file, target) {
        var readStream = $5X5qb$fs.createReadStream(file.name), writeStream = $5X5qb$fs.createWriteStream(target, {
            mode: file.mode
        });
        readStream.on('error', onError);
        writeStream.on('error', onError);
        if (transform) transform(readStream, writeStream, file);
        else writeStream.on('open', function() {
            readStream.pipe(writeStream);
        });
        writeStream.once('finish', function() {
            if (modified) {
                //target file modified date sync.
                $5X5qb$fs.utimesSync(target, file.atime, file.mtime);
                cb();
            } else cb();
        });
    }
    function rmFile(file, done) {
        $5X5qb$fs.unlink(file, function(err) {
            if (err) return onError(err);
            return done();
        });
    }
    function onDir(dir) {
        var target = dir.name.replace(currentPath, targetPath);
        isWritable(target, function(writable) {
            if (writable) return mkDir(dir, target);
            copyDir(dir.name);
        });
    }
    function mkDir(dir, target) {
        $5X5qb$fs.mkdir(target, dir.mode, function(err) {
            if (err) return onError(err);
            copyDir(dir.name);
        });
    }
    function copyDir(dir) {
        $5X5qb$fs.readdir(dir, function(err, items) {
            if (err) return onError(err);
            items.forEach(function(item) {
                startCopy($5X5qb$path.join(dir, item));
            });
            return cb();
        });
    }
    function onLink(link) {
        var target = link.replace(currentPath, targetPath);
        $5X5qb$fs.readlink(link, function(err, resolvedPath) {
            if (err) return onError(err);
            checkLink(resolvedPath, target);
        });
    }
    function checkLink(resolvedPath, target) {
        if (dereference) resolvedPath = $5X5qb$path.resolve(basePath, resolvedPath);
        isWritable(target, function(writable) {
            if (writable) return makeLink(resolvedPath, target);
            $5X5qb$fs.readlink(target, function(err, targetDest) {
                if (err) return onError(err);
                if (dereference) targetDest = $5X5qb$path.resolve(basePath, targetDest);
                if (targetDest === resolvedPath) return cb();
                return rmFile(target, function() {
                    makeLink(resolvedPath, target);
                });
            });
        });
    }
    function makeLink(linkPath, target) {
        $5X5qb$fs.symlink(linkPath, target, function(err) {
            if (err) return onError(err);
            return cb();
        });
    }
    function isWritable(path, done) {
        $5X5qb$fs.lstat(path, function(err) {
            if (err) {
                if (err.code === 'ENOENT') return done(true);
                return done(false);
            }
            return done(false);
        });
    }
    function onError(err) {
        if (options.stopOnError) return cback(err);
        else if (!errs && options.errs) errs = $5X5qb$fs.createWriteStream(options.errs);
        else if (!errs) errs = [];
        if (typeof errs.write === 'undefined') errs.push(err);
        else errs.write(err.stack + '\n\n');
        return cb();
    }
    function cb(skipped) {
        if (!skipped) running--;
        finished++;
        if (started === finished && running === 0) {
            if (cback !== undefined) return errs ? cback(errs) : cback(null);
        }
    }
}









var $3c75fb0c8e4c22d9$exports = {};
$3c75fb0c8e4c22d9$exports = JSON.parse("{\"name\":\"@parcel/fs\",\"version\":\"2.13.3\",\"description\":\"Blazing fast, zero configuration web application bundler\",\"license\":\"MIT\",\"publishConfig\":{\"access\":\"public\"},\"funding\":{\"type\":\"opencollective\",\"url\":\"https://opencollective.com/parcel\"},\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/parcel-bundler/parcel.git\"},\"main\":\"lib/index.js\",\"source\":\"src/index.js\",\"types\":\"index.d.ts\",\"engines\":{\"node\":\">= 16.0.0\"},\"targets\":{\"types\":false,\"main\":{\"includeNodeModules\":{\"@parcel/core\":false,\"@parcel/feature-flags\":false,\"@parcel/rust\":false,\"@parcel/types-internal\":false,\"@parcel/utils\":false,\"@parcel/watcher\":false,\"@parcel/watcher-watchman-js\":false,\"@parcel/workers\":false}},\"browser\":{\"includeNodeModules\":{\"@parcel/core\":false,\"@parcel/feature-flags\":false,\"@parcel/rust\":false,\"@parcel/types-internal\":false,\"@parcel/utils\":false,\"@parcel/watcher\":false,\"@parcel/watcher-watchman-js\":false,\"@parcel/workers\":false}}},\"scripts\":{\"build-ts\":\"mkdir -p lib && flow-to-ts src/types.js > lib/types.d.ts\",\"check-ts\":\"tsc --noEmit index.d.ts\"},\"dependencies\":{\"@parcel/feature-flags\":\"2.13.3\",\"@parcel/rust\":\"2.13.3\",\"@parcel/types-internal\":\"2.13.3\",\"@parcel/utils\":\"2.13.3\",\"@parcel/watcher\":\"^2.0.7\",\"@parcel/workers\":\"2.13.3\"},\"devDependencies\":{\"@parcel/watcher-watchman-js\":\"2.13.3\",\"graceful-fs\":\"^4.2.4\",\"ncp\":\"^2.0.0\",\"nullthrows\":\"^1.1.1\",\"utility-types\":\"^3.10.0\"},\"peerDependencies\":{\"@parcel/core\":\"^2.13.3\"},\"browser\":{\"@parcel/fs\":\"./lib/browser.js\",\"./src/NodeFS.js\":\"./src/NodeFS.browser.js\"},\"gitHead\":\"d19b1f6bdb05eb5a3085f44daae15c0fe2709ab9\"}");




function $97eb553301b18171$export$4c6d088a7d7f9947(fs, moduleName, dir) {
    let { root: root } = (0, ($parcel$interopDefault($5X5qb$path))).parse(dir);
    while(dir !== root){
        // Skip node_modules directories
        if ((0, ($parcel$interopDefault($5X5qb$path))).basename(dir) === 'node_modules') dir = (0, ($parcel$interopDefault($5X5qb$path))).dirname(dir);
        try {
            let moduleDir = (0, ($parcel$interopDefault($5X5qb$path))).join(dir, 'node_modules', moduleName);
            let stats = fs.statSync(moduleDir);
            if (stats.isDirectory()) return moduleDir;
        } catch (err) {
        // ignore
        }
        // Move up a directory
        dir = (0, ($parcel$interopDefault($5X5qb$path))).dirname(dir);
    }
    return null;
}
function $97eb553301b18171$export$d51a93c758976388(fs, fileNames, dir, root) {
    let { root: pathRoot } = (0, ($parcel$interopDefault($5X5qb$path))).parse(dir);
    // eslint-disable-next-line no-constant-condition
    while(true){
        if ((0, ($parcel$interopDefault($5X5qb$path))).basename(dir) === 'node_modules') return null;
        for (const fileName of fileNames){
            let filePath = (0, ($parcel$interopDefault($5X5qb$path))).join(dir, fileName);
            try {
                if (fs.statSync(filePath).isFile()) return filePath;
            } catch (err) {
            // ignore
            }
        }
        if (dir === root || dir === pathRoot) break;
        dir = (0, ($parcel$interopDefault($5X5qb$path))).dirname(dir);
    }
    return null;
}
function $97eb553301b18171$export$64df6e3182fd5b2d(fs, filePaths) {
    for (let filePath of filePaths)try {
        if (fs.statSync(filePath).isFile()) return filePath;
    } catch (err) {
    // ignore
    }
}


// Most of this can go away once we only support Node 10+, which includes
// require('fs').promises
const $2a386c23470d420c$var$realpath = (0, $5X5qb$util.promisify)(process.platform === 'win32' ? (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).realpath : (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).realpath.native);
const $2a386c23470d420c$var$isPnP = process.versions.pnp != null;
function $2a386c23470d420c$var$getWatchmanWatcher() {
    // This is here to trick parcel into ignoring this require...
    const packageName = [
        '@parcel',
        'watcher-watchman-js'
    ].join('/');
    // $FlowFixMe
    return require(packageName);
}
class $2a386c23470d420c$export$c4e0ef2ab73c21e7 {
    readFile = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).readFile);
    copyFile = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).copyFile);
    stat = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).stat);
    lstat = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).lstat);
    readdir = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).readdir);
    symlink = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).symlink);
    readlink = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).readlink);
    unlink = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).unlink);
    utimes = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).utimes);
    ncp = (0, $5X5qb$util.promisify)((0, (/*@__PURE__*/$parcel$interopDefault($1041b1cd4648cf09$exports))));
    createReadStream = (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).createReadStream;
    cwd = ()=>process.cwd();
    chdir = (directory)=>process.chdir(directory);
    statSync = (path)=>(0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).statSync(path);
    lstatSync = (path)=>(0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).lstatSync(path);
    realpathSync = process.platform === 'win32' ? (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).realpathSync : (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).realpathSync.native;
    readlinkSync = (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).readlinkSync;
    existsSync = (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).existsSync;
    readdirSync = (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).readdirSync;
    findAncestorFile = $2a386c23470d420c$var$isPnP ? (...args)=>$97eb553301b18171$export$d51a93c758976388(this, ...args) : $5X5qb$parcelrust.findAncestorFile;
    findNodeModule = $2a386c23470d420c$var$isPnP ? (...args)=>$97eb553301b18171$export$4c6d088a7d7f9947(this, ...args) : $5X5qb$parcelrust.findNodeModule;
    findFirstFile = $2a386c23470d420c$var$isPnP ? (...args)=>$97eb553301b18171$export$64df6e3182fd5b2d(this, ...args) : $5X5qb$parcelrust.findFirstFile;
    watcher() {
        return (0, $5X5qb$parcelfeatureflags.getFeatureFlag)('useWatchmanWatcher') ? $2a386c23470d420c$var$getWatchmanWatcher() : (0, ($parcel$interopDefault($5X5qb$parcelwatcher)));
    }
    createWriteStream(filePath, options) {
        // Make createWriteStream atomic
        let tmpFilePath = $2a386c23470d420c$var$getTempFilePath(filePath);
        let failed = false;
        const move = async ()=>{
            if (!failed) try {
                await (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).promises.rename(tmpFilePath, filePath);
            } catch (e) {
                // This is adapted from fs-write-stream-atomic. Apparently
                // Windows doesn't like renaming when the target already exists.
                if (process.platform === 'win32' && e.syscall && e.syscall === 'rename' && e.code && e.code === 'EPERM') {
                    let [hashTmp, hashTarget] = await Promise.all([
                        (0, $5X5qb$parcelutils.hashFile)(this, tmpFilePath),
                        (0, $5X5qb$parcelutils.hashFile)(this, filePath)
                    ]);
                    await this.unlink(tmpFilePath);
                    if (hashTmp != hashTarget) throw e;
                }
            }
        };
        let writeStream = (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).createWriteStream(tmpFilePath, {
            ...options,
            fs: {
                ...(0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))),
                close: (fd, cb)=>{
                    (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).close(fd, (err)=>{
                        if (err) cb(err);
                        else move().then(()=>cb(), (err)=>cb(err));
                    });
                }
            }
        });
        writeStream.once('error', ()=>{
            failed = true;
            (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).unlinkSync(tmpFilePath);
        });
        return writeStream;
    }
    async writeFile(filePath, contents, options) {
        let tmpFilePath = $2a386c23470d420c$var$getTempFilePath(filePath);
        await (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).promises.writeFile(tmpFilePath, contents, options);
        await (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).promises.rename(tmpFilePath, filePath);
    }
    readFileSync(filePath, encoding) {
        if (encoding != null) return (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).readFileSync(filePath, encoding);
        return (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).readFileSync(filePath);
    }
    async realpath(originalPath) {
        try {
            return await $2a386c23470d420c$var$realpath(originalPath, 'utf8');
        } catch (e) {
        // do nothing
        }
        return originalPath;
    }
    exists(filePath) {
        return new Promise((resolve)=>{
            (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).exists(filePath, resolve);
        });
    }
    watch(dir, fn, opts) {
        return this.watcher().subscribe(dir, fn, opts);
    }
    getEventsSince(dir, snapshot, opts) {
        return this.watcher().getEventsSince(dir, snapshot, opts);
    }
    async writeSnapshot(dir, snapshot, opts) {
        await this.watcher().writeSnapshot(dir, snapshot, opts);
    }
    static deserialize() {
        return new $2a386c23470d420c$export$c4e0ef2ab73c21e7();
    }
    serialize() {
        return null;
    }
    async mkdirp(filePath) {
        await (0, ($parcel$interopDefault($5X5qb$fs))).promises.mkdir(filePath, {
            recursive: true
        });
    }
    async rimraf(filePath) {
        if ((0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).promises.rm) {
            await (0, (/*@__PURE__*/$parcel$interopDefault($07c33d31980d7367$exports))).promises.rm(filePath, {
                recursive: true,
                force: true
            });
            return;
        }
        // fs.promises.rm is not supported in node 12...
        let stat;
        try {
            stat = await this.stat(filePath);
        } catch (err) {
            return;
        }
        if (stat.isDirectory()) // $FlowFixMe
        await (0, ($parcel$interopDefault($5X5qb$fs))).promises.rmdir(filePath, {
            recursive: true
        });
        else await (0, ($parcel$interopDefault($5X5qb$fs))).promises.unlink(filePath);
    }
}
(0, $5X5qb$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($3c75fb0c8e4c22d9$exports))).version}:NodeFS`, $2a386c23470d420c$export$c4e0ef2ab73c21e7);
let $2a386c23470d420c$var$writeStreamCalls = 0;
let $2a386c23470d420c$var$threadId;

try {
    ({ threadId: $2a386c23470d420c$var$threadId } = $2a386c23470d420c$import$9c2ae04019a9b9e3);
} catch  {
//
}
let $2a386c23470d420c$var$useOsTmpDir;
function $2a386c23470d420c$var$shouldUseOsTmpDir(filePath) {
    if ($2a386c23470d420c$var$useOsTmpDir != null) return $2a386c23470d420c$var$useOsTmpDir;
    try {
        const tmpDir = (0, $5X5qb$os.tmpdir)();
        (0, ($parcel$interopDefault($5X5qb$fs))).accessSync(tmpDir, (0, ($parcel$interopDefault($5X5qb$fs))).constants.R_OK | (0, ($parcel$interopDefault($5X5qb$fs))).constants.W_OK);
        const tmpDirStats = (0, ($parcel$interopDefault($5X5qb$fs))).statSync(tmpDir);
        const filePathStats = (0, ($parcel$interopDefault($5X5qb$fs))).statSync(filePath);
        // Check the tmpdir is on the same partition as the target directory.
        // This is required to ensure renaming is an atomic operation.
        $2a386c23470d420c$var$useOsTmpDir = tmpDirStats.dev === filePathStats.dev;
    } catch (e) {
        // We don't have read/write access to the OS tmp directory
        $2a386c23470d420c$var$useOsTmpDir = false;
    }
    return $2a386c23470d420c$var$useOsTmpDir;
}
// Generate a temporary file path used for atomic writing of files.
function $2a386c23470d420c$var$getTempFilePath(filePath) {
    $2a386c23470d420c$var$writeStreamCalls = $2a386c23470d420c$var$writeStreamCalls % Number.MAX_SAFE_INTEGER;
    let tmpFilePath = filePath;
    // If possible, write the tmp file to the OS tmp directory
    // This reduces the amount of FS events the watcher needs to process during the build
    if ($2a386c23470d420c$var$shouldUseOsTmpDir(filePath)) tmpFilePath = (0, ($parcel$interopDefault($5X5qb$path))).join((0, $5X5qb$os.tmpdir)(), (0, ($parcel$interopDefault($5X5qb$path))).basename(filePath));
    return tmpFilePath + '.' + process.pid + ($2a386c23470d420c$var$threadId != null ? '.' + $2a386c23470d420c$var$threadId : '') + '.' + ($2a386c23470d420c$var$writeStreamCalls++).toString(36);
}


var $989d2eaaf2de08f9$exports = {};

$parcel$export($989d2eaaf2de08f9$exports, "MemoryFS", () => $989d2eaaf2de08f9$export$3048eb7ec07c2c4e);
$parcel$export($989d2eaaf2de08f9$exports, "FSError", () => $989d2eaaf2de08f9$export$d414276624ebf134);
$parcel$export($989d2eaaf2de08f9$exports, "makeShared", () => $989d2eaaf2de08f9$export$df9eb3e75aa27a22);
$parcel$export($989d2eaaf2de08f9$exports, "File", () => $989d2eaaf2de08f9$export$b6afa8811b7e644e);






var $dbd1ba8e1b3841ba$exports = {};
'use strict';
function $dbd1ba8e1b3841ba$var$nullthrows(x, message) {
    if (x != null) return x;
    var error = new Error(message !== undefined ? message : 'Got unexpected ' + x);
    error.framesToPop = 1; // Skip nullthrows's own stack frame.
    throw error;
}
$dbd1ba8e1b3841ba$exports = $dbd1ba8e1b3841ba$var$nullthrows;
$dbd1ba8e1b3841ba$exports.default = $dbd1ba8e1b3841ba$var$nullthrows;
Object.defineProperty($dbd1ba8e1b3841ba$exports, '__esModule', {
    value: true
});




const $989d2eaaf2de08f9$var$instances = new Map();
let $989d2eaaf2de08f9$var$id = 0;
class $989d2eaaf2de08f9$export$3048eb7ec07c2c4e {
    _numWorkerInstances = 0;
    _workerRegisterResolves = [];
    _emitter = new (0, ($parcel$interopDefault($5X5qb$events)))();
    constructor(workerFarm){
        this.farm = workerFarm;
        this._cwd = (0, ($parcel$interopDefault($5X5qb$path))).resolve((0, ($parcel$interopDefault($5X5qb$path))).sep);
        this.dirs = new Map([
            [
                this._cwd,
                new $989d2eaaf2de08f9$var$Directory()
            ]
        ]);
        this.files = new Map();
        this.symlinks = new Map();
        this.watchers = new Map();
        this.events = [];
        this.id = $989d2eaaf2de08f9$var$id++;
        this._workerHandles = [];
        this._eventQueue = [];
        $989d2eaaf2de08f9$var$instances.set(this.id, this);
        this._emitter.on('allWorkersRegistered', ()=>{
            for (let resolve of this._workerRegisterResolves)resolve();
            this._workerRegisterResolves = [];
        });
    }
    static deserialize(opts) {
        let existing = $989d2eaaf2de08f9$var$instances.get(opts.id);
        if (existing != null) {
            // Correct the count of worker instances since serialization assumes a new instance is created
            (0, ($parcel$interopDefault($5X5qb$parcelworkers))).getWorkerApi().runHandle(opts.handle, [
                'decrementWorkerInstance',
                []
            ]);
            return existing;
        }
        let fs = new $989d2eaaf2de08f9$var$WorkerFS(opts.id, (0, (/*@__PURE__*/$parcel$interopDefault($dbd1ba8e1b3841ba$exports)))(opts.handle));
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
        filePath = (0, ($parcel$interopDefault($5X5qb$path))).normalize(filePath);
        if (!filePath.startsWith(this.cwd())) filePath = (0, ($parcel$interopDefault($5X5qb$path))).resolve(this.cwd(), filePath);
        // get realpath by following symlinks
        let { root: root, dir: dir, base: base } = (0, ($parcel$interopDefault($5X5qb$path))).parse(filePath);
        let parts = dir.slice(root.length).split((0, ($parcel$interopDefault($5X5qb$path))).sep).concat(base);
        // If the realpath option is not true, don't follow the final link
        let last;
        if (!realpath) {
            last = parts[parts.length - 1];
            parts = parts.slice(0, -1);
        }
        let res = root;
        for (let part of parts){
            res = (0, ($parcel$interopDefault($5X5qb$path))).join(res, part);
            let symlink = this.symlinks.get(res);
            if (symlink) res = symlink;
        }
        if (last) res = (0, ($parcel$interopDefault($5X5qb$path))).join(res, last);
        return res;
    }
    async writeFile(filePath, contents, options) {
        filePath = this._normalizePath(filePath);
        if (this.dirs.has(filePath)) throw new $989d2eaaf2de08f9$export$d414276624ebf134('EISDIR', filePath, 'is a directory');
        let dir = (0, ($parcel$interopDefault($5X5qb$path))).dirname(filePath);
        if (!this.dirs.has(dir)) throw new $989d2eaaf2de08f9$export$d414276624ebf134('ENOENT', dir, 'does not exist');
        let buffer = $989d2eaaf2de08f9$export$df9eb3e75aa27a22(contents);
        let file = this.files.get(filePath);
        let mode = options && options.mode || 438;
        if (file) {
            file.write(buffer, mode);
            this.files.set(filePath, file);
        } else this.files.set(filePath, new $989d2eaaf2de08f9$export$b6afa8811b7e644e(buffer, mode));
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
        if (file == null) throw new $989d2eaaf2de08f9$export$d414276624ebf134('ENOENT', filePath, 'does not exist');
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
        if (file == null) throw new $989d2eaaf2de08f9$export$d414276624ebf134('ENOENT', filePath, 'does not exist');
        return file.stat();
    }
    // eslint-disable-next-line require-await
    async stat(filePath) {
        return this.statSync(filePath);
    }
    lstatSync(filePath) {
        filePath = this._normalizePath(filePath, false);
        if (this.symlinks.has(filePath)) {
            let stat = new $989d2eaaf2de08f9$var$Stat();
            stat.mode = $989d2eaaf2de08f9$var$S_IFLNK;
            return stat;
        }
        let dir = this.dirs.get(filePath);
        if (dir) return dir.stat();
        let file = this.files.get(filePath);
        if (file == null) throw new $989d2eaaf2de08f9$export$d414276624ebf134('ENOENT', filePath, 'does not exist');
        return file.stat();
    }
    // eslint-disable-next-line require-await
    async lstat(filePath) {
        return this.lstatSync(filePath);
    }
    readdirSync(dir, opts) {
        dir = this._normalizePath(dir);
        if (!this.dirs.has(dir)) throw new $989d2eaaf2de08f9$export$d414276624ebf134('ENOENT', dir, 'does not exist');
        if (!dir.endsWith((0, ($parcel$interopDefault($5X5qb$path))).sep)) dir += (0, ($parcel$interopDefault($5X5qb$path))).sep;
        let res = [];
        for (let [filePath, entry] of this.dirs){
            if (filePath === dir) continue;
            if (filePath.startsWith(dir) && filePath.indexOf((0, ($parcel$interopDefault($5X5qb$path))).sep, dir.length) === -1) {
                let name = filePath.slice(dir.length);
                if (opts?.withFileTypes) res.push(new $989d2eaaf2de08f9$var$Dirent(name, entry));
                else res.push(name);
            }
        }
        for (let [filePath, entry] of this.files)if (filePath.startsWith(dir) && filePath.indexOf((0, ($parcel$interopDefault($5X5qb$path))).sep, dir.length) === -1) {
            let name = filePath.slice(dir.length);
            if (opts?.withFileTypes) res.push(new $989d2eaaf2de08f9$var$Dirent(name, entry));
            else res.push(name);
        }
        for (let [from] of this.symlinks)if (from.startsWith(dir) && from.indexOf((0, ($parcel$interopDefault($5X5qb$path))).sep, dir.length) === -1) {
            let name = from.slice(dir.length);
            if (opts?.withFileTypes) res.push(new $989d2eaaf2de08f9$var$Dirent(name, {
                mode: $989d2eaaf2de08f9$var$S_IFLNK
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
        if (!this.files.has(filePath) && !this.dirs.has(filePath)) throw new $989d2eaaf2de08f9$export$d414276624ebf134('ENOENT', filePath, 'does not exist');
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
        if (this.files.has(dir)) throw new $989d2eaaf2de08f9$export$d414276624ebf134('ENOENT', dir, 'is not a directory');
        let root = (0, ($parcel$interopDefault($5X5qb$path))).parse(dir).root;
        while(dir !== root){
            if (this.dirs.has(dir)) break;
            this.dirs.set(dir, new $989d2eaaf2de08f9$var$Directory());
            await this._sendWorkerEvent({
                type: 'mkdir',
                path: dir
            });
            this._triggerEvent({
                type: 'create',
                path: dir
            });
            dir = (0, ($parcel$interopDefault($5X5qb$path))).dirname(dir);
        }
        return Promise.resolve();
    }
    async rimraf(filePath) {
        filePath = this._normalizePath(filePath);
        if (this.dirs.has(filePath)) {
            let dir = filePath + (0, ($parcel$interopDefault($5X5qb$path))).sep;
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
                this.dirs.set(destination, new $989d2eaaf2de08f9$var$Directory());
                await this._sendWorkerEvent({
                    type: 'mkdir',
                    path: destination
                });
                this._triggerEvent({
                    type: 'create',
                    path: destination
                });
            }
            let dir = source + (0, ($parcel$interopDefault($5X5qb$path))).sep;
            for (let dirPath of this.dirs.keys())if (dirPath.startsWith(dir)) {
                let destName = (0, ($parcel$interopDefault($5X5qb$path))).join(destination, dirPath.slice(dir.length));
                if (!this.dirs.has(destName)) {
                    this.dirs.set(destName, new $989d2eaaf2de08f9$var$Directory());
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
                let destName = (0, ($parcel$interopDefault($5X5qb$path))).join(destination, filePath.slice(dir.length));
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
        return new $989d2eaaf2de08f9$var$ReadStream(this, filePath);
    }
    createWriteStream(filePath, options) {
        return new $989d2eaaf2de08f9$var$WriteStream(this, filePath, options);
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
        if (!symlink) throw new $989d2eaaf2de08f9$export$d414276624ebf134('EINVAL', filePath, 'is not a symlink');
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
                if (!dir.endsWith((0, ($parcel$interopDefault($5X5qb$path))).sep)) dir += (0, ($parcel$interopDefault($5X5qb$path))).sep;
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
        let watcher = new $989d2eaaf2de08f9$var$Watcher(fn, opts);
        let watchers = this.watchers.get(dir);
        if (!watchers) {
            watchers = new Set();
            this.watchers.set(dir, watchers);
        }
        watchers.add(watcher);
        return Promise.resolve({
            unsubscribe: ()=>{
                watchers = (0, (/*@__PURE__*/$parcel$interopDefault($dbd1ba8e1b3841ba$exports)))(watchers);
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
        if (ignore) events = events.filter((event)=>!ignore.some((i)=>event.path.startsWith(i + (0, ($parcel$interopDefault($5X5qb$path))).sep)));
        return events;
    }
    async writeSnapshot(dir, snapshot) {
        await this.writeFile(snapshot, '' + this.events.length);
    }
    findAncestorFile(fileNames, fromDir, root) {
        return (0, $97eb553301b18171$export$d51a93c758976388)(this, fileNames, fromDir, root);
    }
    findNodeModule(moduleName, fromDir) {
        return (0, $97eb553301b18171$export$4c6d088a7d7f9947)(this, moduleName, fromDir);
    }
    findFirstFile(filePaths) {
        return (0, $97eb553301b18171$export$64df6e3182fd5b2d)(this, filePaths);
    }
}
class $989d2eaaf2de08f9$var$Watcher {
    constructor(fn, options){
        this.fn = fn;
        this.options = options;
    }
    trigger(events) {
        let ignore = this.options.ignore;
        if (ignore) events = events.filter((event)=>!ignore.some((i)=>event.path.startsWith(i + (0, ($parcel$interopDefault($5X5qb$path))).sep)));
        if (events.length > 0) this.fn(null, events);
    }
}
class $989d2eaaf2de08f9$export$d414276624ebf134 extends Error {
    constructor(code, path, message){
        super(`${code}: ${path} ${message}`);
        this.name = 'FSError';
        this.code = code;
        this.path = path;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class $989d2eaaf2de08f9$var$ReadStream extends (0, $5X5qb$stream.Readable) {
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
class $989d2eaaf2de08f9$var$WriteStream extends (0, $5X5qb$stream.Writable) {
    constructor(fs, filePath, options){
        super({
            emitClose: true,
            autoDestroy: true
        });
        this.fs = fs;
        this.filePath = filePath;
        this.options = options;
        this.buffer = Buffer.alloc(0);
    }
    _write(chunk, encoding, callback) {
        let c = typeof chunk === 'string' ? Buffer.from(chunk, encoding) : chunk;
        this.buffer = Buffer.concat([
            this.buffer,
            c
        ]);
        callback();
    }
    _final(callback) {
        this.fs.writeFile(this.filePath, this.buffer, this.options).then(callback).catch(callback);
    }
}
const $989d2eaaf2de08f9$var$S_IFREG = 32768;
const $989d2eaaf2de08f9$var$S_IFDIR = 16384;
const $989d2eaaf2de08f9$var$S_IFLNK = 40960;
const $989d2eaaf2de08f9$var$S_IFMT = 61440;
class $989d2eaaf2de08f9$var$Entry {
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
        return $989d2eaaf2de08f9$var$Stat.fromEntry(this);
    }
}
class $989d2eaaf2de08f9$var$Stat {
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
        let stat = new $989d2eaaf2de08f9$var$Stat();
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
        return (this.mode & $989d2eaaf2de08f9$var$S_IFREG) === $989d2eaaf2de08f9$var$S_IFREG;
    }
    isDirectory() {
        return (this.mode & $989d2eaaf2de08f9$var$S_IFDIR) === $989d2eaaf2de08f9$var$S_IFDIR;
    }
    isBlockDevice() {
        return false;
    }
    isCharacterDevice() {
        return false;
    }
    isSymbolicLink() {
        return (this.mode & $989d2eaaf2de08f9$var$S_IFMT) === $989d2eaaf2de08f9$var$S_IFLNK;
    }
    isFIFO() {
        return false;
    }
    isSocket() {
        return false;
    }
}
class $989d2eaaf2de08f9$var$Dirent {
    #mode;
    constructor(name, entry){
        this.name = name;
        this.#mode = entry.mode;
    }
    isFile() {
        return (this.#mode & $989d2eaaf2de08f9$var$S_IFMT) === $989d2eaaf2de08f9$var$S_IFREG;
    }
    isDirectory() {
        return (this.#mode & $989d2eaaf2de08f9$var$S_IFMT) === $989d2eaaf2de08f9$var$S_IFDIR;
    }
    isBlockDevice() {
        return false;
    }
    isCharacterDevice() {
        return false;
    }
    isSymbolicLink() {
        return (this.#mode & $989d2eaaf2de08f9$var$S_IFMT) === $989d2eaaf2de08f9$var$S_IFLNK;
    }
    isFIFO() {
        return false;
    }
    isSocket() {
        return false;
    }
}
class $989d2eaaf2de08f9$export$b6afa8811b7e644e extends $989d2eaaf2de08f9$var$Entry {
    constructor(buffer, mode){
        super($989d2eaaf2de08f9$var$S_IFREG | mode);
        this.buffer = buffer;
    }
    read() {
        super.access();
        return Buffer.from(this.buffer);
    }
    write(buffer, mode) {
        super.modify($989d2eaaf2de08f9$var$S_IFREG | mode);
        this.buffer = buffer;
    }
    getSize() {
        return this.buffer.byteLength;
    }
}
class $989d2eaaf2de08f9$var$Directory extends $989d2eaaf2de08f9$var$Entry {
    constructor(){
        super($989d2eaaf2de08f9$var$S_IFDIR);
    }
}
function $989d2eaaf2de08f9$export$df9eb3e75aa27a22(contents) {
    if (typeof contents !== 'string' && contents.buffer instanceof (0, $5X5qb$parcelutils.SharedBuffer)) return contents;
    let contentsBuffer = contents;
    // $FlowFixMe
    if (process.browser) // For the polyfilled buffer module, it's faster to always convert once so that the subsequent
    // operations are fast (.byteLength and using .set instead of .write)
    contentsBuffer = contentsBuffer instanceof Buffer ? contentsBuffer : Buffer.from(contentsBuffer);
    let length = Buffer.byteLength(contentsBuffer);
    let shared = new (0, $5X5qb$parcelutils.SharedBuffer)(length);
    let buffer = Buffer.from(shared);
    if (length > 0) {
        if (typeof contentsBuffer === 'string') buffer.write(contentsBuffer);
        else buffer.set(contentsBuffer);
    }
    return buffer;
}
class $989d2eaaf2de08f9$var$WorkerFS extends $989d2eaaf2de08f9$export$3048eb7ec07c2c4e {
    constructor(id, handle){
        // TODO Make this not a subclass
        // $FlowFixMe
        super();
        this.id = id;
        this.handleFn = (methodName, args)=>(0, ($parcel$interopDefault($5X5qb$parcelworkers))).getWorkerApi().runHandle(handle, [
                methodName,
                args
            ]);
        this.handleFn('_registerWorker', [
            (0, ($parcel$interopDefault($5X5qb$parcelworkers))).getWorkerApi().createReverseHandle((event)=>{
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
                        this.dirs.set(event.path, new $989d2eaaf2de08f9$var$Directory());
                        break;
                    case 'symlink':
                        this.symlinks.set(event.path, event.target);
                        break;
                }
            })
        ]);
    }
    static deserialize(opts) {
        return (0, (/*@__PURE__*/$parcel$interopDefault($dbd1ba8e1b3841ba$exports)))($989d2eaaf2de08f9$var$instances.get(opts.id));
    }
    serialize() {
        // $FlowFixMe
        return {
            id: this.id
        };
    }
    writeFile(filePath, contents, options) {
        super.writeFile(filePath, contents, options);
        let buffer = $989d2eaaf2de08f9$export$df9eb3e75aa27a22(contents);
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
(0, $5X5qb$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($3c75fb0c8e4c22d9$exports))).version}:MemoryFS`, $989d2eaaf2de08f9$export$3048eb7ec07c2c4e);
(0, $5X5qb$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($3c75fb0c8e4c22d9$exports))).version}:WorkerFS`, $989d2eaaf2de08f9$var$WorkerFS);
(0, $5X5qb$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($3c75fb0c8e4c22d9$exports))).version}:Stat`, $989d2eaaf2de08f9$var$Stat);
(0, $5X5qb$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($3c75fb0c8e4c22d9$exports))).version}:File`, $989d2eaaf2de08f9$export$b6afa8811b7e644e);
(0, $5X5qb$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($3c75fb0c8e4c22d9$exports))).version}:Directory`, $989d2eaaf2de08f9$var$Directory);


var $fbaaed16e5702c7c$exports = {};

$parcel$export($fbaaed16e5702c7c$exports, "OverlayFS", () => $fbaaed16e5702c7c$export$5963299e2424ca1c);







class $fbaaed16e5702c7c$export$5963299e2424ca1c {
    deleted = new Set();
    constructor(workerFarmOrFS, readable){
        if (workerFarmOrFS instanceof (0, ($parcel$interopDefault($5X5qb$parcelworkers)))) this.writable = new (0, $989d2eaaf2de08f9$export$3048eb7ec07c2c4e)(workerFarmOrFS);
        else this.writable = workerFarmOrFS;
        this.readable = readable;
        this._cwd = readable.cwd();
    }
    static deserialize(opts) {
        let fs = new $fbaaed16e5702c7c$export$5963299e2424ca1c(opts.writable, opts.readable);
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
        if (this.deleted.has(filePath)) throw new $fbaaed16e5702c7c$var$FSError('ENOENT', filePath, 'does not exist');
        return filePath;
    }
    _checkExists(filePath) {
        filePath = this._deletedThrows(filePath);
        if (!this.existsSync(filePath)) throw new $fbaaed16e5702c7c$var$FSError('ENOENT', filePath, 'does not exist');
        return filePath;
    }
    _isSymlink(filePath) {
        filePath = this._normalizePath(filePath);
        // Check the parts of the path to see if any are symlinks.
        let { root: root, dir: dir, base: base } = (0, ($parcel$interopDefault($5X5qb$path))).parse(filePath);
        let segments = dir.slice(root.length).split((0, ($parcel$interopDefault($5X5qb$path))).sep).concat(base);
        while(segments.length){
            filePath = (0, ($parcel$interopDefault($5X5qb$path))).join(root, ...segments);
            let name = segments.pop();
            if (this.deleted.has(filePath)) return false;
            else if (this.writable instanceof (0, $989d2eaaf2de08f9$export$3048eb7ec07c2c4e) && this.writable.symlinks.has(filePath)) return true;
            else {
                // HACK: Parcel fs does not provide `lstatSync`,
                // so we use `readdirSync` to check if the path is a symlink.
                let parent = (0, ($parcel$interopDefault($5X5qb$path))).resolve(filePath, '..');
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
        let dirPath = (0, ($parcel$interopDefault($5X5qb$path))).dirname(filePath);
        if (this.existsSync(dirPath) && !this.writable.existsSync(dirPath)) await this.writable.mkdirp(dirPath);
        return filePath;
    }
    _normalizePath(filePath) {
        return (0, ($parcel$interopDefault($5X5qb$path))).resolve(this.cwd(), filePath);
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
        if (this.writable instanceof (0, $989d2eaaf2de08f9$export$3048eb7ec07c2c4e) && this._isSymlink(filePath)) this.writable.symlinks.delete(filePath);
        else if (this.statSync(filePath).isDirectory()) {
            let stack = [
                filePath
            ];
            // Recursively add every descendant path to deleted.
            while(stack.length){
                let root = (0, (/*@__PURE__*/$parcel$interopDefault($dbd1ba8e1b3841ba$exports)))(stack.pop());
                for (let ent of this.readdirSync(root, {
                    withFileTypes: true
                }))if (typeof ent === 'string') {
                    let childPath = (0, ($parcel$interopDefault($5X5qb$path))).join(root, ent);
                    toDelete.push(childPath);
                    if (this.statSync(childPath).isDirectory()) stack.push(childPath);
                } else {
                    let childPath = (0, ($parcel$interopDefault($5X5qb$path))).join(root, ent.name);
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
            let root = (0, ($parcel$interopDefault($5X5qb$path))).parse(dir).root;
            while(dir !== root){
                this.deleted.delete(dir);
                dir = (0, ($parcel$interopDefault($5X5qb$path))).dirname(dir);
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
                let filePath = (0, ($parcel$interopDefault($5X5qb$path))).join(dir, entry.name ?? entry);
                if (this.deleted.has(filePath)) continue;
                entries.set(filePath, entry);
            }
        } catch  {
        // noop
        }
        try {
            for (let entry of this.readable.readdirSync(dir, opts)){
                let filePath = (0, ($parcel$interopDefault($5X5qb$path))).join(dir, entry.name ?? entry);
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
        return (0, $97eb553301b18171$export$d51a93c758976388)(this, fileNames, fromDir, root);
    }
    findNodeModule(moduleName, fromDir) {
        return (0, $97eb553301b18171$export$4c6d088a7d7f9947)(this, moduleName, fromDir);
    }
    findFirstFile(filePaths) {
        return (0, $97eb553301b18171$export$64df6e3182fd5b2d)(this, filePaths);
    }
}
class $fbaaed16e5702c7c$var$FSError extends Error {
    constructor(code, path, message){
        super(`${code}: ${path} ${message}`);
        this.name = 'FSError';
        this.code = code;
        this.path = path;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
(0, $5X5qb$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($3c75fb0c8e4c22d9$exports))).version}:OverlayFS`, $fbaaed16e5702c7c$export$5963299e2424ca1c);


const $089d94f02de2cc72$var$pipeline = (0, $5X5qb$util.promisify)((0, ($parcel$interopDefault($5X5qb$stream))).pipeline);
async function $089d94f02de2cc72$export$d3a8044e3fef7335(sourceFS, source, destinationFS, destination) {
    await destinationFS.mkdirp(destination);
    let files = await sourceFS.readdir(source);
    for (let file of files){
        let sourcePath = (0, ($parcel$interopDefault($5X5qb$path))).join(source, file);
        let destPath = (0, ($parcel$interopDefault($5X5qb$path))).join(destination, file);
        let stats = await sourceFS.stat(sourcePath);
        if (stats.isFile()) await $089d94f02de2cc72$var$pipeline(sourceFS.createReadStream(sourcePath), destinationFS.createWriteStream(destPath));
        else if (stats.isDirectory()) await $089d94f02de2cc72$export$d3a8044e3fef7335(sourceFS, sourcePath, destinationFS, destPath);
    }
}
$parcel$exportWildcard(module.exports, $2a386c23470d420c$exports);
$parcel$exportWildcard(module.exports, $989d2eaaf2de08f9$exports);
$parcel$exportWildcard(module.exports, $fbaaed16e5702c7c$exports);


//# sourceMappingURL=index.js.map
