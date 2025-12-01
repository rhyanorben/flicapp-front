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
 * Normalizes an E164 phone number to ensure it doesn't have duplicate 9s
 * @param phoneE164 - E164 format phone number (+55XXXXXXXXXXX)
 * @returns Normalized E164 format phone number
 * 
 * Exemplo: +5548991234567 (com 9 duplicado) -> +554891234567
 */
export function normalizeE164(phoneE164: string): string {
  const digits = phoneE164.replace(/\D/g, "");

  if (!digits.startsWith("55")) {
    return `+${digits}`;
  }

  const local = digits.slice(2); // depois do 55

  // Mantém qualquer coisa que não seja 11 dígitos (não vou inventar regra)
  if (local.length !== 11) {
    return `+${digits}`;
  }

  const ddd = local.slice(0, 2);
  let subscriber = local.slice(2); // 9 dígitos

  // Se tiver 9 dígitos e começar com 99..., tira um 9 (DDD + 9 + 9 + 7)
  if (subscriber.length === 9 && subscriber[0] === "9" && subscriber[1] === "9") {
    subscriber = subscriber.slice(1); // remove UM 9
  }

  return `+55${ddd}${subscriber}`;
}

/**
 * Converts Brazilian phone number format to E164 format
 * @param phone - Brazilian phone number in format (XX) XXXXX-XXXX or E164 format
 * @returns E164 format phone number (+55XXXXXXXXXXX)
 * 
 * E164 format for Brazil:
 * - Mobile: +55 + DDD (2) + 9 + number (8) = 13 characters total (+55 + 12 digits)
 * - Landline: +55 + DDD (2) + number (8) = 12 characters total (+55 + 11 digits)
 * 
 * IMPORTANT: Sempre normaliza no final para garantir que não há 9 duplicado.
 */
export function convertPhoneToE164(phone: string): string {
  const numbers = phone.replace(/\D/g, "");

  let e164: string;

  if (numbers.startsWith("55")) {
    // Já tem DDI
    e164 = `+${numbers}`;
  } else if (numbers.length === 11) {
    // DDD (2) + 9 + 8 dígitos (ou DDD + 9 dígitos sem 9)
    e164 = `+55${numbers}`;
  } else if (numbers.length === 10) {
    // DDD (2) + 8 dígitos -> decide se adiciona 9 ou não
    const ddd = numbers.slice(0, 2);
    const rest = numbers.slice(2);

    // Se já começa com 9, não adiciona outro 9 (pode ser número incompleto ou já tem o 9)
    if (rest[0] === "9") {
      // Já tem 9 ou número incompleto -> mantém como está
      e164 = `+55${numbers}`;
    } else if (/^[4-8]/.test(rest)) {
      // provável celular (começa com 4-8) -> adiciona 9
      e164 = `+55${ddd}9${rest}`;
    } else {
      // provável fixo -> mantém
      e164 = `+55${numbers}`;
    }
  } else {
    throw new Error("Formato de telefone inválido");
  }

  // GARANTE que não tem 9 duplicado
  return normalizeE164(e164);
}

/**
 * Converts E164 format phone number to WhatsApp ID format
 * @param phoneE164 - E164 format phone number (+55XXXXXXXXXXX)
 * @returns WhatsApp ID format (55XXXXXXXXXXX@s.whatsapp.net)
 */
export function convertE164ToWhatsAppId(phoneE164: string): string {
  // Remove the + sign and add @s.whatsapp.net
  const numbers = phoneE164.replace(/^\+/, "");
  return `${numbers}@s.whatsapp.net`;
}

/**
 * Converts E164 format phone number to Brazilian format
 * @param phoneE164 - E164 format phone number (+55XXXXXXXXXXX)
 * @returns Brazilian format phone number (XX) XXXXX-XXXX
 */
export function formatPhoneFromE164(phoneE164: string | null): string {
  if (!phoneE164) return "";

  // First normalize the E164 number to remove any duplicate 9s
  const normalized = normalizeE164(phoneE164);

  // Remove country code (+55) from phoneE164
  let phoneWithoutCountryCode = normalized.replace(/^\+55/, "");

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
