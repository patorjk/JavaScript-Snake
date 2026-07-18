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
function _utils() {
  const data = require("@parcel/utils");
  _utils = function () {
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
var _default = exports.default = new (_plugin().Packager)({
  async package({
    bundle,
    bundleGraph,
    getInlineBundleContents
  }) {
    let assets = [];
    bundle.traverseAssets(asset => {
      assets.push(asset);
    });
    _assert().default.equal(assets.length, 1, 'HTML bundles must only contain one asset');
    let asset = assets[0];
    let code = await asset.getBuffer();
    let {
      bundles,
      importMap
    } = getBundleReferences(bundleGraph, bundle);
    let inlineBundles = await getInlineBundles(bundleGraph, bundle, getInlineBundleContents);
    let res = (0, _rust().packageHtml)({
      code,
      xml: bundle.type === 'xhtml',
      bundles,
      inlineBundles,
      importMap
    });
    return {
      contents: res.code
    };
  }
});
async function getInlineBundles(bundleGraph, bundle, getInlineBundleContents) {
  let inlineBundles = {};
  let dependencies = [];
  bundle.traverse(node => {
    if (node.type === 'dependency') {
      dependencies.push(node.value);
    }
  });
  for (let dependency of dependencies) {
    let entryBundle = bundleGraph.getReferencedBundle(dependency, bundle);
    if ((entryBundle === null || entryBundle === void 0 ? void 0 : entryBundle.bundleBehavior) === 'inline') {
      var _dependency$meta;
      let packagedBundle = await getInlineBundleContents(entryBundle, bundleGraph);
      let packagedContents = await (0, _utils().blobToString)(packagedBundle.contents);

      // Escape closing script tags and HTML comments in JS content.
      // https://www.w3.org/TR/html52/semantics-scripting.html#restrictions-for-contents-of-script-elements
      // Avoid replacing </script with <\/script as it would break the following valid JS: 0</script/ (i.e. regexp literal).
      // Instead, escape the s character.
      if (entryBundle.type === 'js') {
        packagedContents = packagedContents.replace(/<!--/g, '<\\!--').replace(/<\/(script)/gi, '</\\$1');
      }

      // Escape closing style tags in CSS content.
      if (entryBundle.type === 'css') {
        packagedContents = packagedContents.replace(/<\/(style)/gi, '<\\/$1');
      }
      let placeholder = ((_dependency$meta = dependency.meta) === null || _dependency$meta === void 0 ? void 0 : _dependency$meta.placeholder) ?? dependency.id;
      (0, _assert().default)(typeof placeholder === 'string');
      inlineBundles[placeholder] = {
        contents: packagedContents,
        module: entryBundle.env.outputFormat === 'esmodule'
      };
    } else if (dependency.specifierType === 'url') {
      var _dependency$meta2;
      let placeholder = ((_dependency$meta2 = dependency.meta) === null || _dependency$meta2 === void 0 ? void 0 : _dependency$meta2.placeholder) ?? dependency.id;
      (0, _assert().default)(typeof placeholder === 'string');
      inlineBundles[placeholder] = {
        contents: entryBundle ? (0, _utils().getURLReplacement)({
          dependency,
          fromBundle: bundle,
          toBundle: entryBundle,
          relative: false
        }).to : dependency.specifier,
        module: false
      };
    }
  }
  return inlineBundles;
}
function getBundleReferences(bundleGraph, htmlBundle) {
  let bundles = [];
  let importMap = {};
  let useImportMap = htmlBundle.env.supports('import-meta-resolve');
  let referencedBundles = new Set(bundleGraph.getReferencedBundles(htmlBundle));
  let nonRecursiveReferencedBundles = new Set(bundleGraph.getReferencedBundles(htmlBundle, {
    recursive: false
  }));
  for (let bundle of referencedBundles) {
    let isDirectlyReferenced = nonRecursiveReferencedBundles.has(bundle);
    if (bundle.type === 'css' && !isDirectlyReferenced) {
      bundles.push({
        type: 'StyleSheet',
        value: {
          href: (0, _utils().urlJoin)(bundle.target.publicUrl, bundle.name)
        }
      });
    } else if (bundle.type === 'js' && !isDirectlyReferenced) {
      let nomodule = bundle.env.outputFormat !== 'esmodule' && bundle.env.sourceType === 'module' && bundle.env.shouldScopeHoist;
      bundles.push({
        type: 'Script',
        value: {
          module: bundle.env.outputFormat === 'esmodule',
          nomodule,
          src: (0, _utils().urlJoin)(bundle.target.publicUrl, bundle.name)
        }
      });
    }
    if (useImportMap && bundle.type === 'js') {
      Object.assign(importMap, (0, _utils().getImportMap)(bundleGraph, bundle));
    }
  }
  if (useImportMap && Object.keys(importMap).length > 0) {
    for (let id in importMap) {
      importMap[id] = (0, _utils().urlJoin)(htmlBundle.target.publicUrl, importMap[id], true);
    }
  }
  return {
    bundles,
    importMap
  };
}