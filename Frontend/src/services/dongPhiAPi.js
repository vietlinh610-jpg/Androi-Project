import axios from 'axios';

const API_URL = '/api/dongphi';

// Lấy các khoản thu
export const layDSKT = (id) => {
    return axios.get(`${API_URL}/dskt/${id}`);
}

// Nộp một khoản thu
export const nopKt = (data) => {
    return axios.post(`${API_URL}/noptien`, data);
}

// Lấy lịch sử thanh toán của hộ khẩu của nhân khẩu
export const layLSTT = (id) => {
    return axios.get(`${API_URL}/lstt/${id}`);
}