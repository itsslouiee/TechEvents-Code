import { apiService } from "./apiService";

export const adminService = {
  // Auth
  login: (credentials) => apiService.post("/admin/login", credentials),
  logout: () => apiService.post("/admin/logout"),
  changePassword: (data) => apiService.put("/admin/changepassword", data),

  // Organizers
  getPendingRegistrations: () => apiService.get("/admin/registrations/pending"),
  getApprovedOrganizers: () => apiService.get("/admin/organizers/approved"),
  approveRegistration: (organizerId) =>
    apiService.put(`/admin/approve-registration/${organizerId}`),
  rejectRegistration: (organizerId) =>
    apiService.put(`/admin/reject-registration/${organizerId}`),
  deleteOrganizer: (organizerId) =>
    apiService.delete(`/admin/organizer/${organizerId}`),

  // Events
  getPendingEvents: () => apiService.get("/admin/events/pending"),
  getApprovedEvents: () => apiService.get("/admin/events/approved"),
  approveEvent: (eventId) => apiService.post(`/admin/approve-event/${eventId}`),
  rejectEvent: (eventId) => apiService.post(`/admin/reject-event/${eventId}`),
  deleteEvent: (eventId) => apiService.delete(`/admin/delete-event/${eventId}`),
  searchEvents: (query) =>
    apiService.get(`/admin/events/search?query=${encodeURIComponent(query)}`),

  // Admins
  getAdmins: () => apiService.get("/admin/admins"),
};
