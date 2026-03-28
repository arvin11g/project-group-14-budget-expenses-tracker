package com.yorku.budgettracker.budgettracker.controller;
import com.yorku.budgettracker.budgettracker.service.BudgetService;
import com.yorku.budgettracker.budgettracker.dto.TermSummary;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yorku.budgettracker.budgettracker.model.Budget;
import com.yorku.budgettracker.budgettracker.repository.BudgetRepository;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {

    // used for saving and getting budget data from the database
    private final BudgetRepository budgetRepository;
    // handles the budget-related calculations and summary logic
    private final BudgetService budgetService;

    // brings in the repository and service so this controller can use them
    public BudgetController(BudgetRepository budgetRepository, BudgetService budgetService) {
        this.budgetRepository = budgetRepository;
        this.budgetService = budgetService;
    }

    // gets the saved budget for a term, and if there is none yet it returns a default budget of 0
    @GetMapping("/term/{term}")
    public ResponseEntity<Budget> getBudgetByTerm(@PathVariable String term) {
        return budgetRepository.findByAcademicTerm(term)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new Budget(term, 0.0)));
    }

    // saves a new budget or updates the existing one for the selected term
    @PostMapping
    public ResponseEntity<Budget> saveOrUpdateBudget(@RequestBody Budget budget) {
        Budget existingBudget = budgetRepository.findByAcademicTerm(budget.getAcademicTerm())
                .orElse(new Budget());

        existingBudget.setAcademicTerm(budget.getAcademicTerm());
        existingBudget.setAmount(budget.getAmount());

        return ResponseEntity.ok(budgetRepository.save(existingBudget));
    }
    // builds the full term summary using the saved budget and the expenses for that term
    @GetMapping("/term/{term}/summary")
    public ResponseEntity<?> getTermSummary(@PathVariable String term) {

        Budget budget = budgetRepository.findByAcademicTerm(term)
                .orElse(new Budget(term, 0.0));

        double totalExpenses = budgetService.getTotalExpensesForTerm(term);
        double remaining = budgetService.getRemainingBalance(term, budget.getAmount());
        boolean overBudget = budgetService.isOverBudget(term, budget.getAmount());

        return ResponseEntity.ok(
                new TermSummary(
                        term,
                        budget.getAmount(),
                        totalExpenses,
                        remaining,
                        overBudget
                )
        );
    }
    // returns all budgets that are currently saved
    @GetMapping
    public ResponseEntity<?> getAllBudgets() {
        return ResponseEntity.ok(budgetRepository.findAll());
    }

}