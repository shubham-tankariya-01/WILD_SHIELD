import API from "./axiosInstance";

export const createDonation = (data) => API.post("/donations", data);
export const getMyDonations = () => API.get("/donations/mine");
export const getAllDonations = () => API.get("/donations");
