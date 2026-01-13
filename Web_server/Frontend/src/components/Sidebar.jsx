import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button 
} from '@mui/material';
import '../styles/Sidebar.css';

const Sidebar = () => {
  // 1. Lấy ROLE từ localStorage
  const [role] = useState(() => {
    return localStorage.getItem('userRole') || '';
  });

  // 2. Lấy TÊN NGƯỜI DÙNG từ localStorage
  const [fullName, setFullName] = useState(() => {
    // Nếu không tìm thấy tên thì hiển thị mặc định là "Cư dân" hoặc "Admin"
    return localStorage.getItem('fullName') || 'Người dùng';
  });
  
  useEffect(() => {
  const handleUserInfoChange = () => {
      const newName = localStorage.getItem('fullName');
      if (newName) setFullName(newName);
    };

    window.addEventListener('userInfoUpdated', handleUserInfoChange);

    return () => {
      window.removeEventListener('userInfoUpdated', handleUserInfoChange);
    };
  }, []);

  const [openMenus, setOpenMenus] = useState({ hoKhau: false, nhanDan: false });
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleOpenLogout = () => setOpenLogoutModal(true);
  const handleCloseLogout = () => setOpenLogoutModal(false);

  const handleConfirmLogout = () => {
    localStorage.clear();
    setOpenLogoutModal(false);
    navigate('/login');
    window.location.reload();
  };

  const getRoleDisplayName = (currentRole) => {
    switch(currentRole) {
        case 'admin': return 'Ban quản trị';
        case 'ketoan': return 'Phòng Kế toán';
        case 'user': return 'Cư dân';
        default: return 'Khách';
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h3 className="sidebar-title">QUẢN LÝ CHUNG CƯ</h3>
        <div className="logo-section">
          <img src="/images/logo.png" alt="Logo" className="bluemoon-logo" />
        </div>
        <hr className="sidebar-divider" />
        
        <div className="user-info">
          <span className="user-name">

            {fullName}
          </span>
          <p className="user-role">

            {getRoleDisplayName(role)}
          </p>
        </div>

        <hr className="sidebar-divider" />
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              <i className="fas fa-home"></i> Trang chủ
            </Link>
          </li>
          
          {role === 'admin' && (
            <>
              <li className={`has-submenu ${openMenus.hoKhau ? 'open' : ''}`}>
                <div className={`nav-link dropdown-toggle ${location.pathname.includes('ho-gia-dinh') ? 'active' : ''}`} onClick={() => toggleMenu('hoKhau')}>
                  Quản lý hộ gia đình
                  <i className={`fas fa-chevron-down arrow ${openMenus.hoKhau ? 'rotate' : ''}`}></i>
                </div>
                <ul className="submenu">
                  <li><Link to="/ho-gia-dinh/ho-khau">Hộ khẩu</Link></li>
                  <li><Link to="/ho-gia-dinh/can-ho">Căn hộ</Link></li>
                </ul>
              </li>
              <li className={`has-submenu ${openMenus.nhanDan ? 'open' : ''}`}>
                <div className={`nav-link dropdown-toggle ${location.pathname.includes('nhan-dan') ? 'active' : ''}`} onClick={() => toggleMenu('nhanDan')}>
                  Quản lý nhân dân
                  <i className={`fas fa-chevron-down arrow ${openMenus.nhanDan ? 'rotate' : ''}`}></i>
                </div>
                <ul className="submenu">
                  <li><Link to="/quan-ly-nhan-dan/nhan-khau">Nhân khẩu</Link></li>
                  <li><Link to="/quan-ly-nhan-dan/tam-tru">Tạm trú</Link></li>
                  <li><Link to="/quan-ly-nhan-dan/tam-vang">Tạm vắng</Link></li>
                </ul>
              </li>
            </>
          )}

          {(role === 'admin' || role === 'ketoan') && (
            <li>
              <Link to="/quan-ly-khoan-thu" className={`nav-link ${isActive('/quan-ly-khoan-thu')}`}>
                Quản lý khoản thu
              </Link>
            </li>
          )}

          {role === 'user' && (
            <>
              <li><Link to="/thong-tin-ca-nhan" className={`nav-link ${isActive('/thong-tin-ca-nhan')}`}>Thông tin cá nhân</Link></li>
              <li><Link to="/thanh-vien-gia-dinh" className={`nav-link ${isActive('/thanh-vien-gia-dinh')}`}>Thành viên gia đình</Link></li>
              <li><Link to="/khoan-thu" className={`nav-link ${isActive('/khoan-thu')}`}>Khoản thu</Link></li>
            </>
          )}

          {role === 'admin' && (
            <li>
              <Link to="/quan-ly-tai-khoan" className={`nav-link ${isActive('/quan-ly-tai-khoan')}`}>
                Quản lý tài khoản
              </Link>
            </li>
          )}

          {role === 'ketoan' && (
            <li>
              <Link to="/kiem-tra-khoan-thu" className={`nav-link ${isActive('/kiem-tra-khoan-thu')}`}>
                Kiểm tra khoản thu
              </Link>
            </li>
          )}

          {role === 'admin' && (
            <li>
              <Link to="/quan-ly-gui-xe" className={`nav-link ${
                  location.pathname === "/quan-ly-gui-xe" ? "active" : ""
                }`}
              >
                Quản lý gửi xe
              </Link>
            </li>
          )}
            

          <li className="logout-item" style={{ marginTop: '20px' }}>
            <button onClick={handleOpenLogout} className="nav-link logout-btn" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#dc3545', textAlign: 'left', padding: '10px 15px' }}>
              <i className="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </li>
        </ul>
      </nav>

      <Dialog open={openLogoutModal} onClose={handleCloseLogout}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn thoát khỏi hệ thống không? Các phiên làm việc hiện tại sẽ bị kết thúc.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button onClick={handleCloseLogout} variant="outlined">Hủy bỏ</Button>
          <Button onClick={handleConfirmLogout} variant="contained" color="error" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;