package com.yorku.budgettracker.budgettracker.model;

// base class to share common fields like id across different models
public abstract class BaseEntity {
    protected Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}