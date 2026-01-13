
import React, { useState, useEffect } from 'react';
import {
  DataGrid, GridToolbar, GridRowModes, GridActionsCellItem
} from '@mui/x-data-grid';
import {
  Box, Typography, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField,  Stack, IconButton,
} from '@mui/material';


import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';

import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



import {
  getListTamTru, deleteTamTru, updateTamTru
} from '../services/tamtruApi'; 

const TamTruPage = () => {
  const navigate = useNavigate();

  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});

  
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditingReason, setIsEditingReason] = useState(false);
  const [tempReason, setTempReason] = useState('');

  
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getListTamTru();

      const formattedData = res.data.map((item, index) => ({
        id: item.ID || index,
        
        maNhanKhau: item.MaNhanKhau,
        
        hoTen: item.HoTen,
        SoCCCD: item.SoCCCD,
        maCanHo: item.MaCanHo || 'Chưa có',
        lyDo: item.LyDo,
        ngayBatDau: item.TuNgay ? new Date(item.TuNgay) : null,
        ngayKetThuc: item.DenNgay ? new Date(item.DenNgay) : null,
      }));

      setRows(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  

  const handleViewDetail = (row) => {
    setSelectedRow(row);
    setTempReason(row.lyDo || '');
    setIsEditingReason(false);
    setOpenDetail(true);
  };

  const handleSaveReasonFromModal = async () => {
    if (!selectedRow) return;

    if (!selectedRow.ngayBatDau || !selectedRow.ngayKetThuc) {
      alert("Lỗi: Ngày bắt đầu và Ngày kết thúc không được để trống!");
      return;
    }

    const dateDi = dayjs(newRow.ngayBatDau);
    const dateVe = dayjs(newRow.ngayKetThuc);

    if (dateVe.isBefore(dateDi)) {
      alert("Lỗi vô lý: Ngày kết thúc không được phép trước Ngày bắt đầu!");
      return oldRow; 
    }

    try {
      const payload = {
        TuNgay: dayjs(selectedRow.ngayBatDau).format('YYYY-MM-DD'),
        DenNgay: dayjs(selectedRow.ngayKetThuc).format('YYYY-MM-DD'),
        LyDo: tempReason
      };

      await updateTamTru(selectedRow.id, payload);

      alert("Cập nhật lý do thành công!");
      setOpenDetail(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật: " + (error.response?.data?.message || error.message));
    }
  };

  
  const handleDeleteClick = (id) => async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      try {
        await deleteTamTru(id);
        setRows(rows.filter((row) => row.id !== id));
      } catch (e) { alert("Lỗi xóa!"); }
    }
  };

  const processRowUpdate = async (newRow) => {
    if (!newRow.ngayBatDau || !newRow.ngayKetThuc) {
      alert("Không được để trống ngày tháng!");
      throw new Error("Date cannot be null");
    }

    try {
      const payload = {
        TuNgay: dayjs(newRow.ngayBatDau).format('YYYY-MM-DD'),
        DenNgay: dayjs(newRow.ngayKetThuc).format('YYYY-MM-DD'),
        LyDo: newRow.lyDo
      };

      await updateTamTru(newRow.id, payload);
      fetchData();
      return newRow;
    } catch (error) {
      alert("Cập nhật thất bại!");
      throw error;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  
  const columns = [
    
    {
      field: 'maNhanKhau',
      headerName: 'Mã NK',
      width: 90,
      editable: false 
    },
    
    { field: 'hoTen', headerName: 'Họ tên', flex: 1.2, minWidth: 160 },
    { field: 'SoCCCD', headerName: 'Số CCCD', flex: 1, minWidth: 140 },
    { field: 'maCanHo', headerName: 'Mã căn hộ', flex: 0.8, align: 'center', editable: false },

    {
      field: 'ngayBatDau', headerName: 'Ngày bắt đầu', flex: 1, minWidth: 120,
      editable: true, type: 'date',
      valueFormatter: (v) => v ? dayjs(v).format('DD/MM/YYYY') : ''
    },
    {
      field: 'ngayKetThuc', headerName: 'Ngày kết thúc', flex: 1, minWidth: 120,
      editable: true, type: 'date',
      valueFormatter: (v) => v ? dayjs(v).format('DD/MM/YYYY') : ''
    },

    {
      field: 'trangThai',
      headerName: 'Trạng thái',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const today = dayjs();
        const start = dayjs(params.row.ngayBatDau);
        const end = dayjs(params.row.ngayKetThuc);
        let label = 'Còn hạn';
        let color = 'success';
        if (today.isBefore(start)) { label = 'Chưa bắt đầu'; color = 'warning'; }
        else if (today.isAfter(end)) { label = 'Hết hạn'; color = 'error'; }
        return <Chip label={label} color={color} size="small" variant="outlined" />;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      flex: 1.2,
      minWidth: 180,
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem icon={<SaveIcon />} label="Lưu" onClick={handleSaveClick(id)} sx={{ color: 'primary.main' }} />,
            <GridActionsCellItem icon={<CancelIcon />} label="Hủy" onClick={handleCancelClick(id)} color="inherit" />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<InfoIcon />}
            label="Chi tiết"
            onClick={() => handleViewDetail(row)}
            color="info"
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Sửa ngày"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Xóa"
            onClick={handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} title="Trang chủ">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Quản lý đăng ký tạm trú
        </Typography>
      </Stack>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate('/quan-ly-nhan-dan/tam-tru/create')}
        sx={{ mb: 3, backgroundColor: '#008ecc', textTransform: 'none', fontWeight: 'bold', width: 'fit-content' }}
      >
        ĐĂNG KÝ TẠM TRÚ MỚI
      </Button>

      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(err) => console.log(err)}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          sx={{
            height: '100%', width: '100%', border: '1px solid #e0e0e0',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa' }
          }}
        />
      </Box>

      {}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditingReason ? "Chỉnh sửa lý do" : "Chi tiết lý do tạm trú"}
        </DialogTitle>

        <DialogContent dividers>
          {isEditingReason ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Nội dung lý do"
              value={tempReason}
              onChange={(e) => setTempReason(e.target.value)}
              autoFocus
            />
          ) : (
            <DialogContentText sx={{ color: '#333', fontSize: '1rem' }}>
              {selectedRow?.lyDo || "Không có lý do cụ thể."}
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          {isEditingReason ? (
            <>
              <Button onClick={() => setIsEditingReason(false)} color="inherit">
                Hủy
              </Button>
              <Button onClick={handleSaveReasonFromModal} variant="contained" color="primary">
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setOpenDetail(false)} color="inherit">
                Đóng
              </Button>
              <Button onClick={() => setIsEditingReason(true)} variant="contained" startIcon={<EditIcon />}>
                Sửa lý do
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TamTruPage;