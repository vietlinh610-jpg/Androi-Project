import axios from 'axios';
const API_URL = '/api/tamtru';

export const getListTamTru = () => axios.get(`${API_URL}`);
export const createTamTru = (data) => axios.post(`${API_URL}`, data);
export const updateTamTru = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTamTru = (id) => axios.delete(`${API_URL}/${id}`);