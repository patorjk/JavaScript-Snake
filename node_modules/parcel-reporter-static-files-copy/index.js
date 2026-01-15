"use strict";
const { Reporter } = require("@parcel/plugin");
const fs = require("fs");
const path = require("path");

const PACKAGE_JSON_SECTION = "staticFiles";

const staticCopyPlugin = new Reporter({
  async report({ event, options }) {
    if (event.type === "buildSuccess") {
      const projectRoot = findProjectRoot(event, options);
      const configs = getSettings(projectRoot);

      // Get all dist dir from targets, we'll copy static files into them
      const targets = Array.from(
        new Set(
          event.bundleGraph
            .getBundles()
            .filter((b) => b.target && b.target.distDir)
            .map((b) => b.target.distDir)
        )
      );

      for (var config of configs) {
        let distPaths = config.distDir ? [config.distDir] : targets;

        if (config.env) {
          if (!doesEnvironmentVarsMatches(config.env)) {
            continue;
          }
        }

        if (config.staticOutPath) {
          distPaths = distPaths.map((p) => path.join(p, config.staticOutPath));
        }
  
        let staticPath = config.staticPath || path.join(projectRoot, "static");
  
        let fn = fs.statSync(staticPath).isDirectory() ? copyDir : copyFile;
        
        for (let distPath of distPaths) {
            fn(staticPath, distPath);
        }
      }
    }
  },
});

const copyFile = (copyFrom, copyTo) => {
  if (!fs.existsSync(copyTo)) {
    fs.mkdirSync(copyTo, { recursive: true });
  }
  fs.copyFileSync(copyFrom, path.join(copyTo, path.basename(copyFrom)));
};

const copyDir = (copyFrom, copyTo) => {
  if (!fs.existsSync(copyTo)) {
    fs.mkdirSync(copyTo, { recursive: true });
  }
  const copy = (filepath, relative, filename) => {
    const dest = path.join(copyTo, relative);
    if (!filename) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
    } else {
      fs.copyFileSync(filepath, dest);
    }
  };
  recurseSync(copyFrom, copy);
};

/**
 * Recurse into directory and execute callback function for each file and folder.
 *
 * Based on https://github.com/douzi8/file-system/blob/master/file-system.js#L254
 *
 * @param dirpath directory to start from
 * @param callback function to be run on every file/directory
 */
const recurseSync = (dirpath, callback) => {
  const rootpath = dirpath;

  function recurse(dirpath) {
    fs.readdirSync(dirpath).forEach(function (filename) {
      const filepath = path.join(dirpath, filename);
      const stats = fs.statSync(filepath);
      const relative = path.relative(rootpath, filepath);

      if (stats.isDirectory()) {
        callback(filepath, relative);
        recurse(filepath);
      } else {
        callback(filepath, relative, filename);
      }
    });
  }

  recurse(dirpath);
};

const findProjectRoot = (event, options) => {
  if (options.env["npm_package_json"]) {
    return path.dirname(options.env["npm_package_json"]);
  }
  if (options.env["PNPM_SCRIPT_SRC_DIR"]) {
    return options.env["PNPM_SCRIPT_SRC_DIR"];
  }
  return options.projectRoot;
}

const getSettings = (projectRoot) => {
  let packageJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "package.json"))
  );
  var section = packageJson[PACKAGE_JSON_SECTION];
  if (Array.isArray(section)) {
    return section;
  } else {
    return [Object.assign({}, section)];
  }
};

const doesEnvironmentVarsMatches = (envVars) => {
  var allMatches = true;
  for (var envVarName in envVars) {
    if (process.env[envVarName] !== envVars[envVarName]) {
      allMatches = false;
      break;
    }
  }
  return allMatches;
}

exports.default = staticCopyPlugin;
