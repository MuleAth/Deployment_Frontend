// API Configuration
export const API_BASE_URL = "https://sportalon-backend.onrender.com";

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  
  // User endpoints
  GET_EVENTS: "/api/user/getevent",
  GET_EQUIPMENT: "/api/user/equipment",
  UPDATE_PROFILE: "/api/user/profile/update",
  
  // Admin endpoints
  ADMIN_EVENTS: "/api/admin/events",
  ADMIN_EQUIPMENT: "/api/admin/equipment",
  ADMIN_USERS: "/api/admin/users",
  
  // Other endpoints
  UPLOAD_IMAGE: "/api/upload/image",
  FEEDBACK: "/api/feedback",
  NOTIFICATIONS: "/api/notifications",
  RECOMMENDATIONS: "/api/recommendations"
};