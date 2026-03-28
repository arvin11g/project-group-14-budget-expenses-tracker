package com.yorku.budgettracker.budgettracker.customer;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("stub")
public class SharedExpenseCustomerTest {

    // lets the test send fake HTTP requests to the API
    @Autowired
    private MockMvc mockMvc;

    // creates a shared expense and returns the new id so the tests can keep using it
    private Long createSharedExpense(String personName, String description, int amountOwed) throws Exception {
        String sharedExpense = String.format("""
            {
              \"personName\": \"%s\",
              \"description\": \"%s\",
              \"amountOwed\": %d,
              \"date\": \"2026-03-27\",
              \"academicTerm\": \"Winter 2026\"
            }
            """, personName, description, amountOwed);

        MvcResult result = mockMvc.perform(post("/api/shared-expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sharedExpense))
                .andExpect(status().isCreated())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        return Long.valueOf(response.replaceAll(".*\\\"id\\\":(\\d+).*", "$1"));
    }

    // makes sure a shared expense can be added first and then marked as paid
    @Test
    void studentCanAddSharedExpenseAndMarkItPaid() throws Exception {
        // create a shared expense first so it can be updated in the next step
        Long id = createSharedExpense("Tolu", "Groceries", 40);

        // mark that same shared expense as paid
        mockMvc.perform(put("/api/shared-expenses/" + id + "/mark-paid"))
                .andExpect(status().isOk());

        // check that the expense now shows up as paid
        mockMvc.perform(get("/api/shared-expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id==" + id + ")].paid").value(true));
    }

    // makes sure a shared expense can be added and then seen in the list
    @Test
    void studentCanAddSharedExpenseAndSeeItInList() throws Exception {
        Long id = createSharedExpense("Maya", "Uber", 25);

        mockMvc.perform(get("/api/shared-expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id==" + id + ")].personName").value("Maya"))
                .andExpect(jsonPath("$[?(@.id==" + id + ")].description").value("Uber"));
    }

    // makes sure a new shared expense starts off as unpaid
    @Test
    void sharedExpenseStartsAsUnpaid() throws Exception {
        Long id = createSharedExpense("Jordan", "Dinner", 32);

        mockMvc.perform(get("/api/shared-expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id==" + id + ")].paid").value(false));
    }
}