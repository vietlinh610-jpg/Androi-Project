import axios from 'axios';
const API_URL = '/api/nhankhau';

export const getCanHoCount = () => axios.get(`${API_URL}/canho`);
export const getNhanKhauByCanHo = (maCanHo) => axios.get(`${API_URL}/canho/${maCanHo}`);
export const createNhanKhau = (data) => axios.post(`${API_URL}`, data);
export const updateNhanKhau = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteNhanKhau = (id) => axios.delete(`${API_URL}/${id}`);
export const findNhanKhau = (maNhanKhau) => axios.get(`${API_URL}/find/${maNhanKhau}`);
export const getAllNhanKhau = () => axios.get(`${API_URL}`);