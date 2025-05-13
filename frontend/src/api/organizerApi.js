import axios from 'axios';
import { API_BASE_URL } from './config';

export const getTrendingOrganizers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/main/trending-organizers`);
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch trending organizers');
    }
  } catch (error) {
    console.error('Error fetching trending organizers:', error);
    throw error;
  }
};

export const getAllOrganizers = async (sortBy = 'name') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/main/organizers/all?sortBy=${sortBy}`);
    if (response.data.success) {
      return response.data.organizers;
    } else {
      throw new Error(response.data.message || 'Failed to fetch organizers');
    }
  } catch (error) {
    console.error('Error fetching all organizers:', error);
    throw error;
  }
}; 