import { useEffect, useState } from "react";
import budgetAPI from "../api/BudgetAPI";
import { formatCurrency } from "../utils/currency";
const TERMS = ["Winter 2026", "Summer 2026", "Fall 2026", "Winter 2027"];

function Budgets() {
  const [selectedTerm, setSelectedTerm] = useState("Winter 2026");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    loadBudgetForSelectedTerm();
  }, [selectedTerm]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetAPI.getAllBudgets();
      setBudgets(res.data || []);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBudgetForSelectedTerm = async () => {
    try {
      const res = await budgetAPI.getBudgetByTerm(selectedTerm);
      if (res.data && res.data.amount !== undefined) {
        setBudgetAmount(res.data.amount === 0 ? "" : res.data.amount);
      } else {
        setBudgetAmount("");
      }
    } catch (err) {
      console.error("Failed to load selected term budget:", err);
      setBudgetAmount("");
    }
  };

  const handleSaveBudget = async () => {
    const amount = parseFloat(budgetAmount);

    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    try {
      setSaving(true);
      await budgetAPI.setBudgetForTerm(selectedTerm, amount);
      await fetchBudgets();
      alert("Budget saved successfully.");
    } catch (err) {
      console.error("Failed to save budget:", err);
      alert("Failed to save budget.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditBudget = (budget) => {
    setSelectedTerm(budget.academicTerm);
    setBudgetAmount(budget.amount);
  };

  const sortedBudgets = [...budgets].sort((a, b) =>
    a.academicTerm.localeCompare(b.academicTerm)
  );

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Budgets</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Budgets</h1>

      <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
        {/* Left Card */}
        <div
          className="card"
          style={{
            flex: 1,
            minWidth: "380px",
            background: "white",
            borderRadius: "18px",
            padding: "28px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "24px" }}>Set Budget</h2>

          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Academic Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              style={inputStyle}
            >
              {TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "22px" }}>
           <label style={labelStyle}>Budget Amount (CAD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder="Enter budget amount"
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSaveBudget}
            disabled={saving}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Budget"}
          </button>
        </div>

        {/* Right Card */}
        <div
          className="card"
          style={{
            flex: 1,
            minWidth: "420px",
            background: "white",
            borderRadius: "18px",
            padding: "28px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0 }}>All Budgets</h2>
            <span style={{ color: "#2563eb", fontWeight: "700" }}>
              {sortedBudgets.length} {sortedBudgets.length === 1 ? "budget" : "budgets"}
            </span>
          </div>

          {sortedBudgets.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No budgets saved yet.</p>
          ) : (
            <div>
              {sortedBudgets.map((budget) => (
                <div
                  key={budget.id ?? budget.academicTerm}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0",
                    borderBottom: "1px solid #e5e7eb",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "16px" }}>
                      {budget.academicTerm}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                      Budget set for this term
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        fontWeight: "800",
                        fontSize: "20px",
                        color: "#111827",
                        minWidth: "110px",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(budget.amount)}
                    </div>

                    <button
                      onClick={() => handleEditBudget(budget)}
                      style={{
                        padding: "8px 12px",
                        background: "#f3f4f6",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Edit
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

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  fontSize: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

export default Budgets;