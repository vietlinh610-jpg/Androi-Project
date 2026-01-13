import axios from "axios";

const API_URL = "/api/guixe";

// Lấy danh sách gửi xe
export const layDSGX = () => {
  return axios.get(`${API_URL}/dsgx`);
};

// Ngừng gửi (gỡ 1 xe ra khỏi danh sách quản lý)
// id : biển kiểm soát của xe cần xóa
export const ngungGuiXe = (id) => {
  return axios.delete(`${API_URL}/xoa/${id}`);
};

// Thêm gửi xe
// data gồm loại xe và biểm kiểm soát
export const themGuiXe = (maHoKhau, data) => {
  return axios.post(`${API_URL}/${maHoKhau}`, data);
};