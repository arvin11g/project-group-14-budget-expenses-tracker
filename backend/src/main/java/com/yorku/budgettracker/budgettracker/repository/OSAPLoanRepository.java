package com.yorku.budgettracker.budgettracker.repository;

import com.yorku.budgettracker.budgettracker.model.OSAPLoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OSAPLoanRepository extends JpaRepository<OSAPLoan, Long> {
    
    // Find all loans ordered by date
    List<OSAPLoan> findAllByOrderByDateReceivedDesc();
    
    // Get total grant amount
    @Query("SELECT SUM(o.grantAmount) FROM OSAPLoan o")
    Double getTotalGrants();
    
    // Get total loan amount
    @Query("SELECT SUM(o.loanAmount) FROM OSAPLoan o")
    Double getTotalLoans();
}