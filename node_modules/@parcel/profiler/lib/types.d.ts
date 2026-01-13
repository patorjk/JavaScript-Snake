export type { TraceMeasurement } from "@parcel/types-internal";
export type TraceMeasurementData = {
    readonly categories: string[];
    readonly args?: Record<string, unknown>;
};
