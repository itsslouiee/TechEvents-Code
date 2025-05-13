import axios from 'axios';

// Create the api instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create a separate instance for public endpoints that don't need auth
const publicApi = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: false, // No credentials needed for public endpoints
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the token for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || 
                 localStorage.getItem('token') || 
                 localStorage.getItem('jwt');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Public organizer profile functions
const getPublicOrganizerProfile = async (organizerId) => {
  try {
    console.log(`Fetching public organizer profile for ID: ${organizerId}`);
    const response = await publicApi.get(`/public/organizer/${organizerId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getPublicOrganizerProfile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

const getPublicOrganizerEvents = async (organizerId) => {
  try {
    console.log(`Fetching public events for organizer ID: ${organizerId}`);
    // Note: Adjust this endpoint based on your actual public events endpoint
    const response = await publicApi.get(`/public/organizer/${organizerId}/events`);
    return response.data;
  } catch (error) {
    console.error('Error in getPublicOrganizerEvents:', {
      message: error.message,
      status: error.response?.status,
    });
    // Return empty array instead of throwing to prevent UI breakage
    return { success: true, data: [] };
  }
};

// Existing authenticated service functions
const getOrganizerProfile = async () => {
  try {
    console.log('Fetching organizer profile...');
    const response = await api.get('/organizer/profile');
    return response.data;
  } catch (error) {
    console.error('Error in getOrganizerProfile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

const updateOrganizerProfile = async (profileData) => {
  try {
    // Determine which endpoint to use based on the data being updated
    let endpoint = '/organizer/profile/intro';
    
    // If the data contains 'about' field, use the about endpoint
    if (profileData.about !== undefined) {
      endpoint = '/organizer/profile/about';
    }
    
    // If the data contains a file (logo), use the logo endpoint
    if (profileData.logo instanceof File) {
      endpoint = '/organizer/profile/logo';
      const formData = new FormData();
      formData.append('logo', profileData.logo);
      const response = await api.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    
    // For regular profile updates (intro or about)
    const response = await api.put(endpoint, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating organizer profile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

const updateOrganizerLogo = async (formData) => {
  try {
    const response = await api.put(
      '/organizer/profile/logo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating organizer logo:', error);
    throw error;
  }
};

const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put(
      '/organizer/changepassword',
      { currentPassword, newPassword }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    // Make API call to logout endpoint first (while we still have the token)
    const response = await api.post('/organizer/logout');
    
    // Clear the token from localStorage after successful API call
    localStorage.removeItem('authToken');
    
    return response.data;
  } catch (error) {
    // Even if the API call fails, we still want to clear the token
    localStorage.removeItem('authToken');
    console.error('Error during logout:', error);
    throw error;
  }
};

const getOrganizerEvents = async () => {
  try {
    const response = await api.get('/organizer/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    throw error;
  }
};

// Single export block
export {
  getOrganizerProfile,
  getPublicOrganizerProfile,
  getPublicOrganizerEvents,
  updateOrganizerProfile,
  updateOrganizerLogo,
  changePassword,
  logout,
  getOrganizerEvents
};