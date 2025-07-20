import "./App.css";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tickets from "./components/TicketCard";
import CreateTicket from "./components/CreateTicket";
import AllTickets from "./components/AllTickets";
import Analytics from "./components/Analytics";
import TicketDetailPage from "./pages/TicketDetailPage";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/all-tickets" element={<AllTickets />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
