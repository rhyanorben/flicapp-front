/**
 * Brazilian phone number mask utility
 * Formats phone number to (XX) XXXXX-XXXX pattern
 */

export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Limit to 11 digits (DDD + 9 digits)
  const limitedNumbers = numbers.slice(0, 11);

  // Apply mask based on length
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(
      2,
      7
    )}-${limitedNumbers.slice(7)}`;
  }
}

export function validatePhoneNumber(phone: string): boolean {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length === 11;
}

export function getPhonePlaceholder(): string {
  return "(11) 99999-9999";
}

/**
 * Converts Brazilian phone number format to E164 format
 * @param phone - Brazilian phone number in format (XX) XXXXX-XXXX
 * @returns E164 format phone number (+55XXXXXXXXXXX)
 */
export function convertPhoneToE164(phone: string): string {
  // Remove all non-numeric characters
  const numbers = phone.replace(/\D/g, "");

  // If already has country code, return as is
  if (numbers.startsWith("55") && numbers.length === 13) {
    return `+${numbers}`;
  }

  // Add country code +55 for Brazil
  if (numbers.length === 11) {
    return `+55${numbers}`;
  }

  // If 10 digits, add 9 for mobile (Brazil mobile format)
  if (numbers.length === 10) {
    const ddd = numbers.substring(0, 2);
    const rest = numbers.substring(2);

    // Check if it's a valid mobile number pattern
    if (parseInt(ddd) >= 11 && parseInt(ddd) <= 99 && /^[4-9]/.test(rest)) {
      return `+55${ddd}9${rest}`;
    }
  }

  throw new Error("Formato de telefone inválido");
}

/**
 * Converts E164 format phone number to Brazilian format
 * @param phoneE164 - E164 format phone number (+55XXXXXXXXXXX)
 * @returns Brazilian format phone number (XX) XXXXX-XXXX
 */
export function formatPhoneFromE164(phoneE164: string | null): string {
  if (!phoneE164) return "";

  // Remove country code (+55) from phoneE164
  let phoneWithoutCountryCode = phoneE164.replace(/^\+55/, "");

  // Add 9 for mobile numbers if missing (Brazil mobile format)
  // Check if it's a 10-digit number (missing the 9 for mobile)
  if (phoneWithoutCountryCode.length === 10) {
    const ddd = phoneWithoutCountryCode.substring(0, 2);
    const rest = phoneWithoutCountryCode.substring(2);

    // If DDD is valid (11-99) and the rest starts with 4, 5, 6, 7, 8, or 9 (mobile prefixes), add 9
    if (parseInt(ddd) >= 11 && parseInt(ddd) <= 99 && /^[4-9]/.test(rest)) {
      phoneWithoutCountryCode = ddd + "9" + rest;
    }
  }

  return formatPhoneNumber(phoneWithoutCountryCode);
}
