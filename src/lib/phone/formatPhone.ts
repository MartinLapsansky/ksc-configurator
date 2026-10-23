import parsePhoneNumberFromString from "libphonenumber-js";

export type PhoneParts = {
  dialCode: string;
  national: string;
};

/**
 * Normalise a dial code to a leading "+" followed by digits,
 * e.g. "353" -> "+353", "+353" -> "+353", "353 " -> "+353".
 */
function normaliseDialCode(dialCode: string): string {
  const digits = dialCode.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

/**
 * Strip any non-digit characters from a national number.
 */
function normaliseNational(national: string): string {
  return national.replace(/\D/g, "");
}

/**
 * Build a canonical E.164 number from separately stored parts.
 * Falls back to "" when either part is empty.
 */
export function toE164({ dialCode, national }: PhoneParts): string {
  const code = normaliseDialCode(dialCode);
  const number = normaliseNational(national);

  if (!code || !number) {
    return "";
  }

  return `${code}${number}`;
}

/**
 * Format a stored phone as a user-friendly international number,
 * e.g. "+421 987 564 765", "+353 87 123 4567".
 *
 * Falls back to "{dialCode} {national}" when the number cannot be
 * parsed by libphonenumber.
 */
export function formatPhone(parts: PhoneParts): string {
  const e164 = toE164(parts);

  if (!e164) {
    return "";
  }

  const parsed = parsePhoneNumberFromString(e164);

  if (parsed) {
    return parsed.formatInternational();
  }

  const code = normaliseDialCode(parts.dialCode);
  const number = normaliseNational(parts.national);

  return [code, number].filter(Boolean).join(" ");
}

/**
 * Build a `tel:` href that mobile devices can use to place a call.
 * Always returns the canonical E.164 value (digits only, prefixed with "+").
 */
export function toTelHref(parts: PhoneParts): string {
  const e164 = toE164(parts);
  return e164 ? `tel:${e164}` : "";
}

/**
 * Extract the national (significant) number from a full E.164 digit string.
 *
 * `value` is digits only (e.g. "353871234567") and `dialCode` is "353".
 * Returns the part after the dial code, or the full value when the dial code
 * does not prefix the value.
 */
export function splitNationalFromE164(value: string, dialCode: string): string {
  const digits = value.replace(/\D/g, "");
  const code = (dialCode ?? "").replace(/\D/g, "");

  if (code && digits.startsWith(code)) {
    return digits.slice(code.length);
  }

  return digits;
}
