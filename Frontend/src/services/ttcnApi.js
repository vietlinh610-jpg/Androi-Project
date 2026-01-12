import axios from 'axios';
const API_URL = '/api/ttcn';

// Lấy thông tin cá nhân
export const layTTCN = (id) => {
    return axios.get(`${API_URL}/layttcn/${id}`);
}
// Chỉnh sửa ttcn
export const chinhSuaTTCN = (id, data) => {
    return axios.put(`${API_URL}/chinhsua/${id}`, data);
}
// Lấy thông tin chung về nhân khẩu
export const layTTChung = (id) => {
    return axios.get(`${API_URL}/ttchung/${id}`);
}
// Lấy thông tin về gia đình
export const layTTGD = (id) => {
    return axios.get(`${API_URL}/ttgd/${id}`);
}