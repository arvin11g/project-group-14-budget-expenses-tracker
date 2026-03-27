package com.yorku.budgettracker.budgettracker.repository;

import com.yorku.budgettracker.budgettracker.model.SharedExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SharedExpenseRepository extends JpaRepository<SharedExpense, Long> {
    
    // Find all shared expenses for a term
    List<SharedExpense> findByAcademicTerm(String academicTerm);
    
    // Find unpaid expenses
    List<SharedExpense> findByIsPaidFalse();
    
    // Find unpaid expenses by term
    List<SharedExpense> findByAcademicTermAndIsPaidFalse(String academicTerm);
    
    // Find expenses by person
    List<SharedExpense> findByPersonName(String personName);
    
    // Find unpaid expenses by person
    List<SharedExpense> findByPersonNameAndIsPaidFalse(String personName);
    
    // Get total owed by person
    @Query("SELECT SUM(s.amountOwed) FROM SharedExpense s WHERE s.personName = ?1 AND s.isPaid = false")
    Double getTotalOwedByPerson(String personName);
    
    // Get total owed overall
    @Query("SELECT SUM(s.amountOwed) FROM SharedExpense s WHERE s.isPaid = false")
    Double getTotalOwed();
}