import { useState, useEffect } from "react";
import CoffeeRealityCheck from "./CoffeeRealityCheck";
import SimpleBurnRateDashboard from "./SimpleBurnRateDashboard";
import expenseAPI from "../api/ExpensesAPI";
import budgetAPI from "../api/BudgetAPI";

const TERMS = ["Winter 2026", "Summer 2026", "Fall 2026", "Winter 2027"];

function SpendingInsights() {
  const [selectedTerm, setSelectedTerm] = useState("Winter 2026");
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, summaryRes] = await Promise.allSettled([
        expenseAPI.getExpensesByTerm(selectedTerm),
        budgetAPI.getTermSummary(selectedTerm),
      ]);

      let budget = 0;
      let spent = 0;

      if (summaryRes.status === "fulfilled") {
        const data = summaryRes.value.data;
        budget = Number(data.budget || 0);
        spent = Number(data.totalExpenses || 0);
      }

      if (expensesRes.status === "fulfilled") {
        const expenses = expensesRes.value.data || [];
        if (!spent) {
          spent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        }
      }

      setTotalBudget(budget);
      setTotalSpent(spent);
    } catch (err) {
      console.error("Error loading insights:", err);
      setTotalBudget(0);
      setTotalSpent(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Spending Overview</h1>

        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        >
          {TERMS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ marginTop: "20px", color: "#6b7280" }}>Loading insights...</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div className="card" style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                Total Budget
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                ${Number(totalBudget || 0).toFixed(2)}
              </div>
            </div>

            <div className="card" style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                Total Spent
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                ${Number(totalSpent || 0).toFixed(2)}
              </div>
            </div>
          </div>

          {Number(totalBudget || 0) <= 0 ? (
            <div className="card" style={{ marginTop: "20px" }}>
              <h2 style={{ marginBottom: "10px" }}>Spending Overview</h2>
              <p style={{ color: "#6b7280", margin: 0 }}>
                Set a budget for this term to view spending details.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginTop: "20px" }}>
                <SimpleBurnRateDashboard
                  term={selectedTerm}
                  totalBudget={totalBudget}
                  totalSpent={totalSpent}
                />
              </div>

              <div style={{ marginTop: "30px" }}>
                <CoffeeRealityCheck term={selectedTerm} totalBudget={totalBudget} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SpendingInsights;