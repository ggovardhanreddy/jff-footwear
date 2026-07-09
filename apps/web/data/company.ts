/** Re-export verified company copy; web-only stats kept here. */
export {
  ABOUT_US,
  MISSION,
  VISION,
  BUSINESS_HOURS,
  ADDRESS_LINES,
  WHY_CHOOSE_JFF,
  WHOLESALE_SERVICES,
} from "@jff/shared/company";

/** Verified operational highlights — no fictional metrics. */
export const COMPANY_STATS = [
  { value: "2021", label: "Founded in Rayachoty" },
  { value: "100+", label: "Team members" },
  { value: "2L+", label: "Annual production capacity" },
  { value: "Made in India", label: "Manufacturing" },
] as const;
