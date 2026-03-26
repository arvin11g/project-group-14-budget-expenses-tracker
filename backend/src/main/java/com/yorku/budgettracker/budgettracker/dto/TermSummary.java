package com.yorku.budgettracker.budgettracker.dto;

public class TermSummary {

    private String term;
    private double budget;
    private double totalExpenses;
    private double remaining;
    private boolean overBudget;

    public TermSummary(String term, double budget, double totalExpenses, double remaining, boolean overBudget) {
        this.term = term;
        this.budget = budget;
        this.totalExpenses = totalExpenses;
        this.remaining = remaining;
        this.overBudget = overBudget;
    }

    public String getTerm() { return term; }
    public double getBudget() { return budget; }
    public double getTotalExpenses() { return totalExpenses; }
    public double getRemaining() { return remaining; }
    public boolean isOverBudget() { return overBudget; }
}