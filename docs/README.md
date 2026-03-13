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

The application supports two database modes.

PostgreSQL (Persistent Mode)
- Stores data permanently
- Used as the real database

H2 (Stub / In-Memory Mode)
- Used for testing
- Data resets whenever the application restarts

Both modes load the same sample data when the database is empty.

---

## Running Tests

Backend tests can be run using:

./mvnw test

The project includes:
- Unit tests for the service layer
- Integration tests for database operations

---

