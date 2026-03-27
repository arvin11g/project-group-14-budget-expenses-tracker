package com.yorku.budgettracker.budgettracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
public class SharedExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Person name is required")
    private String personName; // Who owes you
    
    @Positive(message = "Amount must be positive")
    private double amountOwed;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotBlank(message = "Academic term is required")
    private String academicTerm;
    
    private boolean isPaid = false;
    
    private LocalDate paidDate;
    
    private int remindersSent = 0; // Track how many reminders sent
    
    private LocalDate lastReminderDate;
    
    // Constructors
    public SharedExpense() {}
    
    public SharedExpense(String description, String personName, double amountOwed, LocalDate date, String academicTerm) {
        this.description = description;
        this.personName = personName;
        this.amountOwed = amountOwed;
        this.date = date;
        this.academicTerm = academicTerm;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPersonName() {
        return personName;
    }
    
    public void setPersonName(String personName) {
        this.personName = personName;
    }
    
    public double getAmountOwed() {
        return amountOwed;
    }
    
    public void setAmountOwed(double amountOwed) {
        this.amountOwed = amountOwed;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public String getAcademicTerm() {
        return academicTerm;
    }
    
    public void setAcademicTerm(String academicTerm) {
        this.academicTerm = academicTerm;
    }
    
    public boolean isPaid() {
        return isPaid;
    }
    
    public void setPaid(boolean paid) {
        isPaid = paid;
    }
    
    public LocalDate getPaidDate() {
        return paidDate;
    }
    
    public void setPaidDate(LocalDate paidDate) {
        this.paidDate = paidDate;
    }
    
    public int getRemindersSent() {
        return remindersSent;
    }
    
    public void setRemindersSent(int remindersSent) {
        this.remindersSent = remindersSent;
    }
    
    public LocalDate getLastReminderDate() {
        return lastReminderDate;
    }
    
    public void setLastReminderDate(LocalDate lastReminderDate) {
        this.lastReminderDate = lastReminderDate;
    }
}