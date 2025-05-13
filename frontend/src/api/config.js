const API_BASE_URL = "/api";

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/auth
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    ...apiConfig.headers,
    Authorization: token ? `Bearer ${token}` : "",
  };
};
