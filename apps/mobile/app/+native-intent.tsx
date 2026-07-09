import { mapWebPathToMobile } from "@jff/utils/deep-links";

/**
 * Normalize inbound universal links / app scheme paths for Expo Router.
 * @see https://docs.expo.dev/router/advanced/native-intent/
 */
export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}): string {
  try {
    return mapWebPathToMobile(path);
  } catch {
    return "/";
  }
}
