export type FeatureFlags = {
  // This feature flag mostly exists to test the feature flag system, and doesn't have any build/runtime effect
  readonly exampleFeature: boolean;

  /**
   * Use node.js implementation of @parcel/watcher watchman backend
   */
  readonly useWatchmanWatcher: boolean;
};
