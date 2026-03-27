import { useState, useEffect } from "react";
import expenseAPI from "../api/ExpensesAPI";
import budgetAPI from "../api/BudgetAPI";
import { formatCurrency } from "../utils/currency";
import { splitExpenses, calculateExpenseTotal } from "../utils/expenseUtils";
import CoffeeRealityCheck from "./CoffeeRealityCheck";
import SimpleBurnRateDashboard from "./SimpleBurnRateDashboard";
import PayMeBack from "./Paymeback";
import SpendingComparison from "./SpendingComparison";

const TERMS = ["Winter 2026", "Summer 2026", "Fall 2026", "Winter 2027"];

function Dashboard() {
  const [selectedTerm, setSelectedTerm] = useState("Winter 2026");
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTerm]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Expenses
   const [expensesRes, summaryRes] = await Promise.allSettled([
     expenseAPI.getExpensesByTerm(selectedTerm),
     budgetAPI.getTermSummary(selectedTerm),
   ]);

   // Expenses
   const expensesData = expensesRes.status === "fulfilled" ? expensesRes.value.data : [];
   setExpenses(expensesData);
   const sorted = [...expensesData].sort((a, b) => new Date(b.date) - new Date(a.date));
   setRecentExpenses(sorted.slice(0, 3));

   // Summary from backend
   if (summaryRes.status === "fulfilled") {
     const data = summaryRes.value.data;
     setTotalBudget(data.budget || 0);
     setTotalSpent(data.totalExpenses || 0);
     setBudgetInput(data.budget || "");
   }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async () => {
    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid budget amount.");
      return;
    }
    try {
      await budgetAPI.setBudgetForTerm(selectedTerm, amount);
      setTotalBudget(amount);
      setEditingBudget(false);
    } catch (err) {
      console.error("Error saving budget:", err);
      alert("Failed to save budget.");
    }
  };

  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const overBudget = totalSpent > totalBudget && totalBudget > 0;
  const { planned, actual } = splitExpenses(expenses);
  const plannedTotal = calculateExpenseTotal(planned);
  const actualTotal = calculateExpenseTotal(actual);

  // Financial health calculation
  let healthScore = 0;
  let healthStatus = "No Budget";

  if (totalBudget > 0) {
    const ratio = remaining / totalBudget;
    healthScore = Math.max(0, Math.min(100, Math.round(ratio * 100)));

    if (ratio > 0.4) healthStatus = "Excellent";
    else if (ratio > 0.2) healthStatus = "Good";
    else if (ratio > 0) healthStatus = "Warning";
    else healthStatus = "Over Budget";
  }

  let advice = "Set a budget to start getting personalized insights.";

  if (healthStatus === "Excellent") {
    advice = "You're managing your budget very well this term.";
  } else if (healthStatus === "Good") {
    advice = "You're on track with your spending.";
  } else if (healthStatus === "Warning") {
    advice = "You are close to your budget limit. Monitor spending carefully.";
  } else if (healthStatus === "Over Budget") {
    advice = "You are over budget. Consider reducing non-essential expenses.";
  }

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}><h2>Loading...</h2></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          style={{ padding: "8px 12px", fontSize: "15px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        >
          {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/*BURN RATE DASHBOARD */}
      <SimpleBurnRateDashboard
        term={selectedTerm}
        totalBudget={totalBudget}
        totalSpent={totalSpent}
      />


      {/* ☕ COFFEE REALITY CHECK */}
      <CoffeeRealityCheck term={selectedTerm} totalBudget={totalBudget} />

      {/* 💰 PAY ME BACK TRACKER */}
      <PayMeBack term={selectedTerm} />

      {/* 📊 SPENDING COMPARISON */}
      <SpendingComparison term={selectedTerm} totalSpent={totalSpent} />

      {/* Top Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        {/* Budget card with inline editing */}
        <div className="card" style={{ width: "220px" }}>
          <div className="card-title">Total Budget</div>
          {editingBudget ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="Enter budget"
                style={{ padding: "6px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
              />
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={handleSaveBudget} style={{ flex: 1, padding: "6px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Save</button>
                <button onClick={() => setEditingBudget(false)} style={{ flex: 1, padding: "6px", background: "#e5e7eb", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
             <div className="card-value">{totalBudget > 0 ? formatCurrency(totalBudget) : "Not set"}</div>
              <button onClick={() => setEditingBudget(true)} style={{ fontSize: "12px", padding: "3px 8px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
            </div>
          )}
        </div>

       <SummaryCard title="Total Spent" value={formatCurrency(totalSpent)} />
        <SummaryCard
          title="Remaining"
          value={totalBudget > 0 ? formatCurrency(remaining) : "No budget set"}
          valueColor={overBudget ? "#ef4444" : remaining > 0 ? "#16a34a" : "#6b7280"}
        />
        <SummaryCard
          title="Financial Health"
          value={`${healthScore}/100 (${healthStatus})`}
          subtitle={advice}
          valueColor={
            healthStatus === "Excellent" ? "#16a34a" :
            healthStatus === "Good" ? "#2563eb" :
            healthStatus === "Warning" ? "#f59e0b" :
            healthStatus === "Over Budget" ? "#ef4444" : undefined
          }
        />
        <SummaryCard
          title="Planned vs Actual"
          value={`Planned: ${formatCurrency(plannedTotal)}`}
          subtitle={`Actual: ${formatCurrency(actualTotal)}`}
        />
      </div>

      {/* Lower Section */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div className="card" style={{ flex: 1 }}>
          <h3>Budget Progress</h3>
          {totalBudget > 0 ? (
            <>
              <ProgressBar percentage={percentage} overBudget={overBudget} />
              {overBudget && (
                <p style={{ color: "#ef4444", marginTop: "12px", fontWeight: "600" }}>
                  Warning: You are over budget for {selectedTerm}.
                </p>
              )}
            </>
          ) : (
            <p style={{ color: "#6b7280", marginTop: "15px" }}>Set a budget above to track progress.</p>
          )}
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h3>Recent Transactions — {selectedTerm}</h3>
          {recentExpenses.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No expenses for this term yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {recentExpenses.map((e) => (
                <li key={e.id} style={{ padding: "8px 0", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
                  <span>{e.description} <span style={{ color: "#6b7280", fontSize: "13px" }}>({e.category})</span></span>
                  <strong>{formatCurrency(e.amount)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, valueColor }) {
  return (
    <div className="card" style={{ width: "220px" }}>
      <div className="card-title">{title}</div>
      <div className="card-value" style={valueColor ? { color: valueColor } : {}}>{value}</div>
      {subtitle && (
        <div style={{ marginTop: "8px", fontSize: "13px", color: "#6b7280", lineHeight: "1.4" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ percentage, overBudget }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ background: "#e5e7eb", height: "12px", borderRadius: "10px" }}>
        <div style={{
          width: `${percentage}%`,
          background: overBudget ? "#ef4444" : "#2563eb",
          height: "100%",
          borderRadius: "10px",
          transition: "width 0.3s ease"
        }} />
      </div>
      <p style={{ marginTop: "10px", color: overBudget ? "#ef4444" : "inherit" }}>
        {percentage.toFixed(1)}% Used {overBudget && "⚠️ Over budget!"}
      </p>
    </div>
  );
}

export default Dashboard;