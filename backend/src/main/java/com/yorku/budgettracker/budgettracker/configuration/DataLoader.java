package com.yorku.budgettracker.budgettracker.configuration;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.yorku.budgettracker.budgettracker.model.Budget;
import com.yorku.budgettracker.budgettracker.model.Expense;
import com.yorku.budgettracker.budgettracker.repository.BudgetRepository;
import com.yorku.budgettracker.budgettracker.repository.ExpenseRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        return args -> {
            if (budgetRepository.count() == 0) {
                budgetRepository.save(new Budget("Winter 2026", 2000));
                budgetRepository.save(new Budget("Summer 2026", 1500));
            }

            if (expenseRepository.count() == 0) {
                expenseRepository.save(new Expense(
                        "Rent",
                        "Residence payment",
                        1200,
                        LocalDate.of(2026, 1, 10),
                        "Winter 2026"
                ));

                expenseRepository.save(new Expense(
                        "Food",
                        "Groceries",
                        150,
                        LocalDate.of(2026, 1, 14),
                        "Winter 2026"
                ));

                expenseRepository.save(new Expense(
                        "Textbooks",
                        "Engineering textbook",
                        220,
                        LocalDate.of(2026, 1, 18),
                        "Winter 2026"
                ));

                expenseRepository.save(new Expense(
                        "Transport",
                        "TTC pass",
                        128,
                        LocalDate.of(2026, 1, 8),
                        "Winter 2026"
                ));
            }
        };
    }
}