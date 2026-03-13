import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import expenseAPI from "../api/ExpensesAPI";
import budgetAPI from "../api/BudgetAPI";
import { formatCurrency } from "../utils/currency";

const TERMS = ["Winter 2026", "Summer 2026", "Fall 2026", "Winter 2027"];

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

function Charts() {
  const [selectedTerm, setSelectedTerm] = useState("Winter 2026");
  const [categoryData, setCategoryData] = useState({});
  const [summary, setSummary] = useState({
    budget: 0,
    totalExpenses: 0,
    remaining: 0,
    overBudget: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [selectedTerm]);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      const [groupedRes, summaryRes] = await Promise.all([
        expenseAPI.getExpensesByTermGrouped(selectedTerm),
        budgetAPI.getTermSummary(selectedTerm),
      ]);

      setCategoryData(groupedRes.data || {});
      setSummary(
        summaryRes.data || {
          budget: 0,
          totalExpenses: 0,
          remaining: 0,
          overBudget: false,
        }
      );
    } catch (err) {
      console.error("Failed to load chart data:", err);
      setCategoryData({});
      setSummary({
        budget: 0,
        totalExpenses: 0,
        remaining: 0,
        overBudget: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = [
    { name: "Budget", value: summary.budget || 0 },
    { name: "Spent", value: summary.totalExpenses || 0 },
    { name: "Remaining", value: Math.max(summary.remaining || 0, 0) },
  ];

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "10px 12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "600" }}>{label}</p>
          <p style={{ margin: "6px 0 0 0" }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "10px 12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "600" }}>{item.name}</p>
          <p style={{ margin: "6px 0 0 0" }}>
            {formatCurrency(item.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Charts</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0 }}>Charts</h1>

        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "15px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        >
          {TERMS.map((term) => (
            <option key={term} value={term}>
              {term}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        <div
          className="card"
          style={{
            flex: 1,
            background: "white",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Spending by Category</h2>

          {pieData.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No expense data for this term yet.</p>
          ) : (
            <div style={{ width: "100%", height: 380 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={140}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div
          className="card"
          style={{
            flex: 1,
            background: "white",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Budget vs Spent (CAD)</h2>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => {
                    const barColors = {
                      Budget: "#2563eb",
                      Spent: "#ef4444",
                      Remaining: "#22c55e",
                    };

                    return (
                      <Cell
                        key={`bar-cell-${index}`}
                        fill={barColors[entry.name]}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: "16px", color: "#374151", lineHeight: "1.8" }}>
            <div><strong>Budget:</strong> {formatCurrency(summary.budget)}</div>
            <div><strong>Spent:</strong> {formatCurrency(summary.totalExpenses)}</div>
            <div><strong>Remaining:</strong> {formatCurrency(summary.remaining)}</div>
          </div>

          {summary.overBudget && (
            <p style={{ marginTop: "16px", color: "#ef4444", fontWeight: "600" }}>
              Warning: You are over budget for {selectedTerm}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Charts;