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

  // If already has country code, check if it needs the 9
  if (numbers.startsWith("55")) {
    const withoutCountryCode = numbers.substring(2);
    // If has 11 digits after country code, return as is
    if (withoutCountryCode.length === 11) {
      return `+${numbers}`;
    }
    // If has 10 digits after country code, check if needs 9
    if (withoutCountryCode.length === 10) {
      const ddd = withoutCountryCode.substring(0, 2);
      const rest = withoutCountryCode.substring(2);
      // If it's a mobile pattern (starts with 4-9), add the 9
      if (parseInt(ddd) >= 11 && parseInt(ddd) <= 99 && /^[4-9]/.test(rest)) {
        return `+55${ddd}9${rest}`;
      }
      // Otherwise return as is (landline)
      return `+${numbers}`;
    }
    // If has 13 digits total, return as is
    if (numbers.length === 13) {
      return `+${numbers}`;
    }
  }

  // Add country code +55 for Brazil
  if (numbers.length === 11) {
    // Check if it's already a mobile number (starts with DDD + 9)
    const ddd = numbers.substring(0, 2);
    const firstDigit = numbers.substring(2, 3);
    // If first digit after DDD is 9, it's already a mobile number
    if (firstDigit === "9") {
      return `+55${numbers}`;
    }
    // If first digit is 4-8, it might be missing the 9, but we assume it's correct
    // Most likely it's already correct (11 digits)
    return `+55${numbers}`;
  }

  // If 10 digits, check if it's mobile or landline
  if (numbers.length === 10) {
    const ddd = numbers.substring(0, 2);
    const rest = numbers.substring(2);

    // Check if it's a valid mobile number pattern
    // Mobile numbers in Brazil typically start with 6, 7, 8, or 9 after DDD
    // But we also check if the first digit is 4-9 to be safe
    if (parseInt(ddd) >= 11 && parseInt(ddd) <= 99) {
      // If the number after DDD starts with 4-9, it's likely a mobile number
      // Add the 9 after DDD for mobile format
      if (/^[4-9]/.test(rest)) {
        return `+55${ddd}9${rest}`;
      }
      // If it starts with 2 or 3, it's likely a landline (but some areas use these for mobile too)
      // For safety, if it's 10 digits and doesn't start with 4-9, assume it's landline
      return `+55${numbers}`;
    }
    // Invalid DDD, return as is
    return `+55${numbers}`;
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
