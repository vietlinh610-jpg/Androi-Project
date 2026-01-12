import axios from 'axios';

const API_URL = '/api/kt-khoanthu';

export const KiemTraKhoanThu = () => {
    return axios.get(`${API_URL}`);
}

export const xacNhanKhoanThu = (id) => {
    return axios.post(`${API_URL}/xacnhan/${id}`);
}

export const tuChoiKhoanThu = (id) => {
    return axios.post(`${API_URL}/tuchoi/${id}`)
}