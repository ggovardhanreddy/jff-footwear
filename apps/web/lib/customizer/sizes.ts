import { SIZE_RANGES } from "@/lib/constants";
import type { Gender } from "@/types";

export function getSizesForGender(gender: Gender): number[] {
  return [...(SIZE_RANGES[gender] ?? SIZE_RANGES.Unisex)];
}
