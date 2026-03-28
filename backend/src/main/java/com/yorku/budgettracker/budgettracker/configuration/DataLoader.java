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
                        "Utiities",
                        "Phone bill",
                        80,
                       LocalDate.now(),
                        "Winter 2026"
                ));

                expenseRepository.save(new Expense(
                        "Food",
                        "Groceries",
                        150,
                        LocalDate.now(),
                        "Winter 2026"
                ));

                expenseRepository.save(new Expense(
                        "Education",
                        "Laptop payment",
                        500,
                        LocalDate.now(),
                        "Winter 2026"
                ));

                expenseRepository.save(new Expense(
                        "Transport",
                        "TTC pass",
                        128,
                        LocalDate.now(),
                        "Winter 2026"
                ));
            }
        };
    }
}