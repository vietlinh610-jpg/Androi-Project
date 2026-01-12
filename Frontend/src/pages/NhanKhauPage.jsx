
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Chip, IconButton,
  Stack, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel 
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import PieChartIcon from '@mui/icons-material/PieChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



import { getCanHoCount, getNhanKhauByCanHo, deleteNhanKhau, updateNhanKhau } from '../services/nhankhauApi';

const NhanKhauPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const [apartmentRows, setApartmentRows] = useState([]);
  const [loadingApartments, setLoadingApartments] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedHoKhau, setSelectedHoKhau] = useState(null);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [selectedMaHoKhau, setSelectedMaHoKhau] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  
  const [openChangeHostModal, setOpenChangeHostModal] = useState(false);
  const [candidates, setCandidates] = useState([]); 
  const [newHostId, setNewHostId] = useState('');   
  const [deletingMemberId, setDeletingMemberId] = useState(null); 
  

  
  const fetchApartments = async () => {
    try {
      setLoadingApartments(true);
      const res = await getCanHoCount();
      const filteredData = res.data.filter(item => item.MaHoKhau !== null);

      const formatted = filteredData.map((item) => ({
        id: item.MaCanHo,
        maCanHo: item.MaCanHo,
        tenCanHo: item.TenCanHo,
        soThanhVien: item.SoThanhVien,
        maHoKhau: item.MaHoKhau
      }));
      setApartmentRows(formatted);
    } catch (error) {
      console.error("Lỗi tải danh sách căn hộ:", error);
    } finally {
      setLoadingApartments(false);
    }
  };

  useEffect(() => { fetchApartments(); }, []);

  useEffect(() => {
    if (apartmentRows.length > 0 && location.state?.targetMaHoKhau) {
      const targetRow = apartmentRows.find(row => row.maHoKhau === location.state.targetMaHoKhau);
      if (targetRow) {
        handleOpenMembers(targetRow);
        window.history.replaceState({}, document.title);
      }
    }
  }, [apartmentRows, location.state]);

  
  const handleOpenMembers = async (apartmentRow) => {
    setSelectedApartment(apartmentRow);
    setCurrentMembers([]);
    setSelectedHoKhau({ maHoKhau: apartmentRow.maHoKhau });
    setOpenModal(true);
    setIsEditing(false);
    setLoadingMembers(true);

    try {
      const res = await getNhanKhauByCanHo(apartmentRow.maCanHo);
      const rawData = (res.data && res.data.data) ? res.data.data : [];
      setSelectedMaHoKhau(res.data?.maHoKhau || apartmentRow.maHoKhau);

      const formattedMembers = rawData.map((nk, index) => ({
        id: nk.MaNhanKhau || index,
        maNhanKhau: nk.MaNhanKhau,
        hoTen: nk.HoTen,
        gioiTinh: nk.GioiTinh,
        danToc: nk.DanToc,
        ngheNghiep: nk.NgheNghiep,
        cccd: nk.SoCCCD,
        noiSinh: nk.NoiSinh,
        ngaySinh: nk.NgaySinh ? new Date(nk.NgaySinh) : null,
        quanHe: nk.QuanHeVoiChuHo
      }));

      setCurrentMembers(formattedMembers);
    } catch (error) {
      console.error("Lỗi tải thành viên:", error);
      setCurrentMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  
  const processRowUpdate = async (newRow, oldRow) => {
    const errorMessages = {
      hoTen: "Họ và tên",
      gioiTinh: "Giới tính",
      danToc: "Dân tộc",
      ngheNghiep: "Nghề nghiệp",
      cccd: "Số CCCD",
      noiSinh: "Nơi sinh",
      quanHe: "Quan hệ",
      ngaySinh: "Ngày sinh"
    };

    for (const field in errorMessages) {
      if (!newRow[field] || newRow[field].toString().trim() === '') {
        alert(`Lỗi: ${errorMessages[field]} không được để trống!`);
        return oldRow;
      }
    }

    const newRelation = newRow.quanHe.trim().toLowerCase();

    if (newRelation === 'chủ hộ') {
        const existingHost = currentMembers.find(
            m => m.quanHe.trim().toLowerCase() === 'chủ hộ' && m.id !== newRow.id
        );

        if (existingHost) {
            alert(`Thất bại: Hộ này đã có chủ hộ là "${existingHost.hoTen}".\n\nMột hộ khẩu chỉ được phép có 1 chủ hộ. Vui lòng đổi quan hệ của chủ hộ cũ trước.`);
            return oldRow; 
        }
    }

    try {
      const payload = {
        HoTen: newRow.hoTen,
        GioiTinh: newRow.gioiTinh,
        DanToc: newRow.danToc,
        NgheNghiep: newRow.ngheNghiep,
        SoCCCD: newRow.cccd,
        NoiSinh: newRow.noiSinh,
        QuanHeVoiChuHo: newRow.quanHe,
        NgaySinh: newRow.ngaySinh ? dayjs(newRow.ngaySinh).format('YYYY-MM-DD') : null
      };

      await updateNhanKhau(newRow.id, payload);
      setCurrentMembers((prevMembers) => 
        prevMembers.map((member) => (member.id === newRow.id ? newRow : member))
      );
      return newRow;
    } catch (error) {
      alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
      return oldRow;
    }
  };

  
  const handleDeleteMember = async (memberRow) => {
    
    const curRole = memberRow.quanHe.trim().toLowerCase();
    if (curRole !== 'chủ hộ') {
      if (window.confirm(`Bạn có chắc muốn xóa ${memberRow.hoTen}?`)) {
        await executeDelete(memberRow.id);
      }
      return;
    }

    
    const otherMembers = currentMembers.filter(m => m.id !== memberRow.id);

    
    if (otherMembers.length === 0) {
      if (window.confirm("Đây là thành viên cuối cùng. Xóa người này sẽ xóa luôn hộ khẩu?")) {
        await executeDelete(memberRow.id);
      }
      return;
    }

    
    setCandidates(otherMembers);
    setDeletingMemberId(memberRow.id);
    setNewHostId('');
    setOpenChangeHostModal(true);
  };

  
  const executeDelete = async (id) => {
    try {
      await deleteNhanKhau(id);
      setCurrentMembers((prev) => prev.filter(m => m.id !== id));
      fetchApartments(); 
      alert("Xóa thành công!");
    } catch (error) {
      alert("Lỗi khi xóa: " + (error.response?.data?.message || error.message));
    }
  };

  
  const confirmChangeHostAndDelete = async () => {
    if (!newHostId) {
      alert("Vui lòng chọn người làm chủ hộ mới!");
      return;
    }

    try {
      
      const newHost = candidates.find(c => c.maNhanKhau === newHostId);
      if (!newHost) return;

      
      const payload = {
        HoTen: newHost.hoTen,
        GioiTinh: newHost.gioiTinh,
        DanToc: newHost.danToc,
        NgheNghiep: newHost.ngheNghiep,
        SoCCCD: newHost.cccd,
        NoiSinh: newHost.noiSinh,
        NgaySinh: newHost.ngaySinh ? dayjs(newHost.ngaySinh).format('YYYY-MM-DD') : null,
        QuanHeVoiChuHo: 'Chủ hộ' 
      };

      
      await updateNhanKhau(newHost.id, payload);

      
      await deleteNhanKhau(deletingMemberId);

      
      alert(`Đã chuyển quyền Chủ hộ cho ${newHost.hoTen} và xóa thành viên cũ!`);
      setOpenChangeHostModal(false);
      fetchApartments();
      handleCloseModal(); 

    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
    }
  };

  
  const memberColumns = [
    {
      field: 'maNhanKhau', headerName: 'Mã NK', width: 90, editable: false,
      headerAlign: 'center', align: 'center'
    },
    { field: 'hoTen', headerName: 'Họ và tên', flex: 1.5, minWidth: 150, editable: isEditing },
    {
      field: 'gioiTinh', headerName: 'Giới tính', width: 80, editable: isEditing,
      type: 'singleSelect', valueOptions: ['Nam', 'Nữ']
    },
    { field: 'quanHe', headerName: 'Quan hệ', flex: 1, editable: isEditing },
    {
      field: 'ngaySinh', headerName: 'Ngày sinh', width: 110, editable: isEditing, type: 'date',
      valueFormatter: (value) => value ? dayjs(value).format('DD/MM/YYYY') : ''
    },
    { field: 'noiSinh', headerName: 'Nơi Sinh', width: 130, editable: isEditing },
    { field: 'cccd', headerName: 'Số CCCD', width: 130, editable: isEditing },
    { field: 'danToc', headerName: 'Dân tộc', width: 90, editable: isEditing },
    { field: 'ngheNghiep', headerName: 'Nghề nghiệp', width: 120, editable: isEditing },

    {
      field: 'actions', headerName: 'Xóa', width: 60, sortable: false,
      renderCell: (params) => (
        <IconButton color="error" size="small" onClick={() => handleDeleteMember(params.row)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )
    }
  ];

  
  const apartmentColumns = [
    { field: 'maCanHo', headerName: 'Mã căn hộ', flex: 1, minWidth: 120 },
    { field: 'tenCanHo', headerName: 'Tên căn hộ', flex: 1.5, minWidth: 200 },
    {
      field: 'soThanhVien', headerName: 'Số thành viên', flex: 1, align: 'center', headerAlign: 'center',
      renderCell: (params) => <Chip label={params.value} color="primary" variant="outlined" size="small" />
    },
    {
      field: 'actions', headerName: 'Thao tác', flex: 1, minWidth: 150, sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained" size="small" startIcon={<GroupsIcon />}
          onClick={() => handleOpenMembers(params.row)}
          sx={{ bgcolor: '#008ecc', textTransform: 'none', fontWeight: 'bold' }}
        >
          THÀNH VIÊN
        </Button>
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
          Quản lý nhân khẩu
        </Typography>
      </Stack>


      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<GroupsIcon />}
          onClick={() => navigate('/quan-ly-nhan-dan/nhan-khau/tat-ca')}
          sx={{ bgcolor: '#2b98c0ff', '&:hover': { bgcolor: '#3fa8c3ff' }, textTransform: 'none', fontWeight: 'bold' }}
        >
          XEM TẤT CẢ NHÂN KHẨU
        </Button>

        <Button
          variant="contained"
          startIcon={<PieChartIcon />}
          onClick={() => navigate('/ho-gia-dinh/ho-khau/thong-ke')}
          sx={{ backgroundColor: '#8e44ad', textTransform: 'none', fontWeight: 'bold', '&:hover': { backgroundColor: '#7d3c98' } }}
        >
          THỐNG KÊ NHÂN KHẨU
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <DataGrid
          rows={apartmentRows}
          columns={apartmentColumns}
          loading={loadingApartments}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Paper>

      {}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', bgcolor: '#f8f9fa' }}>
          Thành viên - {selectedApartment?.tenCanHo} - {selectedHoKhau?.maHoKhau}
          <IconButton onClick={handleCloseModal}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={currentMembers}
              columns={memberColumns}
              loading={loadingMembers}
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={(err) => console.log(err)}
              onCellClick={(params, event) => {
                if (isEditing && params.colDef.editable) {
                  event.defaultMuiPrevented = true;
                  params.api.startCellEditMode({ id: params.id, field: params.field });
                }
              }}
              slots={{
                noRowsOverlay: () => (
                  <Stack height="100%" alignItems="center" justifyContent="center">
                    {loadingMembers ? "Đang tải..." : "Chưa có thành viên nào"}
                  </Stack>
                )
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          {selectedMaHoKhau && (
            <Button
              variant="outlined" color="success" startIcon={<AddIcon />}
              onClick={() => navigate(`/quan-ly-nhan-dan/nhan-khau/create/${selectedMaHoKhau}`)}
              sx={{ textTransform: 'none' }}
            >
              Thêm thành viên
            </Button>
          )}

          <Button
            variant="contained"
            color={isEditing ? "primary" : "warning"}
            startIcon={isEditing ? <GroupsIcon /> : <EditIcon />}
            onClick={() => setIsEditing(!isEditing)}
            disabled={currentMembers.length === 0}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            {isEditing ? "HOÀN TẤT" : "CHỈNH SỬA"}
          </Button>

          <Button variant="outlined" color="inherit" onClick={handleCloseModal} sx={{ textTransform: 'none' }}>
            ĐÓNG
          </Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog open={openChangeHostModal} onClose={() => setOpenChangeHostModal(false)}>
        <DialogTitle sx={{ bgcolor: '#fff3cd', color: '#856404' }}>
          ⚠️ Yêu cầu chọn Chủ hộ mới
        </DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 300 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn đang xóa <b>Chủ hộ</b>. Vui lòng chọn một thành viên khác để thay thế vị trí này trước khi xóa.
          </Typography>

          <FormControl>
            <FormLabel>Chọn người kế nhiệm:</FormLabel>
            <RadioGroup
              value={newHostId}
              onChange={(e) => setNewHostId(e.target.value)}
            >
              {candidates.map((mem) => (
                <FormControlLabel
                  key={mem.id}
                  value={mem.maNhanKhau} 
                  control={<Radio />}
                  label={`${mem.hoTen} (${mem.quanHe})`}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangeHostModal(false)} color="inherit">Hủy bỏ</Button>
          <Button onClick={confirmChangeHostAndDelete} variant="contained" color="primary">
            Lưu & Xóa
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default NhanKhauPage;