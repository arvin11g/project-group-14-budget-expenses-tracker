import { useState, useEffect } from "react";

// Hardcoded term dates (can be made configurable later)
const TERM_DATES = {
  "Winter 2026": { start: "2026-01-06", end: "2026-04-30" },
  "Summer 2026": { start: "2026-05-04", end: "2026-08-31" },
  "Fall 2026": { start: "2026-09-08", end: "2026-12-18" },
  "Winter 2027": { start: "2027-01-05", end: "2027-04-29" },
};

function SimpleBurnRateDashboard({ term, totalBudget, totalSpent }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!totalBudget || totalBudget <= 0) return;
    
    const dates = TERM_DATES[term];
    if (!dates) return;

    const termStart = new Date(dates.start);
    const termEnd = new Date(dates.end);
    const today = new Date();

    // Calculate days
    const totalDays = Math.floor((termEnd - termStart) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.max(1, Math.floor((today - termStart) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.floor((termEnd - today) / (1000 * 60 * 60 * 24)));

    // Calculate burn rate
    const dailyBurnRate = totalSpent / daysElapsed;
    const remaining = totalBudget - totalSpent;
    const daysUntilBroke = remaining > 0 ? remaining / dailyBurnRate : 0;
    const targetDailySpending = daysRemaining > 0 ? remaining / daysRemaining : 0;
    const projectedEndBalance = remaining - (dailyBurnRate * daysRemaining);

    setAnalysis({
      totalBudget,
      totalSpent,
      remaining,
      daysElapsed,
      daysRemaining,
      totalDays,
      dailyBurnRate: Math.round(dailyBurnRate * 100) / 100,
      daysUntilBroke: Math.round(daysUntilBroke),
      targetDailySpending: Math.round(targetDailySpending * 100) / 100,
      projectedEndBalance: Math.round(projectedEndBalance * 100) / 100,
      willRunOut: daysUntilBroke < daysRemaining && remaining > 0,
      onTrack: projectedEndBalance >= 0,
      percentageSpent: (totalSpent / totalBudget) * 100,
      percentageTimeElapsed: (daysElapsed / totalDays) * 100,
    });
  }, [term, totalBudget, totalSpent]);

  if (!analysis || totalBudget <= 0) return null;

  const isWarning = analysis.willRunOut;
  const isDanger = analysis.projectedEndBalance < 0;

  return (
    <div className="card" style={{ marginTop: "30px", marginBottom: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>💰 Will You Run Out of Money?</h2>

      {/* Alert Banner */}
      {isWarning && (
        <div style={{
          padding: "15px",
          backgroundColor: isDanger ? "#fee2e2" : "#fef3c7",
          color: isDanger ? "#991b1b" : "#92400e",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: "600",
          fontSize: "15px"
        }}>
          {isDanger ? "🚨 DANGER:" : "⚠️ WARNING:"} At your current spending rate, you'll run out of money{" "}
          <strong>{Math.floor(analysis.daysRemaining - analysis.daysUntilBroke)} days before the term ends!</strong>
        </div>
      )}

      {!isWarning && analysis.onTrack && (
        <div style={{
          padding: "15px",
          backgroundColor: "#d1fae5",
          color: "#065f46",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: "600",
          fontSize: "15px"
        }}>
          ✅ You're good! Keep this up and you'll finish with <strong>${Math.abs(analysis.projectedEndBalance).toFixed(2)}</strong> left over.
        </div>
      )}

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
        <MetricBox
          label="Your Daily Spending"
          value={`$${analysis.dailyBurnRate}/day`}
          subtitle={`Based on ${analysis.daysElapsed} days`}
          color={analysis.dailyBurnRate > analysis.targetDailySpending ? "#ef4444" : "#2563eb"}
        />
        <MetricBox
          label="Target to Make It"
          value={`$${analysis.targetDailySpending}/day`}
          subtitle={`${analysis.daysRemaining} days left`}
          color="#10b981"
        />
      </div>

      {/* Progress Comparison */}
      <div style={{ marginBottom: "25px" }}>
        <div style={{ marginBottom: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Money Spent</span>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {analysis.percentageSpent.toFixed(1)}%
            </span>
          </div>
          <ProgressBar 
            percentage={analysis.percentageSpent} 
            color={analysis.percentageSpent > analysis.percentageTimeElapsed ? "#ef4444" : "#10b981"}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Time Passed</span>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {analysis.percentageTimeElapsed.toFixed(1)}%
            </span>
          </div>
          <ProgressBar percentage={analysis.percentageTimeElapsed} color="#3b82f6" />
        </div>

        {analysis.percentageSpent > analysis.percentageTimeElapsed && (
          <p style={{ marginTop: "12px", fontSize: "14px", color: "#ef4444", fontWeight: "500" }}>
            ⚠️ You're spending faster than time is passing! 
            <br />
            <span style={{ fontSize: "13px" }}>
              ({(analysis.percentageSpent - analysis.percentageTimeElapsed).toFixed(1)}% ahead of schedule)
            </span>
          </p>
        )}
      </div>

      {/* What To Do */}
      {isWarning && (
        <div style={{ backgroundColor: "#fef3c7", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #f59e0b" }}>
          <h3 style={{ marginBottom: "10px", fontSize: "15px", color: "#92400e" }}>💡 How to Fix This:</h3>
          <ul style={{ marginLeft: "18px", lineHeight: "1.7", color: "#92400e", fontSize: "14px" }}>
            <li>
              Cut spending from <strong>${analysis.dailyBurnRate.toFixed(2)}/day</strong> to <strong>${analysis.targetDailySpending.toFixed(2)}/day</strong>
            </li>
            <li>
              Save <strong>${(analysis.dailyBurnRate - analysis.targetDailySpending).toFixed(2)}/day</strong> ({((analysis.dailyBurnRate - analysis.targetDailySpending) * 7).toFixed(2)}/week)
            </li>
            <li>Focus on cutting: food delivery, coffee, entertainment</li>
          </ul>
        </div>
      )}

      {analysis.onTrack && !isWarning && (
        <div style={{ backgroundColor: "#f0fdf4", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
          <p style={{ color: "#065f46", fontSize: "14px", margin: 0 }}>
            <strong>Great job!</strong> You're projected to finish with <strong>${analysis.projectedEndBalance.toFixed(2)}</strong> remaining. 
            Consider setting aside some for next term or emergencies.
          </p>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, subtitle, color }) {
  return (
    <div style={{ 
      padding: "15px", 
      border: `2px solid ${color}`,
      borderRadius: "8px",
      backgroundColor: `${color}08`
    }}>
      <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "24px", fontWeight: "bold", color, marginBottom: "4px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#6b7280" }}>{subtitle}</div>
    </div>
  );
}

function ProgressBar({ percentage, color }) {
  return (
    <div style={{ 
      width: "100%", 
      height: "10px", 
      backgroundColor: "#e5e7eb", 
      borderRadius: "10px",
      overflow: "hidden"
    }}>
      <div style={{
        width: `${Math.min(percentage, 100)}%`,
        height: "100%",
        backgroundColor: color,
        transition: "width 0.3s ease"
      }} />
    </div>
  );
}

export default SimpleBurnRateDashboard;