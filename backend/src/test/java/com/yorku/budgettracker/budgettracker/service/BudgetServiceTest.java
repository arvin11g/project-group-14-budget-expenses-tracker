package com.yorku.budgettracker.budgettracker.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
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

    @BeforeEach
    void setUp() {
        expenseRepository.deleteAll();
    }

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

        expenseRepository.save(
                new Expense(
                        "rent",
                        "Rent",
                        500,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        double total = service.getTotalExpensesForTerm("Winter 2026");

        assertEquals(600, total, 0.001);
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

        assertEquals(150, remaining, 0.001);
    }

    @Test
    void isOverBudget_returnsTrueWhenExpensesAreHigherThanBudget() {
        expenseRepository.save(
                new Expense(
                        "books",
                        "Textbook",
                        300,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        boolean overBudget = service.isOverBudget("Winter 2026", 200);

        assertTrue(overBudget);
    }

    @Test
    void getExpensesForTerm_returnsOnlyExpensesForThatTerm() {
        expenseRepository.save(
                new Expense(
                        "food",
                        "Dinner",
                        40,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        expenseRepository.save(
                new Expense(
                        "rent",
                        "Rent",
                        700,
                        LocalDate.now(),
                        "Fall 2026"
                )
        );

        List<Expense> winterExpenses = service.getExpensesForTerm("Winter 2026");

        assertEquals(1, winterExpenses.size());
        assertEquals("Winter 2026", winterExpenses.get(0).getAcademicTerm());
    }
}