package com.yorku.budgettracker.budgettracker.data;

import java.util.List;
import com.yorku.budgettracker.budgettracker.model.Expense;

public interface ExpenseDataAccess {
    Expense save(Expense expense);
    List<Expense> findByAcademicTerm(String academicTerm);
    List<Expense> findAll();
}