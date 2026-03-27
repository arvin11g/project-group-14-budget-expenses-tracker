package com.yorku.budgettracker.budgettracker.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
public class Expense extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@NotBlank(message = "category is required")
	private String category; // e.g.: tuition, textbooks, rent
	
	private String description;

	private String type;
	@Positive(message = "Amount must be Positive")
	private double amount;
	
	@NotNull(message = "Date is required")
	private LocalDate date;
	
	@NotBlank(message = "Academic term is required")
    private String academicTerm; // e.g., Fall 2026
    
    // Constructors, getters, setters
    public Expense() {}
    
    public Expense(String category, String description, double amount, LocalDate date, String academicTerm) {
    	this.category = category;
    	this.description = description;
    	this.amount = amount;
    	this.date = date;
    	this.academicTerm = academicTerm;
    }
    
    public void setAmount(double amount1) {
    	this.amount = amount1;
    }
    
    public void setDate(LocalDate date1) {
    	this.date = date1;
    }
    
    public void setDescription(String description1) {
    	this.description = description1;
    }
    
    public void setCategory(String category1) {
    	this.category = category1;
    }
    
    public void setAcademicTerm(String academicTerm1) {
    	this.academicTerm = academicTerm1;
    }
    
    public double getAmount() {
    	return this.amount;
    }
    
    public LocalDate getDate() {
    	return this.date;
    }
    
    public String getDescription() {
    	return this.description;
    }
    
    public String getCategory() {
    	return this.category;
    }
    
    public String getAcademicTerm() {
    	return this.academicTerm;
    }

	public void setId(Long id2) {
		this.id = id2;
		
	}
	
	public Long getId() {
	    return id;
	}
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
    
}
