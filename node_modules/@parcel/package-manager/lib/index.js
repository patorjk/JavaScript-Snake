var $i45p4$fs = require("fs");
var $i45p4$child_process = require("child_process");
var $i45p4$path = require("path");
var $i45p4$parcelcore = require("@parcel/core");
var $i45p4$parceldiagnostic = require("@parcel/diagnostic");
var $i45p4$parcelfs = require("@parcel/fs");
var $i45p4$module = require("module");
var $i45p4$semver = require("semver");
var $i45p4$parcellogger = require("@parcel/logger");
var $i45p4$parcelutils = require("@parcel/utils");
var $i45p4$parcelnoderesolvercore = require("@parcel/node-resolver-core");
var $i45p4$url = require("url");
var $i45p4$swccore = require("@swc/core");
var $i45p4$assert = require("assert");
var $i45p4$util = require("util");
var $i45p4$parcelworkers = require("@parcel/workers");
var $i45p4$stream = require("stream");
var $i45p4$string_decoder = require("string_decoder");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    
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

var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire94c2"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire94c2"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("12izX", function(module, exports) {
module.exports = $0c1463b961b3f1b4$var$isexe;
$0c1463b961b3f1b4$var$isexe.sync = $0c1463b961b3f1b4$var$sync;

function $0c1463b961b3f1b4$var$checkPathExt(path, options) {
    var pathext = options.pathExt !== undefined ? options.pathExt : process.env.PATHEXT;
    if (!pathext) return true;
    pathext = pathext.split(';');
    if (pathext.indexOf('') !== -1) return true;
    for(var i = 0; i < pathext.length; i++){
        var p = pathext[i].toLowerCase();
        if (p && path.substr(-p.length).toLowerCase() === p) return true;
    }
    return false;
}
function $0c1463b961b3f1b4$var$checkStat(stat, path, options) {
    if (!stat.isSymbolicLink() && !stat.isFile()) return false;
    return $0c1463b961b3f1b4$var$checkPathExt(path, options);
}
function $0c1463b961b3f1b4$var$isexe(path, options, cb) {
    $i45p4$fs.stat(path, function(er, stat) {
        cb(er, er ? false : $0c1463b961b3f1b4$var$checkStat(stat, path, options));
    });
}
function $0c1463b961b3f1b4$var$sync(path, options) {
    return $0c1463b961b3f1b4$var$checkStat($i45p4$fs.statSync(path), path, options);
}

});

parcelRegister("fYIqr", function(module, exports) {
module.exports = $ba1eeb918b75f5a8$var$isexe;
$ba1eeb918b75f5a8$var$isexe.sync = $ba1eeb918b75f5a8$var$sync;

function $ba1eeb918b75f5a8$var$isexe(path, options, cb) {
    $i45p4$fs.stat(path, function(er, stat) {
        cb(er, er ? false : $ba1eeb918b75f5a8$var$checkStat(stat, options));
    });
}
function $ba1eeb918b75f5a8$var$sync(path, options) {
    return $ba1eeb918b75f5a8$var$checkStat($i45p4$fs.statSync(path), options);
}
function $ba1eeb918b75f5a8$var$checkStat(stat, options) {
    return stat.isFile() && $ba1eeb918b75f5a8$var$checkMode(stat, options);
}
function $ba1eeb918b75f5a8$var$checkMode(stat, options) {
    var mod = stat.mode;
    var uid = stat.uid;
    var gid = stat.gid;
    var myUid = options.uid !== undefined ? options.uid : process.getuid && process.getuid();
    var myGid = options.gid !== undefined ? options.gid : process.getgid && process.getgid();
    var u = parseInt('100', 8);
    var g = parseInt('010', 8);
    var o = parseInt('001', 8);
    var ug = u | g;
    var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
    return ret;
}

});

