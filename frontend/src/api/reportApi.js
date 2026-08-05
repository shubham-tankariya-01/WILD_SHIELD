import API from "./axiosInstance";

export const createReport = (formData) =>
  API.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getAllReports = (params) => API.get("/reports", { params });
export const getMyReports = () => API.get("/reports/mine");
export const getReportById = (id) => API.get(`/reports/${id}`);
export const updateReportStatus = (id, status) => API.patch(`/reports/${id}/status`, { status });
export const assignTeam = (id, team_id) => API.patch(`/reports/${id}/assign`, { team_id });
export const deleteReport = (id) => API.delete(`/reports/${id}`);
