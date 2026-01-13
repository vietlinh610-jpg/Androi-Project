
import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Box, Typography, Button, Stack, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



import { getTaiKhoan, deleteTaiKhoan, updateTaiKhoan } from '../services/taikhoanApi';

const TaiKhoanPage = () => {
  const navigate = useNavigate();

  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    id: '', hoTen: '', SoCCCD: '', tenDangNhap: '', matKhau: '', quyenTaiKhoan: ''
  });

  
  const fetchTaiKhoan = async () => {
    try {
      setLoading(true);
      
      const response = await getTaiKhoan();
      
      const data = response.data;

      const formattedData = data.map(item => ({
        ...item,
        maHoKhau: item.maHoKhau || '---'
      }));

      setRows(formattedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
      alert("Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaiKhoan();
  }, []);

  
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        await deleteTaiKhoan(id);
        alert("Xóa thành công!");
        fetchTaiKhoan(); 
      } catch (error) {
        console.error("Lỗi xóa:", error);
        alert("Xóa thất bại!");
      }
    }
  };

  
  const handleEditClick = (row) => {
    setEditData({
      id: row.id,
      hoTen: row.hoTen,
      SoCCCD: row.SoCCCD,
      tenDangNhap: row.tenDangNhap,
      matKhau: row.matKhau,
      quyenTaiKhoan: row.quyenTaiKhoan
    });
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    
    
    if (!editData.tenDangNhap || editData.tenDangNhap.toString().trim() === '') {
      alert("Lỗi: Tên đăng nhập không được để trống!");
      return; 
    }

    
    
    if (!editData.matKhau || editData.matKhau.toString().trim() === '') {
      alert("Lỗi: Mật khẩu không được để trống!");
      return;
    }

    
    if (!editData.hoTen || editData.hoTen.toString().trim() === '') {
      alert("Lỗi: Họ tên không được để trống!");
      return;
    }

    
    if (!editData.SoCCCD || editData.SoCCCD.toString().trim() === '') {
      alert("Lỗi: Số CCCD không được để trống!");
      return;
    }

    
    try {
      
      const payload = {
        tenDangNhap: editData.tenDangNhap.trim(), 
        matKhau: editData.matKhau,
        hoTen: editData.hoTen.trim(),
        SoCCCD: editData.SoCCCD.toString().trim(),
        quyen: editData.quyenTaiKhoan
      };

      
      await updateTaiKhoan(editData.id, payload);
      localStorage.setItem('fullName', editData.hoTen.trim());
      window.dispatchEvent(new Event('userInfoUpdated'));
      alert("Cập nhật thành công!");
      setOpenEdit(false);
      fetchTaiKhoan(); 
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      
      const message = error.response?.data?.message || "Đã xảy ra lỗi kết nối server";
      alert("Lỗi: " + message);
    }
  };

  
  const columns = [
    {
      field: 'maHoKhau',
      headerName: 'Mã HK',
      flex: 0.8,
      minWidth: 100
    },
    { field: 'hoTen', headerName: 'Họ tên', flex: 1.2, minWidth: 180 },
    { field: 'SoCCCD', headerName: 'Số CCCD', flex: 1, minWidth: 150 },
    { field: 'tenDangNhap', headerName: 'Tên đăng nhập', flex: 1, minWidth: 150 },
    { field: 'matKhau', headerName: 'Mật khẩu', flex: 0.8, minWidth: 100 },
    {
      field: 'quyenTaiKhoan',
      headerName: 'Quyền tài khoản',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        let color = 'default';
        if (params.value === 'Admin') color = 'error';
        if (params.value === 'Kế toán') color = 'primary';
        if (params.value === 'Người dùng') color = 'success';

        return (
          <Chip label={params.value} size="small" variant="outlined" color={color} />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton size="small" onClick={() => handleEditClick(params.row)}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.id)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} title="Trang chủ">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Danh sách tài khoản
        </Typography>
      </Stack>


      <Button
        variant="contained"
        onClick={() => navigate('/quan-ly-tai-khoan/create')}
        sx={{
          mb: 3,
          backgroundColor: '#008ecc',
          textTransform: 'none',
          fontWeight: 'bold',
          width: 'fit-content'
        }}
      >
        THÊM TÀI KHOẢN
      </Button>

      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff', minHeight: 0 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            height: '100%',
            width: '100%',
            border: '1px solid #e0e0e0',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa' }
          }}
        />
      </Box>

      {}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
          Cập nhật tài khoản
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ paddingTop: 1 }}>

            <TextField
              label="Tên đăng nhập"
              fullWidth
              value={editData.tenDangNhap}
              onChange={(e) => setEditData({ ...editData, tenDangNhap: e.target.value })}
            />

            <TextField
              label="Mật khẩu"
              fullWidth
              value={editData.matKhau}
              onChange={(e) => setEditData({ ...editData, matKhau: e.target.value })}
            />

            <TextField
              label="Họ và tên"
              fullWidth
              value={editData.hoTen}
              
              disabled={editData.quyenTaiKhoan === 'Người dùng'}
              helperText={
                editData.quyenTaiKhoan === 'Người dùng'
                  ? "Dữ liệu được đồng bộ từ Chủ hộ (Không thể sửa)."
                  : "Nhập tên nhân viên quản lý."
              }
              onChange={(e) => setEditData({ ...editData, hoTen: e.target.value })}
            />

            <TextField
              label="Số CCCD"
              fullWidth
              value={editData.SoCCCD}
              disabled={editData.quyenTaiKhoan === 'Người dùng'}
              onChange={(e) => setEditData({ ...editData, SoCCCD: e.target.value })}
            />

            <TextField
              label="Quyền hiện tại"
              fullWidth
              value={editData.quyenTaiKhoan}
              disabled
              variant="filled"
            />

          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setOpenEdit(false)} color="inherit" variant="outlined">Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaiKhoanPage;