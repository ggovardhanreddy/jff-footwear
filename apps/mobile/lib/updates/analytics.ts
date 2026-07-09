export type OtaAnalyticsEvent =
  | "update_check"
  | "update_available"
  | "update_found"
  | "download_started"
  | "download_completed"
  | "restart_accepted"
  | "restart_later"
  | "restart_postponed"
  | "update_failed"
  | "update_error"
  | "network_unavailable"
  | "timeout"
  | "emergency_launch"
  | "runtime_mismatch";

export interface OtaAnalyticsPayload {
  event: OtaAnalyticsEvent;
  timestamp: string;
  channel?: string | null;
  runtimeVersion?: string | null;
  updateId?: string | null;
  manual?: boolean;
  message?: string;
}

export function logOtaEvent(
  event: OtaAnalyticsEvent,
  meta: Omit<OtaAnalyticsPayload, "event" | "timestamp"> = {}
): void {
  const payload: OtaAnalyticsPayload = {
    event,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  if (__DEV__) console.info("[OTA]", payload);
  else console.info("[OTA]", JSON.stringify(payload));
}
