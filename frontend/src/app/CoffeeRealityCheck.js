import { useState, useEffect } from "react";
import axios from "axios";

function CoffeeRealityCheck({ term }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoffeeAnalysis();
  }, [term]);

  const fetchCoffeeAnalysis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/expenses/term/${term}/coffee-reality-check`);
      setAnalysis(response.data);
    } catch (err) {
      console.error("Error fetching coffee analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  // Don't show if:
  // 1. Still loading
  // 2. No analysis data
  // 3. No wasteful spending
  // 4. Less than 5 wasteful purchases (not enough data for meaningful analysis)
  if (loading || !analysis || analysis.totalWaste === 0 || analysis.wasteCount < 5) {
    return null;
  }

  const { totalWaste, wasteCount, totalSpent, wastePercentage, categoryBreakdown, equivalents } = analysis;

  // Find biggest waste category
  const sortedCategories = Object.entries(categoryBreakdown)
    .filter(([cat]) => ["Food", "Entertainment", "Coffee", "Other"].includes(cat))
    .sort(([, a], [, b]) => b - a);

  const biggestWaste = sortedCategories[0];

  return (
    <div className="card" style={{ marginTop: "30px", backgroundColor: "#fef3c7", border: "2px solid #f59e0b" }}>
      <h2 style={{ marginBottom: "20px", color: "#92400e" }}>☕ Stop Buying X Reality Check</h2>

      {/* Shame Header */}
      <div style={{
        padding: "20px",
        backgroundColor: "#fee2e2",
        borderRadius: "12px",
        marginBottom: "25px",
        border: "2px solid #ef4444"
      }}>
        <h3 style={{ fontSize: "24px", color: "#991b1b", marginBottom: "10px" }}>
          You've wasted <strong>${totalWaste.toFixed(2)}</strong> this term
        </h3>
        <p style={{ fontSize: "16px", color: "#7f1d1d", marginBottom: "0" }}>
          That's <strong>{wastePercentage.toFixed(1)}%</strong> of your total spending ({wasteCount} purchases)
        </p>
      </div>

      {/* Category Breakdown */}
      {biggestWaste && (
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ fontSize: "18px", color: "#92400e", marginBottom: "15px" }}>
            Your Biggest Waste: {biggestWaste[0]}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {sortedCategories.slice(0, 4).map(([category, amount]) => (
              <div key={category} style={{
                padding: "12px",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #fbbf24"
              }}>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>{category}</div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ef4444" }}>${amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What You Could Have Bought */}
      <div style={{
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "12px",
        marginBottom: "20px"
      }}>
        <h3 style={{ fontSize: "18px", color: "#92400e", marginBottom: "15px" }}>
          What ${totalWaste.toFixed(2)} Could Have Bought You:
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
          {equivalents.textbooks > 0 && (
            <EquivalentItem icon="📚" count={equivalents.textbooks} label="Textbooks" />
          )}
          {equivalents.pizzaSlices > 0 && (
            <EquivalentItem icon="🍕" count={equivalents.pizzaSlices} label="Pizza Slices" />
          )}
          {equivalents.spotifyMonths > 0 && (
            <EquivalentItem icon="🎵" count={equivalents.spotifyMonths} label="Months of Spotify" />
          )}
          {equivalents.uberRides > 0 && (
            <EquivalentItem icon="🚗" count={equivalents.uberRides} label="Uber Rides" />
          )}
          {equivalents.movieTickets > 0 && (
            <EquivalentItem icon="🎬" count={equivalents.movieTickets} label="Movie Tickets" />
          )}
          {equivalents.gymMonths > 0 && (
            <EquivalentItem icon="💪" count={equivalents.gymMonths} label="Months of Gym" />
          )}
        </div>
      </div>

      {/* Action Items */}
      <div style={{
        padding: "15px",
        backgroundColor: "#fef3c7",
        borderRadius: "8px",
        borderLeft: "4px solid #f59e0b"
      }}>
        <h3 style={{ fontSize: "16px", color: "#92400e", marginBottom: "10px" }}>💡 How to Stop the Bleeding:</h3>
        <ul style={{ marginLeft: "18px", lineHeight: "1.8", color: "#78350f", fontSize: "14px" }}>
          {biggestWaste && biggestWaste[0] === "Food" && (
            <>
              <li><strong>Meal prep on Sundays</strong> - Cook bulk meals for the week</li>
              <li><strong>Delete delivery apps</strong> - Uber Eats is draining your wallet</li>
              <li><strong>Pack lunch 3x/week</strong> - Save ~$60/week</li>
            </>
          )}
          {biggestWaste && biggestWaste[0] === "Coffee" && (
            <>
              <li><strong>Buy a French press</strong> - $25 one-time vs $150+/month</li>
              <li><strong>Make coffee at home</strong> - Costs $0.50 vs $5.00</li>
              <li><strong>Limit to 2 coffee shop visits/week</strong> - As a treat, not daily habit</li>
            </>
          )}
          {biggestWaste && biggestWaste[0] === "Entertainment" && (
            <>
              <li><strong>Cancel unused subscriptions</strong> - Do you REALLY watch Netflix AND Disney+?</li>
              <li><strong>Use student discounts</strong> - Most places give 10-15% off</li>
              <li><strong>Free campus events</strong> - York has free movie nights, sometimes..</li>
            </>
          )}
          <li><strong>Set a weekly "fun money" budget</strong> - ${(totalWaste / 16).toFixed(0)}/week max for non-essentials</li>
        </ul>
      </div>

      {/* Comparison */}
      <div style={{
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#fee2e2",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <p style={{ fontSize: "15px", color: "#991b1b", fontWeight: "600", marginBottom: "8px" }}>
          🔥 If you keep this up, you'll waste <strong>${(totalWaste * 3).toFixed(2)}</strong> this year
        </p>

      </div>
    </div>
  );
}

function EquivalentItem({ icon, count, label }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      backgroundColor: "#fef3c7",
      borderRadius: "8px"
    }}>
      <span style={{ fontSize: "28px" }}>{icon}</span>
      <div>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#92400e" }}>{count}</div>
        <div style={{ fontSize: "13px", color: "#78350f" }}>{label}</div>
      </div>
    </div>
  );


}

export default CoffeeRealityCheck;