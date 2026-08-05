import API from "./axiosInstance";

export const getStats = () => API.get("/admin/stats");
export const getUsers = () => API.get("/admin/users");
export const changeUserRole = (id, role) => API.patch(`/admin/users/${id}/role`, { role });
