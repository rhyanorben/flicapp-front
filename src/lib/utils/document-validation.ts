/**
 * Brazilian document validation utilities
 * CPF and CNPJ validation with proper formatting
 */

export function formatCPF(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Limit to 11 digits
  const limitedNumbers = numbers.slice(0, 11);

  // Apply CPF mask: XXX.XXX.XXX-XX
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(
      3,
      6
    )}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(
      3,
      6
    )}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
  }
}

export function formatCNPJ(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Limit to 14 digits
  const limitedNumbers = numbers.slice(0, 14);

  // Apply CNPJ mask: XX.XXX.XXX/XXXX-XX
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 5) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 8) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5)}`;
  } else if (limitedNumbers.length <= 12) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
  } else {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(
      8,
      12
    )}-${limitedNumbers.slice(12)}`;
  }
}

export function formatDocument(value: string): string {
  const numbers = value.replace(/\D/g, "");

  // If 11 digits or less, format as CPF
  if (numbers.length <= 11) {
    return formatCPF(value);
  }
  // If more than 11 digits, format as CNPJ
  return formatCNPJ(value);
}

export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "");

  if (numbers.length !== 11) return false;

  // Check for invalid patterns (all same digits)
  if (/^(\d)\1{10}$/.test(numbers)) return false;

  // Validate CPF algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) return false;

  return true;
}

export function validateCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, "");

  if (numbers.length !== 14) return false;

  // Check for invalid patterns (all same digits)
  if (/^(\d)\1{13}$/.test(numbers)) return false;

  // Validate CNPJ algorithm
  let sum = 0;
  let weight = 2;

  for (let i = 11; i >= 0; i--) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  if (firstDigit !== parseInt(numbers[12])) return false;

  sum = 0;
  weight = 2;

  for (let i = 12; i >= 0; i--) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  if (secondDigit !== parseInt(numbers[13])) return false;

  return true;
}

export function validateDocument(document: string): boolean {
  const numbers = document.replace(/\D/g, "");

  if (numbers.length === 11) {
    return validateCPF(document);
  } else if (numbers.length === 14) {
    return validateCNPJ(document);
  }

  return false;
}

export function getDocumentPlaceholder(): string {
  return "000.000.000-00 ou 00.000.000/0000-00";
}
