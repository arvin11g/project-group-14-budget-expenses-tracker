package com.yorku.budgettracker.budgettracker.data;

import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.yorku.budgettracker.budgettracker.model.Expense;
import com.yorku.budgettracker.budgettracker.stub.InMemoryExpenseStore;

@Component
@Profile("stub")
public class StubExpenseDataAccess implements ExpenseDataAccess {

    private final InMemoryExpenseStore store = new InMemoryExpenseStore();

    @Override
    public Expense save(Expense expense) {
        store.add(expense);
        return expense;
    }

    @Override
    public List<Expense> findByAcademicTerm(String academicTerm) {
        return store.findByAcademicTerm(academicTerm);
    }

    @Override
    public List<Expense> findAll() {
        return store.findAll();
    }
}