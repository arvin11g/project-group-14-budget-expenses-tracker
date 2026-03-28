package com.yorku.budgettracker.budgettracker.integration;

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
public class BudgetSummaryIntegrationTest {

    // lets the test call the real endpoints
    @Autowired
    private MockMvc mockMvc;

    // makes sure the term summary uses both the saved budget and the saved expenses
    @Test
    void summaryShouldReturnCorrectBudgetAndExpenseTotals() throws Exception {
        String budgetRequest = """
            {
              "amount": 2000,
              "academicTerm": "Fall 2099"
            }
            """;

        String expense1 = """
            {
              "category": "Food",
              "description": "Groceries",
              "amount": 150,
              "date": "2026-03-27",
              "academicTerm": "Fall 2099"
            }
            """;

        String expense2 = """
            {
              "category": "Transport",
              "description": "TTC pass",
              "amount": 128,
              "date": "2026-03-27",
              "academicTerm": "Fall 2099"
            }
            """;

        // save a budget first
        mockMvc.perform(post("/api/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(budgetRequest))
                .andExpect(status().isOk());

        // add 2 expenses to the same term
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(expense1))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(expense2))
                .andExpect(status().isCreated());

        // now check that the summary reflects both the budget and the expenses
        mockMvc.perform(get("/api/budgets/term/Fall 2099/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.budget").value(2000))
                .andExpect(jsonPath("$.totalExpenses").value(278))
                .andExpect(jsonPath("$.remaining").value(1722));
    }

    // makes sure a term with no saved budget still returns a summary without crashing
    @Test
    void summaryShouldHandleMissingBudget() throws Exception {
        mockMvc.perform(get("/api/budgets/term/Fall 2027/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.budget").value(0));
    }
}