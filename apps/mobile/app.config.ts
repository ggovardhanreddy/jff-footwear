import { ExpoConfig, ConfigContext } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID ?? "your-eas-project-id";

const getAppName = () => {
  if (IS_DEV) return "JFF Footwear (Dev)";
  if (IS_PREVIEW) return "JFF Footwear (Preview)";
  return "JFF Footwear";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "jff-footwear",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "jff",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
    dark: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#121212",
    },
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.jfffootwear.app",
    associatedDomains: ["applinks:jffstores.com", "applinks:www.jffstores.com"],
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#2563eb",
    },
    package: "com.jfffootwear.app",
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          { scheme: "https", host: "jffstores.com", pathPrefix: "/" },
          { scheme: "https", host: "www.jffstores.com", pathPrefix: "/" },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-notifications",
      {
        icon: "./assets/icon.png",
        color: "#2563eb",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  updates: {
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    enabled: !IS_DEV,
    fallbackToCacheTimeout: 0,
    checkAutomatically: "NEVER",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID,
    },
    webAssetBaseUrl: process.env.EXPO_PUBLIC_WEB_ASSET_BASE_URL ?? "https://jffstores.com",
    remoteConfigUrl: process.env.EXPO_PUBLIC_REMOTE_CONFIG_URL ?? undefined,
  },
});
