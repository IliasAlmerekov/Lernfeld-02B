// API functions for admin-related operations

/**
 * Fetch all admin users for ticket assignment
 * @returns {Promise<Array>} List of admin users
 */
export const fetchAdmins = async () => {
  try {
    // Get token from localStorage or sessionStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch("/api/auth/admins", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }
};

/**
 * Assign a ticket to an admin
 * @param {string} ticketId - ID of the ticket to assign
 * @param {string} adminId - ID of the admin to assign the ticket to
 * @returns {Promise<Object>} Updated ticket object
 */
export const assignTicketToAdmin = async (ticketId, adminId) => {
  try {
    // Get token from localStorage or sessionStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch(`/api/tickets/${ticketId}/assign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ adminId }),
    });

    if (!response.ok) {
      throw new Error("Failed to assign ticket");
    }

    return await response.json();
  } catch (error) {
    console.error("Error assigning ticket:", error);
    throw error;
  }
};
