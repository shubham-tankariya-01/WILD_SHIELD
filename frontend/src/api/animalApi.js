import API from "./axiosInstance";

export const getAnimals = (params) => API.get("/animals", { params });
export const getAnimalById = (id) => API.get(`/animals/${id}`);
export const createAnimal = (data) => API.post("/animals", data);
export const updateAnimal = (id, data) => API.put(`/animals/${id}`, data);
export const deleteAnimal = (id) => API.delete(`/animals/${id}`);