parcelRegister("3lhdG", function(module, exports) {
'use strict';

var $26f0b0c0ae54f47e$require$exec = $i45p4$child_process.exec;

var $26f0b0c0ae54f47e$require$execSync = $i45p4$child_process.execSync;


var $26f0b0c0ae54f47e$var$access = $i45p4$fs.access;
var $26f0b0c0ae54f47e$var$accessSync = $i45p4$fs.accessSync;
var $26f0b0c0ae54f47e$var$constants = $i45p4$fs.constants || $i45p4$fs;
var $26f0b0c0ae54f47e$var$isUsingWindows = process.platform == 'win32';
var $26f0b0c0ae54f47e$var$fileNotExists = function(commandName, callback) {
    $26f0b0c0ae54f47e$var$access(commandName, $26f0b0c0ae54f47e$var$constants.F_OK, function(err) {
        callback(!err);
    });
};
var $26f0b0c0ae54f47e$var$fileNotExistsSync = function(commandName) {
    try {
        $26f0b0c0ae54f47e$var$accessSync(commandName, $26f0b0c0ae54f47e$var$constants.F_OK);
        return false;
    } catch (e) {
        return true;
    }
};
var $26f0b0c0ae54f47e$var$localExecutable = function(commandName, callback) {
    $26f0b0c0ae54f47e$var$access(commandName, $26f0b0c0ae54f47e$var$constants.F_OK | $26f0b0c0ae54f47e$var$constants.X_OK, function(err) {
        callback(null, !err);
    });
};
var $26f0b0c0ae54f47e$var$localExecutableSync = function(commandName) {
    try {
        $26f0b0c0ae54f47e$var$accessSync(commandName, $26f0b0c0ae54f47e$var$constants.F_OK | $26f0b0c0ae54f47e$var$constants.X_OK);
        return true;
    } catch (e) {
        return false;
    }
};
var $26f0b0c0ae54f47e$var$commandExistsUnix = function(commandName, cleanedCommandName, callback) {
    $26f0b0c0ae54f47e$var$fileNotExists(commandName, function(isFile) {
        if (!isFile) {
            var child = $26f0b0c0ae54f47e$require$exec('command -v ' + cleanedCommandName + ' 2>/dev/null' + ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }', function(error, stdout, stderr) {
                callback(null, !!stdout);
            });
            return;
        }
        $26f0b0c0ae54f47e$var$localExecutable(commandName, callback);
    });
};
var $26f0b0c0ae54f47e$var$commandExistsWindows = function(commandName, cleanedCommandName, callback) {
    // Regex from Julio from: https://stackoverflow.com/questions/51494579/regex-windows-path-validator
    if (!/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:(?:[^<>:"\|\?\*\n])+(?:\/\/|\/|\\\\|\\)?)+$/m.test(commandName)) {
        callback(null, false);
        return;
    }
    var child = $26f0b0c0ae54f47e$require$exec('where ' + cleanedCommandName, function(error) {
        if (error !== null) callback(null, false);
        else callback(null, true);
    });
};
var $26f0b0c0ae54f47e$var$commandExistsUnixSync = function(commandName, cleanedCommandName) {
    if ($26f0b0c0ae54f47e$var$fileNotExistsSync(commandName)) try {
        var stdout = $26f0b0c0ae54f47e$require$execSync('command -v ' + cleanedCommandName + ' 2>/dev/null' + ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }');
        return !!stdout;
    } catch (error) {
        return false;
    }
    return $26f0b0c0ae54f47e$var$localExecutableSync(commandName);
};
var $26f0b0c0ae54f47e$var$commandExistsWindowsSync = function(commandName, cleanedCommandName, callback) {
    // Regex from Julio from: https://stackoverflow.com/questions/51494579/regex-windows-path-validator
    if (!/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:(?:[^<>:"\|\?\*\n])+(?:\/\/|\/|\\\\|\\)?)+$/m.test(commandName)) return false;
    try {
        var stdout = $26f0b0c0ae54f47e$require$execSync('where ' + cleanedCommandName, {
            stdio: []
        });
        return !!stdout;
    } catch (error) {
        return false;
    }
};
var $26f0b0c0ae54f47e$var$cleanInput = function(s) {
    if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
        s = "'" + s.replace(/'/g, "'\\''") + "'";
        s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
        .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    return s;
};
if ($26f0b0c0ae54f47e$var$isUsingWindows) $26f0b0c0ae54f47e$var$cleanInput = function(s) {
    var isPathName = /[\\]/.test(s);
    if (isPathName) {
        var dirname = '"' + $i45p4$path.dirname(s) + '"';
        var basename = '"' + $i45p4$path.basename(s) + '"';
        return dirname + ':' + basename;
    }
    return '"' + s + '"';
};
module.exports = function commandExists(commandName, callback) {
    var cleanedCommandName = $26f0b0c0ae54f47e$var$cleanInput(commandName);
    if (!callback && typeof Promise !== 'undefined') return new Promise(function(resolve, reject) {
        commandExists(commandName, function(error, output) {
            if (output) resolve(commandName);
            else reject(error);
        });
    });
    if ($26f0b0c0ae54f47e$var$isUsingWindows) $26f0b0c0ae54f47e$var$commandExistsWindows(commandName, cleanedCommandName, callback);
    else $26f0b0c0ae54f47e$var$commandExistsUnix(commandName, cleanedCommandName, callback);
};
module.exports.sync = function(commandName) {
    var cleanedCommandName = $26f0b0c0ae54f47e$var$cleanInput(commandName);
    if ($26f0b0c0ae54f47e$var$isUsingWindows) return $26f0b0c0ae54f47e$var$commandExistsWindowsSync(commandName, cleanedCommandName);
    else return $26f0b0c0ae54f47e$var$commandExistsUnixSync(commandName, cleanedCommandName);
};

});

parcelRegister("jd2hZ", function(module, exports) {

$parcel$export(module.exports, "NodePackageManager", () => NodePackageManager, (v) => NodePackageManager = v);









var $axmO7 = parcelRequire("axmO7");


var $32AGp = parcelRequire("32AGp");

var $b3vcY = parcelRequire("b3vcY");

var $jeDhm = parcelRequire("jeDhm");



// Package.json fields. Must match package_json.rs.
const MAIN = 1;
const SOURCE = 4;
const ENTRIES = MAIN | ((0, process.env.PARCEL_SELF_BUILD) ? SOURCE : 0);
const NODE_MODULES = `${(0, ($parcel$interopDefault($i45p4$path))).sep}node_modules${(0, ($parcel$interopDefault($i45p4$path))).sep}`;
const IS_FILE = 1;
const IS_DIR = 2;
const IS_SYMLINK = 4;
// There can be more than one instance of NodePackageManager, but node has only a single module cache.
// Therefore, the resolution cache and the map of parent to child modules should also be global.
const cache = new Map();
const children = new Map();
const invalidationsCache = new Map();
class NodePackageManager {
    constructor(fs, projectRoot, installer){
        this.fs = fs;
        this.projectRoot = projectRoot;
        this.installer = installer;
        // $FlowFixMe - no type for _extensions
        this.currentExtensions = Object.keys((0, ($parcel$interopDefault($i45p4$module)))._extensions).map((e)=>e.substring(1));
    }
    _createResolver() {
        return new (0, $i45p4$parcelnoderesolvercore.ResolverBase)(this.projectRoot, {
            fs: this.fs instanceof (0, $i45p4$parcelfs.NodeFS) && process.versions.pnp == null ? undefined : {
                read: (path)=>this.fs.readFileSync(path),
                kind: (path)=>{
                    let flags = 0;
                    try {
                        let stat = this.fs.lstatSync(path);
                        if (stat.isSymbolicLink()) {
                            flags |= IS_SYMLINK;
                            stat = this.fs.statSync(path);
                        }
                        if (stat.isFile()) flags |= IS_FILE;
                        else if (stat.isDirectory()) flags |= IS_DIR;
                    } catch (err) {
                    // ignore
                    }
                    return flags;
                },
                readLink: (path)=>this.fs.readlinkSync(path)
            },
            mode: 2,
            entries: ENTRIES,
            packageExports: true,
            moduleDirResolver: process.versions.pnp != null ? (module1, from)=>{
                // $FlowFixMe[prop-missing]
                let pnp = (0, ($parcel$interopDefault($i45p4$module))).findPnpApi((0, ($parcel$interopDefault($i45p4$path))).dirname(from));
                return pnp.resolveToUnqualified(// append slash to force loading builtins from npm
                module1 + '/', from);
            } : undefined,
            extensions: this.currentExtensions,
            typescript: true
        });
    }
    static deserialize(opts) {
        return new NodePackageManager(opts.fs, opts.projectRoot, opts.installer);
    }
    serialize() {
        return {
            $$raw: false,
            fs: this.fs,
            projectRoot: this.projectRoot,
            installer: this.installer
        };
    }
    async require(name, from, opts) {
        let { resolved, type } = await this.resolve(name, from, opts);
        if (type === 2) {
            (0, ($parcel$interopDefault($i45p4$parcellogger))).warn({
                message: 'ES module dependencies are experimental.',
                origin: '@parcel/package-manager',
                codeFrames: [
                    {
                        filePath: resolved,
                        codeHighlights: []
                    }
                ]
            });
            // On Windows, Node requires absolute paths to be file URLs.
            if (process.platform === 'win32' && (0, ($parcel$interopDefault($i45p4$path))).isAbsolute(resolved)) resolved = (0, $i45p4$url.pathToFileURL)(resolved);
            // $FlowFixMe
            return import(resolved);
        }
        return this.load(resolved, from);
    }
    requireSync(name, from) {
        let { resolved } = this.resolveSync(name, from);
        return this.load(resolved, from);
    }
    load(filePath, from) {
        if (!(0, ($parcel$interopDefault($i45p4$path))).isAbsolute(filePath)) // Node builtin module
        // $FlowFixMe
        return require(filePath);
        // $FlowFixMe[prop-missing]
        const cachedModule = (0, ($parcel$interopDefault($i45p4$module)))._cache[filePath];
        if (cachedModule !== undefined) return cachedModule.exports;
        // $FlowFixMe
        let m = new (0, ($parcel$interopDefault($i45p4$module)))(filePath, (0, ($parcel$interopDefault($i45p4$module)))._cache[from] || module.parent);
        // $FlowFixMe _extensions not in type
        const extensions = Object.keys((0, ($parcel$interopDefault($i45p4$module)))._extensions);
        // This handles supported extensions changing due to, for example, esbuild/register being used
        // We assume that the extension list will change in size - as these tools usually add support for
        // additional extensions.
        if (extensions.length !== this.currentExtensions.length) {
            this.currentExtensions = extensions.map((e)=>e.substring(1));
            this.resolver = this._createResolver();
        }
        // $FlowFixMe[prop-missing]
        (0, ($parcel$interopDefault($i45p4$module)))._cache[filePath] = m;
        // Patch require within this module so it goes through our require
        m.require = (id)=>{
            return this.requireSync(id, filePath);
        };
        // Patch `fs.readFileSync` temporarily so that it goes through our file system
        let { readFileSync, statSync } = (0, ($parcel$interopDefault($i45p4$fs)));
        // $FlowFixMe
        (0, ($parcel$interopDefault($i45p4$fs))).readFileSync = (filename, encoding)=>{
            return this.fs.readFileSync(filename, encoding);
        };
        // $FlowFixMe
        (0, ($parcel$interopDefault($i45p4$fs))).statSync = (filename)=>{
            return this.fs.statSync(filename);
        };
        if (!filePath.includes(NODE_MODULES)) {
            let extname = (0, ($parcel$interopDefault($i45p4$path))).extname(filePath);
            if ((extname === '.ts' || extname === '.tsx' || extname === '.mts' || extname === '.cts') && // $FlowFixMe
            !(0, ($parcel$interopDefault($i45p4$module)))._extensions[extname]) {
                let compile = m._compile;
                m._compile = (code, filename)=>{
                    let out = (0, $i45p4$swccore.transformSync)(code, {
                        filename: filename,
                        module: {
                            type: 'commonjs'
                        }
                    });
                    compile.call(m, out.code, filename);
                };
                // $FlowFixMe
                (0, ($parcel$interopDefault($i45p4$module)))._extensions[extname] = (m, filename)=>{
                    // $FlowFixMe
                    delete (0, ($parcel$interopDefault($i45p4$module)))._extensions[extname];
                    // $FlowFixMe
                    (0, ($parcel$interopDefault($i45p4$module)))._extensions['.js'](m, filename);
                };
            }
        }
        try {
            m.load(filePath);
        } catch (err) {
            // $FlowFixMe[prop-missing]
            delete (0, ($parcel$interopDefault($i45p4$module)))._cache[filePath];
            throw err;
        } finally{
            // $FlowFixMe
            (0, ($parcel$interopDefault($i45p4$fs))).readFileSync = readFileSync;
            // $FlowFixMe
            (0, ($parcel$interopDefault($i45p4$fs))).statSync = statSync;
        }
        return m.exports;
    }
    async resolve(id, from, options) {
        let basedir = (0, ($parcel$interopDefault($i45p4$path))).dirname(from);
        let key = basedir + ':' + id;
        let resolved = cache.get(key);
        if (!resolved) {
            let [name] = (0, $i45p4$parcelutils.getModuleParts)(id);
            try {
                resolved = this.resolveInternal(id, from);
            } catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND' || options?.shouldAutoInstall !== true || id.startsWith('.') // a local file, don't autoinstall
                ) {
                    if (e.code === 'MODULE_NOT_FOUND' && options?.shouldAutoInstall !== true) {
                        let err = new (0, ($parcel$interopDefault($i45p4$parceldiagnostic)))({
                            diagnostic: {
                                message: (0, $i45p4$parceldiagnostic.escapeMarkdown)(e.message),
                                hints: [
                                    'Autoinstall is disabled, please install this package manually and restart Parcel.'
                                ]
                            }
                        });
                        // $FlowFixMe - needed for loadParcelPlugin
                        err.code = 'MODULE_NOT_FOUND';
                        throw err;
                    } else throw e;
                }
                let conflicts = await (0, $32AGp.getConflictingLocalDependencies)(this.fs, name, from, this.projectRoot);
                if (conflicts == null) {
                    this.invalidate(id, from);
                    await this.install([
                        {
                            name: name,
                            range: options?.range
                        }
                    ], from, {
                        saveDev: options?.saveDev ?? true
                    });
                    return this.resolve(id, from, {
                        ...options,
                        shouldAutoInstall: false
                    });
                }
                throw new (0, ($parcel$interopDefault($i45p4$parceldiagnostic)))({
                    diagnostic: conflicts.fields.map((field)=>({
                            message: (0, $i45p4$parceldiagnostic.md)`Could not find module "${name}", but it was listed in package.json. Run your package manager first.`,
                            origin: '@parcel/package-manager',
                            codeFrames: [
                                {
                                    filePath: conflicts.filePath,
                                    language: 'json',
                                    code: conflicts.json,
                                    codeHighlights: (0, $i45p4$parceldiagnostic.generateJSONCodeHighlights)(conflicts.json, [
                                        {
                                            key: `/${field}/${(0, $i45p4$parceldiagnostic.encodeJSONKeyComponent)(name)}`,
                                            type: 'key',
                                            message: 'Defined here, but not installed'
                                        }
                                    ])
                                }
                            ]
                        }))
                });
            }
            let range = options?.range;
            if (range != null) {
                let pkg = resolved.pkg;
                if (pkg == null || !(0, ($parcel$interopDefault($i45p4$semver))).satisfies(pkg.version, range)) {
                    let conflicts = await (0, $32AGp.getConflictingLocalDependencies)(this.fs, name, from, this.projectRoot);
                    if (conflicts == null && options?.shouldAutoInstall === true) {
                        this.invalidate(id, from);
                        await this.install([
                            {
                                name: name,
                                range: range
                            }
                        ], from);
                        return this.resolve(id, from, {
                            ...options,
                            shouldAutoInstall: false
                        });
                    } else if (conflicts != null) throw new (0, ($parcel$interopDefault($i45p4$parceldiagnostic)))({
                        diagnostic: {
                            message: (0, $i45p4$parceldiagnostic.md)`Could not find module "${name}" satisfying ${range}.`,
                            origin: '@parcel/package-manager',
                            codeFrames: [
                                {
                                    filePath: conflicts.filePath,
                                    language: 'json',
                                    code: conflicts.json,
                                    codeHighlights: (0, $i45p4$parceldiagnostic.generateJSONCodeHighlights)(conflicts.json, conflicts.fields.map((field)=>({
                                            key: `/${field}/${(0, $i45p4$parceldiagnostic.encodeJSONKeyComponent)(name)}`,
                                            type: 'key',
                                            message: 'Found this conflicting local requirement.'
                                        })))
                                }
                            ]
                        }
                    });
                    let version = pkg?.version;
                    let message = (0, $i45p4$parceldiagnostic.md)`Could not resolve package "${name}" that satisfies ${range}.`;
                    if (version != null) message += (0, $i45p4$parceldiagnostic.md)` Found ${version}.`;
                    throw new (0, ($parcel$interopDefault($i45p4$parceldiagnostic)))({
                        diagnostic: {
                            message: message,
                            hints: [
                                'Looks like the incompatible version was installed transitively. Add this package as a direct dependency with a compatible version range.'
                            ]
                        }
                    });
                }
            }
            cache.set(key, resolved);
            invalidationsCache.clear();
            // Add the specifier as a child to the parent module.
            // Don't do this if the specifier was an absolute path, as this was likely a dynamically resolved path
            // (e.g. babel uses require() to load .babelrc.js configs and we don't want them to be added  as children of babel itself).
            if (!(0, ($parcel$interopDefault($i45p4$path))).isAbsolute(name)) {
                let moduleChildren = children.get(from);
                if (!moduleChildren) {
                    moduleChildren = new Set();
                    children.set(from, moduleChildren);
                }
                moduleChildren.add(name);
            }
        }
        return resolved;
    }
    resolveSync(name, from) {
        let basedir = (0, ($parcel$interopDefault($i45p4$path))).dirname(from);
        let key = basedir + ':' + name;
        let resolved = cache.get(key);
        if (!resolved) {
            resolved = this.resolveInternal(name, from);
            cache.set(key, resolved);
            invalidationsCache.clear();
            if (!(0, ($parcel$interopDefault($i45p4$path))).isAbsolute(name)) {
                let moduleChildren = children.get(from);
                if (!moduleChildren) {
                    moduleChildren = new Set();
                    children.set(from, moduleChildren);
                }
                moduleChildren.add(name);
            }
        }
        return resolved;
    }
    async install(modules, from, opts) {
        await (0, $b3vcY.installPackage)(this.fs, this, modules, from, this.projectRoot, {
            packageInstaller: this.installer,
            ...opts
        });
    }
    getInvalidations(name, from) {
        let basedir = (0, ($parcel$interopDefault($i45p4$path))).dirname(from);
        let resolved = cache.get(basedir + ':' + name);
        if (resolved && (0, ($parcel$interopDefault($i45p4$path))).isAbsolute(resolved.resolved)) {
            let cached = invalidationsCache.get(resolved.resolved);
            if (cached != null) return cached;
            let res = {
                invalidateOnFileCreate: [],
                invalidateOnFileChange: new Set(),
                invalidateOnStartup: false
            };
            let seen = new Set();
            let addKey = (name, from)=>{
                let basedir = (0, ($parcel$interopDefault($i45p4$path))).dirname(from);
                let key = basedir + ':' + name;
                if (seen.has(key)) return;
                seen.add(key);
                let resolved = cache.get(key);
                if (!resolved || !(0, ($parcel$interopDefault($i45p4$path))).isAbsolute(resolved.resolved)) return;
                res.invalidateOnFileCreate.push(...resolved.invalidateOnFileCreate);
                res.invalidateOnFileChange.add(resolved.resolved);
                for (let file of resolved.invalidateOnFileChange)res.invalidateOnFileChange.add(file);
                let moduleChildren = children.get(resolved.resolved);
                if (moduleChildren) for (let specifier of moduleChildren)addKey(specifier, resolved.resolved);
            };
            addKey(name, from);
            // If this is an ES module, we won't have any of the dependencies because import statements
            // cannot be intercepted. Instead, ask the resolver to parse the file and recursively analyze the deps.
            if (resolved.type === 2) {
                let invalidations = this.resolver.getInvalidations(resolved.resolved);
                invalidations.invalidateOnFileChange.forEach((i)=>res.invalidateOnFileChange.add(i));
                invalidations.invalidateOnFileCreate.forEach((i)=>res.invalidateOnFileCreate.push(i));
                res.invalidateOnStartup ||= invalidations.invalidateOnStartup;
                if (res.invalidateOnStartup) (0, ($parcel$interopDefault($i45p4$parcellogger))).warn({
                    message: (0, $i45p4$parceldiagnostic.md)`${(0, ($parcel$interopDefault($i45p4$path))).relative(this.projectRoot, resolved.resolved)} contains non-statically analyzable dependencies in its module graph. This causes Parcel to invalidate the cache on startup.`,
                    origin: '@parcel/package-manager'
                });
            }
            invalidationsCache.set(resolved.resolved, res);
            return res;
        }
        return {
            invalidateOnFileCreate: [],
            invalidateOnFileChange: new Set(),
            invalidateOnStartup: false
        };
    }
    invalidate(name, from) {
        let seen = new Set();
        let invalidate = (name, from)=>{
            let basedir = (0, ($parcel$interopDefault($i45p4$path))).dirname(from);
            let key = basedir + ':' + name;
            if (seen.has(key)) return;
            seen.add(key);
            let resolved = cache.get(key);
            if (!resolved || !(0, ($parcel$interopDefault($i45p4$path))).isAbsolute(resolved.resolved)) return;
            invalidationsCache.delete(resolved.resolved);
            // $FlowFixMe
            let module1 = (0, ($parcel$interopDefault($i45p4$module)))._cache[resolved.resolved];
            if (module1) // $FlowFixMe
            delete (0, ($parcel$interopDefault($i45p4$module)))._cache[resolved.resolved];
            let moduleChildren = children.get(resolved.resolved);
            if (moduleChildren) for (let specifier of moduleChildren)invalidate(specifier, resolved.resolved);
            children.delete(resolved.resolved);
            cache.delete(key);
        };
        invalidate(name, from);
        this.resolver = this._createResolver();
    }
    resolveInternal(name, from) {
        if (this.resolver == null) this.resolver = this._createResolver();
        let res = this.resolver.resolve({
            filename: name,
            specifierType: 'commonjs',
            parent: from
        });
        // Invalidate whenever the .pnp.js file changes.
        // TODO: only when we actually resolve a node_modules package?
        if (process.versions.pnp != null && res.invalidateOnFileChange) {
            // $FlowFixMe[prop-missing]
            let pnp = (0, ($parcel$interopDefault($i45p4$module))).findPnpApi((0, ($parcel$interopDefault($i45p4$path))).dirname(from));
            res.invalidateOnFileChange.push(pnp.resolveToUnqualified('pnpapi', null));
        }
        if (res.error) {
            let e = new Error(`Could not resolve module "${name}" from "${from}"`);
            // $FlowFixMe
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        }
        let getPkg;
        switch(res.resolution.type){
            case 'Path':
                getPkg = ()=>{
                    let pkgPath = this.fs.findAncestorFile([
                        'package.json'
                    ], (0, (/*@__PURE__*/$parcel$interopDefault($axmO7)))(res.resolution.value), this.projectRoot);
                    return pkgPath ? JSON.parse(this.fs.readFileSync(pkgPath, 'utf8')) : null;
                };
            // fallthrough
            case 'Builtin':
                return {
                    resolved: res.resolution.value,
                    invalidateOnFileChange: new Set(res.invalidateOnFileChange),
                    invalidateOnFileCreate: res.invalidateOnFileCreate,
                    type: res.moduleType,
                    get pkg () {
                        return getPkg();
                    }
                };
            default:
                throw new Error('Unknown resolution type');
        }
    }
}
(0, $i45p4$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($jeDhm))).version}:NodePackageManager`, NodePackageManager);

});
parcelRegister("axmO7", function(module, exports) {
'use strict';
function $7abead83372a61d2$var$nullthrows(x, message) {
    if (x != null) return x;
    var error = new Error(message !== undefined ? message : 'Got unexpected ' + x);
    error.framesToPop = 1; // Skip nullthrows's own stack frame.
    throw error;
}
module.exports = $7abead83372a61d2$var$nullthrows;
module.exports.default = $7abead83372a61d2$var$nullthrows;
Object.defineProperty(module.exports, '__esModule', {
    value: true
});

});

parcelRegister("32AGp", function(module, exports) {

$parcel$export(module.exports, "exec", () => $236e0378d2f4cade$export$78e3044358792147);
$parcel$export(module.exports, "npmSpecifierFromModuleRequest", () => $236e0378d2f4cade$export$44a673cac0f09696);
$parcel$export(module.exports, "moduleRequestsFromDependencyMap", () => $236e0378d2f4cade$export$8e3ae06b6f2ee6e2);
$parcel$export(module.exports, "getConflictingLocalDependencies", () => $236e0378d2f4cade$export$ab9915b45c70a034);





const $236e0378d2f4cade$export$78e3044358792147 = (0, $i45p4$child_process.exec) ? (0, $i45p4$util.promisify)((0, $i45p4$child_process.exec)) : // _exec is undefined in browser builds
(0, $i45p4$child_process.exec);
function $236e0378d2f4cade$export$44a673cac0f09696(moduleRequest) {
    return moduleRequest.range != null ? [
        moduleRequest.name,
        moduleRequest.range
    ].join('@') : moduleRequest.name;
}
function $236e0378d2f4cade$export$8e3ae06b6f2ee6e2(dependencyMap) {
    return Object.entries(dependencyMap).map(([name, range])=>{
        (0, ($parcel$interopDefault($i45p4$assert)))(typeof range === 'string');
        return {
            name: name,
            range: range
        };
    });
}
async function $236e0378d2f4cade$export$ab9915b45c70a034(fs, name, local, projectRoot) {
    let pkgPath = await (0, $i45p4$parcelutils.resolveConfig)(fs, local, [
        'package.json'
    ], projectRoot);
    if (pkgPath == null) return;
    let pkgStr = await fs.readFile(pkgPath, 'utf8');
    let pkg;
    try {
        pkg = JSON.parse(pkgStr);
    } catch (e) {
        // TODO: codeframe
        throw new (0, ($parcel$interopDefault($i45p4$parceldiagnostic)))({
            diagnostic: {
                message: 'Failed to parse package.json',
                origin: '@parcel/package-manager'
            }
        });
    }
    if (typeof pkg !== 'object' || pkg == null) // TODO: codeframe
    throw new (0, ($parcel$interopDefault($i45p4$parceldiagnostic)))({
        diagnostic: {
            message: 'Expected package.json contents to be an object.',
            origin: '@parcel/package-manager'
        }
    });
    let fields = [];
    for (let field of [
        'dependencies',
        'devDependencies',
        'peerDependencies'
    ])if (typeof pkg[field] === 'object' && pkg[field] != null && pkg[field][name] != null) fields.push(field);
    if (fields.length > 0) return {
        filePath: pkgPath,
        json: pkgStr,
        fields: fields
    };
}

});

parcelRegister("b3vcY", function(module, exports) {

$parcel$export(module.exports, "_addToInstallQueue", () => $80c82ed7748ddc94$export$f09e6d5146bb6da1);
$parcel$export(module.exports, "installPackage", () => $80c82ed7748ddc94$export$9c0565d18deefc7f);



var $axmO7 = parcelRequire("axmO7");






var $lLPK6 = parcelRequire("lLPK6");

var $eZHZZ = parcelRequire("eZHZZ");

var $buj7e = parcelRequire("buj7e");

var $32AGp = parcelRequire("32AGp");

var $cXMMx = parcelRequire("cXMMx");

var $b405e = parcelRequire("b405e");

var $80c82ed7748ddc94$var$$parcel$__filename = $i45p4$path.resolve(__dirname, "../src", "installPackage.js");

var $80c82ed7748ddc94$var$$parcel$__dirname = $i45p4$path.resolve(__dirname, "../src");
async function $80c82ed7748ddc94$var$install(fs, packageManager, modules, from, projectRoot, options = {}) {
    let { installPeers: installPeers = true, saveDev: saveDev = true, packageInstaller: packageInstaller } = options;
    let moduleNames = modules.map((m)=>m.name).join(', ');
    (0, ($parcel$interopDefault($i45p4$parcellogger))).progress(`Installing ${moduleNames}...`);
    let fromPkgPath = await (0, $i45p4$parcelutils.resolveConfig)(fs, from, [
        'package.json'
    ], projectRoot);
    let cwd = fromPkgPath ? (0, ($parcel$interopDefault($i45p4$path))).dirname(fromPkgPath) : fs.cwd();
    if (!packageInstaller) packageInstaller = await $80c82ed7748ddc94$var$determinePackageInstaller(fs, from, projectRoot);
    try {
        await packageInstaller.install({
            modules: modules,
            saveDev: saveDev,
            cwd: cwd,
            packagePath: fromPkgPath,
            fs: fs
        });
    } catch (err) {
        throw new Error(`Failed to install ${moduleNames}: ${err.message}`);
    }
    if (installPeers) await Promise.all(modules.map((m)=>$80c82ed7748ddc94$var$installPeerDependencies(fs, packageManager, m, from, projectRoot, options)));
}
async function $80c82ed7748ddc94$var$installPeerDependencies(fs, packageManager, module, from, projectRoot, options) {
    const { resolved: resolved } = await packageManager.resolve(module.name, from);
    const modulePkg = (0, (/*@__PURE__*/$parcel$interopDefault($axmO7)))(await (0, $i45p4$parcelutils.loadConfig)(fs, resolved, [
        'package.json'
    ], projectRoot)).config;
    const peers = modulePkg.peerDependencies || {};
    let modules = [];
    for (let [name, range] of Object.entries(peers)){
        (0, ($parcel$interopDefault($i45p4$assert)))(typeof range === 'string');
        let conflicts = await (0, $32AGp.getConflictingLocalDependencies)(fs, name, from, projectRoot);
        if (conflicts) {
            let { pkg: pkg } = await packageManager.resolve(name, from);
            (0, ($parcel$interopDefault($i45p4$assert)))(pkg);
            if (!(0, ($parcel$interopDefault($i45p4$semver))).satisfies(pkg.version, range)) throw new (0, ($parcel$interopDefault($i45p4$parceldiagnostic)))({
                diagnostic: {
                    message: (0, $i45p4$parceldiagnostic.md)`Could not install the peer dependency "${name}" for "${module.name}", installed version ${pkg.version} is incompatible with ${range}`,
                    origin: '@parcel/package-manager',
                    codeFrames: [
                        {
                            filePath: conflicts.filePath,
                            language: 'json',
                            code: conflicts.json,
                            codeHighlights: (0, $i45p4$parceldiagnostic.generateJSONCodeHighlights)(conflicts.json, conflicts.fields.map((field)=>({
                                    key: `/${field}/${(0, $i45p4$parceldiagnostic.encodeJSONKeyComponent)(name)}`,
                                    type: 'key',
                                    message: 'Found this conflicting local requirement.'
                                })))
                        }
                    ]
                }
            });
            continue;
        }
        modules.push({
            name: name,
            range: range
        });
    }
    if (modules.length) await $80c82ed7748ddc94$var$install(fs, packageManager, modules, from, projectRoot, Object.assign({}, options, {
        installPeers: false
    }));
}
async function $80c82ed7748ddc94$var$determinePackageInstaller(fs, filepath, projectRoot) {
    let configFile = await (0, $i45p4$parcelutils.resolveConfig)(fs, filepath, [
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock'
    ], projectRoot);
    let configName = configFile && (0, ($parcel$interopDefault($i45p4$path))).basename(configFile);
    // Always use the package manager that seems to be used in the project,
    // falling back to a different one wouldn't update the existing lockfile.
    if (configName === 'package-lock.json') return new (0, $lLPK6.Npm)();
    else if (configName === 'pnpm-lock.yaml') return new (0, $buj7e.Pnpm)();
    else if (configName === 'yarn.lock') return new (0, $eZHZZ.Yarn)();
    let currentPackageManager = (0, $cXMMx.default)()?.name;
    if (currentPackageManager === 'npm') return new (0, $lLPK6.Npm)();
    else if (currentPackageManager === 'yarn') return new (0, $eZHZZ.Yarn)();
    else if (currentPackageManager === 'pnpm') return new (0, $buj7e.Pnpm)();
    if (await (0, $eZHZZ.Yarn).exists()) return new (0, $eZHZZ.Yarn)();
    else if (await (0, $buj7e.Pnpm).exists()) return new (0, $buj7e.Pnpm)();
    else return new (0, $lLPK6.Npm)();
}
let $80c82ed7748ddc94$var$queue = new (0, $i45p4$parcelutils.PromiseQueue)({
    maxConcurrent: 1
});
let $80c82ed7748ddc94$var$modulesInstalling = new Set();
function $80c82ed7748ddc94$export$f09e6d5146bb6da1(fs, packageManager, modules, filePath, projectRoot, options) {
    modules = modules.map((request)=>({
            name: (0, $b405e.default)(request.name),
            range: request.range
        }));
    // Wrap PromiseQueue and track modules that are currently installing.
    // If a request comes in for a module that is currently installing, don't bother
    // enqueuing it.
    let modulesToInstall = modules.filter((m)=>!$80c82ed7748ddc94$var$modulesInstalling.has($80c82ed7748ddc94$var$getModuleRequestKey(m)));
    if (modulesToInstall.length) {
        for (let m of modulesToInstall)$80c82ed7748ddc94$var$modulesInstalling.add($80c82ed7748ddc94$var$getModuleRequestKey(m));
        $80c82ed7748ddc94$var$queue.add(()=>$80c82ed7748ddc94$var$install(fs, packageManager, modulesToInstall, filePath, projectRoot, options).then(()=>{
                for (let m of modulesToInstall)$80c82ed7748ddc94$var$modulesInstalling.delete($80c82ed7748ddc94$var$getModuleRequestKey(m));
            })).then(()=>{}, ()=>{});
    }
    return $80c82ed7748ddc94$var$queue.run();
}
function $80c82ed7748ddc94$export$9c0565d18deefc7f(fs, packageManager, modules, filePath, projectRoot, options) {
    if ((0, ($parcel$interopDefault($i45p4$parcelworkers))).isWorker()) {
        let workerApi = (0, ($parcel$interopDefault($i45p4$parcelworkers))).getWorkerApi();
        // TODO this should really be `__filename` but without the rewriting.
        let bundlePath = !process.env.PARCEL_SELF_BUILD ? (0, ($parcel$interopDefault($i45p4$path))).join($80c82ed7748ddc94$var$$parcel$__dirname, '..', 'lib/index.js') : $80c82ed7748ddc94$var$$parcel$__filename;
        return workerApi.callMaster({
            location: bundlePath,
            args: [
                fs,
                packageManager,
                modules,
                filePath,
                projectRoot,
                options
            ],
            method: '_addToInstallQueue'
        });
    }
    return $80c82ed7748ddc94$export$f09e6d5146bb6da1(fs, packageManager, modules, filePath, projectRoot, options);
}
function $80c82ed7748ddc94$var$getModuleRequestKey(moduleRequest) {
    return [
        moduleRequest.name,
        moduleRequest.range
    ].join('@');
}

});
parcelRegister("lLPK6", function(module, exports) {

$parcel$export(module.exports, "Npm", () => $fd961fc31634a95d$export$bc651973ec076cd0);


var $e6aVH = parcelRequire("e6aVH");


var $fs99M = parcelRequire("fs99M");


var $32AGp = parcelRequire("32AGp");

var $jeDhm = parcelRequire("jeDhm");
const $fd961fc31634a95d$var$NPM_CMD = 'npm';
class $fd961fc31634a95d$export$bc651973ec076cd0 {
    async install({ modules: modules, cwd: cwd, fs: fs, packagePath: packagePath, saveDev: saveDev = true }) {
        // npm doesn't auto-create a package.json when installing,
        // so create an empty one if needed.
        if (packagePath == null) await fs.writeFile((0, ($parcel$interopDefault($i45p4$path))).join(cwd, 'package.json'), '{}');
        let args = [
            'install',
            '--json',
            saveDev ? '--save-dev' : '--save'
        ].concat(modules.map((0, $32AGp.npmSpecifierFromModuleRequest)));
        // When Parcel is run by npm (e.g. via package.json scripts), several environment variables are
        // added. When parcel in turn calls npm again, these can cause npm to behave stragely, so we
        // filter them out when installing packages.
        let env = {};
        for(let key in process.env)if (!key.startsWith('npm_') && key !== 'INIT_CWD' && key !== 'NODE_ENV') env[key] = process.env[key];
        let installProcess = (0, (/*@__PURE__*/$parcel$interopDefault($e6aVH)))($fd961fc31634a95d$var$NPM_CMD, args, {
            cwd: cwd,
            env: env
        });
        let stdout = '';
        installProcess.stdout.on('data', (buf)=>{
            stdout += buf.toString();
        });
        let stderr = [];
        installProcess.stderr.on('data', (buf)=>{
            stderr.push(buf.toString().trim());
        });
        try {
            await (0, $fs99M.default)(installProcess);
            let results = JSON.parse(stdout);
            let addedCount = results.added.length;
            if (addedCount > 0) (0, ($parcel$interopDefault($i45p4$parcellogger))).log({
                origin: '@parcel/package-manager',
                message: `Added ${addedCount} packages via npm`
            });
            // Since we succeeded, stderr might have useful information not included
            // in the json written to stdout. It's also not necessary to log these as
            // errors as they often aren't.
            for (let message of stderr)if (message.length > 0) (0, ($parcel$interopDefault($i45p4$parcellogger))).log({
                origin: '@parcel/package-manager',
                message: message
            });
        } catch (e) {
            throw new Error('npm failed to install modules: ' + e.message + ' - ' + stderr.join('\n'));
        }
    }
}
(0, $i45p4$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($jeDhm))).version}:Npm`, $fd961fc31634a95d$export$bc651973ec076cd0);

});
parcelRegister("e6aVH", function(module, exports) {
'use strict';


var $wHEkS = parcelRequire("wHEkS");

var $5XKEQ = parcelRequire("5XKEQ");
function $a43a1aa555fd1c31$var$spawn(command, args, options) {
    // Parse the arguments
    const parsed = $wHEkS(command, args, options);
    // Spawn the child process
    const spawned = $i45p4$child_process.spawn(parsed.command, parsed.args, parsed.options);
    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    $5XKEQ.hookChildProcess(spawned, parsed);
    return spawned;
}
function $a43a1aa555fd1c31$var$spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = $wHEkS(command, args, options);
    // Spawn the child process
    const result = $i45p4$child_process.spawnSync(parsed.command, parsed.args, parsed.options);
    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || $5XKEQ.verifyENOENTSync(result.status, parsed);
    return result;
}
module.exports = $a43a1aa555fd1c31$var$spawn;
module.exports.spawn = $a43a1aa555fd1c31$var$spawn;
module.exports.sync = $a43a1aa555fd1c31$var$spawnSync;
module.exports._parse = $wHEkS;
module.exports._enoent = $5XKEQ;

});
parcelRegister("wHEkS", function(module, exports) {
'use strict';


var $8HV7x = parcelRequire("8HV7x");

var $8JtRc = parcelRequire("8JtRc");

var $S9QOg = parcelRequire("S9QOg");
const $0624d92b8231a485$var$isWin = process.platform === 'win32';
const $0624d92b8231a485$var$isExecutableRegExp = /\.(?:com|exe)$/i;
const $0624d92b8231a485$var$isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
function $0624d92b8231a485$var$detectShebang(parsed) {
    parsed.file = $8HV7x(parsed);
    const shebang = parsed.file && $S9QOg(parsed.file);
    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return $8HV7x(parsed);
    }
    return parsed.file;
}
function $0624d92b8231a485$var$parseNonShell(parsed) {
    if (!$0624d92b8231a485$var$isWin) return parsed;
    // Detect & add support for shebangs
    const commandFile = $0624d92b8231a485$var$detectShebang(parsed);
    // We don't need a shell if the command filename is an executable
    const needsShell = !$0624d92b8231a485$var$isExecutableRegExp.test(commandFile);
    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = $0624d92b8231a485$var$isCmdShimRegExp.test(commandFile);
        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = $i45p4$path.normalize(parsed.command);
        // Escape command & arguments
        parsed.command = $8JtRc.command(parsed.command);
        parsed.args = parsed.args.map((arg)=>$8JtRc.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [
            parsed.command
        ].concat(parsed.args).join(' ');
        parsed.args = [
            '/d',
            '/s',
            '/c',
            `"${shellCommand}"`
        ];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }
    return parsed;
}
function $0624d92b8231a485$var$parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }
    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original
    // Build our parsed object
    const parsed = {
        command: command,
        args: args,
        options: options,
        file: undefined,
        original: {
            command: command,
            args: args
        }
    };
    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : $0624d92b8231a485$var$parseNonShell(parsed);
}
module.exports = $0624d92b8231a485$var$parse;

});
parcelRegister("8HV7x", function(module, exports) {
'use strict';


var $gQCz1 = parcelRequire("gQCz1");

var $lfSFu = parcelRequire("lfSFu");
function $656ea5dc096f611c$var$resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;
    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) try {
        process.chdir(parsed.options.cwd);
    } catch (err) {
    /* Empty */ }
    let resolved;
    try {
        resolved = $gQCz1.sync(parsed.command, {
            path: env[$lfSFu({
                env: env
            })],
            pathExt: withoutPathExt ? $i45p4$path.delimiter : undefined
        });
    } catch (e) {
    /* Empty */ } finally{
        if (shouldSwitchCwd) process.chdir(cwd);
    }
    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) resolved = $i45p4$path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    return resolved;
}
function $656ea5dc096f611c$var$resolveCommand(parsed) {
    return $656ea5dc096f611c$var$resolveCommandAttempt(parsed) || $656ea5dc096f611c$var$resolveCommandAttempt(parsed, true);
}
module.exports = $656ea5dc096f611c$var$resolveCommand;

});
parcelRegister("gQCz1", function(module, exports) {
const $c43f6aa8d0c0cebe$var$isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

const $c43f6aa8d0c0cebe$var$COLON = $c43f6aa8d0c0cebe$var$isWindows ? ';' : ':';

var $xnA1W = parcelRequire("xnA1W");
const $c43f6aa8d0c0cebe$var$getNotFoundError = (cmd)=>Object.assign(new Error(`not found: ${cmd}`), {
        code: 'ENOENT'
    });
const $c43f6aa8d0c0cebe$var$getPathInfo = (cmd, opt)=>{
    const colon = opt.colon || $c43f6aa8d0c0cebe$var$COLON;
    // If it has a slash, then we don't bother searching the pathenv.
    // just check the file itself, and that's it.
    const pathEnv = cmd.match(/\//) || $c43f6aa8d0c0cebe$var$isWindows && cmd.match(/\\/) ? [
        ''
    ] : [
        // windows always checks the cwd first
        ...$c43f6aa8d0c0cebe$var$isWindows ? [
            process.cwd()
        ] : [],
        ...(opt.path || process.env.PATH || /* istanbul ignore next: very unusual */ '').split(colon)
    ];
    const pathExtExe = $c43f6aa8d0c0cebe$var$isWindows ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM' : '';
    const pathExt = $c43f6aa8d0c0cebe$var$isWindows ? pathExtExe.split(colon) : [
        ''
    ];
    if ($c43f6aa8d0c0cebe$var$isWindows) {
        if (cmd.indexOf('.') !== -1 && pathExt[0] !== '') pathExt.unshift('');
    }
    return {
        pathEnv: pathEnv,
        pathExt: pathExt,
        pathExtExe: pathExtExe
    };
};
const $c43f6aa8d0c0cebe$var$which = (cmd, opt, cb)=>{
    if (typeof opt === 'function') {
        cb = opt;
        opt = {};
    }
    if (!opt) opt = {};
    const { pathEnv: pathEnv, pathExt: pathExt, pathExtExe: pathExtExe } = $c43f6aa8d0c0cebe$var$getPathInfo(cmd, opt);
    const found = [];
    const step = (i)=>new Promise((resolve, reject)=>{
            if (i === pathEnv.length) return opt.all && found.length ? resolve(found) : reject($c43f6aa8d0c0cebe$var$getNotFoundError(cmd));
            const ppRaw = pathEnv[i];
            const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
            const pCmd = $i45p4$path.join(pathPart, cmd);
            const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
            resolve(subStep(p, i, 0));
        });
    const subStep = (p, i, ii)=>new Promise((resolve, reject)=>{
            if (ii === pathExt.length) return resolve(step(i + 1));
            const ext = pathExt[ii];
            $xnA1W(p + ext, {
                pathExt: pathExtExe
            }, (er, is)=>{
                if (!er && is) {
                    if (opt.all) found.push(p + ext);
                    else return resolve(p + ext);
                }
                return resolve(subStep(p, i, ii + 1));
            });
        });
    return cb ? step(0).then((res)=>cb(null, res), cb) : step(0);
};
const $c43f6aa8d0c0cebe$var$whichSync = (cmd, opt)=>{
    opt = opt || {};
    const { pathEnv: pathEnv, pathExt: pathExt, pathExtExe: pathExtExe } = $c43f6aa8d0c0cebe$var$getPathInfo(cmd, opt);
    const found = [];
    for(let i = 0; i < pathEnv.length; i++){
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = $i45p4$path.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for(let j = 0; j < pathExt.length; j++){
            const cur = p + pathExt[j];
            try {
                const is = $xnA1W.sync(cur, {
                    pathExt: pathExtExe
                });
                if (is) {
                    if (opt.all) found.push(cur);
                    else return cur;
                }
            } catch (ex) {}
        }
    }
    if (opt.all && found.length) return found;
    if (opt.nothrow) return null;
    throw $c43f6aa8d0c0cebe$var$getNotFoundError(cmd);
};
module.exports = $c43f6aa8d0c0cebe$var$which;
$c43f6aa8d0c0cebe$var$which.sync = $c43f6aa8d0c0cebe$var$whichSync;

});
parcelRegister("xnA1W", function(module, exports) {

var $06455fb49d6aed3b$var$core;


if (process.platform === 'win32' || $parcel$global.TESTING_WINDOWS) $06455fb49d6aed3b$var$core = (parcelRequire("12izX"));
else $06455fb49d6aed3b$var$core = (parcelRequire("fYIqr"));
module.exports = $06455fb49d6aed3b$var$isexe;
$06455fb49d6aed3b$var$isexe.sync = $06455fb49d6aed3b$var$sync;
function $06455fb49d6aed3b$var$isexe(path, options, cb) {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    if (!cb) {
        if (typeof Promise !== 'function') throw new TypeError('callback not provided');
        return new Promise(function(resolve, reject) {
            $06455fb49d6aed3b$var$isexe(path, options || {}, function(er, is) {
                if (er) reject(er);
                else resolve(is);
            });
        });
    }
    $06455fb49d6aed3b$var$core(path, options || {}, function(er, is) {
        // ignore EACCES because that just means we aren't allowed to run it
        if (er) {
            if (er.code === 'EACCES' || options && options.ignoreErrors) {
                er = null;
                is = false;
            }
        }
        cb(er, is);
    });
}
function $06455fb49d6aed3b$var$sync(path, options) {
    // my kingdom for a filtered catch
    try {
        return $06455fb49d6aed3b$var$core.sync(path, options || {});
    } catch (er) {
        if (options && options.ignoreErrors || er.code === 'EACCES') return false;
        else throw er;
    }
}

});


parcelRegister("lfSFu", function(module, exports) {
'use strict';
const $f79567a520e4b451$var$pathKey = (options = {})=>{
    const environment = options.env || process.env;
    const platform = options.platform || process.platform;
    if (platform !== 'win32') return 'PATH';
    return Object.keys(environment).reverse().find((key)=>key.toUpperCase() === 'PATH') || 'Path';
};
module.exports = $f79567a520e4b451$var$pathKey;
// TODO: Remove this for the next major release
module.exports.default = $f79567a520e4b451$var$pathKey;

});


parcelRegister("8JtRc", function(module, exports) {

$parcel$export(module.exports, "command", () => $65b9afb0fc8cc124$export$ae50443ffc990749, (v) => $65b9afb0fc8cc124$export$ae50443ffc990749 = v);
$parcel$export(module.exports, "argument", () => $65b9afb0fc8cc124$export$6ea29ee575e3f5ff, (v) => $65b9afb0fc8cc124$export$6ea29ee575e3f5ff = v);
var $65b9afb0fc8cc124$export$ae50443ffc990749;
var $65b9afb0fc8cc124$export$6ea29ee575e3f5ff;
'use strict';
// See http://www.robvanderwoude.com/escapechars.php
const $65b9afb0fc8cc124$var$metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
function $65b9afb0fc8cc124$var$escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace($65b9afb0fc8cc124$var$metaCharsRegExp, '^$1');
    return arg;
}
function $65b9afb0fc8cc124$var$escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;
    // Algorithm below is based on https://qntm.org/cmd
    // It's slightly altered to disable JS backtracking to avoid hanging on specially crafted input
    // Please see https://github.com/moxystudio/node-cross-spawn/pull/160 for more information
    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(?=(\\+?)?)\1$/, '$1$1');
    // All other backslashes occur literally
    // Quote the whole thing:
    arg = `"${arg}"`;
    // Escape meta chars
    arg = arg.replace($65b9afb0fc8cc124$var$metaCharsRegExp, '^$1');
    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) arg = arg.replace($65b9afb0fc8cc124$var$metaCharsRegExp, '^$1');
    return arg;
}
$65b9afb0fc8cc124$export$ae50443ffc990749 = $65b9afb0fc8cc124$var$escapeCommand;
$65b9afb0fc8cc124$export$6ea29ee575e3f5ff = $65b9afb0fc8cc124$var$escapeArgument;

});

parcelRegister("S9QOg", function(module, exports) {
'use strict';


var $c1SBZ = parcelRequire("c1SBZ");
function $0a2caf6af036a4d5$var$readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);
    let fd;
    try {
        fd = $i45p4$fs.openSync(command, 'r');
        $i45p4$fs.readSync(fd, buffer, 0, size, 0);
        $i45p4$fs.closeSync(fd);
    } catch (e) {}
    // Attempt to extract shebang (null is returned if not a shebang)
    return $c1SBZ(buffer.toString());
}
module.exports = $0a2caf6af036a4d5$var$readShebang;

});
parcelRegister("c1SBZ", function(module, exports) {
'use strict';

var $87mH3 = parcelRequire("87mH3");
module.exports = (string = '')=>{
    const match = string.match($87mH3);
    if (!match) return null;
    const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
    const binary = path.split('/').pop();
    if (binary === 'env') return argument;
    return argument ? `${binary} ${argument}` : binary;
};

});
parcelRegister("87mH3", function(module, exports) {
'use strict';
module.exports = /^#!(.*)/;

});




parcelRegister("5XKEQ", function(module, exports) {
'use strict';
const $4576a7b8ccaf1ed6$var$isWin = process.platform === 'win32';
function $4576a7b8ccaf1ed6$var$notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
    });
}
function $4576a7b8ccaf1ed6$var$hookChildProcess(cp, parsed) {
    if (!$4576a7b8ccaf1ed6$var$isWin) return;
    const originalEmit = cp.emit;
    cp.emit = function(name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = $4576a7b8ccaf1ed6$var$verifyENOENT(arg1, parsed);
            if (err) return originalEmit.call(cp, 'error', err);
        }
        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}
