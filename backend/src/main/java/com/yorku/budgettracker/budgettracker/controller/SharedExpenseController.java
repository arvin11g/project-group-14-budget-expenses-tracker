package com.yorku.budgettracker.budgettracker.controller;

import com.yorku.budgettracker.budgettracker.model.SharedExpense;
import com.yorku.budgettracker.budgettracker.repository.SharedExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shared-expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class SharedExpenseController {

    private final SharedExpenseRepository sharedExpenseRepository;

    public SharedExpenseController(SharedExpenseRepository sharedExpenseRepository) {
        this.sharedExpenseRepository = sharedExpenseRepository;
    }

    // GET all shared expenses
    @GetMapping
    public ResponseEntity<?> getAllSharedExpenses() {
        return ResponseEntity.ok(sharedExpenseRepository.findAll());
    }

    // GET shared expenses by term
    @GetMapping("/term/{term}")
    public ResponseEntity<?> getSharedExpensesByTerm(@PathVariable String term) {
        return ResponseEntity.ok(sharedExpenseRepository.findByAcademicTerm(term));
    }

    // GET unpaid shared expenses
    @GetMapping("/unpaid")
    public ResponseEntity<?> getUnpaidSharedExpenses() {
        return ResponseEntity.ok(sharedExpenseRepository.findByIsPaidFalse());
    }

    // GET unpaid expenses by term
    @GetMapping("/term/{term}/unpaid")
    public ResponseEntity<?> getUnpaidByTerm(@PathVariable String term) {
        return ResponseEntity.ok(sharedExpenseRepository.findByAcademicTermAndIsPaidFalse(term));
    }

    // POST create shared expense
    @PostMapping
    public ResponseEntity<?> createSharedExpense(@Valid @RequestBody SharedExpense sharedExpense) {
        SharedExpense saved = sharedExpenseRepository.save(sharedExpense);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT mark as paid
    @PutMapping("/{id}/mark-paid")
    public ResponseEntity<?> markAsPaid(@PathVariable Long id) {
        return sharedExpenseRepository.findById(id)
                .map(expense -> {
                    expense.setPaid(true);
                    expense.setPaidDate(LocalDate.now());
                    return ResponseEntity.ok(sharedExpenseRepository.save(expense));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT send reminder
    @PutMapping("/{id}/send-reminder")
    public ResponseEntity<?> sendReminder(@PathVariable Long id) {
        return sharedExpenseRepository.findById(id)
                .map(expense -> {
                    expense.setRemindersSent(expense.getRemindersSent() + 1);
                    expense.setLastReminderDate(LocalDate.now());
                    SharedExpense updated = sharedExpenseRepository.save(expense);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("expense", updated);
                    response.put("reminderMessage", generateReminderMessage(expense));
                    
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE shared expense
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSharedExpense(@PathVariable Long id) {
        if (!sharedExpenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sharedExpenseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // GET summary by person
    @GetMapping("/summary")
    public ResponseEntity<?> getSummaryByPerson() {
        List<SharedExpense> unpaid = sharedExpenseRepository.findByIsPaidFalse();
        
        Map<String, PersonSummary> summaries = new HashMap<>();
        
        for (SharedExpense expense : unpaid) {
            String person = expense.getPersonName();
            summaries.putIfAbsent(person, new PersonSummary(person));
            
            PersonSummary summary = summaries.get(person);
            summary.totalOwed += expense.getAmountOwed();
            summary.expenseCount++;
            summary.expenses.add(expense);
        }
        
        return ResponseEntity.ok(summaries.values());
    }

    // Generate reminder message based on how many reminders sent
    private String generateReminderMessage(SharedExpense expense) {
        int reminderCount = expense.getRemindersSent();
        String person = expense.getPersonName();
        double amount = expense.getAmountOwed();
        String description = expense.getDescription();
        
        if (reminderCount == 1) {
            return String.format("Hey %s! Just a friendly reminder about the $%.2f for %s 😊", 
                person, amount, description);
        } else if (reminderCount == 2) {
            return String.format("Hi %s, following up on the $%.2f for %s. Let me know when you can pay!", 
                person, amount, description);
        } else if (reminderCount >= 3) {
            return String.format("%s - this is the %d reminder about the $%.2f for %s. Please pay ASAP.", 
                person, reminderCount, amount, description);
        }
        
        return String.format("Reminder: %s owes $%.2f for %s", person, amount, description);
    }

    // DTO for person summary
    public static class PersonSummary {
        public String personName;
        public double totalOwed = 0;
        public int expenseCount = 0;
        public List<SharedExpense> expenses = new ArrayList<>();
        
        public PersonSummary(String personName) {
            this.personName = personName;
        }
    }
}