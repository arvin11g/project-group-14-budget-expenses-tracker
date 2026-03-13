# Team 14 – Iteration 0 & Iteration 1 Log

---

## Jan 16, 2026 – Initial Brainstorming  
**Attendees:** Dexter Sargent, Iyinoluwa Blossom Olu-Alabi, Ayesh Ahmed, Arvin Gholipoor  

We met to figure out what kind of project we wanted to build. We threw around a few ideas like a task manager, event planner, and a general budgeting app. After talking through them, we realized most budgeting apps focus on monthly tracking, which doesn’t really match how students actually manage money during the school year.

We decided to build a Student Budget & Expenses Tracker that works around academic terms instead of months. That became our main idea and selling point.

---

## Jan 24, 2026 – Defining Scope & Users  
**Attendees:** Dexter Sargent, Iyinoluwa Blossom Olu-Alabi, Ayesh Ahmed, Arvin Gholipoor  

We discussed who this system would actually be for. We identified:
- Undergraduate students
- Graduate students
- International students
- Financial advisors working with students

We talked about how student finances are different from normal budgeting. Students usually receive money at the start of a term (loans, scholarships, family support), and then spend it across the semester. There are also big costs like tuition and textbooks that don’t happen monthly.

From this discussion, we confirmed that our system should:
- Track expenses by academic term
- Separate school-related expenses from everyday spending
- Allow summaries that can be shared with advisors or family if needed

---

## Late January – Vision & Big User Stories (Discord Discussions)  
**Attendees:** Dexter Sargent, Iyinoluwa Blossom Olu-Alabi, Ayesh Ahmed, Arvin Gholipoor  

We finalized the vision statement and defined four main feature categories for the full project:

1. Term-Based Expense Tracking  
2. Term Budgeting & Insights  
3. Student-Focused Planning & Goals  
4. Multi-Term Review & Reporting  

For Iteration 1, we decided to focus only on the first big story (Term-Based Expense Tracking). We broke it into smaller user stories like adding expenses, editing them, deleting them, and viewing them by term or category.

We also agreed to follow a simple 3-layer structure (controller, service, repository) to keep the code organized.

---

## Feb 9, 2026 – Backend & Logic Setup  
**Attendees:** Dexter Sargent, Iyinoluwa Blossom Olu-Alabi, Ayesh Ahmed, Arvin Gholipoor  

We started implementing the core functionality for Iteration 1.

What we completed:
- Created a `Term` class.
- Set up an in-memory repository using an ArrayList to act as a stub database.
- Added some sample expense data.
- Implemented a `BudgetService` to handle calculations like total spending and remaining balance.
- Added unit tests for the service logic.

We made sure that calculations were handled in the service layer instead of the controller.

We ran `./mvnw test` and confirmed that everything passed.

---

## Feb 11, 2026 – Basic GUI & Final Checks  
**Attendees:** Dexter Sargent, Iyinoluwa Blossom Olu-Alabi, Ayesh Ahmed, Arvin Gholipoor  

We created a basic GUI page and connected it using a HomeController.

To verify everything worked:
- Ran `./mvnw test` 
- Ran `./mvnw spring-boot:run`
- Opened `http://localhost:8080/` and confirmed the GUI loads without errors.

---

## Plan Adjustments (ITR0 → ITR1)

Originally, we planned to include some multi-term comparisons earlier. After reviewing our timeline, we decided to focus only on core expense tracking for ITR1 and move advanced reporting features to later iterations.

This helped us make sure Iteration 1 was stable and fully functional instead of rushed.

---

## Current Status Before ITR1 Deadline

- All Iteration 1 user stories implemented.
- Stub database working.
- Unit tests passing.
- Basic GUI working.
- Jira updated.
- Repository tagged as `ITR1`.
