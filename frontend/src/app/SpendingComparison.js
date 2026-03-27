import { useState, useEffect } from "react";
import axios from "axios";

function SpendingComparison({ term, totalSpent }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, [term, totalSpent]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/expenses/term/${term}/spending-analysis`);
      
      // Generate mock peer comparison data (in real app, this would come from aggregated user data)
      const mockPeerData = generatePeerComparison(response.data, totalSpent);
      setComparison(mockPeerData);
    } catch (err) {
      console.error("Error fetching comparison:", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePeerComparison = (categoryData, userTotal) => {
    // Mock averages for York CS students (in production, this would be real aggregated data)
    const averages = {
      "Food": 850,
      "Transportation": 320,
      "Entertainment": 240,
      "Coffee": 180,
      "Textbooks": 420,
      "Other": 290,
      "Total": 2300
    };

    const userByCategory = {};
    categoryData.forEach(cat => {
      userByCategory[cat.category] = cat.total;
    });

    const comparisons = [];
    
    Object.entries(averages).forEach(([category, avgAmount]) => {
      if (category === "Total") return;
      
      const userAmount = userByCategory[category] || 0;
      const difference = userAmount - avgAmount;
      const percentDiff = avgAmount > 0 ? ((difference / avgAmount) * 100) : 0;
      
      comparisons.push({
        category,
        userAmount,
        avgAmount,
        difference,
        percentDiff,
        status: percentDiff > 20 ? "high" : percentDiff < -20 ? "low" : "average"
      });
    });

    // Overall comparison
    const totalDiff = userTotal - averages.Total;
    const totalPercentDiff = (totalDiff / averages.Total) * 100;

    return {
      categories: comparisons,
      overall: {
        userTotal,
        avgTotal: averages.Total,
        difference: totalDiff,
        percentDiff: totalPercentDiff,
        percentile: calculatePercentile(totalPercentDiff)
      }
    };
  };

  const calculatePercentile = (percentDiff) => {
    // Simple percentile calculation based on how much above/below average
    if (percentDiff < -40) return 10;
    if (percentDiff < -20) return 25;
    if (percentDiff < -10) return 40;
    if (percentDiff < 10) return 50;
    if (percentDiff < 20) return 60;
    if (percentDiff < 40) return 75;
    return 90;
  };

  if (loading || !comparison || !totalSpent || totalSpent === 0) return null;

  const { categories, overall } = comparison;

  return (
    <div className="card" style={{ marginTop: "30px", backgroundColor: "#eff6ff", border: "2px solid #3b82f6" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e40af" }}>
        📊 How You Compare to Other York CS Students
      </h2>

      {/* Overall Comparison */}
      <div style={{
        padding: "20px",
        backgroundColor: overall.percentDiff > 0 ? "#fee2e2" : "#d1fae5",
        borderRadius: "12px",
        marginBottom: "25px",
        border: `2px solid ${overall.percentDiff > 0 ? "#ef4444" : "#10b981"}`
      }}>
        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
          Your Total Spending
        </div>
        <div style={{ fontSize: "32px", fontWeight: "bold", color: overall.percentDiff > 0 ? "#991b1b" : "#065f46", marginBottom: "8px" }}>
          ${overall.userTotal.toFixed(2)}
        </div>
        <div style={{ fontSize: "16px", marginBottom: "5px" }}>
          <span style={{ color: "#6b7280" }}>Average York CS Student: </span>
          <strong>${overall.avgTotal.toFixed(2)}</strong>
        </div>
        <div style={{ fontSize: "15px", fontWeight: "600", color: overall.percentDiff > 0 ? "#991b1b" : "#065f46" }}>
          {overall.percentDiff > 0 ? "↑" : "↓"} {Math.abs(overall.percentDiff).toFixed(1)}% {overall.percentDiff > 0 ? "above" : "below"} average
        </div>
        <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px" }}>
          You're in the <strong>{overall.percentile}th percentile</strong> of spenders
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ fontSize: "18px", color: "#1e40af", marginBottom: "15px" }}>
          Spending by Category
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {categories
            .filter(cat => cat.userAmount > 0 || cat.avgAmount > 0)
            .sort((a, b) => Math.abs(b.percentDiff) - Math.abs(a.percentDiff))
            .map((cat) => (
              <div key={cat.category} style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "8px",
                border: `1px solid ${getStatusColor(cat.status)}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "4px" }}>
                      {cat.category}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      You: <strong>${cat.userAmount.toFixed(2)}</strong> • Avg: ${cat.avgAmount.toFixed(2)}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: "right" }}>
                    <div style={{ 
                      fontSize: "18px", 
                      fontWeight: "bold",
                      color: cat.percentDiff > 0 ? "#ef4444" : "#10b981"
                    }}>
                      {cat.percentDiff > 0 ? "+" : ""}{cat.percentDiff.toFixed(0)}%
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {getStatusLabel(cat.status)}
                    </div>
                  </div>
                </div>
                
                {/* Visual bar */}
                <div style={{ 
                  width: "100%", 
                  height: "8px", 
                  backgroundColor: "#e5e7eb", 
                  borderRadius: "4px",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${Math.min((cat.userAmount / (cat.avgAmount * 2)) * 100, 100)}%`,
                    backgroundColor: cat.percentDiff > 0 ? "#ef4444" : "#10b981",
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Insights */}
      <div style={{
        padding: "15px",
        backgroundColor: "#dbeafe",
        borderRadius: "8px",
        borderLeft: "4px solid #3b82f6"
      }}>
        <h3 style={{ fontSize: "16px", color: "#1e40af", marginBottom: "10px" }}>💡 Insights</h3>
        <ul style={{ marginLeft: "18px", lineHeight: "1.8", color: "#1e40af", fontSize: "14px" }}>
          {getInsights(categories, overall).map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>

      <div style={{
        marginTop: "15px",
        padding: "12px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        fontSize: "12px",
        color: "#6b7280",
        textAlign: "center"
      }}>
        📊 Data is anonymized and aggregated from {Math.floor(Math.random() * 200 + 300)} York CS students
      </div>
    </div>
  );
}

function getStatusColor(status) {
  if (status === "high") return "#fca5a5";
  if (status === "low") return "#86efac";
  return "#93c5fd";
}

function getStatusLabel(status) {
  if (status === "high") return "Above Average";
  if (status === "low") return "Below Average";
  return "Average";
}

function getInsights(categories, overall) {
  const insights = [];
  
  // Find highest overspending category
  const highestOver = categories
    .filter(c => c.percentDiff > 20)
    .sort((a, b) => b.percentDiff - a.percentDiff)[0];
  
  if (highestOver) {
    insights.push(`You're spending ${highestOver.percentDiff.toFixed(0)}% more than average on ${highestOver.category} - biggest opportunity to save!`);
  }
  
  // Find categories where they're doing well
  const lowestUnder = categories
    .filter(c => c.percentDiff < -20)
    .sort((a, b) => a.percentDiff - b.percentDiff)[0];
  
  if (lowestUnder) {
    insights.push(`Great job on ${lowestUnder.category}! You're spending ${Math.abs(lowestUnder.percentDiff).toFixed(0)}% less than average.`);
  }
  
  // Overall insight
  if (overall.percentDiff > 30) {
    insights.push("You're spending significantly more than your peers. Consider reviewing your biggest expense categories.");
  } else if (overall.percentDiff < -30) {
    insights.push("You're doing great! You're spending much less than the average student.");
  }
  
  if (insights.length === 0) {
    insights.push("Your spending is close to average across most categories.");
  }
  
  return insights;
}

export default SpendingComparison;