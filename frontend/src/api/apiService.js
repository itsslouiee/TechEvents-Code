import { apiConfig, getAuthHeaders } from "./config";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    console.error("API Error:", error);
    throw new Error(error.message || "Something went wrong");
  }
  const data = await response.json();
  console.log("API Response:", data);
  return data;
};

export const apiService = {
  async get(endpoint) {
    try {
      console.log("Making GET request to:", `${apiConfig.baseURL}${endpoint}`);
      const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
     
      return handleResponse(response);
    } catch (error) {
      console.error("GET request failed:", error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      console.log("Making POST request to:", `${apiConfig.baseURL}${endpoint}`);
      const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      console.log("Making PUT request to:", `${apiConfig.baseURL}${endpoint}`);
      const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      console.log(
        "Making DELETE request to:",
        `${apiConfig.baseURL}${endpoint}`
      );
      const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      return handleResponse(response);
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  },
};
