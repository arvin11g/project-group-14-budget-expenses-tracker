package com.yorku.budgettracker.budgettracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yorku.budgettracker.budgettracker.model.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByAcademicTerm(String academicTerm);
}