export function formatCurrency(rawAmount: number | undefined) {
  if (rawAmount == undefined) {
    return "";
  }
  return rawAmount.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
