import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchUserProfile = async () => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const response = await apiClient.get("/api/v1/accounts/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    return null;
  }
};


export const fetchOutcomes = async () => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const response = await apiClient.get("/api/v1/expenses/daily/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching outcomes:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    return null;
  }
};

export const deleteOutcome = async (id) => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const response = await apiClient.delete(`/api/v1/expenses/outcomes/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, "delete outcome")
    return response;
  } catch (error) {
    console.error("Error fetching outcomes:", error);
    return null;
  }
};
export const UpdateOutcome = async (id, updatedData) => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const response = await apiClient.put(
      `/api/v1/expenses/outcome/edit/${id}/`,
      updatedData, // Include the payload here
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure the Content-Type is set correctly
        },
      }
    );
    console.log(response, "update outcome");
    return response;
  } catch (error) {
    console.error("Error updating outcome:", error);
    return null;
  }
};



export const fetchWeeklyOutcomes = async () => {
  const token = localStorage.getItem("access");
  if (!token) {
    console.error("No access token found.");
    return null;
  }
  try {
    const response = await apiClient.get("/api/v1/expenses/weekly/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly outcomes:", error);
    if (error.response?.status === 401) {
      console.log("Unauthorized access, removing tokens...");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    } else {
      console.error("An error occurred:", error.message || "Unknown error");
    }
    return null;
  }
};


export const fetchMonthlyOutcomes = async () => {
  const token = localStorage.getItem("access");
  if (!token) {
    console.error("No access token found.");
    return null;
  }
  try {
    const response = await apiClient.get("/api/v1/expenses/monthly/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly outcomes:", error);
    if (error.response?.status === 401) {
      console.log("Unauthorized access, removing tokens...");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    } else {
      console.error("An error occurred:", error.message || "Unknown error");
    }
    return null;
  }
};

export const fetchAllOutcomes = async () => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const response = await apiClient.get("/api/v1/expenses/outcome/all/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching outcomes:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    return null;
  }
};



export const fetchAllTodos = async () => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const response = await apiClient.get("/api/v1/todos/all-todos/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    return null;
  }
};
