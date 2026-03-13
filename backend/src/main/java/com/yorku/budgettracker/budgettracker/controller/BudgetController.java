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

    private final BudgetRepository budgetRepository;
    private final BudgetService budgetService;

    public BudgetController(BudgetRepository budgetRepository, BudgetService budgetService) {
        this.budgetRepository = budgetRepository;
        this.budgetService = budgetService;
    }

    @GetMapping("/term/{term}")
    public ResponseEntity<Budget> getBudgetByTerm(@PathVariable String term) {
        return budgetRepository.findByAcademicTerm(term)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new Budget(term, 0.0)));
    }

    @PostMapping
    public ResponseEntity<Budget> saveOrUpdateBudget(@RequestBody Budget budget) {
        Budget existingBudget = budgetRepository.findByAcademicTerm(budget.getAcademicTerm())
                .orElse(new Budget());
        
        existingBudget.setAcademicTerm(budget.getAcademicTerm());
        existingBudget.setAmount(budget.getAmount());
        
        return ResponseEntity.ok(budgetRepository.save(existingBudget));
    }
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

}