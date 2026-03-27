import { useState, useEffect } from "react";

// Hardcoded term dates (can be made configurable later)
const TERM_DATES = {
  "Winter 2026": { start: "2026-01-06", end: "2026-04-30" },
  "Summer 2026": { start: "2026-05-04", end: "2026-08-31" },
  "Fall 2026": { start: "2026-09-08", end: "2026-12-18" },
  "Winter 2027": { start: "2027-01-05", end: "2027-04-29" },
};

function safeFixed(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return Number(0).toFixed(digits);
  }
  return num.toFixed(digits);
}

function SimpleBurnRateDashboard({ term, totalBudget, totalSpent }) {
  const safeBudget = Number(totalBudget || 0);
  const safeSpent = Number(totalSpent || 0);

  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!safeBudget || safeBudget <= 0) return;

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
    const dailyBurnRate = daysElapsed > 0 ? safeSpent / daysElapsed : 0;
    const remaining = safeBudget - safeSpent;
    const daysUntilBroke = remaining > 0 ? remaining / dailyBurnRate : 0;
    const targetDailySpending = daysRemaining > 0 ? remaining / daysRemaining : 0;
    const projectedEndBalance = remaining - (dailyBurnRate * daysRemaining);

    setAnalysis({
      totalBudget: safeBudget,
      totalSpent: safeSpent,
      remaining,
      daysElapsed,
      daysRemaining,
      totalDays,
      dailyBurnRate: Number.isFinite(dailyBurnRate) ? Math.round(dailyBurnRate * 100) / 100 : 0,
      daysUntilBroke: Number.isFinite(daysUntilBroke) ? Math.round(daysUntilBroke) : 0,
      targetDailySpending: Number.isFinite(targetDailySpending) ? Math.round(targetDailySpending * 100) / 100 : 0,
      projectedEndBalance: Number.isFinite(projectedEndBalance) ? Math.round(projectedEndBalance * 100) / 100 : 0,
      willRunOut: Number.isFinite(daysUntilBroke) ? daysUntilBroke < daysRemaining && remaining > 0 : false,
      onTrack: Number.isFinite(projectedEndBalance) ? projectedEndBalance >= 0 : false,
      percentageSpent: safeBudget > 0 ? (safeSpent / safeBudget) * 100 : 0,
      percentageTimeElapsed: totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0,
    });
  }, [term, safeBudget, safeSpent]);

  if (safeBudget <= 0) return null;

  if (!analysis) {
    return (
      <div className="card" style={{ marginTop: "30px", marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "10px" }}>Will You Run Out of Money?</h2>
        <p style={{ color: "#6b7280", margin: 0 }}>Loading burn rate...</p>
      </div>
    );
  }

  const isWarning = analysis.willRunOut;
  const isDanger = analysis.projectedEndBalance < 0;

  return (
    <div className="card" style={{ marginTop: "30px", marginBottom: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Will You Run Out of Money?</h2>

      {/* Alert Banner */}
      {isWarning && (
        <div style={{
          padding: "15px",
          backgroundColor: "#f9fafb",
          color: "#991b1b",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: "600",
          fontSize: "15px",
          border: "1px solid #e5e7eb"
        }}>
          {isDanger ? "Danger:" : "Warning:"} At your current spending rate, you'll run out of money{" "}
          <strong>{Math.floor(analysis.daysRemaining - analysis.daysUntilBroke)} days before the term ends.</strong>
        </div>
      )}

      {!isWarning && analysis.onTrack && (
        <div style={{
          padding: "15px",
          backgroundColor: "#f9fafb",
          color: "#065f46",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: "600",
          fontSize: "15px",
          border: "1px solid #e5e7eb"
        }}>
          You're on track. At this rate, you'll finish with <strong>${safeFixed(Math.abs(analysis.projectedEndBalance), 2)}</strong> left over.
        </div>
      )}

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
        <MetricBox
          label="Your Daily Spending"
          value={`$${safeFixed(analysis.dailyBurnRate, 2)}/day`}
          subtitle={`Based on ${analysis.daysElapsed} days`}
          color={analysis.dailyBurnRate > analysis.targetDailySpending ? "#ef4444" : "#2563eb"}
        />
        <MetricBox
          label="Target to Make It"
          value={`$${safeFixed(analysis.targetDailySpending, 2)}/day`}
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
              {safeFixed(analysis.percentageSpent, 1)}%
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
              {safeFixed(analysis.percentageTimeElapsed, 1)}%
            </span>
          </div>
          <ProgressBar percentage={analysis.percentageTimeElapsed} color="#3b82f6" />
        </div>

        {analysis.percentageSpent > analysis.percentageTimeElapsed && (
          <p style={{ marginTop: "12px", fontSize: "14px", color: "#ef4444", fontWeight: "500" }}>
            You're spending faster than time is passing.
            <br />
            <span style={{ fontSize: "13px" }}>
              ({safeFixed((analysis.percentageSpent ?? 0) - (analysis.percentageTimeElapsed ?? 0), 1)}% ahead of schedule)
            </span>
          </p>
        )}
      </div>

      {/* What To Do */}
      {isWarning && (
        <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ marginBottom: "10px", fontSize: "15px", color: "#374151" }}>How to Fix This:</h3>
          <ul style={{ marginLeft: "18px", lineHeight: "1.7", color: "#374151", fontSize: "14px" }}>
            <li>
              Cut spending from <strong>${safeFixed(analysis.dailyBurnRate, 2)}/day</strong> to <strong>${safeFixed(analysis.targetDailySpending, 2)}/day</strong>
            </li>
            <li>
              Save <strong>${safeFixed((analysis.dailyBurnRate ?? 0) - (analysis.targetDailySpending ?? 0), 2)}/day</strong> ({safeFixed(((analysis.dailyBurnRate ?? 0) - (analysis.targetDailySpending ?? 0)) * 7, 2)}/week)
            </li>
            <li>Focus on cutting: food delivery, coffee, entertainment</li>
          </ul>
        </div>
      )}

      {analysis.onTrack && !isWarning && (
        <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <p style={{ color: "#374151", fontSize: "14px", margin: 0 }}>
            <strong>Great job.</strong> You're projected to finish with <strong>${safeFixed(analysis.projectedEndBalance, 2)}</strong> remaining.
            Consider setting some aside for next term or emergencies.
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
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      backgroundColor: "white"
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
        width: `${Math.min(Number(percentage ?? 0), 100)}%`,
        height: "100%",
        backgroundColor: color,
        transition: "width 0.3s ease"
      }} />
    </div>
  );
}

export default SimpleBurnRateDashboard;