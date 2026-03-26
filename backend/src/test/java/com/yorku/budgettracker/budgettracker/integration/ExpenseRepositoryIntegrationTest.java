package com.yorku.budgettracker.budgettracker.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.yorku.budgettracker.budgettracker.model.Expense;
import com.yorku.budgettracker.budgettracker.repository.ExpenseRepository;

@SpringBootTest
@ActiveProfiles("h2")
public class ExpenseRepositoryIntegrationTest {

    @Autowired
    private ExpenseRepository expenseRepository;

    @BeforeEach
    void setUp() {
        expenseRepository.deleteAll();
    }

    @Test
    void saveAndFindExpenseByAcademicTerm() {
        Expense expense = new Expense(
                "Food",
                "Groceries",
                120,
                LocalDate.of(2026, 1, 15),
                "Winter 2026"
        );

        expenseRepository.save(expense);

        List<Expense> found = expenseRepository.findByAcademicTerm("Winter 2026");

        assertEquals(1, found.size());
        assertEquals("Groceries", found.get(0).getDescription());
        assertEquals(120, found.get(0).getAmount(), 0.001);
    }
}