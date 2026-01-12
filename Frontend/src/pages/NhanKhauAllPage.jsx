
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, InputAdornment, IconButton, Stack, Button 
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';


import { getAllNhanKhau } from '../services/nhankhauApi'; 

const NhanKhauAllPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const res = await getAllNhanKhau(); 
      const formatted = res.data.map((nk) => ({
        id: nk.MaNhanKhau,
        maHoKhau: nk.MaHoKhau,
        maNhanKhau: nk.MaNhanKhau,
        hoTen: nk.HoTen,
        gioiTinh: nk.GioiTinh,
        cccd: nk.SoCCCD,
        ngaySinh: nk.NgaySinh ? new Date(nk.NgaySinh) : null,
        noiSinh: nk.NoiSinh,
        danToc: nk.DanToc,
        ngheNghiep: nk.NgheNghiep,
        maCanHo: nk.MaCanHo 
      }));
      setRows(formatted);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  
  const filteredRows = rows.filter((row) => {
    const searchLower = searchText.toLowerCase();
    return (
      row.hoTen?.toLowerCase().includes(searchLower) ||
      row.maHoKhau?.toLowerCase().includes(searchLower) ||
      row.maNhanKhau?.toLowerCase().includes(searchLower) ||
      row.cccd?.toLowerCase().includes(searchLower) ||
      row.maCanHo?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { field: 'maHoKhau', headerName: 'Mã HK', width: 100 },
    { field: 'maNhanKhau', headerName: 'Mã NK', width: 100 },
    { field: 'hoTen', headerName: 'Họ và tên', flex: 1, minWidth: 150 },
    { field: 'maCanHo', headerName: 'Căn hộ', width: 100 },
    { field: 'gioiTinh', headerName: 'Giới tính', width: 80 },
    { 
      field: 'ngaySinh', headerName: 'Ngày sinh', width: 100, type: 'date',
      valueFormatter: (value) => value ? dayjs(value).format('DD/MM/YYYY') : ''
    },
    { field: 'noiSinh', headerName: 'Nơi Sinh', width : 130 },
    { field: 'cccd', headerName: 'Số CCCD', width: 120 },
    { field: 'danToc', headerName: 'Dân tộc', width: 100 },
    { field: 'ngheNghiep', headerName: 'Nghề nghiệp', flex: 1.5, width: 150 },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-nhan-dan/nhan-khau')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Danh sách toàn bộ cư dân
        </Typography>
      </Stack>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          size="small"
          placeholder="Tìm tên, mã NK, CCCD hoặc căn hộ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: 400, bgcolor: '#fff' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper elevation={0} sx={{ flexGrow: 1, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Paper>
    </Box>
  );
};

export default NhanKhauAllPage;