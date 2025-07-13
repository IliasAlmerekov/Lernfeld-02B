import "./App.css";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Tickets from "./components/Tickets";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
      </Routes>
    </Router>
  );
}

export default App;
