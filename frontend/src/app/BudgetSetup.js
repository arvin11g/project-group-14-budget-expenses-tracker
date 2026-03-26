import { useState } from "react";
import axios from "axios";

function BudgetSetup() {
  const [formData, setFormData] = useState({
    academicTerm: "Winter 2026",
    totalAmount: "",
    termStartDate: "2026-01-06",
    termEndDate: "2026-04-30",
    notes: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.totalAmount || !formData.termStartDate || !formData.termEndDate) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/budgets", {
        academicTerm: formData.academicTerm,
        totalAmount: parseFloat(formData.totalAmount),
        termStartDate: formData.termStartDate,
        termEndDate: formData.termEndDate,
        notes: formData.notes
      });

      alert("Budget created successfully!");
      
      // Reset form
      setFormData({
        academicTerm: "Winter 2026",
        totalAmount: "",
        termStartDate: "2026-01-06",
        termEndDate: "2026-04-30",
        notes: ""
      });
    } catch (err) {
      console.error("Error creating budget:", err);
      if (err.response?.status === 409) {
        alert("Budget already exists for this term! Update it instead.");
      } else {
        alert("Failed to create budget. Check console for details.");
      }
    }
  };

  return (
    <div>
      <h1>Set Up Your Budget</h1>

      <div className="card" style={{ maxWidth: "600px", marginTop: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>Create Term Budget</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Academic Term *
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

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Total Budget Amount * ($)
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              placeholder="e.g., 7000 (your OSAP/savings for the term)"
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
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "5px" }}>
              How much money do you have for this entire term?
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Term Start Date *
            </label>
            <input
              type="date"
              name="termStartDate"
              value={formData.termStartDate}
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

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Term End Date *
            </label>
            <input
              type="date"
              name="termEndDate"
              value={formData.termEndDate}
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
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., OSAP + part-time job savings"
              rows="3"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontFamily: "inherit"
              }}
            />
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
            Create Budget
          </button>
        </form>
      </div>

      <div className="card" style={{ maxWidth: "600px", marginTop: "30px", backgroundColor: "#f9fafb" }}>
        <h3 style={{ marginBottom: "15px" }}>💡 Pro Tips</h3>
        <ul style={{ lineHeight: "1.8", marginLeft: "20px" }}>
          <li>Include ALL money you have for the term (OSAP, savings, expected income from work)</li>
          <li>Set realistic term dates (first day of classes to last day of exams)</li>
          <li>You can create budgets for future terms too!</li>
          <li>Update your budget if you get unexpected money (birthday, refund, etc.)</li>
        </ul>
      </div>
    </div>
  );
}

export default BudgetSetup;