function $4576a7b8ccaf1ed6$var$verifyENOENT(status, parsed) {
    if ($4576a7b8ccaf1ed6$var$isWin && status === 1 && !parsed.file) return $4576a7b8ccaf1ed6$var$notFoundError(parsed.original, 'spawn');
    return null;
}
function $4576a7b8ccaf1ed6$var$verifyENOENTSync(status, parsed) {
    if ($4576a7b8ccaf1ed6$var$isWin && status === 1 && !parsed.file) return $4576a7b8ccaf1ed6$var$notFoundError(parsed.original, 'spawnSync');
    return null;
}
module.exports = {
    hookChildProcess: $4576a7b8ccaf1ed6$var$hookChildProcess,
    verifyENOENT: $4576a7b8ccaf1ed6$var$verifyENOENT,
    verifyENOENTSync: $4576a7b8ccaf1ed6$var$verifyENOENTSync,
    notFoundError: $4576a7b8ccaf1ed6$var$notFoundError
};

});


parcelRegister("fs99M", function(module, exports) {

$parcel$export(module.exports, "default", () => $b40092e356814152$export$2e2bcd8739ae039);
function $b40092e356814152$export$2e2bcd8739ae039(childProcess) {
    return new Promise((resolve, reject)=>{
        childProcess.on('error', reject);
        childProcess.on('close', (code)=>{
            if (code !== 0) {
                reject(new Error('Child process failed'));
                return;
            }
            resolve();
        });
    });
}

});

