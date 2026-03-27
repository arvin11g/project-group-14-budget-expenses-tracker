import { useState } from "react";
import CoffeeRealityCheck from "./CoffeeRealityCheck";
import SimpleBurnRateDashboard from "./SimpleBurnRateDashboard";

function SpendingInsights() {
  const [selectedTerm, setSelectedTerm] = useState("Winter 2026");

  return (
    <div>
      <h1>Spending Insights</h1>

      <CoffeeRealityCheck term={selectedTerm} />

      <div style={{ marginTop: "30px" }}>
        <SimpleBurnRateDashboard
          term={selectedTerm}
          totalBudget={0} // we’ll fix this next
          totalSpent={0}
        />
      </div>
    </div>
  );
}

export default SpendingInsights;