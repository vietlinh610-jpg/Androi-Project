import axios from 'axios';

const API_URL = '/api/hokhau'; // Đổi port nếu cần

export const getHoKhauList = () => axios.get(API_URL);
export const createHoKhau = (data) => axios.post(`${API_URL}`, data);
export const updateHoKhau = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteHoKhau = (id) => axios.delete(`${API_URL}/${id}`);
export const getThongTinChuHo = (id) => axios.get(`${API_URL}/thongtin-chuho/${id}`);