import { useState, useEffect } from "react";
import expenseAPI from "../api/ExpensesAPI";


function Expenses() {
  // State to store list of expenses --> used AI to help generate const
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the form inputs
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
    academicTerm: "Winter 2026" // Default term
  });

  // Fetch expenses from backend when component loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAllExpenses();
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses. Make sure your backend is running on http://localhost:8080");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.description || !formData.amount || !formData.category || !formData.date || !formData.academicTerm) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      // Create expense object matching your backend model
      const newExpense = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date, // Backend expects LocalDate in YYYY-MM-DD format
        academicTerm: formData.academicTerm
      };

      // Send to backend
      await expenseAPI.createExpense(newExpense);

      // Refresh the list
      await fetchExpenses();

      // Reset form
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: "",
        academicTerm: "Winter 2026"
      });

      alert("Expense added successfully!");
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Failed to add expense. Please check the console for details.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expenseAPI.deleteExpense(id);
        await fetchExpenses(); // Refresh list
        alert("Expense deleted successfully!");
      } catch (err) {
        console.error("Error deleting expense:", err);
        alert("Failed to delete expense.");
      }
    }
  };

  // Calculate total
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading expenses...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>Expenses</h1>

      {error && (
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#fee2e2", 
          color: "#991b1b", 
          borderRadius: "8px", 
          marginBottom: "20px" 
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "30px", marginTop: "30px" }}>
        {/* Left Side - Add Expense Form */}
        <div className="card" style={{ flex: 1 }}>
          <h2 style={{ marginBottom: "20px" }}>Add New Expense</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Textbook for EECS3311, Groceries"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px"
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px"
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px"
                }}
              >
                <option value="">Select a category</option>
                <option value="Tuition">Tuition</option>
                <option value="Textbooks">Textbooks</option>
                <option value="Rent">Rent</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Academic Term
              </label>
              <select
                name="academicTerm"
                value={formData.academicTerm}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px"
                }}
              >
                <option value="Winter 2026">Winter 2026</option>
                <option value="Summer 2026">Summer 2026</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Winter 2027">Winter 2027</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* Right Side - Expenses List */}
        <div className="card" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>All Expenses</h2>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#2563eb" }}>
              Total: ${totalExpenses.toFixed(2)}
            </div>
          </div>

          {expenses.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>
              No expenses yet. Add your first expense!
            </p>
          ) : (
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {expense.description}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      {expense.category} • {expense.academicTerm} • {expense.date}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      ${expense.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Expenses;