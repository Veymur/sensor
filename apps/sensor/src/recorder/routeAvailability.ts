import type { RecorderSnapshot } from "./types";

export const routeUnavailableLabel = "Unavailable for now";

export function locationOffForRequestedRoute(
  routeRequested: boolean,
  locationEnabled: boolean | null,
): boolean {
  return routeRequested && locationEnabled === false;
}

export const routeConfirmationMessage = "Route will be recorded on this phone";
export const routeConfirmationDurationMs = 3200;

export type RouteConfirmation = "now" | "after_location_on" | "none";

export function routeConfirmation(
  permissionGranted: boolean,
  locationEnabled: boolean | null,
): RouteConfirmation {
  if (!permissionGranted) return "none";
  return locationEnabled === false ? "after_location_on" : "now";
}

export function sessionRouteUnavailable(
  snapshot: Pick<RecorderSnapshot, "routeEnabled" | "gpsStatus">,
): boolean {
  return (
    snapshot.routeEnabled &&
    /no recent|gps disabled|permission denied|route unavailable/i.test(
      snapshot.gpsStatus,
    )
  );
}

export function sessionRouteLabel(
  snapshot: Pick<RecorderSnapshot, "routeEnabled" | "gpsStatus">,
  paused: boolean,
): string {
  if (!snapshot.routeEnabled) return "Off";
  if (sessionRouteUnavailable(snapshot)) return routeUnavailableLabel;
  return paused ? "Paused" : "Recording";
}
