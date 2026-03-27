package com.yorku.budgettracker.budgettracker.data;

import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.yorku.budgettracker.budgettracker.model.Expense;
import com.yorku.budgettracker.budgettracker.repository.ExpenseRepository;

@Component
@Profile("!stub")
public class DbExpenseDataAccess implements ExpenseDataAccess {

    private final ExpenseRepository expenseRepository;

    public DbExpenseDataAccess(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public Expense save(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> findByAcademicTerm(String academicTerm) {
        return expenseRepository.findByAcademicTerm(academicTerm);
    }

    @Override
    public List<Expense> findAll() {
        return expenseRepository.findAll();
    }
}