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
    const assets = [];
    bundle.traverseAssets(asset => {
      assets.push(asset);
    });
    _assert().default.strictEqual(assets.length, 1, 'SVG bundles must only contain one asset');
    let asset = assets[0];
    let code = await asset.getBuffer();
    let {
      bundles,
      importMap
    } = getBundleReferences(bundleGraph, bundle);
    let inlineBundles = await getInlineBundles(bundleGraph, bundle, getInlineBundleContents);
    let res = (0, _rust().packageSvg)({
      code,
      xml: true,
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

      // Wrap scripts and styles with CDATA if needed to ensure characters are not interpreted as XML
      if (entryBundle.type === 'js' || entryBundle.type === 'css') {
        if (packagedContents.includes('<') || packagedContents.includes('&')) {
          packagedContents = packagedContents.replace(/]]>/g, ']\\]>');
          packagedContents = `<![CDATA[\n${packagedContents}\n]]>`;
        }
      }
      let placeholder = ((_dependency$meta = dependency.meta) === null || _dependency$meta === void 0 ? void 0 : _dependency$meta.placeholder) ?? dependency.id;
      (0, _assert().default)(typeof placeholder === 'string');
      inlineBundles[placeholder] = {
        contents: packagedContents,
        module: false
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
      bundles.push({
        type: 'Script',
        value: {
          module: false,
          nomodule: false,
          src: (0, _utils().urlJoin)(bundle.target.publicUrl, bundle.name)
        }
      });
    }
  }
  return {
    bundles,
    importMap: {}
  };
}