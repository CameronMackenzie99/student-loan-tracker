export function formatTaxYear(startingYear: number) {
  const endingYear = startingYear + 1;
  return `${startingYear}/${endingYear.toString().slice(2)}`;
}
