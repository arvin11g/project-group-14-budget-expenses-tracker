package com.yorku.budgettracker.budgettracker.controller;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yorku.budgettracker.budgettracker.exception.ExpenseNotFoundException;
import com.yorku.budgettracker.budgettracker.model.Expense;
import com.yorku.budgettracker.budgettracker.repository.ExpenseRepository;
import com.yorku.budgettracker.budgettracker.service.BudgetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final BudgetService budgetService;

    public ExpenseController(ExpenseRepository expenseRepository, BudgetService budgetService) {
        this.expenseRepository = expenseRepository;
        this.budgetService = budgetService;
    }

    // GET /api/expenses
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(budgetService.getAllExpenses());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Expense>> getAllExpenses(Pageable pageable) {
        Page<Expense> page = expenseRepository.findAll(pageable);
        return ResponseEntity.ok(page);
    }

    // GET /api/expenses/term/{term}
    @GetMapping("/term/{term}")
    public ResponseEntity<List<Expense>> getExpensesByTerm(@PathVariable String term) {
        return ResponseEntity.ok(budgetService.getExpensesForTerm(term));
    }

    // Requirement: View all expenses for a selected term (Chronological)
    @GetMapping("/term/{term}/chronological")
    public ResponseEntity<List<Expense>> getExpensesByTermChronological(@PathVariable String term) {
        List<Expense> expenses = budgetService.getExpensesForTerm(term);
        expenses.sort((e1, e2) -> e1.getDate().compareTo(e2.getDate()));
        return ResponseEntity.ok(expenses);
    }

    // Requirement: View expenses grouped by category for a term
    @GetMapping("/term/{term}/grouped")
    public ResponseEntity<Map<String, Double>> getExpensesByTermGrouped(@PathVariable String term) {
        List<Expense> expenses = budgetService.getExpensesForTerm(term);
        Map<String, Double> groupedExpenses = expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.summingDouble(Expense::getAmount)
            ));
        return ResponseEntity.ok(groupedExpenses);
    }

    // POST /api/expenses
    @PostMapping
    public ResponseEntity<Expense> createExpense(
            @Valid @RequestBody Expense expense) {

        Expense savedExpense = budgetService.addExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
    }

    // PUT /api/expenses/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody Expense updatedExpense) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));

        expense.setCategory(updatedExpense.getCategory());
        expense.setDescription(updatedExpense.getDescription());
        expense.setAmount(updatedExpense.getAmount());
        expense.setDate(updatedExpense.getDate());
        expense.setAcademicTerm(updatedExpense.getAcademicTerm());

        return ResponseEntity.ok(expenseRepository.save(expense));
    }

    // DELETE /api/expenses/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {

        if (!expenseRepository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }

        expenseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/summary/category")
    public ResponseEntity<List<CategoryTotal>> getTotalByCategory() {
        List<Object[]> results = expenseRepository.findTotalAmountByCategory();
        List<CategoryTotal> totals = results.stream()
            .map(row -> new CategoryTotal((String)row[0], (Double)row[1]))
            .collect(Collectors.toList());
        return ResponseEntity.ok(totals);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(@PathVariable String category) {
        // Fixed: Replaced undefined getCategory() with findByCategory()
        List<Expense> expenses = expenseRepository.findByCategory(category);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(
        @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
        @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        List<Expense> expenses = expenseRepository.findByDateBetween(start, end);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/summary/total")
    public ResponseEntity<Double> getTotalExpensesByDateRange(
        @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
        @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        Double total = expenseRepository.findTotalAmountByDateRange(start, end);
        return ResponseEntity.ok(total != null ? total : 0.0);
    }

    @GetMapping("/summary/term/{term}")
    public ResponseEntity<Double> getTotalByTerm(@PathVariable String term) {
        Double total = expenseRepository.findTotalAmountByTerm(term);
        return ResponseEntity.ok(total != null ? total : 0.0);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Expense>> searchExpenses(@RequestParam String query) {
        List<Expense> expenses = expenseRepository.findByDescriptionContainingIgnoreCase(query);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/term/{term}/coffee-reality-check")
    public ResponseEntity<?> getCoffeeRealityCheck(@PathVariable String term) {
        List<Expense> expenses = expenseRepository.findByAcademicTerm(term);
        
        // Categories that are "wasteful" spending
        Set<String> wasteCategories = new HashSet<>(Arrays.asList("Food", "Entertainment", "Coffee", "Other"));
        
        double totalWaste = 0;
        int wasteCount = 0;
        double totalSpent = 0;
        
        Map<String, Double> categoryTotals = new HashMap<>();
        
        for (Expense expense : expenses) {
            totalSpent += expense.getAmount();
            String cat = expense.getCategory();
            categoryTotals.put(cat, categoryTotals.getOrDefault(cat, 0.0) + expense.getAmount());
            
            if (wasteCategories.contains(cat)) {
                totalWaste += expense.getAmount();
                wasteCount++;
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalWaste", Math.round(totalWaste * 100.0) / 100.0);
        result.put("wasteCount", wasteCount);
        result.put("totalSpent", Math.round(totalSpent * 100.0) / 100.0);
        result.put("wastePercentage", totalSpent > 0 ? (totalWaste / totalSpent) * 100 : 0);
        result.put("categoryBreakdown", categoryTotals);
        result.put("averageWastePerTransaction", wasteCount > 0 ? totalWaste / wasteCount : 0);
        
        // "What you could have bought" calculations
        result.put("equivalents", calculateEquivalents(totalWaste));
        
        return ResponseEntity.ok(result);
    }

    private Map<String, Object> calculateEquivalents(double amount) {
        Map<String, Object> equivalents = new HashMap<>();
        
        // Student-relevant items
        equivalents.put("textbooks", (int)(amount / 120));  // ~$120 per textbook
        equivalents.put("pizzaSlices", (int)(amount / 5));  // ~$5 per slice
        equivalents.put("spotifyMonths", (int)(amount / 11)); // $10.99/month
        equivalents.put("uberRides", (int)(amount / 15));   // ~$15 per ride
        equivalents.put("movieTickets", (int)(amount / 14)); // ~$14 per ticket
        equivalents.put("gymMonths", (int)(amount / 45));   // ~$45/month gym
        equivalents.put("coffees", (int)(amount / 5));      // ~$5 per coffee
        
        return equivalents;
    }

    // DTO for returning summary data
    public static class CategoryTotal {
        private String category;
        private Double totalAmount;

        public CategoryTotal(String category, Double totalAmount) {
            this.category = category;
            this.totalAmount = totalAmount;
        }

        // getters
        public String getCategory() { return category; }
        public Double getTotalAmount() { return totalAmount; }
    }
}