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
                      tuition: 0,
                      supplementary: 0,
                      total: 0,
                    },
                    domesticOutOfProvince: {
                      tuition: 0,
                      supplementary: 0,
                      total: 0,
                    },
                    international: {
                      tuition: 0,
                      supplementary: 0,
                      total: 0,
                    },
                  },
                  estimatedBooksAndSupplies: {
                    min: 1200,
                    max: 2600,
                  },
                  notes: "Replace these zero values with the exact Lassonde engineering values from the York fee page.",
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
                  notes: "Taken from the Faculty of Health - all other programs FW25 page.",
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