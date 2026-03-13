package com.yorku.budgettracker.budgettracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String academicTerm;
    private double amount;

    public Budget() {}

    public Budget(String academicTerm, double amount) {
        this.academicTerm = academicTerm;
        this.amount = amount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAcademicTerm() { return academicTerm; }
    public void setAcademicTerm(String academicTerm) { this.academicTerm = academicTerm; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}