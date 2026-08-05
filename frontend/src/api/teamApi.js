import API from "./axiosInstance";

export const getTeams = () => API.get("/teams");
export const createTeam = (data) => API.post("/teams", data);
export const updateTeam = (id, data) => API.put(`/teams/${id}`, data);
export const deleteTeam = (id) => API.delete(`/teams/${id}`);
