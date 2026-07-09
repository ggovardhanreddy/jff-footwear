/**
 * Remote app configuration — fetched from CDN / API at runtime.
 * Update apps/web/public/app-config.json to change values without an app release.
 */
export interface AppRemoteConfig {
  /** Users below this native version must update via the app store */
  minimumSupportedVersion: string;
  /** Latest native version available in stores */
  latestVersion: string;
  /** When true, users below latestVersion must update (in addition to minimum check) */
  forceUpdate: boolean;
  /** Optional override for the force-update message */
  message?: string;
  iosStoreUrl: string;
  androidStoreUrl: string;
}

export const DEFAULT_APP_REMOTE_CONFIG: AppRemoteConfig = {
  minimumSupportedVersion: "1.0.0",
  latestVersion: "1.0.0",
  forceUpdate: false,
  iosStoreUrl: "https://apps.apple.com/app/jff-footwear/id0000000000",
  androidStoreUrl:
    "https://play.google.com/store/apps/details?id=com.jfffootwear.app",
};

/** Relative path served by the website CDN */
export const REMOTE_APP_CONFIG_PATH = "/app-config.json";
