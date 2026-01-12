
import React, { useEffect, useState } from 'react';
import { 
  DataGrid, 
  GridToolbar, 
  GridRowModes, 
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { Box, Typography, Button, TextField, InputAdornment ,  Stack, IconButton,} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search'; 
import { useNavigate } from 'react-router-dom';
import { getCanHoList, deleteCanHo, updateCanHo } from '../services/canhoApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const CanHoPage = () => {
  const navigate = useNavigate();
  
  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // state quản lý tìm kiếm
  const [searchText, setSearchText] = useState('');
  
  
  const [rowModesModel, setRowModesModel] = useState({});

  // Lọc dựa trên mã căn hộ, tên căn hộ hoặc mã hộ khẩu
  const filteredRows = rows.filter((row) => {
    const searchLower = searchText.toLowerCase();
    return (
      row.maCanHo?.toLowerCase().includes(searchLower) ||
      row.tenCanHo?.toLowerCase().includes(searchLower) ||
      row.maHoKhau?.toLowerCase().includes(searchLower) ||
      row.tang?.toString().includes(searchLower)
    );
  });

  // xử lý các sự kiện click
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

  const handleDeleteClick = (id) => async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa căn hộ mã: ${id} không?`)) {
      try {
        await deleteCanHo(id);
        setRows(rows.filter((row) => row.id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        const message = error.response?.data?.message || "Xóa thất bại! Có lỗi xảy ra.";
        alert(message);
      }
    }
  };

  const processRowUpdate = async (newRow) => {
    try {
      const updatedData = {
        MaHoKhau: newRow.maHoKhau || null 
      };
      await updateCanHo(newRow.id, updatedData);
      setRows((prevRows) => 
        prevRows.map((row) => (row.id === newRow.id ? newRow : row))
      );
      return newRow; 
      
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      const message = error.response?.data?.message || "Cập nhật thất bại! Vui lòng thử lại.";
      alert(message);
      throw error; 
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'maCanHo', headerName: 'Mã căn hộ', flex: 1, minWidth: 100, editable: false }, 
    { field: 'tenCanHo', headerName: 'Tên căn hộ', flex: 1, minWidth: 120, editable: false },
    { field: 'tang', headerName: 'Tầng', flex: 0.8, align: 'center', headerAlign: 'center', type: 'number', editable: false },
    { field: 'dienTich', headerName: 'Diện tích (m2)', flex: 1, align: 'center', headerAlign: 'center', type: 'number', editable: false },
    { 
      field: 'maHoKhau', 
      headerName: 'Mã hộ khẩu', 
      flex: 1.2, 
      minWidth: 150, 
      editable: true 
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      flex: 1.5,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const fetchCanHo = async () => {
    try {
      setLoading(true);
      const response = await getCanHoList();
      const formattedData = response.data.map((item) => ({
        id: item.MaCanHo, 
        maCanHo: item.MaCanHo,
        tenCanHo: item.TenCanHo,
        tang: item.Tang,
        dienTich: item.DienTich,
        maHoKhau: item.MaHoKhau
      }));
      setRows(formattedData);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      alert("Không thể tải dữ liệu từ server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanHo();
  }, []);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} title="Trang chủ">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Danh sách căn hộ
        </Typography>
      </Stack>


      {/* CẬP NHẬT GIAO DIỆN HÀNG NÚT VÀ TÌM KIẾM */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/ho-gia-dinh/can-ho/create')}
          sx={{ 
            backgroundColor: '#008ecc', 
            textTransform: 'none', 
            fontWeight: 'bold',
            width: 'fit-content'
          }}
        >
          THÊM CĂN HỘ
        </Button>

        <TextField
          size="small"
          placeholder="Tìm mã căn, tên căn, hộ khẩu..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: 350, backgroundColor: '#fff' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={filteredRows} 
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.log(error)}
          onCellDoubleClick={(params, event) => {
            event.stopPropagation();
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          sx={{
            height: '100%', 
            width: '100%',
            border: '1px solid #e0e0e0',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default CanHoPage;