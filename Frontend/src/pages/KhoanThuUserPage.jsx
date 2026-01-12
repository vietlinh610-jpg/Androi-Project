import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Button, Stack, Modal
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



import { layDSKT, nopKt } from "../services/dongPhiAPi";

const KhoanThuUserPage = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const userId = localStorage.getItem("userID");

  
  const fetchDSKT = async () => {
    try {
      const res = await layDSKT(userId);

      const data = res.data.data.map((item, index) => ({
        id: index + 1,
        id_kt: item.MaKhoanThu,
        ten: item.TenKhoanThu,
        loai: item.Loai,
        soTien: item.SoTien.toLocaleString("vi-VN"),
        soTienRaw: item.SoTien,
        hanNop: item.HanNop
          ? new Date(item.HanNop).toLocaleDateString("vi-VN")
          : "",
        trangThai: item.TrangThai,
      }));

      setBills(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách khoản thu:", err);
    }
  };

  useEffect(() => {
    
    fetchDSKT();
  }, []);

  
  const getStatusChip = (status) => {
    switch (status) {
      case "Đã nộp":
        return <Chip label={status} color="success" size="small" />;
      case "Chờ xác nhận":
        return <Chip label={status} color="info" size="small" />;
      case "Từ chối":
        return <Chip label={status} color="warning" size="small" />;
      default:
        return <Chip label={status} color="error" size="small" variant="outlined" />;
    }
  };

  
  const renderAction = (bill) => {
    if (bill.trangThai === "Chưa nộp" || bill.trangThai === "Từ chối") {
      return (
        <Button
          size="small"
          sx={{ textTransform: 'none' }}
          onClick={() => {
            setSelectedBill(bill);
            setOpen(true);
          }}
        >
          {bill.trangThai === "Từ chối" ? "Thanh toán lại" : "Thanh toán"}
        </Button>
      );
    }

    return (
      <Typography variant="caption" color="text.disabled">
        —
      </Typography>
    );
  };

  
  const handleSubmitPayment = async () => {
    try {
      await nopKt({
        id_nk: userId,                 
        id_kt: selectedBill.id_kt,
        soTien: selectedBill.soTienRaw,
      });

      alert("Đã gửi yêu cầu đóng phí, chờ kế toán xác nhận");

      setOpen(false);
      setSelectedBill(null);

      fetchDSKT();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gửi yêu cầu đóng phí");
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        
        <IconButton onClick={() => navigate('/dashboard')} title="Trang chủ">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Danh sách khoản thu
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/khoan-thu/lich-su')}
            sx={{ textTransform: 'none' }}
          >
            Lịch sử nộp tiền
          </Button>

        </Stack>
      </Stack>

      <Paper elevation={1} sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', gap: 1 }}>
          <ReceiptLongIcon color="primary" />
          <Typography fontWeight="bold">Chi tiết khoản thu</Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên khoản thu</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Hạn nộp</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} hover>
                  <TableCell>{bill.ten}</TableCell>
                  <TableCell>{bill.loai}</TableCell>
                  <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    {bill.soTien}
                  </TableCell>
                  <TableCell>{bill.hanNop}</TableCell>
                  <TableCell>{getStatusChip(bill.trangThai)}</TableCell>
                  <TableCell>{renderAction(bill)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350,
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 4,
          textAlign: 'center'
        }}>
          <Typography fontWeight="bold">Quét mã VietQR</Typography>

          <Typography sx={{ mt: 1 }}>
            Khoản thu: <b>{selectedBill?.ten}</b>
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Số tiền: <b>{selectedBill?.soTien}</b>
          </Typography>

          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=THANHTOAN"
            alt="QR"
            style={{ width: 200, margin: '16px auto' }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 1 }}
            onClick={handleSubmitPayment}
          >
            Gửi yêu cầu xác nhận
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default KhoanThuUserPage;