parcelRegister("jeDhm", function(module, exports) {
module.exports = JSON.parse("{\"name\":\"@parcel/package-manager\",\"version\":\"2.13.3\",\"description\":\"Blazing fast, zero configuration web application bundler\",\"license\":\"MIT\",\"publishConfig\":{\"access\":\"public\"},\"funding\":{\"type\":\"opencollective\",\"url\":\"https://opencollective.com/parcel\"},\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/parcel-bundler/parcel.git\"},\"main\":\"lib/index.js\",\"source\":\"src/index.js\",\"types\":\"index.d.ts\",\"engines\":{\"node\":\">= 16.0.0\"},\"scripts\":{\"build-ts\":\"mkdir -p lib && flow-to-ts src/index.js > lib/index.d.ts\",\"check-ts\":\"tsc --noEmit index.d.ts\",\"test\":\"mocha test\"},\"targets\":{\"types\":false,\"main\":{\"includeNodeModules\":{\"@parcel/core\":false,\"@parcel/diagnostic\":false,\"@parcel/fs\":false,\"@parcel/logger\":false,\"@parcel/node-resolver-core\":false,\"@parcel/types\":false,\"@parcel/utils\":false,\"@parcel/workers\":false,\"@swc/core\":false,\"semver\":false}}},\"dependencies\":{\"@parcel/diagnostic\":\"2.13.3\",\"@parcel/fs\":\"2.13.3\",\"@parcel/logger\":\"2.13.3\",\"@parcel/node-resolver-core\":\"3.4.3\",\"@parcel/types\":\"2.13.3\",\"@parcel/utils\":\"2.13.3\",\"@parcel/workers\":\"2.13.3\",\"@swc/core\":\"^1.7.26\",\"semver\":\"^7.5.2\"},\"devDependencies\":{\"command-exists\":\"^1.2.6\",\"cross-spawn\":\"^7.0.3\",\"nullthrows\":\"^1.1.1\",\"split2\":\"^4.2.0\"},\"peerDependencies\":{\"@parcel/core\":\"^2.13.3\"},\"browser\":{\"./src/NodePackageManager.js\":false,\"./src/Npm.js\":false,\"./src/Pnpm.js\":false,\"./src/Yarn.js\":false},\"gitHead\":\"d19b1f6bdb05eb5a3085f44daae15c0fe2709ab9\"}");

});


