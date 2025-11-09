const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, "");
  const limitedNumbers = numbers.slice(0, 11);
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
};

const formatPhoneFromE164 = (phoneE164) => {
  if (!phoneE164) return "";

  let phoneWithoutCountryCode = phoneE164.replace(/^\+55/, "");

  if (phoneWithoutCountryCode.length === 10) {
    const ddd = phoneWithoutCountryCode.substring(0, 2);
    const rest = phoneWithoutCountryCode.substring(2);

    if (parseInt(ddd) >= 11 && parseInt(ddd) <= 99 && /^[4-9]/.test(rest)) {
      phoneWithoutCountryCode = ddd + "9" + rest;
    }
  }

  return formatPhoneNumber(phoneWithoutCountryCode);
};

console.log("Teste de formatação:");
console.log("+554896899346 ->", formatPhoneFromE164("+554896899346"));
console.log("+5548996899346 ->", formatPhoneFromE164("+5548996899346"));
console.log("+5511999999999 ->", formatPhoneFromE164("+5511999999999"));
