# Budget & Expenses Tracker – Group 14

## Overview

This project is a student budget tracker designed to help university students manage their finances during the academic term.

Users can:
- Track expenses
- Set budgets for each academic term
- View charts of their spending
- Monitor their financial health
- Convert spending into their home currency (useful for international students)

Technologies used:
- Backend: Spring Boot
- Frontend: React
- Database: PostgreSQL (persistent) and H2 (in-memory stub)

---

## Project Structure

project-group-14-budget-expenses-tracker

backend/
Spring Boot REST API  
Business logic and database access  

frontend/
React application  
Dashboard, Expenses, Budgets, Charts, Profile  

---

## Running the Application

### 1. Start the Backend

Navigate to the backend folder:

cd backend

Run with H2 (in-memory / stub database):

./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

Run with PostgreSQL (persistent database):

./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres

The backend runs on:

http://localhost:8080

---

### 2. Start the Frontend

Open another terminal and run:

cd frontend  
npm install  
npm start  

The frontend runs on:

http://localhost:3000

---

## Default Sample Data

When the application starts and the database is empty, the system automatically loads sample data so the application can be tested easily.

Example data:

Budgets
- Winter 2026 – 2000
- Summer 2026 – 1500

Expenses
- Residence payment – 1200
- Groceries – 150
- Engineering textbook – 220
- TTC pass – 128

This allows the system to display information without requiring manual data entry.

---

## Features

Dashboard
- Shows total budget, total spent, and remaining balance
- Displays recent transactions
- Includes a financial health score

Expenses
- Add new expenses
- Delete expenses
- Categorize spending
- Track expenses by academic term

Budgets
- Set budgets for each academic term
- Track remaining balance

Charts
- Pie chart showing spending by category
- Bar chart comparing budget vs spending

Profile
- Student information (name, program, school, term)
- Home currency selection
- Currency conversion for international students

---

## Database Design

The application supports two database modes: a persistent PostgreSQL database and an in-memory H2 database.

### PostgreSQL (Persistent Mode)

PostgreSQL is used as the main database for the application. In this mode, data is stored permanently and remains available even after the application restarts.

Run the backend using:

```
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

### H2 (In-Memory Mode)

H2 is used for testing and development. It runs completely in memory, so any data stored in it will reset whenever the application restarts.

Run the backend using:

```
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

This mode is mainly useful for development and integration testing.

### Switching Between Databases

The application switches between databases using **Spring profiles**. This makes it easy to run the same application with either the persistent database or the in-memory database without changing the code.

### Default Data

When the application starts and the database is empty, some sample data is automatically loaded. This allows the system to be tested immediately without having to manually add data first.

To support both the real database and the stub database, the application uses a common interface:

ExpenseDataAccess

Two implementations are provided:

- DbExpenseDataAccess – uses PostgreSQL through Spring Data JPA
- StubExpenseDataAccess – uses the original InMemoryExpenseStore

BudgetService depends only on the interface, allowing the database implementation to be switched using Spring profiles.

---

## Running Tests

Backend tests can be run using:

./mvnw test

The project includes:
- Unit tests for the service layer
- Integration tests for database operations

---

