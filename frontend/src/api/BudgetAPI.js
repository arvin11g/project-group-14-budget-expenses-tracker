import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/budgets';

const budgetAPI = {
  // Get budget by term
  getBudgetByTerm: async (term) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/term/${term}`);
      return response;
    } catch (error) {
      // If budget doesn't exist (404), return null data
      if (error.response?.status === 404) {
        return { data: { id: null, amount: 0 } };
      }
      throw error;
    }
  },

  // Set/Create budget for term
  setBudgetForTerm: async (term, amount) => {
    // Check if budget already exists
    try {
      const existing = await axios.get(`${API_BASE_URL}/term/${term}`);
      
      // If it exists, update it
      if (existing.data && existing.data.id) {
        return await axios.put(`${API_BASE_URL}/${existing.data.id}`, {
          academicTerm: term,
          amount: amount,
          // Add default dates based on term
          termStartDate: getTermStartDate(term),
          termEndDate: getTermEndDate(term)
        });
      }
    } catch (error) {
      // Budget doesn't exist, create new one
    }

    // Create new budget
    return await axios.post(`${API_BASE_URL}`, {
      academicTerm: term,
      amount: amount,
      termStartDate: getTermStartDate(term),
      termEndDate: getTermEndDate(term)
    });
  },

  // Get all budgets
  getAllBudgets: async () => {
    return await axios.get(`${API_BASE_URL}`);
  },

  // Delete budget
  deleteBudget: async (id) => {
    return await axios.delete(`${API_BASE_URL}/${id}`);
  }
};

// Helper functions to get term dates
function getTermStartDate(term) {
  const dates = {
    "Winter 2026": "2026-01-06",
    "Summer 2026": "2026-05-04",
    "Fall 2026": "2026-09-08",
    "Winter 2027": "2027-01-05"
  };
  return dates[term] || "2026-01-06";
}

function getTermEndDate(term) {
  const dates = {
    "Winter 2026": "2026-04-30",
    "Summer 2026": "2026-08-31",
    "Fall 2026": "2026-12-18",
    "Winter 2027": "2027-04-29"
  };
  return dates[term] || "2026-04-30";
}

export default budgetAPI;