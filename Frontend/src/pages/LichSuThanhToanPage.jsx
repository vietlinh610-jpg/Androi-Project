
import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Stack 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';


import { layLSTT } from "../services/dongPhiAPi";

const LichSuThanhToanPage = () => {
  const navigate = useNavigate();

  const [historyData, setHistoryData] = useState([]);

  const userId = localStorage.getItem("userID");

  
  const fetchLichSu = async () => {
    try {
      const res = await layLSTT(userId);

      const data = res.data.data.map((item, index) => ({
        id: index + 1,
        ten: item.TenKhoanThu,
        loai: item.Loai,
        soTien: item.SoTienPhaiThu.toLocaleString("vi-VN"),
        ngayNop: new Date(item.NgayDong).toLocaleDateString("vi-VN"),
        trangThai: "Đã nộp",
      }));

      setHistoryData(data);
    } catch (err) {
      console.error("Lỗi lấy lịch sử thanh toán:", err);
    }
  };

  useEffect(() => {
     
    fetchLichSu();
  
  }, []);

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      {}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/khoan-thu')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Lịch sử thanh toán
        </Typography>
      </Stack>

      {}
      <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#fafafa' }}>
              <TableRow>
                <TableCell fontWeight="bold">Tên khoản thu</TableCell>
                <TableCell fontWeight="bold">Loại phí</TableCell>
                <TableCell fontWeight="bold">Số tiền (VNĐ)</TableCell>
                <TableCell fontWeight="bold">Ngày nộp</TableCell>
                <TableCell fontWeight="bold">Trạng thái</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {historyData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có lịch sử thanh toán
                  </TableCell>
                </TableRow>
              ) : (
                historyData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.ten}</TableCell>
                    <TableCell>{item.loai}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {item.soTien}
                    </TableCell>
                    <TableCell>{item.ngayNop}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.trangThai}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default LichSuThanhToanPage;