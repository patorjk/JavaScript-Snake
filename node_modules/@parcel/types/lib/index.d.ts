import type WorkerFarm from "@parcel/workers";
import type { InitialParcelOptionsInternal } from "@parcel/types-internal";
export * from "@parcel/types-internal";
export type InitialParcelOptions = InitialParcelOptionsInternal<WorkerFarm>;
