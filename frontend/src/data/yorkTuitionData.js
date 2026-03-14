const yorkTuitionData = {
  source: "York University Course and Program Fees",
  sessions: [
    {
      session: "Fall/Winter 2025-2026",
      educationLevels: [
        {
          level: "Undergrad",
          faculties: [
            {
              faculty: "Lassonde School of Engineering",
              programs: [
                {
                  program: "Bachelor of Engineering",
                  feesPerCredit: {
                    domesticOntario: {
                      tuition: 319.06,
                      supplementary: 43.56,
                      total: 362.62,
                    },
                    domesticOutOfProvince: {
                      tuition: 351.76,
                      supplementary: 43.56,
                      total: 395.32,
                    },
                    international: {
                      tuition: 1235.99,
                      supplementary: 43.56,
                      total: 1279.55,
                    },
                  },
                  estimatedBooksAndSupplies: {
                    min: 1200,
                    max: 2600,
                  },
                },
              ],
            },
            {
              faculty: "Faculty of Health",
              programs: [
                {
                  program: "All other programs",
                  feesPerCredit: {
                    domesticOntario: {
                      tuition: 203.93,
                      supplementary: 42.36,
                      total: 246.29,
                    },
                    domesticOutOfProvince: {
                      tuition: 224.84,
                      supplementary: 42.36,
                      total: 267.20,
                    },
                    international: {
                      tuition: 1275.90,
                      supplementary: 42.36,
                      total: 1318.26,
                    },
                  },
                  estimatedBooksAndSupplies: {
                    min: 1200,
                    max: 2600,
                  },
                  notes:
                    "Values taken from York University Faculty of Health - All Other Programs (FW25 fee page).",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default yorkTuitionData;