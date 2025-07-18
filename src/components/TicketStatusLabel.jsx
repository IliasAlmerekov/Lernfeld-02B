import React from "react";

const TicketStatusLabel = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "open":
        return {
          backgroundColor: "#EBF9F5",
          color: "#45C49C",
          label: "OPEN",
        };
      case "in-progress":
        return {
          backgroundColor: "#EBF9F5",
          color: "#45C49C",
          label: "IN PROGRESS",
        };
      case "resolved":
        return {
          backgroundColor: "#EBF9F5",
          color: "#45C49C",
          label: "RESOLVED",
        };
      default:
        return {
          backgroundColor: "#EBF9F5",
          color: "#45C49C",
          label: status.toUpperCase(),
        };
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <div
      className="status-label"
      style={{
        backgroundColor: statusStyle.backgroundColor,
        color: statusStyle.color,
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "0.7rem",
        fontWeight: "600",
        textTransform: "uppercase",
        display: "inline-block",
        letterSpacing: "0.5px",
      }}
    >
      {statusStyle.label}
    </div>
  );
};

export default TicketStatusLabel;