parcelRegister("eZHZZ", function(module, exports) {

$parcel$export(module.exports, "Yarn", () => $aea8e475eee44f94$export$8db243e2edc9d1b8);

var $fPtcL = parcelRequire("fPtcL");

var $e6aVH = parcelRequire("e6aVH");


var $aS4Hf = parcelRequire("aS4Hf");

var $2MhVX = parcelRequire("2MhVX");

var $fs99M = parcelRequire("fs99M");


var $32AGp = parcelRequire("32AGp");

var $jeDhm = parcelRequire("jeDhm");
const $aea8e475eee44f94$var$YARN_CMD = 'yarn';
let $aea8e475eee44f94$var$hasYarn;
let $aea8e475eee44f94$var$yarnVersion;
class $aea8e475eee44f94$export$8db243e2edc9d1b8 {
    static async exists() {
        if ($aea8e475eee44f94$var$hasYarn != null) return $aea8e475eee44f94$var$hasYarn;
        try {
            $aea8e475eee44f94$var$hasYarn = Boolean(await (0, (/*@__PURE__*/$parcel$interopDefault($fPtcL)))('yarn'));
        } catch (err) {
            $aea8e475eee44f94$var$hasYarn = false;
        }
        return $aea8e475eee44f94$var$hasYarn;
    }
    async install({ modules: modules, cwd: cwd, saveDev: saveDev = true }) {
        if ($aea8e475eee44f94$var$yarnVersion == null) {
            let version = await (0, $32AGp.exec)('yarn --version');
            $aea8e475eee44f94$var$yarnVersion = parseInt(version.stdout, 10);
        }
        let args = [
            'add',
            '--json'
        ].concat(modules.map((0, $32AGp.npmSpecifierFromModuleRequest)));
        if (saveDev) {
            args.push('-D');
            if ($aea8e475eee44f94$var$yarnVersion < 2) args.push('-W');
        }
        // When Parcel is run by Yarn (e.g. via package.json scripts), several environment variables are
        // added. When parcel in turn calls Yarn again, these can cause Yarn to behave stragely, so we
        // filter them out when installing packages.
        let env = {};
        for(let key in process.env)if (!key.startsWith('npm_') && key !== 'YARN_WRAP_OUTPUT' && key !== 'INIT_CWD' && key !== 'NODE_ENV') env[key] = process.env[key];
        let installProcess = (0, (/*@__PURE__*/$parcel$interopDefault($e6aVH)))($aea8e475eee44f94$var$YARN_CMD, args, {
            cwd: cwd,
            env: env
        });
        installProcess.stdout// Invoking yarn with --json provides streaming, newline-delimited JSON output.
        .pipe((0, (/*@__PURE__*/$parcel$interopDefault($aS4Hf)))()).pipe(new (0, $2MhVX.default)()).on('error', (e)=>{
            (0, ($parcel$interopDefault($i45p4$parcellogger))).error(e, '@parcel/package-manager');
        }).on('data', (message)=>{
            switch(message.type){
                case 'step':
                    (0, ($parcel$interopDefault($i45p4$parcellogger))).progress($aea8e475eee44f94$var$prefix(`[${message.data.current}/${message.data.total}] ${message.data.message}`));
                    return;
                case 'success':
                case 'info':
                    (0, ($parcel$interopDefault($i45p4$parcellogger))).info({
                        origin: '@parcel/package-manager',
                        message: $aea8e475eee44f94$var$prefix(message.data)
                    });
                    return;
                default:
            }
        });
        installProcess.stderr.pipe((0, (/*@__PURE__*/$parcel$interopDefault($aS4Hf)))()).pipe(new (0, $2MhVX.default)()).on('error', (e)=>{
            (0, ($parcel$interopDefault($i45p4$parcellogger))).error(e, '@parcel/package-manager');
        }).on('data', (message)=>{
            switch(message.type){
                case 'warning':
                    (0, ($parcel$interopDefault($i45p4$parcellogger))).warn({
                        origin: '@parcel/package-manager',
                        message: $aea8e475eee44f94$var$prefix(message.data)
                    });
                    return;
                case 'error':
                    (0, ($parcel$interopDefault($i45p4$parcellogger))).error({
                        origin: '@parcel/package-manager',
                        message: $aea8e475eee44f94$var$prefix(message.data)
                    });
                    return;
                default:
            }
        });
        try {
            return await (0, $fs99M.default)(installProcess);
        } catch (e) {
            throw new Error('Yarn failed to install modules:' + e.message);
        }
    }
}
function $aea8e475eee44f94$var$prefix(message) {
    return 'yarn: ' + message;
}
(0, $i45p4$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($jeDhm))).version}:Yarn`, $aea8e475eee44f94$export$8db243e2edc9d1b8);

});
parcelRegister("fPtcL", function(module, exports) {

module.exports = (parcelRequire("3lhdG"));

});

parcelRegister("aS4Hf", function(module, exports) {
/*
Copyright (c) 2014-2021, Matteo Collina <hello@matteocollina.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/ 'use strict';

var $7ea29728a0f24d62$require$Transform = $i45p4$stream.Transform;

var $7ea29728a0f24d62$require$StringDecoder = $i45p4$string_decoder.StringDecoder;
const $7ea29728a0f24d62$var$kLast = Symbol('last');
const $7ea29728a0f24d62$var$kDecoder = Symbol('decoder');
function $7ea29728a0f24d62$var$transform(chunk, enc, cb) {
    let list;
    if (this.overflow) {
        const buf = this[$7ea29728a0f24d62$var$kDecoder].write(chunk);
        list = buf.split(this.matcher);
        if (list.length === 1) return cb() // Line ending not found. Discard entire chunk.
        ;
        // Line ending found. Discard trailing fragment of previous line and reset overflow state.
        list.shift();
        this.overflow = false;
    } else {
        this[$7ea29728a0f24d62$var$kLast] += this[$7ea29728a0f24d62$var$kDecoder].write(chunk);
        list = this[$7ea29728a0f24d62$var$kLast].split(this.matcher);
    }
    this[$7ea29728a0f24d62$var$kLast] = list.pop();
    for(let i = 0; i < list.length; i++)try {
        $7ea29728a0f24d62$var$push(this, this.mapper(list[i]));
    } catch (error) {
        return cb(error);
    }
    this.overflow = this[$7ea29728a0f24d62$var$kLast].length > this.maxLength;
    if (this.overflow && !this.skipOverflow) {
        cb(new Error('maximum buffer reached'));
        return;
    }
    cb();
}
function $7ea29728a0f24d62$var$flush(cb) {
    // forward any gibberish left in there
    this[$7ea29728a0f24d62$var$kLast] += this[$7ea29728a0f24d62$var$kDecoder].end();
    if (this[$7ea29728a0f24d62$var$kLast]) try {
        $7ea29728a0f24d62$var$push(this, this.mapper(this[$7ea29728a0f24d62$var$kLast]));
    } catch (error) {
        return cb(error);
    }
    cb();
}
function $7ea29728a0f24d62$var$push(self, val) {
    if (val !== undefined) self.push(val);
}
function $7ea29728a0f24d62$var$noop(incoming) {
    return incoming;
}
function $7ea29728a0f24d62$var$split(matcher, mapper, options) {
    // Set defaults for any arguments not supplied.
    matcher = matcher || /\r?\n/;
    mapper = mapper || $7ea29728a0f24d62$var$noop;
    options = options || {};
    // Test arguments explicitly.
    switch(arguments.length){
        case 1:
            // If mapper is only argument.
            if (typeof matcher === 'function') {
                mapper = matcher;
                matcher = /\r?\n/;
            // If options is only argument.
            } else if (typeof matcher === 'object' && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
                options = matcher;
                matcher = /\r?\n/;
            }
            break;
        case 2:
            // If mapper and options are arguments.
            if (typeof matcher === 'function') {
                options = mapper;
                mapper = matcher;
                matcher = /\r?\n/;
            // If matcher and options are arguments.
            } else if (typeof mapper === 'object') {
                options = mapper;
                mapper = $7ea29728a0f24d62$var$noop;
            }
    }
    options = Object.assign({}, options);
    options.autoDestroy = true;
    options.transform = $7ea29728a0f24d62$var$transform;
    options.flush = $7ea29728a0f24d62$var$flush;
    options.readableObjectMode = true;
    const stream = new $7ea29728a0f24d62$require$Transform(options);
    stream[$7ea29728a0f24d62$var$kLast] = '';
    stream[$7ea29728a0f24d62$var$kDecoder] = new $7ea29728a0f24d62$require$StringDecoder('utf8');
    stream.matcher = matcher;
    stream.mapper = mapper;
    stream.maxLength = options.maxLength;
    stream.skipOverflow = options.skipOverflow || false;
    stream.overflow = false;
    stream._destroy = function(err, cb) {
        // Weird Node v12 bug that we need to work around
        this._writableState.errorEmitted = false;
        cb(err);
    };
    return stream;
}
module.exports = $7ea29728a0f24d62$var$split;

});

parcelRegister("2MhVX", function(module, exports) {

$parcel$export(module.exports, "default", () => $205df9be7e041f3d$export$2e2bcd8739ae039);


class $205df9be7e041f3d$export$2e2bcd8739ae039 extends (0, $i45p4$stream.Transform) {
    constructor(options){
        super({
            ...options,
            objectMode: true
        });
    }
    // $FlowFixMe We are in object mode, so we emit objects, not strings
    _transform(chunk, encoding, callback) {
        try {
            let parsed;
            try {
                parsed = JSON.parse(chunk.toString());
            } catch (e) {
                // Be permissive and ignoreJSON parse errors in case there was
                // a non-JSON line in the package manager's stdout.
                (0, ($parcel$interopDefault($i45p4$parcellogger))).verbose({
                    message: 'Ignored invalid JSON message: ' + chunk.toString(),
                    origin: '@parcel/package-manager'
                });
                return;
            }
            callback(null, parsed);
        } catch (err) {
            callback(err);
        }
    }
}

});


parcelRegister("buj7e", function(module, exports) {

$parcel$export(module.exports, "Pnpm", () => $85d1530af77bb266$export$ad678da47ffaf985);



var $fPtcL = parcelRequire("fPtcL");

var $e6aVH = parcelRequire("e6aVH");


var $aS4Hf = parcelRequire("aS4Hf");

var $2MhVX = parcelRequire("2MhVX");

var $fs99M = parcelRequire("fs99M");


var $32AGp = parcelRequire("32AGp");

var $jeDhm = parcelRequire("jeDhm");
const $85d1530af77bb266$var$PNPM_CMD = 'pnpm';
let $85d1530af77bb266$var$hasPnpm;
let $85d1530af77bb266$var$pnpmVersion;
class $85d1530af77bb266$export$ad678da47ffaf985 {
    static async exists() {
        if ($85d1530af77bb266$var$hasPnpm != null) return $85d1530af77bb266$var$hasPnpm;
        try {
            $85d1530af77bb266$var$hasPnpm = Boolean(await (0, (/*@__PURE__*/$parcel$interopDefault($fPtcL)))('pnpm'));
        } catch (err) {
            $85d1530af77bb266$var$hasPnpm = false;
        }
        return $85d1530af77bb266$var$hasPnpm;
    }
    async install({ modules: modules, cwd: cwd, saveDev: saveDev = true }) {
        if ($85d1530af77bb266$var$pnpmVersion == null) {
            let version = await (0, $32AGp.exec)('pnpm --version');
            $85d1530af77bb266$var$pnpmVersion = parseInt(version.stdout, 10);
        }
        let args = [
            'add',
            '--reporter',
            'ndjson'
        ];
        if (saveDev) args.push('-D');
        if ($85d1530af77bb266$var$pnpmVersion >= 7) {
            if ((0, ($parcel$interopDefault($i45p4$fs))).existsSync((0, ($parcel$interopDefault($i45p4$path))).join(cwd, 'pnpm-workspace.yaml'))) // installs in workspace root (regardless of cwd)
            args.push('-w');
        } else // ignores workspace root check
        args.push('-W');
        args = args.concat(modules.map((0, $32AGp.npmSpecifierFromModuleRequest)));
        let env = {};
        for(let key in process.env)if (!key.startsWith('npm_') && key !== 'INIT_CWD' && key !== 'NODE_ENV') env[key] = process.env[key];
        let addedCount = 0, removedCount = 0;
        let installProcess = (0, (/*@__PURE__*/$parcel$interopDefault($e6aVH)))($85d1530af77bb266$var$PNPM_CMD, args, {
            cwd: cwd,
            env: env
        });
        installProcess.stdout.pipe((0, (/*@__PURE__*/$parcel$interopDefault($aS4Hf)))()).pipe(new (0, $2MhVX.default)()).on('error', (e)=>{
            (0, ($parcel$interopDefault($i45p4$parcellogger))).warn({
                origin: '@parcel/package-manager',
                message: e.chunk,
                stack: e.stack
            });
        }).on('data', (json)=>{
            if (json.level === 'error') (0, ($parcel$interopDefault($i45p4$parcellogger))).error({
                origin: '@parcel/package-manager',
                message: json.err.message,
                stack: json.err.stack
            });
            else if (json.level === 'info' && typeof json.message === 'string') (0, ($parcel$interopDefault($i45p4$parcellogger))).info({
                origin: '@parcel/package-manager',
                message: $85d1530af77bb266$var$prefix(json.message)
            });
            else if (json.name === 'pnpm:stats') {
                addedCount += json.added ?? 0;
                removedCount += json.removed ?? 0;
            }
        });
        let stderr = [];
        installProcess.stderr.on('data', (str)=>{
            stderr.push(str.toString());
        }).on('error', (e)=>{
            (0, ($parcel$interopDefault($i45p4$parcellogger))).warn({
                origin: '@parcel/package-manager',
                message: e.message
            });
        });
        try {
            await (0, $fs99M.default)(installProcess);
            if (addedCount > 0 || removedCount > 0) (0, ($parcel$interopDefault($i45p4$parcellogger))).log({
                origin: '@parcel/package-manager',
                message: `Added ${addedCount} ${removedCount > 0 ? `and removed ${removedCount} ` : ''}packages via pnpm`
            });
            // Since we succeeded, stderr might have useful information not included
            // in the json written to stdout. It's also not necessary to log these as
            // errors as they often aren't.
            for (let message of stderr)(0, ($parcel$interopDefault($i45p4$parcellogger))).log({
                origin: '@parcel/package-manager',
                message: message
            });
        } catch (e) {
            throw new Error('pnpm failed to install modules');
        }
    }
}
function $85d1530af77bb266$var$prefix(message) {
    return 'pnpm: ' + message;
}
(0, $i45p4$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($jeDhm))).version}:Pnpm`, $85d1530af77bb266$export$ad678da47ffaf985);

});

