import axios from "axios";

const API_URL = "/api/thu-phi";

/**
 * @param {number} maKhoanThu
 * GET /api/thu-phi/:maKhoanThu/trang-thai
 */
export const getTrangThaiThuPhi = (maKhoanThu) => {
  return axios.get(`${API_URL}/${maKhoanThu}/trang-thai`);
};

/**
 * Lấy danh sách tất cả khoản thu và hiển thị trạng thái đóng, chưa đóng của từng hộ
 * GET /api/thu-phi/kiem-tra
 */
export const kiemTraKhoanThu = () => {
  return axios.get(`${API_URL}/kiem-tra`);
};


// Lấy doanh thu theo tháng/ năm để phục vụ thống kê
export const layDoanhThu = (thang, nam) => {
  return axios.get(`${API_URL}/thong-ke/${thang}/${nam}`);
}