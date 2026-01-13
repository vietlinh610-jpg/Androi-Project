// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HoKhauPage from './pages/HoKhauPage';
import CanHoPage from './pages/CanHoPage';
import ProtectedRoute from './components/ProtectedRoute';
import NhanKhauPage from './pages/NhanKhauPage';
import TamTruPage from './pages/TamTruPage';
import TamVangPage from './pages/TamVangPage';
import KhoanThuPage from './pages/KhoanThuPage';
import TaiKhoanPage from './pages/TaikhoanPage';
import ThongTinCaNhanPage from './pages/ThongTinCaNhanPage';
import ThanhVienGiaDinhPage from './pages/ThanhVienGiaDinhPage';
import KhoanThuUserPage from './pages/KhoanThuUserPage';
import KiemTraKhoanThuPage from './pages/KiemTraKhoanThuPage';
import CreateHoKhauPage from './pages/CreateHoKhauPage';
import CreateCanHoPage from './pages/CreateCanHoPage';
import CreateNhanKhauPage from './pages/CreateNhanKhauPage';
import LichSuThanhToanPage from './pages/LichSuThanhToanPage';
import CreateKhoanThuPage from './pages/CreateKhoanThuPage';
import CreateTamTruPage from './pages/CreateTamTruPage';
import CreateTamVangPage from './pages/CreateTamVangPage';
import CreateTaiKhoanPage from './pages/CreateTaiKhoanPage';
// Thêm chức năng thống kê
import NhanKhauAllPage from './pages/NhanKhauAllPage';
import ThongKeKhoanThuPage from './pages/ThongKeKhoanThuPage';
import ThongKeNhanKhauPage from './pages/ThongKeNhanKhauPage';

// Thêm quản lý gửi xe
import GuiXePage from './pages/GuiXePage';
import CreateGuiXePage from './pages/CreateGuiXePage';

function App() {
  return (
    <Routes>
      {/* 1. Các trang công khai - Ai cũng xem được */}
      
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Các trang bảo mật - Phải login mới thấy Sidebar và nội dung */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
              {/* Sidebar cố định bên trái */}
              <Sidebar />

              {/* Vùng nội dung bên phải tự co giãn */}
              <div style={{ flex: 1,   width: '1250px',  maxWidth: '100%',  height: '100vh',  overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/ho-gia-dinh/ho-khau" element={<HoKhauPage />} />
                  <Route path="/ho-gia-dinh/can-ho" element={<CanHoPage />} />
                  <Route path="/quan-ly-nhan-dan/nhan-khau" element={<NhanKhauPage />} />
                  <Route path="/quan-ly-nhan-dan/tam-tru" element={<TamTruPage />} />
                  <Route path="/quan-ly-nhan-dan/tam-vang" element={<TamVangPage />} />
                  <Route path="/quan-ly-khoan-thu" element={<KhoanThuPage />} />
                  <Route path="/quan-ly-tai-khoan" element={<TaiKhoanPage />} />
                  <Route path="/thong-tin-ca-nhan" element={<ThongTinCaNhanPage />} />
                  <Route path="/thanh-vien-gia-dinh" element={<ThanhVienGiaDinhPage />} />
                  <Route path="/khoan-thu" element={<KhoanThuUserPage />} />
                  <Route path="/kiem-tra-khoan-thu" element={<KiemTraKhoanThuPage />} />
                  <Route path="/ho-gia-dinh/ho-khau/create" element={<CreateHoKhauPage />} />
                  <Route path="/ho-gia-dinh/can-ho/create" element={<CreateCanHoPage />} />
                  <Route path="/quan-ly-nhan-dan/nhan-khau/create/:maHoKhau" element={<CreateNhanKhauPage />} />
                  <Route path="/khoan-thu/lich-su" element={<LichSuThanhToanPage />} />
                  <Route path="/quan-ly-khoan-thu/create" element={<CreateKhoanThuPage />} />
                  <Route path="/quan-ly-nhan-dan/tam-tru/create" element={<CreateTamTruPage />} />
                  <Route path="/quan-ly-nhan-dan/tam-vang/create" element={<CreateTamVangPage />} />
                  <Route path="/quan-ly-tai-khoan/create" element={<CreateTaiKhoanPage />} />
                  <Route path="/quan-ly-nhan-dan/nhan-khau/tat-ca" element={<NhanKhauAllPage />} />
                  <Route path="/quan-ly-khoan-thu/thong-ke" element={<ThongKeKhoanThuPage />} />
                  <Route path="/ho-gia-dinh/ho-khau/thong-ke" element={<ThongKeNhanKhauPage />} />

                  {/* Thêm trang gửi xe và gắn vào ban quản trị*/}
                  <Route path='/quan-ly-gui-xe' element={<GuiXePage/>} />
                  <Route path='/quan-ly-gui-xe/create' element={<CreateGuiXePage/>} />
                  {/* Nếu gõ đường dẫn lạ bên trong khu vực này, tự về dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;