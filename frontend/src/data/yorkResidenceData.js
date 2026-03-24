const yorkResidenceData = {
  source: "York University Housing",
  year: "2026-2027",

  residences: [
    {
      name: "Bethune",
      diningRequired: false,
      options: [
        { roomType: "Traditional Double", rate: 9336, diningRequired: true },
        { roomType: "Traditional Single", rate: 11002, diningRequired: true },

        { roomType: "Suite (4 students) Double", rate: 11882, diningRequired: false },
        { roomType: "Suite (4 students) Single", rate: 13294, diningRequired: false },

        { roomType: "Suite (12 students) Single", rate: 11896, diningRequired: false }
      ]
    },
    {
      name: "Calumet",
      diningRequired: false,
      options: [
        {
          roomType: "Suite (6 students) Double",
          rate: 11462,
          diningRequired: false
        },
        {
          roomType: "Suite (6 students) Single",
          rate: 12770,
          diningRequired: false
        }
      ]
    },
    {
      name: "Founders",
      diningRequired: true,
      options: [
        {
          roomType: "Traditional Double",
          rate: 9072,
          diningRequired: true
        },
        {
          roomType: "Traditional Single",
          rate: 10694,
          diningRequired: true
        },
        {
          roomType: "Traditional Large Single",
          rate: 11764,
          diningRequired: true
        }
      ]
    },
    {
      name: "Winters",
      diningRequired: true,
      options: [
        {
          roomType: "Traditional Double",
          rate: 9194,
          diningRequired: true
        },
        {
          roomType: "Traditional Single",
          rate: 10838,
          diningRequired: true
        },
        {
          roomType: "Hybrid Double",
          rate: 9612,
          diningRequired: true
        },
        {
          roomType: "Hybrid Single",
          rate: 11290,
          diningRequired: true
        }
      ]
    },

    // examples of residence types where dining is optional
    {
      name: "Pond",
      diningRequired: false,
      options: [
        { roomType: "Suite Style (2 students)", rate: 12850 },
      ],
    },
    {
      name: "The Quad",
      diningRequired: false,
      options: [
        { roomType: "Suite Style ", rate: 13500 },
      ],
    },
    {
      name: "Stong",
      diningRequired: true,
      options: [
        {
          roomType: "Traditional Double",
          rate: 9572,
          diningRequired: true
        },
        {
          roomType: "Traditional Single",
          rate: 11282,
          diningRequired: true
        }
      ]
    },

    {
      name: "Tatham Hall",
      diningRequired: true,
      options: [
        {
          roomType: "Traditional Double",
          rate: 9572,
          diningRequired: true
        },
        {
          roomType: "Traditional Single",
          rate: 11282,
          diningRequired: true
        }
      ]
    },

    {
      name: "Vanier",
      diningRequired: true,
      options: [
        {
          roomType: "Traditional Double",
          rate: 9572,
          diningRequired: true
        },
        {
          roomType: "Traditional Single",
          rate: 11282,
          diningRequired: true
        }
      ]
    },



  ],

  diningPlans: [
    {
      name: "None",
      cost: 0,
      mealPlanDollars: 0,
      mealPlanPlus: 0,
      capitalEnhancementFee: 0,
    },
    {
      name: "Entry",
      cost: 5650,
      mealPlanDollars: 4050,
      mealPlanPlus: 1300,
      capitalEnhancementFee: 300,
    },
    {
      name: "Standard",
      cost: 6300,
      mealPlanDollars: 4050,
      mealPlanPlus: 1950,
      capitalEnhancementFee: 300,
    },
    {
      name: "Premium",
      cost: 6950,
      mealPlanDollars: 4050,
      mealPlanPlus: 2600,
      capitalEnhancementFee: 300,
    },
    {
      name: "Convenience",
      cost: 3800,
      mealPlanDollars: null,
      mealPlanPlus: 3650,
      capitalEnhancementFee: 150,
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