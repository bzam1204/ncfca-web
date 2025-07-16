function removeNonDigits(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

function isValidLength(cpf: string): boolean {
  return cpf.length === 11;
}

function isHomogeneous(cpf: string): boolean {
  return cpf.split('').every((c) => c === cpf[0]);
}

function calculateDigit(cpf: string, factor: number): number {
  let total = 0;
  for (const digit of cpf) {
    if (factor > 1) {
      total += parseInt(digit, 10) * factor--;
    }
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCpf(cpf: string | null | undefined): boolean {
  if (!cpf) return false;
  const cleanCpf = removeNonDigits(cpf);
  if (!isValidLength(cleanCpf)) return false;
  if (isHomogeneous(cleanCpf)) return false;
  const digit1 = calculateDigit(cleanCpf, 10);
  const digit2 = calculateDigit(cleanCpf, 11);
  const checkDigit = cleanCpf.slice(9);
  return checkDigit === `${digit1}${digit2}`;
}
