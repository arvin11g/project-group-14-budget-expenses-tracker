import { useState, useEffect } from "react";
import axios from "axios";

// Average OSAP debt by York faculty (based on typical program lengths and costs)
const FACULTY_AVERAGES = {
  "Lassonde School of Engineering": {
    avgDebt: 28500,
    programLength: 4,
    description: "Engineering programs (CS, Software, Electrical, etc.)"
  },
  "Faculty of Liberal Arts & Professional Studies": {
    avgDebt: 22000,
    programLength: 4,
    description: "BA programs (Psychology, Sociology, Political Science, etc.)"
  },
  "Schulich School of Business": {
    avgDebt: 32000,
    programLength: 4,
    description: "BBA and specialized business programs"
  },
  "Faculty of Science": {
    avgDebt: 25000,
    programLength: 4,
    description: "BSc programs (Biology, Chemistry, Physics, Math, etc.)"
  },
  "Faculty of Health": {
    avgDebt: 26500,
    programLength: 4,
    description: "Health programs (Kinesiology, Nursing, etc.)"
  },
  "Glendon College": {
    avgDebt: 21000,
    programLength: 4,
    description: "Bilingual liberal arts programs"
  },
  "Osgoode Hall Law School": {
    avgDebt: 45000,
    programLength: 3,
    description: "Law degree (JD)"
  },
  "Faculty of Education": {
    avgDebt: 18000,
    programLength: 2,
    description: "BEd program"
  },
  "Faculty of Environmental & Urban Change": {
    avgDebt: 23500,
    programLength: 4,
    description: "Environmental Studies, Urban Planning, etc."
  }
};

