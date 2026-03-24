package com.yorku.budgettracker.budgettracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yorku.budgettracker.budgettracker.data.ExpenseDataAccess;
import com.yorku.budgettracker.budgettracker.model.Expense;

@Service
public class BudgetService {

    private final ExpenseDataAccess expenseDataAccess;

    public BudgetService(ExpenseDataAccess expenseDataAccess) {
        this.expenseDataAccess = expenseDataAccess;
    }

    public void addExpense(Expense expense) {
        if (expense.getType() == null) {
            expense.setType("ACTUAL");
        }
        expenseDataAccess.save(expense);
    }

    public List<Expense> getExpensesForTerm(String academicTerm) {
        return expenseDataAccess.findByAcademicTerm(academicTerm);
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