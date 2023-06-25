export const calculateRealValue = (nominalValue: number, year: number) => {
  const adjustmentFactor = (1 - 0.03) ** (year - new Date().getFullYear());
  return nominalValue * adjustmentFactor;
};

calculateRealValue(75000, 2051);
