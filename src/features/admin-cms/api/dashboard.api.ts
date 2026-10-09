import { apiClient } from '@/shared/api';

/** Backend: GET /api/v1/admin/dashboard */
export type AdminDashboardDto = {
  publishedProjects: number;
  publishedBlogs: number;
  newContactResponses: number;
  pendingTestimonials: number;
};

export async function fetchAdminDashboard(): Promise<AdminDashboardDto> {
  return apiClient.get<AdminDashboardDto>('/admin/dashboard');
}

export const getDashboardSummary = fetchAdminDashboard;

export const dashboardApi = {
  fetch: fetchAdminDashboard,
  getSummary: fetchAdminDashboard,
};
