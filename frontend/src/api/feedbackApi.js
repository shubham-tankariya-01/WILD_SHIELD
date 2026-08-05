import API from "./axiosInstance";

export const createFeedback = (data) => API.post("/feedback", data);
export const getAllFeedback = () => API.get("/feedback");
export const getFeedbackByReport = (reportId) => API.get(`/feedback/report/${reportId}`);
