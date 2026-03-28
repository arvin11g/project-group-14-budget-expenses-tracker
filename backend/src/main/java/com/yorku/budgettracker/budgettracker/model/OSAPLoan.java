package com.yorku.budgettracker.budgettracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class OSAPLoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Term is required")
    private String term; // e.g., "Winter 2026"
    
    @PositiveOrZero(message = "Grant amount must be positive or zero")
    private double grantAmount; // Free money (doesn't need to be repaid)
    
    @PositiveOrZero(message = "Loan amount must be positive or zero")
    private double loanAmount; // Money that needs to be repaid
    
    @NotNull(message = "Date received is required")
    private LocalDate dateReceived;
    
    private String notes; // Optional notes
    
    // Constructors
    public OSAPLoan() {}
    
    public OSAPLoan(String term, double grantAmount, double loanAmount, LocalDate dateReceived) {
        this.term = term;
        this.grantAmount = grantAmount;
        this.loanAmount = loanAmount;
        this.dateReceived = dateReceived;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTerm() {
        return term;
    }
    
    public void setTerm(String term) {
        this.term = term;
    }
    
    public double getGrantAmount() {
        return grantAmount;
    }
    
    public void setGrantAmount(double grantAmount) {
        this.grantAmount = grantAmount;
    }
    
    public double getLoanAmount() {
        return loanAmount;
    }
    
    public void setLoanAmount(double loanAmount) {
        this.loanAmount = loanAmount;
    }
    
    public LocalDate getDateReceived() {
        return dateReceived;
    }
    
    public void setDateReceived(LocalDate dateReceived) {
        this.dateReceived = dateReceived;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}