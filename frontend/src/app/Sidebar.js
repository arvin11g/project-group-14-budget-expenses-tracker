import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">BudgetTracker</h2>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/budgets">Budgets</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/charts">Charts</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
}

export default Sidebar;