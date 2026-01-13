import axios from 'axios';
const API_URL = '/api/taikhoan';

export const getTaiKhoan = () => axios.get(`${API_URL}`);
export const createTaiKhoan = (data) => axios.post(`${API_URL}`, data);
export const updateTaiKhoan = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTaiKhoan = (id) => axios.delete(`${API_URL}/${id}`);
