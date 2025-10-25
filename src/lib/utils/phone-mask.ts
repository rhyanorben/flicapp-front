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
