package com.yorku.budgettracker.budgettracker.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.yorku.budgettracker.budgettracker.model.Expense;
import com.yorku.budgettracker.budgettracker.repository.ExpenseRepository;

@SpringBootTest
public class BudgetServiceTest {

    @Autowired
    private BudgetService service;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Test
    void totalExpenses_isCalculatedCorrectly() {

        expenseRepository.save(
                new Expense(
                        "food",
                        "Groceries",
                        100,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        double total = service.getTotalExpensesForTerm("Winter 2026");

        assertTrue(total >= 100);
    }

    @Test
    void remainingBalance_isIncomeMinusExpenses() {

        expenseRepository.save(
                new Expense(
                        "food",
                        "Lunch",
                        50,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        double remaining = service.getRemainingBalance("Winter 2026", 200);

        assertTrue(remaining <= 150);
    }
}