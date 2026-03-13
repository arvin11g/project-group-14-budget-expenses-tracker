package com.yorku.budgettracker.budgettracker.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import com.yorku.budgettracker.budgettracker.data.StubExpenseDataAccess;
import com.yorku.budgettracker.budgettracker.model.Expense;

@ActiveProfiles("stub")
public class BudgetServiceTest {

    private BudgetService service;

    @BeforeEach
    void setUp() {
        service = new BudgetService(new StubExpenseDataAccess());
    }

    @Test
    void addExpense_addsExpenseToCorrectTerm() {
        int before = service.getExpensesForTerm("Winter 2026").size();

        service.addExpense(
                new Expense(
                        "Food",
                        "Groceries",
                        100,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        int after = service.getExpensesForTerm("Winter 2026").size();
        assertEquals(before + 1, after);
    }

    @Test
    void totalExpenses_isCalculatedCorrectly() {
        service.addExpense(
                new Expense(
                        "Food",
                        "Groceries",
                        100,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        double total = service.getTotalExpensesForTerm("Winter 2026");
        assertEquals(1300, total, 0.001);
    }

    @Test
    void remainingBalance_isIncomeMinusExpenses() {
        service.addExpense(
                new Expense(
                        "Food",
                        "Lunch",
                        50,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        double remaining = service.getRemainingBalance("Winter 2026", 2000);
        assertEquals(750, remaining, 0.001);
    }

    @Test
    void isOverBudget_returnsTrueWhenExpensesAreHigherThanBudget() {
        service.addExpense(
                new Expense(
                        "Books",
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
        service.addExpense(
                new Expense(
                        "Food",
                        "Dinner",
                        40,
                        LocalDate.now(),
                        "Winter 2026"
                )
        );

        service.addExpense(
                new Expense(
                        "Rent",
                        "Rent",
                        700,
                        LocalDate.now(),
                        "Fall 2026"
                )
        );

        List<Expense> winterExpenses = service.getExpensesForTerm("Winter 2026");
        assertTrue(winterExpenses.stream().allMatch(e -> e.getAcademicTerm().equals("Winter 2026")));
    }
}