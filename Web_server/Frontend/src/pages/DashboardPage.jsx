import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import FunctionCard from '../components/FunctionCard';

const DashboardPage = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    
    const savedRole = localStorage.getItem('userRole');
    console.log("Vai trò hiện tại:", savedRole); 
    
    setRole(savedRole || 'user');
  }, []);

  
  const allCards = [
    {
      title: "Quản lý hộ khẩu",
      description: "Quản lý hộ khẩu và các khoản thu theo hộ",
      imageUrl: "/images/ho_khau.jpg",
      linkTo: "/ho-gia-dinh/ho-khau",
      roles: ['admin'], 
    },
    {
      title: "Quản lý căn hộ",
      description: "Quản lý các căn hộ trong chung cư",
      imageUrl: "/images/chung_cu.webp",
      linkTo: "/ho-gia-dinh/can-ho",
      roles: ['admin'],
    },
    {
      title: "Quản lý khoản thu",
      description: "Quản lý các khoản thu phí trong chung cư",
      imageUrl: "/images/thu_chi.png",
      linkTo: "/quan-ly-khoan-thu",
      roles: ['admin', 'ketoan'], 
    },
    {
      title: "Quản lý nhân khẩu",
      description: "Quản lý nhân khẩu, đăng ký nhân khẩu",
      imageUrl: "/images/nhan_khau.webp",
      linkTo: "/quan-ly-nhan-dan/nhan-khau",
      roles: ['admin'],
    },
    {
      title: "Quản lý tạm trú",
      description: "Quản lý tạm trú, đăng ký tạm trú",
      imageUrl: "/images/tam_tru.png",
      linkTo: "/quan-ly-nhan-dan/tam-tru",
      roles: ['admin'],
    },
    {
      title: "Quản lý tạm vắng",
      description: "Quản lý tạm vắng, đăng ký tạm vắng",
      imageUrl: "/images/tam_vang.jpg",
      linkTo: "/quan-ly-nhan-dan/tam-vang",
      roles: ['admin'],
    },
    {
      title: "Thông tin cá nhân",
      description: "Xem và cập nhật thông tin cá nhân của bạn",
      imageUrl: "/images/ca_nhan.webp", 
      linkTo: "/thong-tin-ca-nhan",
      roles: ['user'], 
    },
    {
      title: "Thành viên gia đình",
      description: "Quản lý danh sách thành viên trong hộ gia đình",
      imageUrl: "/images/gia_dinh.jpg",
      linkTo: "/thanh-vien-gia-dinh",
      roles: ['user'],
    },
    {
      title: "Khoản thu",
      description: "Xem các hóa đơn và đóng phí hàng tháng",
      imageUrl: "/images/khoan_thu.png",
      linkTo: "/khoan-thu",
      roles: ['user'],
    },
    {
      title: "Kiểm tra khoản thu",
      description: "Kiểm tra trạng thái khảon thu của các hộ gia đình",
      imageUrl: "images/ke_toan.jpg",
      linkTo: "/kiem-tra-khoan-thu",
      roles: ['ketoan'],
    },
    {
      title: "Quản lý gửi xe",
      description: "Quản lý gửi ô tô, xe máy của các hộ",
      imageUrl: "images/guiXe.jpg",
      linkTo: "/quan-ly-gui-xe",
      roles: ['admin'], 
    }
  ];

  
  const filteredCards = allCards.filter(card => card.roles.includes(role));

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        Bảng điều khiển
      </Typography>

      <Box sx={{ width: '100%', flexGrow: 1 }}>
        <Grid container spacing={3} alignItems="stretch">
          {filteredCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FunctionCard
                title={card.title}
                description={card.description}
                imageUrl={card.imageUrl}
                linkTo={card.linkTo}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;