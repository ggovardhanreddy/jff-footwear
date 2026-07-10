import { JFF_COINS } from "@jff/config/constants";
import {
  coinsEarnedForAmount,
  coinsEarnedForProduct,
  coinsToInr,
  getCoinLevel,
  inrToCoins,
} from "@jff/utils/pricing";

export {
  coinsEarnedForAmount,
  coinsEarnedForProduct,
  coinsToInr,
  getCoinLevel,
  inrToCoins,
  JFF_COINS,
};

export function formatCoins(amount: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, Math.floor(amount)));
}