function OSAPDebtTracker() {
  const [loans, setLoans] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [userMajor, setUserMajor] = useState("");
  
  // Repayment calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    salary: "",
    paymentPercentage: "10",
    interestRate: "9.2"
  });
  const [repaymentPlan, setRepaymentPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    term: "Winter 2026",
    grantAmount: "",
    loanAmount: "",
    dateReceived: new Date().toISOString().split('T')[0],
    notes: ""
  });

  useEffect(() => {
    fetchLoans();
    fetchSummary();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/osap-loans");
      setLoans(response.data);
    } catch (err) {
      console.error("Error fetching OSAP loans:", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/osap-loans/summary");
      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:8080/api/osap-loans", {
        ...formData,
        grantAmount: parseFloat(formData.grantAmount),
        loanAmount: parseFloat(formData.loanAmount)
      });
      
      setFormData({
        term: "Winter 2026",
        grantAmount: "",
        loanAmount: "",
        dateReceived: new Date().toISOString().split('T')[0],
        notes: ""
      });
      setShowAddForm(false);
      fetchLoans();
      fetchSummary();
    } catch (err) {
      console.error("Error adding OSAP loan:", err);
      alert("Failed to add OSAP record");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this OSAP record?")) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/osap-loans/${id}`);
      fetchLoans();
      fetchSummary();
    } catch (err) {
      console.error("Error deleting loan:", err);
    }
  };

  const calculateRepayment = async () => {
    if (!calculatorInputs.salary || !summary) {
      alert("Please enter your expected salary and add your OSAP loans first!");
      return;
    }

    const monthlyIncome = parseFloat(calculatorInputs.salary) / 12;
    
    try {
      const response = await axios.post("http://localhost:8080/api/osap-loans/calculate-repayment", {
        principal: summary.netDebt,
        interestRate: parseFloat(calculatorInputs.interestRate),
        monthlyIncome: monthlyIncome,
        paymentPercentage: parseFloat(calculatorInputs.paymentPercentage)
      });
      
      setRepaymentPlan(response.data);
      setShowCalculator(true);
    } catch (err) {
      console.error("Error calculating repayment:", err);
    }
  };

  const facultyAverage = selectedFaculty ? FACULTY_AVERAGES[selectedFaculty] : null;
  const comparison = summary && facultyAverage ? 
    ((summary.netDebt - facultyAverage.avgDebt) / facultyAverage.avgDebt) * 100 : 0;

  return (
    <div>
      <h1>🎓 OSAP Debt Tracker</h1>

      {/* Faculty Selection */}
      <div className="card" style={{ marginTop: "30px", backgroundColor: "#eff6ff", border: "2px solid #3b82f6" }}>
        <h2 style={{ marginBottom: "20px", color: "#1e40af" }}>Your Program</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Faculty
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px"
              }}
            >
              <option value="">Select your faculty</option>
              {Object.keys(FACULTY_AVERAGES).map(faculty => (
                <option key={faculty} value={faculty}>{faculty}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Major/Program
            </label>
            <input
              type="text"
              value={userMajor}
              onChange={(e) => setUserMajor(e.target.value)}
              placeholder="e.g., Computer Science"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px"
              }}
            />
          </div>
        </div>

        {facultyAverage && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#dbeafe",
            borderRadius: "8px"
          }}>
            <div style={{ fontSize: "14px", color: "#1e40af", marginBottom: "8px" }}>
              <strong>{facultyAverage.description}</strong>
            </div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "5px" }}>
              Average Student Debt: ${facultyAverage.avgDebt.toLocaleString()}
            </div>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              Based on {facultyAverage.programLength}-year program completion
            </div>

            {summary && summary.netDebt > 0 && (
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #93c5fd" }}>
                {comparison > 10 ? (
                  <p style={{ color: "#dc2626", fontWeight: "600", margin: 0 }}>
                    ⚠️ You owe {Math.abs(comparison).toFixed(0)}% MORE than the average {selectedFaculty} student
                  </p>
                ) : comparison < -10 ? (
                  <p style={{ color: "#10b981", fontWeight: "600", margin: 0 }}>
                    ✅ You owe {Math.abs(comparison).toFixed(0)}% LESS than the average {selectedFaculty} student
                  </p>
                ) : (
                  <p style={{ color: "#6b7280", fontWeight: "600", margin: 0 }}>
                    ℹ️ You're close to the average for {selectedFaculty}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Debt Summary */}
      {summary && summary.netDebt > 0 && (
        <div className="card" style={{ marginTop: "30px", backgroundColor: "#fef2f2", border: "2px solid #dc2626" }}>
          <h2 style={{ marginBottom: "20px", color: "#991b1b" }}>💰 Your Current Debt</h2>

          <div style={{
            padding: "20px",
            backgroundColor: "#fee2e2",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "2px solid #dc2626"
          }}>
            <div style={{ fontSize: "14px", color: "#7f1d1d", marginBottom: "8px" }}>
              Total OSAP Debt
            </div>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#991b1b", marginBottom: "8px" }}>
              ${summary.netDebt.toLocaleString()}
            </div>
            <div style={{ fontSize: "15px", color: "#7f1d1d" }}>
              Total received: ${summary.totalReceived.toLocaleString()} 
              <span style={{ marginLeft: "10px" }}>
                (${summary.totalGrants.toLocaleString()} grants + ${summary.totalLoans.toLocaleString()} loans)
              </span>
            </div>
          </div>

          {/* Quick Calculator Section */}
          <div style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #fecaca"
          }}>
            <h3 style={{ fontSize: "18px", color: "#991b1b", marginBottom: "15px" }}>
              📊 Repayment Calculator
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                  Expected Salary ($/year)
                </label>
                <input
                  type="number"
                  value={calculatorInputs.salary}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, salary: e.target.value})}
                  placeholder="e.g., 55000"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                  % of Income to Pay (%)
                </label>
                <input
                  type="number"
                  value={calculatorInputs.paymentPercentage}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, paymentPercentage: e.target.value})}
                  min="1"
                  max="50"
                  step="0.5"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={calculatorInputs.interestRate}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, interestRate: e.target.value})}
                  step="0.1"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                  Current OSAP: ~9.2% (Prime + 2.5%)
                </div>
              </div>
            </div>

            <button
              onClick={calculateRepayment}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Calculate My Repayment Plan
            </button>
          </div>
        </div>
      )}

      {/* Repayment Results */}
      {repaymentPlan && !repaymentPlan.error && (
        <div className="card" style={{ marginTop: "30px", backgroundColor: "#fef3c7", border: "2px solid #f59e0b" }}>
          <h2 style={{ marginBottom: "20px", color: "#92400e" }}>📈 Your Repayment Plan</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "25px" }}>
            <div style={{ padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "2px solid #fbbf24" }}>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "5px" }}>Monthly Payment</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#92400e" }}>
                ${repaymentPlan.monthlyPayment.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: "#78350f", marginTop: "5px" }}>
                {calculatorInputs.paymentPercentage}% of monthly income
              </div>
            </div>

            <div style={{ padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "2px solid #fbbf24" }}>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "5px" }}>Time to Pay Off</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#92400e" }}>
                {repaymentPlan.totalYears} years
              </div>
              <div style={{ fontSize: "12px", color: "#78350f", marginTop: "5px" }}>
                {repaymentPlan.totalMonths} months total
              </div>
            </div>

            <div style={{ padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "2px solid #fbbf24" }}>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "5px" }}>Total Interest Paid</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#dc2626" }}>
                ${repaymentPlan.totalInterest.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: "#78350f", marginTop: "5px" }}>
                Total: ${repaymentPlan.totalPaid.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Year-by-Year Breakdown */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", color: "#92400e", marginBottom: "12px" }}>
              Year-by-Year Breakdown
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {repaymentPlan.paymentSchedule.map((year) => (
                <div key={year.year} style={{
                  padding: "12px 15px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  display: "grid",
                  gridTemplateColumns: "100px 1fr 1fr 1fr",
                  gap: "15px",
                  alignItems: "center",
                  fontSize: "14px"
                }}>
                  <div style={{ fontWeight: "600", color: "#92400e" }}>Year {year.year}</div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Remaining: </span>
                    <strong>${year.remainingBalance.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Paid: </span>
                    <strong>${year.totalPaid.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Interest: </span>
                    <strong style={{ color: "#dc2626" }}>${year.totalInterest.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reality Check */}
          <div style={{
            padding: "15px",
            backgroundColor: "#fee2e2",
            borderRadius: "8px",
            borderLeft: "4px solid #dc2626"
          }}>
            <h3 style={{ fontSize: "16px", color: "#991b1b", marginBottom: "10px" }}>⚠️ Reality Check</h3>
            <ul style={{ marginLeft: "18px", lineHeight: "1.8", color: "#7f1d1d", fontSize: "14px" }}>
              <li>
                You're borrowing <strong>${summary.netDebt.toLocaleString()}</strong> now, 
                but will pay <strong>${repaymentPlan.totalPaid.toLocaleString()}</strong> total
              </li>
              <li>
                That's an extra <strong>${repaymentPlan.totalInterest.toLocaleString()}</strong> in interest 
                (${(repaymentPlan.totalInterest / repaymentPlan.totalMonths).toFixed(2)}/month)
              </li>
              <li>
                It will take you <strong>{repaymentPlan.totalYears} years</strong> to pay off this debt
              </li>
              <li>
                <strong>Every dollar you waste on delivery food or coffee is borrowed money that costs you double to pay back</strong>
              </li>
            </ul>
          </div>
        </div>
      )}

      {repaymentPlan && repaymentPlan.error && (
        <div className="card" style={{ marginTop: "30px", backgroundColor: "#fee2e2", border: "2px solid #dc2626" }}>
          <div style={{ padding: "20px" }}>
            <h3 style={{ color: "#991b1b", marginBottom: "10px" }}>🚨 Warning!</h3>
            <p style={{ color: "#7f1d1d", fontSize: "15px", marginBottom: "10px" }}>
              {repaymentPlan.message}
            </p>
            <p style={{ color: "#991b1b", fontWeight: "600" }}>
              Minimum payment needed: ${repaymentPlan.minimumPayment.toLocaleString()}/month
            </p>
          </div>
        </div>
      )}

      {/* Add OSAP Record */}
      <div className="card" style={{ marginTop: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0 }}>OSAP Records</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            {showAddForm ? "Cancel" : "+ Add OSAP Record"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} style={{
            padding: "20px",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            marginBottom: "20px"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                  Term
                </label>
                <select
                  value={formData.term}
                  onChange={(e) => setFormData({...formData, term: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Winter 2025">Winter 2025</option>
                  <option value="Summer 2025">Summer 2025</option>
                  <option value="Fall 2025">Fall 2025</option>
                  <option value="Winter 2026">Winter 2026</option>
                  <option value="Summer 2026">Summer 2026</option>
                  <option value="Fall 2026">Fall 2026</option>
                  <option value="Winter 2027">Winter 2027</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                  Date Received
                </label>
                <input
                  type="date"
                  value={formData.dateReceived}
                  onChange={(e) => setFormData({...formData, dateReceived: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                  Grant Amount (Free Money 🎉)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.grantAmount}
                  onChange={(e) => setFormData({...formData, grantAmount: e.target.value})}
                  placeholder="0.00"
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                  Loan Amount (You Owe This 😰)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                  placeholder="0.00"
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                Notes (Optional)
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="e.g., First year funding, includes books allowance"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Add OSAP Record
            </button>
          </form>
        )}

        {/* Loan History */}
        {loans.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "15px" }}>Your OSAP History</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {loans.map((loan) => (
                <div key={loan.id} style={{
                  padding: "15px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {loan.term}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      Received: {new Date(loan.dateReceived).toLocaleDateString()}
                      {loan.notes && ` • ${loan.notes}`}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: "right", marginRight: "20px" }}>
                    <div style={{ fontSize: "13px", color: "#10b981", marginBottom: "2px" }}>
                      Grant: ${loan.grantAmount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#dc2626" }}>
                      Loan: ${loan.loanAmount.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(loan.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {loans.length === 0 && !showAddForm && (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            <p>No OSAP records yet.</p>
            <p style={{ fontSize: "14px" }}>Click "+ Add OSAP Record" to start tracking your student debt!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OSAPDebtTracker;