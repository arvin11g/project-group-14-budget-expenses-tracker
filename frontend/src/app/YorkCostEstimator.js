import { useMemo, useState } from "react";
import yorkTuitionData from "../data/yorkTuitionData";
import yorkResidenceData from "../data/yorkResidenceData";
import expenseAPI from "../api/ExpensesAPI";
import { formatCurrency, getHomeCurrency, convertFromCad } from "../utils/currency";

function YorkCostEstimator() {
  const sessionOptions = yorkTuitionData.sessions || [];
  const defaultSession = sessionOptions[0];

  const [selectedSession, setSelectedSession] = useState(
    defaultSession?.session || ""
  );
  const [selectedLevel, setSelectedLevel] = useState(
    defaultSession?.educationLevels?.[0]?.level || ""
  );
  const [selectedFaculty, setSelectedFaculty] = useState(
    defaultSession?.educationLevels?.[0]?.faculties?.[0]?.faculty || ""
  );
  const [selectedProgram, setSelectedProgram] = useState(
    defaultSession?.educationLevels?.[0]?.faculties?.[0]?.programs?.[0]?.program || ""
  );
  const [studentType, setStudentType] = useState("domesticOntario");
  const [credits, setCredits] = useState(30);
  const [selectedResidence, setSelectedResidence] = useState(
    yorkResidenceData.residences?.[0]?.name || ""
  );
  const [selectedRoomType, setSelectedRoomType] = useState(
    yorkResidenceData.residences?.[0]?.options?.[0]?.roomType || ""
  );
  const [selectedDiningPlan, setSelectedDiningPlan] = useState("Entry");

  const homeCurrency = getHomeCurrency();

  const currentSession = useMemo(() => {
    return sessionOptions.find((s) => s.session === selectedSession);
  }, [selectedSession, sessionOptions]);

  const levelOptions = currentSession?.educationLevels || [];

  const currentLevel = useMemo(() => {
    return levelOptions.find((l) => l.level === selectedLevel);
  }, [levelOptions, selectedLevel]);

  const facultyOptions = currentLevel?.faculties || [];

  const currentFaculty = useMemo(() => {
    return facultyOptions.find((f) => f.faculty === selectedFaculty);
  }, [facultyOptions, selectedFaculty]);

  const programOptions = currentFaculty?.programs || [];

  const currentProgram = useMemo(() => {
    return programOptions.find((p) => p.program === selectedProgram);
  }, [programOptions, selectedProgram]);

  const residenceOptions = yorkResidenceData.residences || [];

  const currentResidence = useMemo(() => {
    return residenceOptions.find((r) => r.name === selectedResidence);
  }, [residenceOptions, selectedResidence]);

  const roomOptions = currentResidence?.options || [];

  const currentRoom = useMemo(() => {
    return roomOptions.find((r) => r.roomType === selectedRoomType);
  }, [roomOptions, selectedRoomType]);

  const diningPlanOptions = yorkResidenceData.diningPlans || [];

  const currentDiningPlan = useMemo(() => {
    return diningPlanOptions.find((plan) => plan.name === selectedDiningPlan);
  }, [diningPlanOptions, selectedDiningPlan]);

  const isDiningRequired = currentRoom?.diningRequired === true;

  const perCreditFees = currentProgram?.feesPerCredit?.[studentType] || {
    tuition: 0,
    supplementary: 0,
    total: 0,
  };

  const tuitionTotal = perCreditFees.total * Number(credits || 0);
  const booksLow = currentProgram?.estimatedBooksAndSupplies?.min || 0;
  const booksHigh = currentProgram?.estimatedBooksAndSupplies?.max || 0;

  const residenceRate = currentRoom?.rate || 0;
  const applicationFee = yorkResidenceData.additionalFees?.applicationFee || 0;
  const roomDeposit = yorkResidenceData.additionalFees?.roomDeposit || 0;
  const residenceAdminFee =
    yorkResidenceData.additionalFees?.residenceLifeActivityAndAdministrationFee || 0;

  const diningCost = currentDiningPlan?.cost || 0;

  const housingTotal = residenceRate + diningCost + applicationFee + residenceAdminFee;
  const upfrontTotal = applicationFee + roomDeposit + residenceAdminFee;
  const estimatedTotalLow = tuitionTotal + booksLow + housingTotal;
  const estimatedTotalHigh = tuitionTotal + booksHigh + housingTotal;

  const handleSessionChange = (value) => {
    const newSession = sessionOptions.find((s) => s.session === value);
    const newLevel = newSession?.educationLevels?.[0];
    const newFaculty = newLevel?.faculties?.[0];
    const newProgram = newFaculty?.programs?.[0];

    setSelectedSession(value);
    setSelectedLevel(newLevel?.level || "");
    setSelectedFaculty(newFaculty?.faculty || "");
    setSelectedProgram(newProgram?.program || "");
  };

  const handleLevelChange = (value) => {
    const newLevel = levelOptions.find((l) => l.level === value);
    const newFaculty = newLevel?.faculties?.[0];
    const newProgram = newFaculty?.programs?.[0];

    setSelectedLevel(value);
    setSelectedFaculty(newFaculty?.faculty || "");
    setSelectedProgram(newProgram?.program || "");
  };

  const handleFacultyChange = (value) => {
    const newFaculty = facultyOptions.find((f) => f.faculty === value);
    const newProgram = newFaculty?.programs?.[0];

    setSelectedFaculty(value);
    setSelectedProgram(newProgram?.program || "");
  };

  const handleResidenceChange = (value) => {
    const newResidence = residenceOptions.find((r) => r.name === value);
    const newRoom = newResidence?.options?.[0];

    setSelectedResidence(value);
    setSelectedRoomType(newRoom?.roomType || "");

    if (newRoom?.diningRequired) {
      setSelectedDiningPlan("Entry");
    } else {
      setSelectedDiningPlan("None");
    }
  };

  const handleRoomTypeChange = (value) => {
    const newRoom = roomOptions.find((room) => room.roomType === value);

    setSelectedRoomType(value);

    if (newRoom?.diningRequired) {
      if (selectedDiningPlan === "None") {
        setSelectedDiningPlan("Entry");
      }
    } else {
      if (!selectedDiningPlan) {
        setSelectedDiningPlan("None");
      }
    }
  };
  async function handleAddToBudget() {
    try {
      await expenseAPI.createExpense({
        category: "Tuition",
        description: `${selectedProgram} Tuition Estimate`,
        amount: tuitionTotal,
        academicTerm: "Winter 2026",
        date: new Date().toISOString().split("T")[0],
        type: "PLANNED"
      });

      await expenseAPI.createExpense({
        category: "Housing",
        description: `${selectedResidence} Housing Estimate`,
        amount: housingTotal,
        academicTerm: "Winter 2026",
        date: new Date().toISOString().split("T")[0],
        type: "PLANNED"
      });

      alert("Estimated costs added to budget successfully!");
    } catch (error) {
      console.error("Error adding estimated costs to budget:", error);
      alert("Failed to add estimated costs to budget.");
    }
  }

  return (
    <div>
      <div style={topBarStyle}>
        <h1 style={{ margin: 0 }}>York Cost Estimator</h1>
      </div>

      <div className="card" style={cardStyle}>
        <h2 style={sectionTitleStyle}>Select Your York Details</h2>

        <div style={gridStyle}>
          <Field label="Session">
            <select
              value={selectedSession}
              onChange={(e) => handleSessionChange(e.target.value)}
              style={inputStyle}
            >
              {sessionOptions.map((session) => (
                <option key={session.session} value={session.session}>
                  {session.session}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Education Level">
            <select
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              style={inputStyle}
            >
              {levelOptions.map((level) => (
                <option key={level.level} value={level.level}>
                  {level.level}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Faculty">
            <select
              value={selectedFaculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
              style={inputStyle}
            >
              {facultyOptions.map((faculty) => (
                <option key={faculty.faculty} value={faculty.faculty}>
                  {faculty.faculty}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Program">
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={inputStyle}
            >
              {programOptions.map((program) => (
                <option key={program.program} value={program.program}>
                  {program.program}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Student Type">
            <select
              value={studentType}
              onChange={(e) => setStudentType(e.target.value)}
              style={inputStyle}
            >
              <option value="domesticOntario">Domestic (Ontario)</option>
              <option value="domesticOutOfProvince">Domestic (Out of Province)</option>
              <option value="international">International</option>
            </select>
          </Field>

          <Field label="Credits">
            <input
              type="number"
              min="1"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              style={inputStyle}
            />
          </Field>

          <Field label="Residence">
            <select
              value={selectedResidence}
              onChange={(e) => handleResidenceChange(e.target.value)}
              style={inputStyle}
            >
              {residenceOptions.map((residence) => (
                <option key={residence.name} value={residence.name}>
                  {residence.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Room Type">
            <select
              value={selectedRoomType}
              onChange={(e) => handleRoomTypeChange(e.target.value)}
              style={inputStyle}
            >
              {roomOptions.map((room) => (
                <option key={room.roomType} value={room.roomType}>
                  {room.roomType}
                </option>
              ))}
            </select>
          </Field>

          <Field label={isDiningRequired ? "Dining Plan (Required)" : "Dining Plan (Optional)"}>
            <select
              value={selectedDiningPlan}
              onChange={(e) => setSelectedDiningPlan(e.target.value)}
              style={inputStyle}
            >
              {diningPlanOptions
                .filter((plan) => (isDiningRequired ? plan.name !== "None" : true))
                .map((plan) => (
                  <option key={plan.name} value={plan.name}>
                    {plan.name}
                  </option>
                ))}
            </select>
          </Field>
        </div>
      </div>

      <div style={resultsWrapStyle}>
        <div className="card" style={resultCardStyle}>
          <h2 style={sectionTitleStyle}>Tuition Estimate</h2>
          <div style={infoRowStyle}>
            <span>Tuition per credit</span>
            <strong>{formatCurrency(perCreditFees.tuition)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Supplementary fees per credit</span>
            <strong>{formatCurrency(perCreditFees.supplementary)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Total per credit</span>
            <strong>{formatCurrency(perCreditFees.total)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Total for {credits} credits</span>
            <strong>{formatCurrency(tuitionTotal)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Books and supplies</span>
            <strong>
              {formatCurrency(booksLow)} - {formatCurrency(booksHigh)}
            </strong>
          </div>
        </div>

        <div className="card" style={resultCardStyle}>
          <h2 style={sectionTitleStyle}>Residence Estimate</h2>
          <div style={infoRowStyle}>
            <span>Residence rate</span>
            <strong>{formatCurrency(residenceRate)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Dining plan</span>
            <strong>{formatCurrency(diningCost)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Application fee</span>
            <strong>{formatCurrency(applicationFee)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Room deposit</span>
            <strong>{formatCurrency(roomDeposit)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Residence admin fee</span>
            <strong>{formatCurrency(residenceAdminFee)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Housing total (without deposit)</span>
            <strong>{formatCurrency(housingTotal)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span>Upfront required amount</span>
            <strong>{formatCurrency(upfrontTotal)}</strong>
          </div>
        </div>
      </div>

      <div className="card" style={cardStyle}>
        <h2 style={sectionTitleStyle}>Estimated Total Cost</h2>

        <div style={highlightBoxStyle}>
          <div style={totalTextStyle}>
            Low estimate: {formatCurrency(estimatedTotalLow)}
          </div>
          <div style={totalTextStyle}>
            High estimate: {formatCurrency(estimatedTotalHigh)}
          </div>
          <div style={{ marginTop: "10px", color: "#6b7280", fontSize: "14px" }}>
            In {homeCurrency}: {formatCurrency(convertFromCad(estimatedTotalLow, homeCurrency), homeCurrency)} -{" "}
            {formatCurrency(convertFromCad(estimatedTotalHigh, homeCurrency), homeCurrency)}
          </div>
        </div>

        <div style={noteBoxStyle}>
          <p style={{ marginTop: 0 }}>
            <strong>Tuition source year:</strong> {yorkTuitionData.sessions?.[0]?.session}
          </p>
          <p>
            <strong>Residence source year:</strong> {yorkResidenceData.year}
          </p>
          <p>
            <strong>Dining plan:</strong>{" "}
            {isDiningRequired
              ? "Required for this room type."
              : "Optional for this room type."}
          </p>
          <p>
            <strong>Note:</strong> The room deposit is shown separately because it is an upfront payment.
          </p>
          {currentProgram?.notes && (
            <p style={{ marginBottom: 0 }}>
              <strong>Program note:</strong> {currentProgram.notes}
            </p>
          )}
        </div>
      </div>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleAddToBudget}
          style={{
            padding: "12px 18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Add to Budget
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const cardStyle = {
  background: "white",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  marginBottom: "24px",
};

const resultCardStyle = {
  flex: 1,
  background: "white",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
  gap: "18px",
};

const resultsWrapStyle = {
  display: "flex",
  gap: "24px",
  marginBottom: "24px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: "18px",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb",
};

const highlightBoxStyle = {
  background: "#eff6ff",
  borderRadius: "14px",
  padding: "18px",
  marginBottom: "18px",
};

const totalTextStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1d4ed8",
};

const noteBoxStyle = {
  background: "#f9fafb",
  borderRadius: "12px",
  padding: "16px",
  color: "#374151",
  lineHeight: "1.6",
};

export default YorkCostEstimator;