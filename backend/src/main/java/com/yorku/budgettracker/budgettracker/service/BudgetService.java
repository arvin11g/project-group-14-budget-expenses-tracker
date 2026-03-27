package com.yorku.budgettracker.budgettracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yorku.budgettracker.budgettracker.data.ExpenseDataAccess;
import com.yorku.budgettracker.budgettracker.model.Expense;

// Handles all budget-related logic like adding expenses and organizing them by term.


@Service
public class BudgetService {

    private final ExpenseDataAccess expenseDataAccess;

    public BudgetService(ExpenseDataAccess expenseDataAccess) {
        this.expenseDataAccess = expenseDataAccess;
    }
    // adds a new expense and makes sure it defaults to ACTUAL if no type is given
    public Expense addExpense(Expense expense) {
        if (expense.getType() == null) {
            expense.setType("ACTUAL");
        }
        return expenseDataAccess.save(expense);
    }
    public List<Expense> getAllExpenses() {
        return expenseDataAccess.findAll();
    }

    public List<Expense> getExpensesForTerm(String term) {
        return expenseDataAccess.findByAcademicTerm(term);
    }

    public double getTotalExpensesForTerm(String academicTerm) {
        double total = 0;
        for (Expense e : getExpensesForTerm(academicTerm)) {
            total += e.getAmount();
        }
        return total;
    }

    public double getRemainingBalance(String academicTerm, double termIncome) {
        return termIncome - getTotalExpensesForTerm(academicTerm);
    }

    public boolean isOverBudget(String academicTerm, double termIncome) {
        return getRemainingBalance(academicTerm, termIncome) < 0;
    }


}