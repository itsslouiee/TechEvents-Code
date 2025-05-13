import axios from 'axios';
import { API_BASE_URL } from './config';

export const getLatestEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/main/latest-events`);
    if (response.data.success) {
      return response.data.events;
    } else {
      throw new Error(response.data.message || 'Failed to fetch latest events');
    }
  } catch (error) {
    console.error('Error fetching latest events:', error);
    throw error;
  }
};

export const getTrendingEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/main/trending-events`);
    if (response.data.success) {
      return response.data.trendingEvents;
    } else {
      throw new Error(response.data.message || 'Failed to fetch trending events');
    }
  } catch (error) {
    console.error('Error fetching trending events:', error);
    throw error;
  }
};

export const getAllEvents = async (sortBy = 'views') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/main/events/all`, {
      params: { sortBy }
    });
    console.log('API Response:', response.data);
    if (response.data.success) {
      return response.data.events;
    } else {
      throw new Error(response.data.message || 'Failed to fetch events');
    }
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
}; 