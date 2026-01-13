import axios from 'axios';

const API_URL = '/api/khoan-thu';

export const layKhoanThu = () => axios.get(`${API_URL}`);
export const taoKhoanThu = (data) => axios.post(`${API_URL}`, data);