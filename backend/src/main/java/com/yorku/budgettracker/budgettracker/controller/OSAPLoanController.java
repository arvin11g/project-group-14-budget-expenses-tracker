package com.yorku.budgettracker.budgettracker.controller;

import com.yorku.budgettracker.budgettracker.model.OSAPLoan;
import com.yorku.budgettracker.budgettracker.repository.OSAPLoanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.*;

@RestController
@RequestMapping("/api/osap-loans")
@CrossOrigin(origins = "http://localhost:3000")
public class OSAPLoanController {

    private final OSAPLoanRepository osapLoanRepository;

    public OSAPLoanController(OSAPLoanRepository osapLoanRepository) {
        this.osapLoanRepository = osapLoanRepository;
    }

    // GET all OSAP loans
    @GetMapping
    public ResponseEntity<?> getAllLoans() {
        return ResponseEntity.ok(osapLoanRepository.findAllByOrderByDateReceivedDesc());
    }

    // POST create OSAP loan
    @PostMapping
    public ResponseEntity<?> createLoan(@Valid @RequestBody OSAPLoan loan) {
        OSAPLoan saved = osapLoanRepository.save(loan);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update OSAP loan
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLoan(@PathVariable Long id, @Valid @RequestBody OSAPLoan updatedLoan) {
        return osapLoanRepository.findById(id)
                .map(loan -> {
                    loan.setTerm(updatedLoan.getTerm());
                    loan.setGrantAmount(updatedLoan.getGrantAmount());
                    loan.setLoanAmount(updatedLoan.getLoanAmount());
                    loan.setDateReceived(updatedLoan.getDateReceived());
                    loan.setNotes(updatedLoan.getNotes());
                    return ResponseEntity.ok(osapLoanRepository.save(loan));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE OSAP loan
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLoan(@PathVariable Long id) {
        if (!osapLoanRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        osapLoanRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // GET summary
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        Double totalGrants = osapLoanRepository.getTotalGrants();
        Double totalLoans = osapLoanRepository.getTotalLoans();
        
        if (totalGrants == null) totalGrants = 0.0;
        if (totalLoans == null) totalLoans = 0.0;
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalGrants", Math.round(totalGrants * 100.0) / 100.0);
        summary.put("totalLoans", Math.round(totalLoans * 100.0) / 100.0);
        summary.put("totalReceived", Math.round((totalGrants + totalLoans) * 100.0) / 100.0);
        summary.put("netDebt", Math.round(totalLoans * 100.0) / 100.0);
        
        return ResponseEntity.ok(summary);
    }

    // POST calculate repayment
    @PostMapping("/calculate-repayment")
    public ResponseEntity<?> calculateRepayment(@RequestBody Map<String, Object> params) {
        double principal = ((Number) params.get("principal")).doubleValue();
        double annualInterestRate = ((Number) params.get("interestRate")).doubleValue() / 100; // Convert to decimal
        double monthlyIncome = ((Number) params.get("monthlyIncome")).doubleValue();
        double paymentPercentage = ((Number) params.get("paymentPercentage")).doubleValue() / 100; // Convert to decimal
        
        double monthlyPayment = monthlyIncome * paymentPercentage;
        double monthlyRate = annualInterestRate / 12;
        
        // Calculate how many months to pay off
        int months = 0;
        double remainingBalance = principal;
        double totalInterest = 0;
        
        List<Map<String, Object>> paymentSchedule = new ArrayList<>();
        
        while (remainingBalance > 0 && months < 600) { // Cap at 50 years
            months++;
            
            double interestThisMonth = remainingBalance * monthlyRate;
            double principalThisMonth = monthlyPayment - interestThisMonth;
            
            if (principalThisMonth <= 0) {
                // Payment doesn't cover interest - debt grows forever
                return ResponseEntity.ok(Map.of(
                    "error", true,
                    "message", "Your payment doesn't cover the monthly interest! Your debt will grow forever.",
                    "minimumPayment", Math.round(remainingBalance * monthlyRate * 100.0) / 100.0
                ));
            }
            
            if (principalThisMonth > remainingBalance) {
                principalThisMonth = remainingBalance;
                monthlyPayment = principalThisMonth + interestThisMonth;
            }
            
            remainingBalance -= principalThisMonth;
            totalInterest += interestThisMonth;
            
            // Store every 12 months for yearly breakdown
            if (months % 12 == 0) {
                Map<String, Object> yearData = new HashMap<>();
                yearData.put("year", months / 12);
                yearData.put("remainingBalance", Math.round(remainingBalance * 100.0) / 100.0);
                yearData.put("totalPaid", Math.round((monthlyPayment * months) * 100.0) / 100.0);
                yearData.put("totalInterest", Math.round(totalInterest * 100.0) / 100.0);
                paymentSchedule.add(yearData);
            }
        }
        
        double totalPaid = (monthlyPayment * (months - 1)) + (principal + totalInterest - monthlyPayment * (months - 1));
        
        Map<String, Object> result = new HashMap<>();
        result.put("error", false);
        result.put("monthlyPayment", Math.round(monthlyPayment * 100.0) / 100.0);
        result.put("totalMonths", months);
        result.put("totalYears", Math.round((months / 12.0) * 10.0) / 10.0);
        result.put("totalPaid", Math.round(totalPaid * 100.0) / 100.0);
        result.put("totalInterest", Math.round(totalInterest * 100.0) / 100.0);
        result.put("paymentSchedule", paymentSchedule);
        
        return ResponseEntity.ok(result);
    }
}