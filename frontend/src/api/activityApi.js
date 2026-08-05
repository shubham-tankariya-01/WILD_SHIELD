import API from "./axiosInstance";

export const getActivities = () => API.get("/activities");
export const createActivity = (data) => API.post("/activities", data);
export const joinActivity = (id) => API.post(`/activities/${id}/join`);
export const leaveActivity = (id) => API.post(`/activities/${id}/leave`);
export const updateActivity = (id, data) => API.put(`/activities/${id}`, data);
export const deleteActivity = (id) => API.delete(`/activities/${id}`);
