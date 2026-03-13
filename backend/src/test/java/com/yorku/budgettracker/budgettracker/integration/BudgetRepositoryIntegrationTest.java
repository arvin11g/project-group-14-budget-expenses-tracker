package com.yorku.budgettracker.budgettracker.integration;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.yorku.budgettracker.budgettracker.model.Budget;
import com.yorku.budgettracker.budgettracker.repository.BudgetRepository;

@SpringBootTest
public class BudgetRepositoryIntegrationTest {

    @Autowired
    private BudgetRepository budgetRepository;

    @Test
    void saveAndFindBudgetByAcademicTerm() {
        Budget budget = new Budget("Winter 2026", 2500);
        budgetRepository.save(budget);

        Optional<Budget> found = budgetRepository.findByAcademicTerm("Winter 2026");

        assertTrue(found.isPresent());
        assertEquals(2500, found.get().getAmount(), 0.001);
    }
}