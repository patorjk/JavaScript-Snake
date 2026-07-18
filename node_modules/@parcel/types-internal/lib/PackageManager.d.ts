import type { FileCreateInvalidation, PackageJSON } from "./index";
import type { SemverRange } from "./SemverRange";
import type { DependencySpecifier } from "./DependencySpecifier";
import type { FileSystem } from "./FileSystem";
import type { FilePath } from "./FilePath";
export type PackageManagerResolveResult = {
  resolved: FilePath | DependencySpecifier;
  pkg?: PackageJSON | null | undefined;
  invalidateOnFileCreate: Array<FileCreateInvalidation>;
  invalidateOnFileChange: Set<FilePath>;
  type: number;
};
export type InstallOptions = {
  installPeers?: boolean;
  saveDev?: boolean;
  packageInstaller?: PackageInstaller | null | undefined;
};
export type InstallerOptions = {
  modules: Array<ModuleRequest>;
  fs: FileSystem;
  cwd: FilePath;
  packagePath?: FilePath | null | undefined;
  saveDev?: boolean;
};
export interface PackageInstaller {
  install(opts: InstallerOptions): Promise<void>;
}
export type Invalidations = {
  invalidateOnFileCreate: Array<FileCreateInvalidation>;
  invalidateOnFileChange: Set<FilePath>;
  invalidateOnStartup: boolean;
};
export interface PackageManager {
  require(id: DependencySpecifier, from: FilePath, arg2: {
    range?: SemverRange | null | undefined;
    shouldAutoInstall?: boolean;
    saveDev?: boolean;
  } | null | undefined): Promise<any>;
  resolve(id: DependencySpecifier, from: FilePath, arg2: {
    range?: SemverRange | null | undefined;
    shouldAutoInstall?: boolean;
    saveDev?: boolean;
  } | null | undefined): Promise<PackageManagerResolveResult>;
  getInvalidations(id: DependencySpecifier, from: FilePath): Invalidations;
  invalidate(id: DependencySpecifier, from: FilePath): void;
}
export type ModuleRequest = {
  readonly name: string;
  readonly range: SemverRange | null | undefined;
};
