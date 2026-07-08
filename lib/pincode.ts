import { PINCODE_CONFIG } from "@/lib/pincode-config";

export interface PincodeLookupResult {
  pincode: string;
  state: string;
  district: string;
  city: string;
  postOffice: string;
  postOffices: string[];
}

export type PincodeLookupErrorCode =
  | "invalid"
  | "not_found"
  | "network_error";

export class PincodeLookupError extends Error {
  constructor(
    public code: PincodeLookupErrorCode,
    message: string
  ) {
    super(message);
    this.name = "PincodeLookupError";
  }
}

interface PostalPincodeOffice {
  Name: string;
  District: string;
  State: string;
  Block?: string;
  Pincode: string;
}

interface PostalPincodeResponse {
  Status: string;
  Message: string;
  PostOffice?: PostalPincodeOffice[] | null;
}

const cache = new Map<string, PincodeLookupResult>();
const inflight = new Map<string, Promise<PincodeLookupResult>>();

export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

function mapPostOffice(
  pincode: string,
  office: PostalPincodeOffice
): PincodeLookupResult {
  const postOffices = [office.Name];
  return {
    pincode,
    state: office.State,
    district: office.District,
    city: office.Block?.trim() || office.District,
    postOffice: office.Name,
    postOffices,
  };
}

function mergePostOffices(
  pincode: string,
  offices: PostalPincodeOffice[]
): PincodeLookupResult {
  const primary = offices[0];
  const postOfficeNames = offices.map((o) => o.Name);
  return {
    pincode,
    state: primary.State,
    district: primary.District,
    city: primary.Block?.trim() || primary.District,
    postOffice: primary.Name,
    postOffices: postOfficeNames,
  };
}

async function fetchFromPostalPincode(
  pincode: string,
  signal: AbortSignal
): Promise<PincodeLookupResult> {
  const provider = PINCODE_CONFIG.providers.postalpincode;
  const response = await fetch(provider.buildUrl(pincode), { signal });

  if (!response.ok) {
    throw new PincodeLookupError(
      "network_error",
      PINCODE_CONFIG.messages.networkError
    );
  }

  const data = (await response.json()) as PostalPincodeResponse[];

  if (!Array.isArray(data) || data.length === 0) {
    throw new PincodeLookupError(
      "not_found",
      PINCODE_CONFIG.messages.notFound
    );
  }

  const result = data[0];
  if (
    result.Status !== "Success" ||
    !result.PostOffice ||
    result.PostOffice.length === 0
  ) {
    throw new PincodeLookupError(
      "not_found",
      PINCODE_CONFIG.messages.notFound
    );
  }

  return result.PostOffice.length === 1
    ? mapPostOffice(pincode, result.PostOffice[0])
    : mergePostOffices(pincode, result.PostOffice);
}

/**
 * Fetch address details for a 6-digit Indian PIN code.
 * Results are cached in memory for the session.
 */
export async function lookupPincode(
  pincode: string
): Promise<PincodeLookupResult> {
  if (!isValidPincode(pincode)) {
    throw new PincodeLookupError(
      "invalid",
      PINCODE_CONFIG.messages.invalid
    );
  }

  const cached = cache.get(pincode);
  if (cached) return cached;

  const pending = inflight.get(pincode);
  if (pending) return pending;

  const controller = new AbortController();

  const promise = (async () => {
    try {
      let result: PincodeLookupResult;

      switch (PINCODE_CONFIG.activeProvider) {
        case "postalpincode":
        default:
          result = await fetchFromPostalPincode(pincode, controller.signal);
      }

      cache.set(pincode, result);
      return result;
    } catch (error) {
      if (error instanceof PincodeLookupError) throw error;
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
      throw new PincodeLookupError(
        "network_error",
        PINCODE_CONFIG.messages.networkError
      );
    } finally {
      inflight.delete(pincode);
    }
  })();

  inflight.set(pincode, promise);
  return promise;
}

export function clearPincodeCache(): void {
  cache.clear();
}
