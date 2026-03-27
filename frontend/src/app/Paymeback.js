import { useState, useEffect } from "react";
import axios from "axios";

function PayMeBack({ term }) {
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    personName: "",
    amountOwed: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSharedExpenses();
  }, [term]);

  const fetchSharedExpenses = async () => {
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/shared-expenses/term/${term}/unpaid`),
        axios.get(`http://localhost:8080/api/shared-expenses/summary`)
      ]);
      
      setSharedExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error("Error fetching shared expenses:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:8080/api/shared-expenses", {
        ...formData,
        academicTerm: term,
        amountOwed: parseFloat(formData.amountOwed)
      });
      
      setFormData({
        description: "",
        personName: "",
        amountOwed: "",
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
      fetchSharedExpenses();
    } catch (err) {
      console.error("Error creating shared expense:", err);
      alert("Failed to add shared expense");
    }
  };

  const markAsPaid = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/shared-expenses/${id}/mark-paid`);
      fetchSharedExpenses();
    } catch (err) {
      console.error("Error marking as paid:", err);
    }
  };

  const sendReminder = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/shared-expenses/${id}/send-reminder`);
      alert(response.data.reminderMessage);
      fetchSharedExpenses();
    } catch (err) {
      console.error("Error sending reminder:", err);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/shared-expenses/${id}`);
      fetchSharedExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const totalOwed = sharedExpenses.reduce((sum, exp) => sum + exp.amountOwed, 0);

  if (sharedExpenses.length === 0 && !showAddForm) return null;

  return (
    <div className="card" style={{ marginTop: "30px", backgroundColor: "#f0fdf4", border: "2px solid #10b981" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#065f46" }}>💰 Pay Me Back Tracker</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          {showAddForm ? "Cancel" : "+ Add Shared Expense"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} style={{
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          marginBottom: "25px",
          border: "1px solid #d1fae5"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                What did you pay for?
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Groceries, Dinner, Uber"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                Who owes you?
              </label>
              <input
                type="text"
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                placeholder="Roommate's name"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amountOwed}
                onChange={(e) => setFormData({ ...formData, amountOwed: e.target.value })}
                placeholder="0.00"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Add Shared Expense
          </button>
        </form>
      )}

      {/* Summary by Person */}
      {summary.length > 0 && (
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ fontSize: "18px", color: "#065f46", marginBottom: "15px" }}>
            💸 Total Owed: ${totalOwed.toFixed(2)}
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
            {summary.map((person) => (
              <div key={person.personName} style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "2px solid #10b981"
              }}>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#065f46", marginBottom: "5px" }}>
                  {person.personName}
                </div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}>
                  ${person.totalOwed.toFixed(2)}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "5px" }}>
                  {person.expenseCount} {person.expenseCount === 1 ? "item" : "items"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense List */}
      {sharedExpenses.length > 0 && (
        <div>
          <h3 style={{ fontSize: "16px", color: "#065f46", marginBottom: "15px" }}>Outstanding Debts</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sharedExpenses.map((expense) => (
              <div key={expense.id} style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #d1fae5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    {expense.description}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>
                    {expense.personName} • {new Date(expense.date).toLocaleDateString()}
                    {expense.remindersSent > 0 && (
                      <span style={{ marginLeft: "10px", color: "#f59e0b" }}>
                        📬 {expense.remindersSent} {expense.remindersSent === 1 ? "reminder" : "reminders"} sent
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#059669", marginRight: "20px" }}>
                  ${expense.amountOwed.toFixed(2)}
                </div>
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => sendReminder(expense.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#fbbf24",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                  >
                    📬 Remind
                  </button>
                  <button
                    onClick={() => markAsPaid(expense.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                  >
                    ✓ Paid
                  </button>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PayMeBack;