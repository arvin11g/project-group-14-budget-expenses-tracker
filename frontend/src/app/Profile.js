import { useEffect, useState } from "react";
import budgetAPI from "../api/BudgetAPI";
import {
  CURRENCY_OPTIONS,
  getHomeCurrency,
  setHomeCurrency,
  formatCurrency,
  convertFromCad,
} from "../utils/currency";

function Profile() {
  const defaultProfile = {
    name: "York University Student",
    program: "Software Engineering",
    school: "York University",
    academicYear: "2025–2026",
    currentTerm: "Winter 2026",
    homeCurrency: getHomeCurrency(),
  };

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("studentBudgetProfile");
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const [summary, setSummary] = useState({
    budget: 0,
    totalExpenses: 0,
    remaining: 0,
    overBudget: false,
  });

  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    loadSummary(profile.currentTerm);
  }, [profile.currentTerm]);

  useEffect(() => {
    localStorage.setItem("studentBudgetProfile", JSON.stringify(profile));
  }, [profile]);

  const loadSummary = async (term) => {
    try {
      setLoadingSummary(true);
      const res = await budgetAPI.getTermSummary(term);
      setSummary(
        res.data || {
          budget: 0,
          totalExpenses: 0,
          remaining: 0,
          overBudget: false,
        }
      );
    } catch (err) {
      console.error("Failed to load profile summary:", err);
      setSummary({
        budget: 0,
        totalExpenses: 0,
        remaining: 0,
        overBudget: false,
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setProfile(formData);
    setFormData(formData);
    setHomeCurrency(formData.homeCurrency);
    localStorage.setItem("studentBudgetProfile", JSON.stringify(formData));
    setEditing(false);
    loadSummary(formData.currentTerm);
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  const convertedBudget = convertFromCad(summary.budget, profile.homeCurrency);
  const convertedSpent = convertFromCad(summary.totalExpenses, profile.homeCurrency);
  const convertedRemaining = convertFromCad(summary.remaining, profile.homeCurrency);
  const exchangeRate = convertFromCad(1, profile.homeCurrency);

  // Financial health calculation
  let healthScore = 0;
  let healthStatus = "No Budget";

  if (summary.budget > 0) {
    const ratio = summary.remaining / summary.budget;
    healthScore = Math.max(0, Math.min(100, Math.round(ratio * 100)));

    if (ratio > 0.4) healthStatus = "Excellent";
    else if (ratio > 0.2) healthStatus = "Good";
    else if (ratio > 0) healthStatus = "Warning";
    else healthStatus = "Over Budget";
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
        <h1 style={{ margin: 0 }}>Profile</h1>

        {!editing ? (
          <button onClick={() => setEditing(true)} style={buttonStyle}>
            Edit Profile
          </button>
        ) : null}
      </div>

      <div
        className="card"
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          maxWidth: "900px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Student Info</h2>

        {!editing ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              rowGap: "14px",
            }}
          >
            <div style={labelStyle}>Name</div>
            <div style={valueStyle}>{profile.name}</div>

            <div style={labelStyle}>Program</div>
            <div style={valueStyle}>{profile.program}</div>

            <div style={labelStyle}>School</div>
            <div style={valueStyle}>{profile.school}</div>

            <div style={labelStyle}>Academic Year</div>
            <div style={valueStyle}>{profile.academicYear}</div>

            <div style={labelStyle}>Current Term</div>
            <div style={valueStyle}>{profile.currentTerm}</div>

            <div style={labelStyle}>Home Currency</div>
            <div style={valueStyle}>{profile.homeCurrency}</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Program</label>
              <input
                name="program"
                value={formData.program}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>School</label>
              <input
                name="school"
                value={formData.school}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Academic Year</label>
              <input
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Current Term</label>
              <select
                name="currentTerm"
                value={formData.currentTerm}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Winter 2026">Winter 2026</option>
                <option value="Summer 2026">Summer 2026</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Winter 2027">Winter 2027</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Home Currency</label>
              <select
                name="homeCurrency"
                value={formData.homeCurrency}
                onChange={handleChange}
                style={inputStyle}
              >
                {CURRENCY_OPTIONS.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.label} ({currency.code})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={handleSave} style={buttonStyle}>
                Save Changes
              </button>

              <button
                onClick={handleCancel}
                style={{
                  ...buttonStyle,
                  background: "#e5e7eb",
                  color: "#111827",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="card"
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          maxWidth: "900px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Home Currency View</h2>

        {loadingSummary ? (
          <p>Loading financial summary...</p>
        ) : (
          <>
            <div
              style={{
                background: "#f0f9ff",
                borderRadius: "12px",
                padding: "16px 18px",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontWeight: "700", marginBottom: "6px" }}>
                Financial Health Score
              </div>

              <div style={{ fontSize: "20px", fontWeight: "700", color: "#1d4ed8" }}>
                {healthScore} / 100
              </div>

              <div style={{ color: "#374151", fontSize: "14px" }}>
                Status: {healthStatus}
              </div>
            </div>
            <p style={{ color: "#6b7280", marginTop: 0, marginBottom: "18px" }}>
              Your tracker uses CAD, but these values show what your term finances look like in your home currency for easier budgeting.
            </p>
            <p style={{ color: "#4b5563", marginBottom: "18px", fontSize: "14px" }}>
              Exchange Rate: 1 CAD ≈ {formatCurrency(exchangeRate, profile.homeCurrency)}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 1fr",
                rowGap: "14px",
                columnGap: "18px",
              }}
            >
              <div style={labelStyle}>Budget</div>
              <div style={valueStyle}>{formatCurrency(summary.budget, "CAD")}</div>
              <div style={valueStyle}>{formatCurrency(convertedBudget, profile.homeCurrency)}</div>

              <div style={labelStyle}>Spent</div>
              <div style={valueStyle}>{formatCurrency(summary.totalExpenses, "CAD")}</div>
              <div style={valueStyle}>{formatCurrency(convertedSpent, profile.homeCurrency)}</div>

              <div style={labelStyle}>Remaining</div>
              <div style={valueStyle}>{formatCurrency(summary.remaining, "CAD")}</div>
              <div style={valueStyle}>{formatCurrency(convertedRemaining, profile.homeCurrency)}</div>
            </div>

            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                background: "#f9fafb",
                borderRadius: "10px",
                color: "#374151",
              }}
            >
              <strong>Current Term:</strong> {profile.currentTerm}
              <br />
              <strong>Home Currency:</strong> {profile.homeCurrency}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontWeight: "700",
  color: "#374151",
  marginBottom: "6px",
};

const valueStyle = {
  color: "#111827",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

export default Profile;