import "./App.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Tickets from "./components/TicketCard";
import CreateTicket from "./components/CreateTicket";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
      </Routes>
    </Router>
  );
}

export default App;
