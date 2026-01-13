import axios from 'axios';
const API_URL = '/api/tamvang';

export const getListTamVang = () => axios.get(`${API_URL}`);
export const createTamVang = (data) => axios.post(`${API_URL}`, data);
export const updateTamVang = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTamVang = (id) => axios.delete(`${API_URL}/${id}`);