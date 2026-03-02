import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Budgets from "./Budgets";
import Expenses from "./Expenses";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;