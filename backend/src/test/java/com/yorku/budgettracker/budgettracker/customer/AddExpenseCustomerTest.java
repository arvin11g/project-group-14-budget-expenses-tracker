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
public class AddExpenseCustomerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void studentCanAddExpenseAndViewItInSelectedTerm() throws Exception {
        String newExpense = """
            {
              "category": "Food",
              "description": "Lunch",
              "amount": 25,
              "date": "2026-03-27",
              "academicTerm": "Winter 2026"
            }
            """;

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newExpense))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/expenses/term/Winter 2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.description=='Lunch')]").exists());
    }
}