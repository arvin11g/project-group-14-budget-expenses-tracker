function Dashboard() {
  const totalBudget = 2500;
  const totalSpent = 1420;
  const remaining = totalBudget - totalSpent;

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Top Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <SummaryCard title="Total Budget" value={`$${totalBudget}`} />
        <SummaryCard title="Total Spent" value={`$${totalSpent}`} />
        <SummaryCard title="Remaining" value={`$${remaining}`} />
      </div>

      {/* Lower Section */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div className="card" style={{ flex: 1 }}>
          <h3>Budget Progress</h3>
          <ProgressBar percentage={(totalSpent / totalBudget) * 100} />
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h3>Recent Transactions</h3>
          <ul>
            <li>Groceries - $120</li>
            <li>Gym - $45</li>
            <li>Transport - $80</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="card" style={{ width: "220px" }}>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </div>
  );
}

function ProgressBar({ percentage }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <div
        style={{
          background: "#e5e7eb",
          height: "12px",
          borderRadius: "10px"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            background: "#2563eb",
            height: "100%",
            borderRadius: "10px"
          }}
        />
      </div>
      <p style={{ marginTop: "10px" }}>
        {percentage.toFixed(1)}% Used
      </p>
    </div>
  );
}

export default Dashboard;