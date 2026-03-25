export function calculateTuition(program, credits, studentType) {
  if (!program) return 0;

  if (program.billingType === "perYear") {
    return program.fees?.[studentType]?.total || 0;
  }

  return (program.feesPerCredit?.[studentType]?.total || 0) * Number(credits || 0);
}

export function calculateHousing(room, diningPlan, additionalFees) {
  const residenceRate = room?.rate || 0;
  const diningCost = diningPlan?.cost || 0;
  const applicationFee = additionalFees?.applicationFee || 0;
  const residenceAdminFee =
    additionalFees?.residenceLifeActivityAndAdministrationFee || 0;

  return residenceRate + diningCost + applicationFee + residenceAdminFee;
}

export function calculateTotalCost(tuition, housing) {
  return tuition + housing;
}