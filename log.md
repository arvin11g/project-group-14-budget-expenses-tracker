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

---
### March 3, 2026 – Iteration 2 Backend Preparation
Attendees: Iyinoluwa Blossom Olu-Alabi

**Work Completed**
- Added PostgreSQL configuration so the application can run with a real persistent database.
- Kept the H2 in-memory database so the system can still run using a stub database.
- Verified that Spring profiles can switch between H2 and PostgreSQL.
- Confirmed that the budget and expense tables are created correctly in PostgreSQL.

**Local Testing**
- Ran backend locally using the H2 profile.
- Ran backend locally using the PostgreSQL profile.
- Confirmed that the tables appear correctly in PostgreSQL.

**Notes**
- This step was mainly to make sure the system supports both stub and persistent databases before adding more features.

---

### March 4, 2026 – Service Layer Updates
Attendees: Iyinoluwa Blossom Olu-Alabi

**Work Completed**
- Updated BudgetService so it works with the database implementation instead of only the in-memory store.
- Added an endpoint to return a summary for a term including total expenses, remaining balance, and over-budget status.
- Improved validation in the Expense model.
- Added a global exception handler to return clearer validation error messages.

**Local Testing**
- Tested the summary endpoint with sample data and verified the responses were correct.

**Notes**
- These changes made the backend cleaner and improved the API responses.

---

### March 5, 2026 – Frontend Dashboard Improvements
Attendees: Iyinoluwa Blossom Olu-Alabi

**Work Completed**
- Updated the frontend dashboard to use the backend summary endpoint.
- Added an over-budget warning on the dashboard.
- Improved the dashboard layout so budget summaries are easier to read.

**Local Testing**
- Ran the frontend locally and confirmed the dashboard loads and displays data correctly.

**Notes**
- The dashboard now gives better financial feedback to the user.

---

### March 6, 2026 – Testing Implementation
Attendees: Iyinoluwa Blossom Olu-Alabi

**Work Completed**
- Added unit tests for BudgetService.
- Configured tests to run using the stub data access implementation.
- Added an integration test for the BudgetRepository to verify database operations.
- Separated unit tests and integration tests into different folders.

**Local Testing**
- Ran `./mvnw test` and confirmed that all tests passed.
- Verified repository operations using the H2 database profile.

**Notes**
- Testing now covers both the service layer and the persistence layer.

---

### March 7, 2026 – Charts and Financial Insights
Attendees: Iyinoluwa Blossom Olu-Alabi

**Work Completed**
- Implemented a charts page to visualize spending data.
- Added a category-based spending chart.
- Added a financial health score to give students a quick idea of how they are doing financially.
- Connected the charts to backend expense data.

**Local Testing**
- Added sample expenses and verified that the charts update correctly.

**Notes**
- This made the app easier to understand since users can now see their spending visually instead of only looking at numbers.

---

### March 8, 2026 – Profile and Currency Features
Attendees: Iyinoluwa Blossom Olu-Alabi

**Work Completed**
- Added a user profile page for storing user preferences.
- Implemented currency selection so users can choose their home currency.
- Added currency conversion so expenses can be displayed in another currency.
- Connected profile settings to the rest of the application.

**Local Testing**
- Tested different currencies and confirmed values update correctly.

**Notes**
- This feature is especially useful for international students.

---

### March 9, 2026 – York University Cost Estimator
Attendees: Iyinoluwa Blossom Olu-Alabi

**Work Completed**
- Implemented a York University tuition cost estimator based on program and student type.
- Created tuition data structures using York per-credit tuition values.
- Implemented a residence cost estimator using York housing rates.
- Added residence buildings, room types, dining plans, and additional residence fees.
- Added a cost breakdown that includes tuition, housing, dining, books, and additional fees.

**Local Testing**
- Verified that tuition calculations match York per-credit values.
- Tested residence calculations using different buildings and room types.

**Notes**
- This feature was added after feedback from the first presentation to give the project a stronger selling point specifically for York students.

---

### March 10, 2026 – Documentation Updates
Attendees: Iyinoluwa Blossom Olu-Alabi

**Work Completed**
- Updated the project README with database setup instructions.
- Updated the GitHub Wiki with Iteration 2 changes and new system features.
- Revised planning documentation with updated user stories and costs.
- Updated the architecture diagram and UML diagrams.

**Local Testing**
- Reviewed the application to make sure all features work properly before submission.

**Notes**
- This step was mainly for final documentation and getting everything ready for submission.


### Major Design Decisions

**Using PostgreSQL as the main database**

For this iteration I moved the system to a real persistent database using PostgreSQL. Before this the system was only using an in-memory database, which means all the data disappears when the application restarts. PostgreSQL allows the data to actually be stored permanently.

I also kept the H2 in-memory database so the system can still run in a stub/testing mode. This makes development easier because the database resets automatically and does not require setup. The system switches between H2 and PostgreSQL using Spring profiles.



**Creating a common data access interface**

To support both the stub database and the real database, I created a common `ExpenseDataAccess` interface. Then I implemented two versions of it:

- `StubExpenseDataAccess`
- `DatabaseExpenseDataAccess`

This way the service layer always talks to the same interface regardless of where the data is coming from. It also makes testing easier because the stub version can be injected during unit tests.



**Keeping the system layered**

The project follows a layered structure with controllers, services, and a data access layer. The controllers handle the API endpoints, the service layer contains the business logic, and the data layer handles the database operations.

Keeping these parts separate makes the system easier to maintain and also easier to test since the business logic can run without depending directly on the database.



**Adding the York University cost estimator**

During the first presentation the professor mentioned that there are already many budgeting apps and asked what makes this project unique.

Based on that feedback I added a York University cost estimator. This feature lets York students estimate their costs by combining tuition, residence housing, dining plans, and other required fees. The goal was to make the application more useful specifically for York students rather than just being another generic expense tracker.



**Adding currency conversion for international students**

York has a lot of international students, so I added a currency preference option in the profile page. The app still stores everything in CAD, but students can also view the values converted to their home currency. This helps them understand their spending better.

---

**Adding charts and financial insights**

Instead of only showing numbers, I added charts and a financial health score to the dashboard. This makes it easier for users to quickly see where their money is going and whether they are staying within their budget.


---
## Next Steps For ITER3
The York Cost Estimator feature is still in progress and will continue to be expanded in future iterations. Right now it supports a few faculties and programs, but the goal is to eventually include all York programs so students can get a more accurate estimate of their tuition. I also plan to add a mode where the estimated tuition and housing costs can automatically feed into the budgeting part of the app, so students can plan their finances more realistically based on their actual school expenses. Another improvement would be allowing students to compare different residence options, meal plans, and credit loads to see how their total costs change. This feature is intended to make the budgeting tool more useful specifically for York students since it connects real university costs with the budgeting system.



---
### March 15th, 2026 
Attendees: Iyinoluwa Blossom Olu-Alabi

**Design Changes?**
- For the currency conversion - Currently, the conversion rates are fixed. Should I be pulling it from a data source instead?
- Scrape the data for the residnce rates and tuition or type them in manually?
- Might have to redefine one big user story , changing the target audience to York students.









