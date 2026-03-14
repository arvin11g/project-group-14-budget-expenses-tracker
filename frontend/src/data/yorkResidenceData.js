const yorkResidenceData = {
  source: "York University Housing",
  year: "2026-2027",
  residences: [
    {
      name: "Bethune",
      options: [
        { roomType: "Traditional Double", rate: 9336, diningPlan: "Required" },
        { roomType: "Traditional Single", rate: 11002, diningPlan: "Required" },
      ],
    },
    {
      name: "Founders",
      options: [
        { roomType: "Traditional Double", rate: 9072, diningPlan: "Required" },
        { roomType: "Traditional Single", rate: 10694, diningPlan: "Required" },
      ],
    },
    {
      name: "Winters",
      options: [
        { roomType: "Traditional Double", rate: 9194, diningPlan: "Required" },
        { roomType: "Traditional Single", rate: 10838, diningPlan: "Required" },
      ],
    },
  ],
  additionalFees: {
    applicationFee: 250,
    roomDeposit: 750,
    residenceLifeActivityAndAdministrationFee: 80,
  },
  notes: {
    roomDeposit: "Room deposit is required up front and is credited later after move-in.",
  },
};

export default yorkResidenceData;