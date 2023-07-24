export function calcInflation(
  value: number,
  interestRate: number,
  startingYear: number,
  endingYear: number
) {
  return value * (1 + interestRate / 100) ** (endingYear - startingYear);
}