parcelRegister("cXMMx", function(module, exports) {

$parcel$export(module.exports, "default", () => $9700d5cfd04c8596$export$2e2bcd8739ae039);
function $9700d5cfd04c8596$export$2e2bcd8739ae039(userAgent = process.env.npm_config_user_agent) {
    if (!userAgent) return undefined;
    const pmSpec = userAgent.split(' ')[0];
    const separatorPos = pmSpec.lastIndexOf('/');
    const name = pmSpec.substring(0, separatorPos);
    return {
        name: name,
        version: pmSpec.substring(separatorPos + 1)
    };
}

});

parcelRegister("b405e", function(module, exports) {

$parcel$export(module.exports, "default", () => $80e021fbed76242f$export$2e2bcd8739ae039);
const $80e021fbed76242f$var$MODULE_REGEX = /^((@[^/\s]+\/){0,1}([^/\s.~]+[^/\s]*)){1}(@[^/\s]+){0,1}/;
function $80e021fbed76242f$export$2e2bcd8739ae039(moduleName) {
    let matches = $80e021fbed76242f$var$MODULE_REGEX.exec(moduleName);
    if (matches) return matches[0];
    return '';
}

});




$parcel$export(module.exports, "_addToInstallQueue", () => (parcelRequire("b3vcY"))._addToInstallQueue);

var $lLPK6 = parcelRequire("lLPK6");

var $buj7e = parcelRequire("buj7e");

var $eZHZZ = parcelRequire("eZHZZ");
var $afea74298363e136$exports = {};

$parcel$export($afea74298363e136$exports, "MockPackageInstaller", () => $afea74298363e136$export$75a986c28df5fb9b);




var $jeDhm = parcelRequire("jeDhm");

var $32AGp = parcelRequire("32AGp");
class $afea74298363e136$export$75a986c28df5fb9b {
    packages = new Map();
    register(packageName, fs, packagePath) {
        this.packages.set(packageName, {
            fs: fs,
            packagePath: packagePath
        });
    }
    async install({ modules: modules, fs: fs, cwd: cwd, packagePath: packagePath, saveDev: saveDev = true }) {
        if (packagePath == null) {
            packagePath = (0, ($parcel$interopDefault($i45p4$path))).join(cwd, 'package.json');
            await fs.writeFile(packagePath, '{}');
        }
        let pkg = JSON.parse(await fs.readFile(packagePath, 'utf8'));
        let key = saveDev ? 'devDependencies' : 'dependencies';
        if (!pkg[key]) pkg[key] = {};
        for (let module of modules)pkg[key][module.name] = '^' + await this.installPackage(module, fs, packagePath);
        await fs.writeFile(packagePath, JSON.stringify(pkg));
    }
    async installPackage(moduleRequest, fs, packagePath) {
        let pkg = this.packages.get(moduleRequest.name);
        if (!pkg) throw new Error('Unknown package ' + moduleRequest.name);
        let dest = (0, ($parcel$interopDefault($i45p4$path))).join((0, ($parcel$interopDefault($i45p4$path))).dirname(packagePath), 'node_modules', moduleRequest.name);
        await (0, $i45p4$parcelfs.ncp)(pkg.fs, pkg.packagePath, fs, dest);
        let packageJSON = JSON.parse(await fs.readFile((0, ($parcel$interopDefault($i45p4$path))).join(dest, 'package.json'), 'utf8'));
        if (packageJSON.dependencies != null) for (let dep of (0, $32AGp.moduleRequestsFromDependencyMap)(packageJSON.dependencies))await this.installPackage(dep, fs, packagePath);
        return packageJSON.version;
    }
}
(0, $i45p4$parcelcore.registerSerializableClass)(`${(0, (/*@__PURE__*/$parcel$interopDefault($jeDhm))).version}:MockPackageInstaller`, $afea74298363e136$export$75a986c28df5fb9b);



var $jd2hZ = parcelRequire("jd2hZ");

var $b3vcY = parcelRequire("b3vcY");
$parcel$exportWildcard(module.exports, $lLPK6);
$parcel$exportWildcard(module.exports, $buj7e);
$parcel$exportWildcard(module.exports, $eZHZZ);
$parcel$exportWildcard(module.exports, $afea74298363e136$exports);
$parcel$exportWildcard(module.exports, $jd2hZ);


//# sourceMappingURL=index.js.map
