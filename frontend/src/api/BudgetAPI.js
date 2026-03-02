import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/budgets',
  headers: { 'Content-Type': 'application/json' },
});

const budgetAPI = {
  getBudgetByTerm: (term) => api.get(`/term/${term}`),
  
  // Matches your POST /api/budgets endpoint — sends full budget object in body
  setBudgetForTerm: (term, amount) => api.post('', { academicTerm: term, amount: amount }),
};

export default budgetAPI;