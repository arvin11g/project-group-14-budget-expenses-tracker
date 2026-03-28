package com.yorku.budgettracker.budgettracker.customer;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("stub")
public class BudgetSummaryCustomerTest{

    // lets the test send requests through the real API
    @Autowired
    private MockMvc mockMvc;

    // saves a budget for the term first
    private void createBudget(double amount, String term) throws Exception {
        String budgetRequest = String.format("""
            {
              "amount": %.2f,
              "academicTerm": "%s"
            }
            """, amount, term);

        mockMvc.perform(post("/api/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(budgetRequest))
                .andExpect(status().isOk());
    }

    // adds an expense into the selected term
    private void createExpense(String category, String description, double amount, String term) throws Exception {
        String expenseRequest = String.format("""
            {
              "category": "%s",
              "description": "%s",
              "amount": %.2f,
              "date": "2026-03-27",
              "academicTerm": "%s"
            }
            """, category, description, amount, term);

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(expenseRequest))
                .andExpect(status().isCreated());
    }

    // makes sure the summary updates after a budget and expense are added
    @Test
    void studentCanSeeUpdatedBudgetSummaryAfterAddingExpenses() throws Exception {
        createBudget(2000, "Winter 2101");
        createExpense("Food", "Groceries", 150, "Winter 2101");
        createExpense("Transport", "TTC pass", 128, "Winter 2101");

        mockMvc.perform(get("/api/budgets/term/Winter 2101/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.budget").value(2000))
                .andExpect(jsonPath("$.totalExpenses").value(278))
                .andExpect(jsonPath("$.remaining").value(1722));
    }

    // makes sure the summary still works even when no budget has been set yet
    @Test
    void summaryStillWorksWhenNoBudgetExists() throws Exception {
        createExpense("Food", "Lunch", 25, "Fall 2027");

        mockMvc.perform(get("/api/budgets/term/Fall 2027/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.budget").value(0))
                .andExpect(jsonPath("$.totalExpenses").value(25));
    }
}