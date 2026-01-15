"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.report = report;
exports.reportWorker = reportWorker;
function _assert() {
  const data = _interopRequireDefault(require("assert"));
  _assert = function () {
    return data;
  };
  return data;
}
var _Bundle = require("./public/Bundle");
function _workers() {
  const data = _interopRequireWildcard(require("@parcel/workers"));
  _workers = function () {
    return data;
  };
  return data;
}
function _logger() {
  const data = _interopRequireWildcard(require("@parcel/logger"));
  _logger = function () {
    return data;
  };
  return data;
}
var _PluginOptions = _interopRequireDefault(require("./public/PluginOptions"));
var _BundleGraph = _interopRequireDefault(require("./BundleGraph"));
function _profiler() {
  const data = require("@parcel/profiler");
  _profiler = function () {
    return data;
  };
  return data;
}
function _diagnostic() {
  const data = require("@parcel/diagnostic");
  _diagnostic = function () {
    return data;
  };
  return data;
}
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const instances = new Set();
class ReporterRunner {
  constructor(opts) {
    this.errors = [];
    this.options = opts.options;
    this.reporters = opts.reporters;
    this.workerFarm = opts.workerFarm;
    this.pluginOptions = new _PluginOptions.default(this.options);
    _logger().default.onLog(event => this.report(event));
    _profiler().tracer.onTrace(event => this.report(event));
    _workers().bus.on('reporterEvent', this.eventHandler);
    instances.add(this);
    if (this.options.shouldPatchConsole) {
      (0, _logger().patchConsole)();
    } else {
      (0, _logger().unpatchConsole)();
    }
  }
  eventHandler = event => {
    if (event.type === 'buildProgress' && (event.phase === 'optimizing' || event.phase === 'packaging') && !(event.bundle instanceof _Bundle.NamedBundle)) {
      // $FlowFixMe[prop-missing]
      let bundleGraphRef = event.bundleGraphRef;
      // $FlowFixMe[incompatible-exact]
      let bundle = event.bundle;
      // Convert any internal bundles back to their public equivalents as reporting
      // is public api
      let bundleGraph = this.workerFarm.workerApi.getSharedReference(
      // $FlowFixMe
      bundleGraphRef);
      (0, _assert().default)(bundleGraph instanceof _BundleGraph.default);
      // $FlowFixMe[incompatible-call]
      this.report({
        ...event,
        bundle: _Bundle.NamedBundle.get(bundle, bundleGraph, this.options)
      });
      return;
    }
    this.report(event);
  };
  async report(unsanitisedEvent) {
    let event = unsanitisedEvent;
    if (event.diagnostics) {
      // Sanitise input before passing to reporters
      // $FlowFixMe too complex to narrow down by type
      event = {
        ...event,
        diagnostics: (0, _diagnostic().anyToDiagnostic)(event.diagnostics)
      };
    }
    for (let reporter of this.reporters) {
      let measurement;
      try {
        // To avoid an infinite loop we don't measure trace events, as they'll
        // result in another trace!
        if (event.type !== 'trace') {
          measurement = _profiler().tracer.createMeasurement(reporter.name, 'reporter');
        }
        await reporter.plugin.report({
          // $FlowFixMe
          event,
          options: this.pluginOptions,
          logger: new (_logger().PluginLogger)({
            origin: reporter.name
          }),
          tracer: new (_profiler().PluginTracer)({
            origin: reporter.name,
            category: 'reporter'
          })
        });
      } catch (reportError) {
        if (event.type !== 'buildSuccess') {
          // This will be captured by consumers
          _logger().INTERNAL_ORIGINAL_CONSOLE.error(reportError);
        }
        this.errors.push(reportError);
      } finally {
        measurement && measurement.end();
      }
    }
  }
  dispose() {
    _workers().bus.off('reporterEvent', this.eventHandler);
    instances.delete(this);
  }
}
exports.default = ReporterRunner;
function reportWorker(workerApi, event) {
  if (event.type === 'buildProgress' && (event.phase === 'optimizing' || event.phase === 'packaging')) {
    // Convert any public api bundles to their internal equivalents for
    // easy serialization
    _workers().bus.emit('reporterEvent', {
      ...event,
      bundle: (0, _Bundle.bundleToInternalBundle)(event.bundle),
      bundleGraphRef: workerApi.resolveSharedReference((0, _Bundle.bundleToInternalBundleGraph)(event.bundle))
    });
    return;
  }
  _workers().bus.emit('reporterEvent', event);
}
async function report(event) {
  await Promise.all([...instances].map(instance => instance.report(event)));
}