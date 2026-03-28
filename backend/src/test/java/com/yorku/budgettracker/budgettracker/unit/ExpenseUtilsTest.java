package com.yorku.budgettracker.budgettracker.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.yorku.budgettracker.budgettracker.model.Expense;

public class ExpenseUtilsTest {

    // helps split expenses into planned and actual the same way the app does
    private Map<String, List<Expense>> splitPlannedAndActual(List<Expense> expenses) {
        List<Expense> planned = expenses.stream()
                .filter(expense -> {
                    String category = expense.getCategory();
                    return category != null && category.equalsIgnoreCase("planned");
                })
                .toList();

        List<Expense> actual = expenses.stream()
                .filter(expense -> {
                    String category = expense.getCategory();
                    return category == null || !category.equalsIgnoreCase("planned");
                })
                .toList();

        return Map.of(
                "planned", planned,
                "actual", actual
        );
    }

    // adds up a list of expenses
    private double calculateExpenseTotal(List<Expense> expenses) {
        return expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    // makes sure planned and actual expenses get separated properly
    @Test
    void splitPlannedAndActualShouldWorkCorrectly() {
        Expense planned1 = new Expense("planned", "Tuition estimate", 500, LocalDate.now(), "Winter 2026");
        Expense planned2 = new Expense("planned", "Books estimate", 100, LocalDate.now(), "Winter 2026");
        Expense actual1 = new Expense("Food", "Groceries", 80, LocalDate.now(), "Winter 2026");
        Expense actual2 = new Expense("Transport", "TTC pass", 128, LocalDate.now(), "Winter 2026");

        List<Expense> expenses = List.of(planned1, planned2, actual1, actual2);

        Map<String, List<Expense>> result = splitPlannedAndActual(expenses);

        assertEquals(2, result.get("planned").size());
        assertEquals(2, result.get("actual").size());
    }

    // makes sure the planned total is added up properly
    @Test
    void calculatePlannedTotalShouldBeCorrect() {
        Expense planned1 = new Expense("planned", "Tuition estimate", 500, LocalDate.now(), "Winter 2026");
        Expense planned2 = new Expense("planned", "Books estimate", 100, LocalDate.now(), "Winter 2026");

        double total = calculateExpenseTotal(List.of(planned1, planned2));

        assertEquals(600, total);
    }

    // makes sure the actual total is added up properly
    @Test
    void calculateActualTotalShouldBeCorrect() {
        Expense actual1 = new Expense("Food", "Groceries", 80, LocalDate.now(), "Winter 2026");
        Expense actual2 = new Expense("Transport", "TTC pass", 128, LocalDate.now(), "Winter 2026");

        double total = calculateExpenseTotal(List.of(actual1, actual2));

        assertEquals(208, total);
    }

    // makes sure an empty expense list gives a total of 0
    @Test
    void calculateExpenseTotalShouldReturnZeroForEmptyList() {
        double total = calculateExpenseTotal(List.of());

        assertEquals(0, total);
    }

    // makes sure everything goes to actual if there are no planned expenses
    @Test
    void splitShouldPutAllExpensesInActualWhenNoPlannedExist() {
        Expense actual1 = new Expense("Food", "Groceries", 80, LocalDate.now(), "Winter 2026");
        Expense actual2 = new Expense("Transport", "TTC pass", 128, LocalDate.now(), "Winter 2026");

        Map<String, List<Expense>> result = splitPlannedAndActual(List.of(actual1, actual2));

        assertTrue(result.get("planned").isEmpty());
        assertEquals(2, result.get("actual").size());
    }
}