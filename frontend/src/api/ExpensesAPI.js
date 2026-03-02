import axios from 'axios';

// Base URL for Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api/expenses';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Expense API Service
const expenseAPI = {
  // GET all expenses
  getAllExpenses: () => {
    return api.get('');
  },

  // GET expenses by term (chronological)
  getExpensesByTerm: (term) => {
    return api.get(`/term/${term}/chronological`);
  },

  // GET expenses grouped by category for a term
  getExpensesGroupedByCategory: (term) => {
    return api.get(`/term/${term}/grouped`);
  },

  // POST create new expense
  createExpense: (expenseData) => {
    return api.post('', expenseData);
  },

  // PUT update expense
  updateExpense: (id, expenseData) => {
    return api.put(`/${id}`, expenseData);
  },

  // DELETE expense
  deleteExpense: (id) => {
    return api.delete(`/${id}`);
  },

  // GET expenses by category
  getExpensesByCategory: (category) => {
    return api.get(`/category/${category}`);
  },

  // GET expenses by date range
  getExpensesByDateRange: (startDate, endDate) => {
    return api.get('/date-range', {
      params: {
        start: startDate,
        end: endDate,
      },
    });
  },

  // GET total expenses by date range
  getTotalByDateRange: (startDate, endDate) => {
    return api.get('/summary/total', {
      params: {
        start: startDate,
        end: endDate,
      },
    });
  },

  // GET total by term
  getTotalByTerm: (term) => {
    return api.get(`/summary/term/${term}`);
  },

  // GET total by category
  getTotalByCategory: () => {
    return api.get('/summary/category');
  },

  // Search expenses
  searchExpenses: (query) => {
    return api.get('/search', {
      params: { query },
    });
  },
};

export default expenseAPI;